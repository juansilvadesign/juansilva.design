import { useEffect, useId, useMemo, useRef, useState, type FC, type PointerEvent } from "react";
import { usePrefersReducedMotion } from "./TextType";

/**
 * React Bits' CurvedLoop, ported.
 *
 * ⛔ An earlier pass replaced this with a CSS `translateX` marquee on the
 * grounds that a straight loop does not need JavaScript. That was wrong twice:
 * `curveAmount: 0` only flattens the path — the mechanism is unchanged — and a
 * CSS translate silently drops the two things that make this component what it
 * is, the pointer drag and the direction flip on release. The motion here is a
 * per-frame `startOffset` walk along an SVG `textPath`, wrapping at exactly one
 * copy of the string, which is not reproducible with a keyframe.
 *
 * Faithful to upstream except where the difference is not visible:
 *
 * 1. **No per-frame `setState`.** Upstream mutates the `startOffset` attribute
 *    *and* stores it in state on every animation frame, which re-renders the
 *    component ~60x a second to reapply the value it just wrote imperatively.
 *    The offset lives in a ref here and the attribute is the single source of
 *    truth, so a re-render cannot snap the text back to a stale position.
 * 2. **`prefers-reduced-motion` bails out of the loop**, matching TextType —
 *    the text still renders along the path, it just does not travel.
 * 3. **The cursor is CSS, not render state.** Upstream reads `dragRef.current`
 *    during render, but a ref mutation triggers no re-render, so `grabbing`
 *    never actually paints. `:active` does it correctly and for free.
 * 4. **`touch-action: pan-y`** (in the stylesheet). `setPointerCapture` on
 *    `pointerdown` otherwise swallows a vertical swipe that merely started on
 *    the strip, trapping the page scroll on mobile.
 * 5. **The SVG is `aria-hidden`.** The real copy ships as a server-rendered
 *    list beside it, the same `.typed-real` contract the typed headlines use,
 *    so assistive tech reads a clean list and never the repeated filler.
 */

interface CurvedLoopProps {
  marqueeText?: string;
  /** Pixels per frame. */
  speed?: number;
  className?: string;
  /** 0 renders the straight strip the binder asked for. */
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
  /** Strip height in CSS pixels. The viewBox matches it 1:1. */
  height?: number;
  /**
   * Type size in CSS pixels. It lives here rather than in the stylesheet
   * because it is geometry, not decoration — the baseline is derived from it.
   */
  fontSize?: number;
  /** Type size below `mobileMaxWidth`. Defaults to `fontSize`. */
  fontSizeMobile?: number;
  /** Matches the site's `--breakpoint-md`. */
  mobileMaxWidth?: number;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = "",
  speed = 2,
  className,
  curveAmount = 0,
  direction = "left",
  interactive = true,
  height = 60,
  fontSize = 20,
  fontSizeMobile,
  mobileMaxWidth = 768,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0";
  }, [marqueeText]);

  const jacketRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid.replace(/:/g, "")}`;
  const reduced = usePrefersReducedMotion();

  /*
   * ⛔ Upstream's viewBox is a fixed `0 0 1440 120` scaled by `width: 100%`,
   * which makes every unit inside it *proportional to the viewport*: at 375px
   * a 34-unit type renders at ~8.9 real pixels, and the strip's own height
   * shrinks with it, so it can only sit centred at one specific width.
   *
   * Matching the viewBox to the measured pixel width fixes both at once — one
   * user unit is one CSS pixel, so `fontSize` is literal and `height` is
   * constant at every breakpoint. The curve keeps its shape because the
   * control point is expressed as a fraction of the width.
   */
  const vbHeight = height;
  const centerY = height / 2;
  const overhang = 100;
  const pathD = `M${-overhang},${centerY} Q${width / 2},${centerY + curveAmount} ${
    width + overhang
  },${centerY}`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<"left" | "right">(direction);
  const velRef = useRef(0);
  const offsetRef = useRef(0);

  /*
   * Derived from the measured container rather than a `matchMedia` listener:
   * the ResizeObserver below is already running, and this way the size follows
   * an actual resize instead of only the width at hydration. `width === 0` is
   * the pre-measure frame, which must not resolve to the mobile size or the
   * strip would measure its spacing at the wrong type and re-lay out.
   */
  const resolvedFontSize =
    fontSizeMobile !== undefined && width > 0 && width < mobileMaxWidth ? fontSizeMobile : fontSize;

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil((width + overhang * 2) / textLength) + 2)
        .fill(text)
        .join("")
    : text;
  const ready = spacing > 0 && width > 0;

  useEffect(() => {
    const el = jacketRef.current;
    if (!el) return;
    const read = () => setWidth(el.getBoundingClientRect().width);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className, resolvedFontSize]);

  /** One copy to the left, so the wrap has material on both sides from frame 0. */
  const applyOffset = (next: number) => {
    offsetRef.current = next;
    textPathRef.current?.setAttribute("startOffset", `${next}px`);
  };

  useEffect(() => {
    if (!spacing) return;
    applyOffset(-spacing);
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready || reduced) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        let next = offsetRef.current + delta;
        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;
        applyOffset(next);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready, reduced]);

  const onPointerDown = (e: PointerEvent) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!interactive || !dragRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    let next = offsetRef.current + dx;
    if (next <= -spacing) next += spacing;
    if (next > 0) next -= spacing;
    applyOffset(next);
  };

  /** A flick decides which way it keeps going — the component's signature move. */
  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    if (velRef.current !== 0) dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  return (
    <div
      ref={jacketRef}
      className={`curved-loop${interactive ? " curved-loop--interactive" : ""}`}
      style={{ height, visibility: ready ? "visible" : "hidden" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
      aria-hidden="true"
    >
      <svg
        className="curved-loop__svg"
        viewBox={`0 0 ${Math.max(width, 1)} ${vbHeight}`}
        width={Math.max(width, 1)}
        height={vbHeight}
        style={{ fontSize: resolvedFontSize }}
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
        >
          {text}
        </text>
        <defs>
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text xmlSpace="preserve" className={className} dominantBaseline="central">
            <textPath ref={textPathRef} href={`#${pathId}`} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;
