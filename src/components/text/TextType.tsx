import { createElement, useCallback, useEffect, useMemo, useRef, useState, type ElementType } from "react";

/**
 * Typing surface — adapted from React Bits' TextType.
 *
 * Licence: React Bits is MIT + Commons Clause. Using a component inside a
 * product or site is granted; redistributing it "alone, in a bundle, or as a
 * ported version" is not. It therefore lives in THIS project only and must
 * never be lifted into a shared starter template.
 *
 * Three deliberate departures from upstream:
 *
 * 1. **No GSAP.** Upstream pulls the whole animation library in to blink one
 *    cursor. On a site whose pages otherwise ship zero JavaScript that trade is
 *    absurd — the blink is a CSS keyframe in `text-type.css` instead.
 * 2. **`start` / `onDone`.** Upstream can only run one string list on a fixed
 *    delay. Sequencing two instances (type a lead, *then* loop a list) needs a
 *    gate and a completion signal, not a guessed `initialDelay` that drifts the
 *    moment the copy or the typing speed changes.
 * 3. **Reduced motion is a bail-out, not a shorter duration.** A looping
 *    type-and-delete cannot be "made faster" into something acceptable — the
 *    text is absent for most of the cycle. Under `prefers-reduced-motion` the
 *    final string renders immediately and nothing ever animates.
 *
 * The caller owns accessibility: this renders decorative text, so every mount
 * is `aria-hidden` and the real string sits in a `.visually-hidden` sibling.
 */

export interface TextTypeProps {
  /** One string, or the list to cycle through. */
  text: string | string[];
  as?: ElementType;
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  /** Hold at the end of a string before deleting (or before stopping). */
  pauseDuration?: number;
  initialDelay?: number;
  loop?: boolean;
  showCursor?: boolean;
  cursorCharacter?: string;
  /** Gate: hold at empty until the parent flips this true. */
  start?: boolean;
  /** Fires once a non-looping run finishes its last string. */
  onDone?: () => void;
  /**
   * Hold the height of the tallest string in `text`, so a partly-typed or
   * rotating line never reflows what sits below it. Every candidate is
   * rendered hidden into the same grid cell, which makes the reservation exact
   * at any font, width and locale — a `min-height` guess is none of those.
   */
  reserveSpace?: boolean;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export default function TextType({
  text,
  as: Component = "span",
  className = "",
  cursorClassName = "",
  typingSpeed = 55,
  deletingSpeed = 30,
  pauseDuration = 1800,
  initialDelay = 0,
  loop = true,
  showCursor = true,
  cursorCharacter = "|",
  start = true,
  onDone,
  reserveSpace = false,
}: TextTypeProps) {
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const reduced = usePrefersReducedMotion();

  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // `onDone` must not re-arm the timer loop when the parent re-renders with a
  // fresh closure, so it is read through a ref rather than listed as a dep.
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const firedRef = useRef(false);

  const current = texts[index] ?? "";
  const shown = reduced ? texts[texts.length - 1] : current.slice(0, chars);

  const finish = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    doneRef.current?.();
  }, []);

  useEffect(() => {
    if (reduced) {
      finish();
      return;
    }
    if (!start) return;

    let timer: ReturnType<typeof setTimeout>;

    if (deleting) {
      if (chars === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % texts.length);
        return;
      }
      timer = setTimeout(() => setChars((c) => c - 1), deletingSpeed);
    } else if (chars < current.length) {
      const delay = chars === 0 && index === 0 ? initialDelay : typingSpeed;
      timer = setTimeout(() => setChars((c) => c + 1), delay);
    } else {
      // A completed string. Stop here when this is the last one of a
      // non-looping run; otherwise hold, then delete and advance.
      const last = index === texts.length - 1;
      if (!loop && last) {
        finish();
        return;
      }
      timer = setTimeout(() => setDeleting(true), pauseDuration);
    }

    return () => clearTimeout(timer);
  }, [
    chars,
    current.length,
    deleting,
    deletingSpeed,
    finish,
    index,
    initialDelay,
    loop,
    pauseDuration,
    reduced,
    start,
    texts.length,
    typingSpeed,
  ]);

  const live = (
    <span className="ttype__live" key="live">
      <span className="ttype__text">{shown}</span>
      {showCursor && !reduced ? (
        <span className={`ttype__caret ${cursorClassName}`.trim()}>{cursorCharacter}</span>
      ) : null}
    </span>
  );

  return createElement(
    Component,
    {
      className: `ttype ${reserveSpace ? "ttype--reserve" : ""} ${className}`.replace(/\s+/g, " ").trim(),
      "aria-hidden": "true",
    },
    reserveSpace
      ? texts.map((t, i) => (
          <span className="ttype__sizer" key={`sizer-${i}`}>
            {t}
          </span>
        ))
      : null,
    live,
  );
}
