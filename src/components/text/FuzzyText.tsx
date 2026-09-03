import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./TextType";

/**
 * React Bits' FuzzyText, ported.
 *
 * The mechanism is a bitmap of the text copied to a visible canvas one scanline
 * at a time, each row nudged sideways by a random amount. There is no CSS
 * equivalent — this is the one item in milestone K that costs a page its
 * zero-JS status, accepted deliberately for the 404 (K3).
 *
 * Faithful to upstream except where this site forces a difference:
 *
 * 1. **Multi-line.** Upstream draws one line and never wraps, which cannot
 *    carry a localized headline: "Not Found" is 9 characters and "Página não
 *    encontrada" is 21, so a single line would render Portuguese at less than
 *    half the English size. The break points are authored per locale in `i18n`
 *    and drawn as rows of one buffer, so the displacement still runs
 *    continuously down the whole block rather than per line.
 * 2. **The size is solved from the container, not passed in.** Upstream takes a
 *    `fontSize` and measures once, so any resize or rotation leaves the text at
 *    the size it happened to be born at. Here a `ResizeObserver` re-solves the
 *    largest size whose widest line — plus the clearance its own fuzz needs —
 *    still fits, clamped between `minFontSize` and `maxFontSize`.
 * 3. **`fuzzRange` is a ratio of the font size, not 30px flat.** Upstream's
 *    default pairs 30px with a `clamp(2rem, 8vw, 8rem)` display size; at this
 *    site's heading sizes a flat 30px displaces further than a glyph is tall
 *    and the text stops being readable. The ratio preserves the look upstream
 *    has at its own default size.
 * 4. **Device-pixel resolution, CSS-pixel noise.** Upstream sizes the canvas in
 *    CSS pixels, so a retina screen upscales the bitmap and the glyphs go soft.
 *    The buffer here is drawn at an integer device scale while the rows are
 *    displaced one CSS pixel at a time, which is the only combination that
 *    sharpens the type without also making the noise finer than upstream's.
 * 5. **Pointer events, and no `preventDefault`.** Upstream attaches
 *    `touchmove` with `{ passive: false }` and cancels it, which swallows a
 *    vertical swipe that merely started on the headline. Same bug class as
 *    CurvedLoop's `touch-action` fix; one `pointermove` pair covers mouse, pen
 *    and touch without touching scroll.
 * 6. **`prefers-reduced-motion` paints one still frame** and starts no loop and
 *    no listeners — house rule, and the text still reads normally.
 *
 * Not ported: `transitionDuration`, `clickEffect`, `glitchMode`, `gradient` and
 * `letterSpacing`. All are off in upstream's defaults and none was asked for.
 */

interface Props {
  /**
   * The headline, pre-split into display lines. Canvas text cannot wrap and the
   * two locales break in different places, so the split is authored in `i18n`
   * rather than computed here.
   */
  lines: string[];
  /** `inherit` reads the cascade, which keeps the colour on a token. */
  color?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  minFontSize?: number;
  maxFontSize?: number;
  /** Multiple of the resolved font size. */
  lineHeight?: number;
  baseIntensity?: number;
  hoverIntensity?: number;
  fuzzRatio?: number;
  fps?: number;
  className?: string;
}

/** Upstream's 30px range against the 128px its default `clamp()` resolves to. */
const UPSTREAM_FUZZ_RATIO = 30 / 128;
/** Room for an antialiased glyph edge in the buffer. Upstream's value. */
const EDGE_BUFFER = 10;
/** Past 3x the extra rows buy nothing a phone screen can show. */
const MAX_SCALE = 3;

