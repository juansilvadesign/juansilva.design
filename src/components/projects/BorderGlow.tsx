import { useCallback, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Edge-glow surface — adapted from React Bits' BorderGlow.
 *
 * Licence: React Bits is MIT + Commons Clause. Using a component inside a
 * product or site is granted; redistributing it "alone, in a bundle, or as a
 * ported version" is not. It therefore lives in THIS project only and must
 * never be lifted into a shared starter template.
 *
 * Adapted the same way SpotlightCard was: the references contribute geometry
 * and motion, never palette. Upstream's signature is a purple/pink/blue mesh;
 * here every gradient stop resolves to the cyan primary, so the glow reads as
 * the same accent already used by the spotlight and the homepage card hover.
 *
 * Upstream's `animated` prop (a scripted one-shot sweep on mount) is dropped —
 * fifty cards firing an entrance animation is noise, and the effect we want is
 * the pointer-following cone.
 *
 * Pointer-only, like the spotlight: touch and keyboard users get the static
 * card, which is why the glow carries no information of its own.
 */

interface Props {
  children: ReactNode;
  className?: string;
  /** Cursor distance from the edge, 0-100, before the border lights at all. */
  edgeSensitivity?: number;
  /** Glow hue as an `H S L` triple. Defaults to --color-cyan-400. */
  glowColor?: string;
  glowIntensity?: number;
  /** How wide the lit arc is, as a percentage of the perimeter. */
  coneSpread?: number;
  /** How far the outer bloom spills past the card, in px. */
  glowRadius?: number;
  fillOpacity?: number;
}

/** Upstream's seven mesh anchors, kept so the gradient keeps its shape. */
const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];

/**
 * Cyan-400, cyan-300 and cyan-700 — the same three the design system already
 * uses for --primary, --primary-light and --primary-dark. Three stops rather
 * than one so the border still reads as a gradient and not a flat rule.
 */
const CYAN_MESH = ["#00c8ff", "#2cd6ff", "#007cab"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function glowVars(hsl: string, intensity: number): Record<string, string> {
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    const alpha = Math.min(opacities[i] * intensity, 100);
    vars[`--glow-color${keys[i]}`] = `hsl(${hsl} / ${alpha}%)`;
  }
  return vars;
}

function gradientVars(colors: string[]): Record<string, string> {
  const vars: Record<string, string> = {};
  for (let i = 0; i < GRADIENT_KEYS.length; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 28,
  glowColor = "193deg 100% 62%",
  glowIntensity = 0.85,
  coneSpread = 25,
  glowRadius = 32,
  fillOpacity = 0.4,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * How close to the edge the cursor is, 0 at the centre and 1 on the border.
   * Upstream's derivation: the ratio of the cursor's offset to the offset the
   * card boundary would have on the same ray.
   */
  const move = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;

    const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
    const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    el.style.setProperty("--edge-proximity", (edge * 100).toFixed(2));
    el.style.setProperty("--cursor-angle", `${angle.toFixed(2)}deg`);
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={move}
      className={`bglow ${className}`.trim()}
      style={
        {
          "--edge-sensitivity": edgeSensitivity,
          "--glow-padding": `${glowRadius}px`,
          "--cone-spread": coneSpread,
          "--fill-opacity": fillOpacity,
          ...glowVars(glowColor, glowIntensity),
          ...gradientVars(CYAN_MESH),
        } as CSSProperties
      }
    >
      <span className="bglow__edge" aria-hidden="true" />
      <div className="bglow__inner">{children}</div>
    </div>
  );
}
