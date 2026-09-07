/**
 * The brand mark for each stack token.
 *
 * Two surfaces render these: `StackBadge.astro` (case-study brief, homepage
 * cards) and the stack filter chips on /projects. The map lives here rather
 * than inside StackBadge because the chips are a React island, and an island
 * cannot import an Astro component.
 *
 * Icons only. The label is deliberately not here — the badge carries its own
 * non-localised name, the chips read theirs from i18n (`copy.stacks`), and a
 * third copy in this file would be the one that goes stale.
 */

import type { ProjectData } from "../content.config";

/*
 * Raw at build time — the same two files the case-study badge renders as an
 * <img>, recoloured here for both chip states rather than duplicated into a
 * per-state variant.
 *
 * A 24px themed export of each was compared against these: 3 paths, identical
 * node counts, every coordinate exactly 2x to within 5-decimal rounding. Same
 * artwork, different fills — so a second file buys no precision at the 16px
 * the chip renders, and these stay the single source.
 */
import javascriptSvg from "../../public/assets/icons/javascript.svg?raw";
import typescriptSvg from "../../public/assets/icons/typescript.svg?raw";

export type StackId = ProjectData["stack"][number];

export const STACK_ICONS = {
  typescript: "/assets/icons/typescript.svg",
  javascript: "/assets/icons/javascript.svg",
  tailwind: "/assets/icons/tailwind.svg",
  figma: "/assets/icons/figma.svg",
  python: "/assets/icons/python.svg",
  opensource: "/assets/icons/open-source.svg",
} as const satisfies Record<StackId, string>;

/**
 * The two marks that are a filled brand tile with the glyph knocked out of it
 * — the "TS" is paint, not a hole.
 *
 * Every other stack mark is a free-standing shape, so the pressed chip can mask
 * it by its own alpha and paint a silhouette through it. Masking one of these
 * resolves the whole square and returns a featureless block, and no luminance
 * or composite recipe separates the glyph cleanly — the tile always bleeds.
 *
 * So these two are inlined instead of used as a background image, which is what
 * lets CSS own the `fill`. The artwork keeps exactly one home — the .svg file
 * imported above — and the pressed state is the same paths in different
 * colours, taken from the theme rather than baked into a second file.
 *
 * Rest and pressed colours both live in `.chip__icon` in projects-index.css.
 */
function themeable(svg: string): string {
  let seen = 0;
  return (
    svg
      // First path is the tile, the rest are the glyph. By position, not by
      // colour, so this reads either the brand file or the themed one.
      .replace(/<path([^>]*?)fill="[^"]*"/g, (_m, attrs) =>
        `<path${attrs}fill="var(${seen++ === 0 ? "--stack-tile" : "--stack-glyph"})"`)
      /*
       * Figma wraps its exports in a clip-path group whose clipPath is a rect
       * the exact size of the viewBox — it clips nothing. Harmless in a file,
       * but this markup is inlined twice per chip (the resting label and the
       * duplicate that rides the disc), which would put the export's `id` in
       * the document twice. Duplicate ids are invalid and `url(#id)` binds to
       * the first, so both copies would share one clip. It renders correctly
       * today only because the clip is a no-op — luck, not design. Dropping
       * the wrapper removes the id, and with it the whole question.
       */
      .replace(/<g clip-path="[^"]*">/, "")
      .replace(/<\/g>/, "")
      .replace(/<defs>[\s\S]*?<\/defs>/, "")
      // The intrinsic size would win over the 16px slot; the viewBox carries it.
      .replace(/^<svg width="\d+" height="\d+" /, "<svg ")
      // The file's own line breaks would land in the label as text nodes, which
      // both pad the measured pill width and show up in its textContent.
      .replace(/>\s+</g, "><")
      .trim()
  );
}

export const STACK_ICON_INLINE: Partial<Record<StackId, string>> = {
  typescript: themeable(typescriptSvg),
  javascript: themeable(javascriptSvg),
};

/** Narrowing lookup: `stackFacets()` yields raw strings from the content. */
export function stackIcon(id: string): string | null {
  return id in STACK_ICONS ? STACK_ICONS[id as StackId] : null;
}

/** The inline, recolourable markup, for marks that cannot mask themselves. */
export function stackIconInline(id: string): string | null {
  return STACK_ICON_INLINE[id as StackId] ?? null;
}