export default function FuzzyText({
  lines,
  color = "inherit",
  fontFamily = "inherit",
  fontWeight = 500,
  minFontSize = 28,
  maxFontSize = 64,
  lineHeight = 1.05,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  fuzzRatio = UPSTREAM_FUZZ_RATIO,
  fps = 30,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  /** `lines` is a new array every render; the joined string is a stable dep. */
  const joined = lines.join("\n");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /*
     * ⛔ Not `canvas.parentElement`. Astro wraps a hydrated component in an
     * `<astro-island>` element, which is unknown to the UA and so defaults to
     * `display: inline` — and `clientWidth` is 0 for every inline element by
     * definition, which reads exactly like a collapsed container and leaves the
     * text unpainted at the canvas' default 300x150. Walk past any inline or
     * `display: contents` wrapper to the first real block box instead; that is
     * the element whose width the design actually controls.
     */
    const resolveHost = () => {
      let node = canvas.parentElement;
      while (node) {
        const display = window.getComputedStyle(node).display;
        if (display !== "inline" && display !== "contents") return node;
        node = node.parentElement;
      }
      return null;
    };

    const host = resolveHost();
    if (!host) return;
    const ctx = canvas.getContext("2d");
    const buffer = document.createElement("canvas");
    const bufferCtx = buffer.getContext("2d");
    if (!ctx || !bufferCtx) return;

    const items = joined.split("\n").filter((line) => line.length > 0);
    if (items.length === 0) return;

    const computed = window.getComputedStyle(canvas);
    const family = fontFamily === "inherit" ? computed.fontFamily || "serif" : fontFamily;
    const fill = color === "inherit" ? computed.color : color;
    /** Integer, so one CSS pixel is a whole number of buffer rows. */
    const scale = Math.max(1, Math.min(MAX_SCALE, Math.round(window.devicePixelRatio || 1)));

    let frame = 0;
    let cancelled = false;
    let hovering = false;
    let lastHostWidth = -1;
    let lastFrameAt = 0;

    /* Written by measure(), read by paint(). Device pixels unless named Css. */
    let bufferWidth = 0;
    let bufferHeight = 0;
    let margin = 0;
    let fuzzRange = 0;
    let textLeftCss = 0;
    let textRightCss = 0;
    let textBottomCss = 0;

    const setFont = (size: number) => {
      bufferCtx.font = `${fontWeight} ${size}px ${family}`;
      bufferCtx.textBaseline = "alphabetic";
    };

    const widest = (metrics: TextMetrics[]) =>
      metrics.reduce((width, metric) => Math.max(width, metric.width), 0);

    const measure = () => {
      const hostWidth = host.clientWidth;
      if (hostWidth <= 0) return false;
      lastHostWidth = hostWidth;
      const available = hostWidth * scale;

      /* One probe at a reference size gives width per 1px of font size. */
      const REFERENCE = 100;
      setFont(REFERENCE);
      const perUnit = widest(items.map((line) => bufferCtx.measureText(line))) / REFERENCE;
      if (perUnit <= 0) return false;

      /*
       * Solve for the size that fits the text *and* the clearance its own fuzz
       * needs, since the range scales with the size:
       *   perUnit·size + 2·(hoverIntensity·fuzzRatio·size / 2) + fixed ≤ available
       *
       * ⚠️ The fixed terms are not only the edge buffer. Each margin adds a
       * whole `scale` of slack and each of the three widths below is rounded up,
       * so a budget of `available - EDGE` alone overshoots by a few pixels — at
       * 375px the Portuguese headline came out 330px wide inside a 327px host
       * and lost 3px of its clearance to the clip.
       */
      const fixed = EDGE_BUFFER * scale + 2 * scale + 3;
      const fitted = (available - fixed) / (perUnit + hoverIntensity * fuzzRatio);
      const size = Math.max(minFontSize * scale, Math.min(maxFontSize * scale, fitted));

      setFont(size);
      const metrics = items.map((line) => bufferCtx.measureText(line));
      const ascent = Math.max(...metrics.map((m) => m.actualBoundingBoxAscent ?? size * 0.8));
      const descent = Math.max(...metrics.map((m) => m.actualBoundingBoxDescent ?? size * 0.2));
      const step = Math.round(size * lineHeight);
      const textWidth = widest(metrics);

      bufferWidth = Math.ceil(textWidth) + EDGE_BUFFER * scale;
      bufferHeight = Math.ceil(ascent + descent) + step * (items.length - 1);
      buffer.width = bufferWidth;
      buffer.height = bufferHeight;

      /* Sizing a canvas resets its context, so the font and fill go back on. */
      setFont(size);
      bufferCtx.fillStyle = fill;
      metrics.forEach((metric, index) => {
        bufferCtx.fillText(
          items[index],
          Math.round((bufferWidth - metric.width) / 2),
          ascent + index * step,
        );
      });

      fuzzRange = size * fuzzRatio;
      margin = Math.ceil((hoverIntensity * fuzzRange) / 2) + scale;

      canvas.width = bufferWidth + margin * 2;
      canvas.height = bufferHeight;
      canvas.style.width = `${canvas.width / scale}px`;
      canvas.style.height = `${canvas.height / scale}px`;
      /*
       * `setTransform`, not `translate`: sizing the canvas just cleared the
       * matrix, and a translate would compound across every re-measure.
       */
      ctx.setTransform(1, 0, 0, 1, margin, 0);

      const textLeft = margin + (bufferWidth - textWidth) / 2;
      textLeftCss = textLeft / scale;
      textRightCss = (textLeft + textWidth) / scale;
      textBottomCss = bufferHeight / scale;
      return true;
    };

    const paint = (intensity: number) => {
      if (bufferHeight === 0) return;
      ctx.clearRect(-margin, 0, bufferWidth + margin * 2, bufferHeight);
      for (let y = 0; y < bufferHeight; y += scale) {
        const slice = Math.min(scale, bufferHeight - y);
        /*
         * One offset per CSS pixel row rather than per buffer row, so the noise
         * stays as coarse as upstream's while the glyphs keep full resolution.
         */
        const dx =
          intensity === 0 ? 0 : Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
        ctx.drawImage(buffer, 0, y, bufferWidth, slice, dx, y, bufferWidth, slice);
      }
    };

    const run = (now: number) => {
      if (cancelled) return;
      if (now - lastFrameAt >= 1000 / fps) {
        lastFrameAt = now;
        paint(hovering ? hoverIntensity : baseIntensity);
      }
      frame = window.requestAnimationFrame(run);
    };

    const observer = new ResizeObserver(() => {
      if (cancelled || host.clientWidth === lastHostWidth) return;
      if (measure() && reduced) paint(0);
    });

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      hovering = x >= textLeftCss && x <= textRightCss && y >= 0 && y <= textBottomCss;
    };
    const onPointerOut = () => {
      hovering = false;
    };

    const start = async () => {
      /*
       * Measure once with whatever face is already available so the row claims
       * its height immediately, then again once the real one has loaded — the
       * height barely moves between the two, so the settle is not visible.
       */
      if (measure()) paint(reduced ? 0 : baseIntensity);
      try {
        await document.fonts.load(`${fontWeight} ${maxFontSize}px ${family}`);
      } catch {
        await document.fonts.ready;
      }
      if (cancelled) return;
      measure();
      observer.observe(host);
      if (reduced) {
        paint(0);
        return;
      }
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerout", onPointerOut);
      canvas.addEventListener("pointercancel", onPointerOut);
      frame = window.requestAnimationFrame(run);
    };

    void start();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerout", onPointerOut);
      canvas.removeEventListener("pointercancel", onPointerOut);
    };
  }, [
    joined,
    color,
    fontFamily,
    fontWeight,
    minFontSize,
    maxFontSize,
    lineHeight,
    baseIntensity,
    hoverIntensity,
    fuzzRatio,
    fps,
    reduced,
  ]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
