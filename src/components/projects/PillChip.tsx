import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Filter pill — the hover mechanic adapted from React Bits' PillNav.
 *
 * Licence: React Bits is MIT + Commons Clause. Using a component inside a
 * product or site is granted; redistributing it "alone, in a bundle, or as a
 * ported version" is not. It therefore lives in THIS project only and must
 * never be lifted into a shared starter template.
 *
 * Upstream is a whole navigation bar (logo, links, mobile drawer, router
 * coupling). Only its pill *mechanic* transfers: a circle that grows from the
 * bottom edge while the label slides up and a duplicate slides in beneath it.
 *
 * Two departures:
 *
 * 1. **No GSAP.** The geometry below is upstream's arithmetic, but the motion
 *    is CSS transitions on `:hover` / `:focus-visible`. Upstream needs a
 *    timeline because it also sequences a logo and a drawer; a filter chip
 *    needs one state change.
 * 2. **Pressed reuses the hover end-state.** These are filters, not links, so
 *    "on" is the same fill the hover previews. Hovering an inactive chip shows
 *    exactly what selecting it will look like.
 *
 * The circle must be a disc big enough to cover a rectangle when it grows from
 * the bottom edge, so its radius comes from the chord through the pill's top
 * corners: R = (w²/4 + h²) / 2h. Measured rather than guessed, because the
 * chips are text-width and every locale changes them.
 */

interface Props {
  label: string;
  count: number;
  pressed: boolean;
  disabled?: boolean;
  onToggle: () => void;
  /**
   * Optional brand mark, from `lib/stack.ts` — the same SVG the case-study
   * StackBadge renders. Stack chips carry one; the evidence-signal chips above
   * them do not, and are left as they were.
   */
  icon?: string | null;
  /**
   * Recolourable inline markup, for a mark that cannot serve as its own mask.
   * Rendered in place of the background image. See STACK_ICON_INLINE.
   */
  iconInline?: string | null;
  /** Which stack this is — carries the mark's own rest colours in CSS. */
  iconId?: string | null;
}

export default function PillChip({
  label,
  count,
  pressed,
  disabled = false,
  onToggle,
  icon = null,
  iconInline = null,
  iconId = null,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [geo, setGeo] = useState({ d: 0, delta: 0, originY: 0, h: 0 });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const { width: w, height: h } = el.getBoundingClientRect();
    if (w === 0 || h === 0) return;

    const r = (w * w) / 4 / (2 * h) + h / 2;
    const d = Math.ceil(2 * r) + 2;
    const delta = Math.ceil(r - Math.sqrt(Math.max(0, r * r - (w * w) / 4))) + 1;

    setGeo({ d, delta, originY: d - delta, h });
  }, []);

  useEffect(() => {
    measure();

    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // Web-font swap changes the pill's text width after first paint.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => ro.disconnect();
  }, [measure]);

  /*
    Built per copy rather than once, because the two differ by exactly one
    thing: the resting label shows the brand mark in full colour, while the
    duplicate that rides the cyan disc knocks it back — the same inversion the
    text already does. Most marks are masked to a silhouette; the two that
    ship their own pressed artwork paint it instead, which is what the flag
    below switches. The stylesheet owns both treatments.
  */
  const inner = (on: boolean) => (
    <>
      {icon && (
        <span
          aria-hidden="true"
          className="chip__icon"
          data-on={on || undefined}
          data-stack={iconInline ? iconId : undefined}
          style={
            iconInline ? undefined : ({ "--chip-icon": `url("${icon}")` } as React.CSSProperties)
          }
          /* Build-time markup from our own icon file, recoloured by CSS
             variables — never anything a visitor can reach. */
          dangerouslySetInnerHTML={iconInline ? { __html: iconInline } : undefined}
        />
      )}
      {label}
      <span className="chip__n">{count}</span>
    </>
  );

  return (
    <button
      ref={ref}
      type="button"
      className="chip"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onToggle}
      style={
        {
          "--pill-d": `${geo.d}px`,
          "--pill-delta": `${geo.delta}px`,
          "--pill-origin-y": `${geo.originY}px`,
          "--pill-h": `${geo.h}px`,
        } as React.CSSProperties
      }
    >
      <span className="chip__circle" aria-hidden="true" />
      <span className="chip__labels">
        <span className="chip__label">{inner(false)}</span>
        <span className="chip__label chip__label--on" aria-hidden="true">
          {inner(true)}
        </span>
      </span>
    </button>
  );
}
