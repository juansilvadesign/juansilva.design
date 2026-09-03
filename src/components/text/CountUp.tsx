import { useEffect, useState } from "react";

/**
 * Counting number — adapted from React Bits' CountUp.
 *
 * Licence: React Bits is MIT + Commons Clause. Using a component inside a
 * product or site is granted; redistributing it "alone, in a bundle, or as a
 * ported version" is not. It therefore lives in THIS project only and must
 * never be lifted into a shared starter template.
 *
 * Three departures from upstream:
 *
 * 1. **No `motion/react`.** Upstream imports Framer Motion for one spring.
 *    This is a `requestAnimationFrame` tween, so the component adds no
 *    dependency to a site that otherwise ships almost no JavaScript.
 * 2. **A bounded tween, not a spring.** A spring approaches its target
 *    asymptotically and only *looks* settled; this has to land on the exact
 *    figure and stop, because the number is a claim about the portfolio.
 *    `ease-out` over a fixed duration, with the final frame assigned rather
 *    than interpolated.
 * 3. **The true figure ships in the HTML.** Upstream renders an empty `<span>`
 *    and writes into it through a ref, so the number is absent from the static
 *    markup entirely. Here it rides in a `.typed-real` sibling — server
 *    rendered, read by crawlers and screen readers, and swapped back into flow
 *    by TypedFallback.astro when scripts are off.
 */

interface Props {
  to: number;
  from?: number;
  /** Milliseconds. */
  duration?: number;
  /** Milliseconds to wait before the first frame — lets a row stagger. */
  delay?: number;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CountUp({ to, from = 0, duration = 1400, delay = 0, className = "" }: Props) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    let frame = 0;
    let startedAt = 0;

    const tick = (now: number) => {
      if (startedAt === 0) startedAt = now;
      const t = Math.min((now - startedAt) / duration, 1);

      if (t >= 1) {
        // Assigned, not interpolated: the last frame must be the exact figure.
        setValue(to);
        return;
      }

      setValue(Math.round(from + (to - from) * easeOutCubic(t)));
      frame = requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [to, from, duration, delay]);

  return (
    <span className={className}>
      <span className="typed-real">{to}</span>
      <span className="typed-anim" aria-hidden="true">
        {value}
      </span>
    </span>
  );
}
