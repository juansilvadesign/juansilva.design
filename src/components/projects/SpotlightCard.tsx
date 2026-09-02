import { useRef, type ReactNode } from "react";

/**
 * Spotlight surface — adapted from React Bits' SpotlightCard.
 *
 * Licence: React Bits is MIT + Commons Clause. Using a component inside a
 * product or site is granted; redistributing it "alone, in a bundle, or as a
 * ported version" is not. It therefore lives in THIS project only and must
 * never be lifted into a shared starter template.
 *
 * Adapted so the glow resolves to --primary rather than the upstream purple,
 * and so it is pointer-only: touch and keyboard users get the static card,
 * which is why the glow carries no information of its own.
 */
export default function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    el.style.setProperty("--spot-o", "1");
  };

  const leave = () => ref.current?.style.setProperty("--spot-o", "0");

  return (
    <div ref={ref} className={`spot ${className}`} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </div>
  );
}
