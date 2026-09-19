/**
 * The hero portrait's media — stills, theme-change clips and the /card avatar.
 * Everything lives on the CDN under `juansilva.design/hero/`; the recipe that
 * renders it is `scripts/hero-portrait/`, and the untouched 1080×1920
 * transparent masters it reads are archived beside it under `hero/masters/`.
 *
 * ⛔ The card gradient is BAKED into every file here (`--color-portrait-*` in
 * tokens.css). Re-render the set when those stops change.
 */
const HERO = "https://cdn.juanpablosilva.com.br/juansilva.design/hero";

type Theme = "dark" | "light";
type CdnUrl = `https://${string}`;

export const heroPortrait = {
  /** Intrinsic size of the large still, 2× the 420×479 Figma card. */
  width: 840,
  height: 958,
  /**
   * The card's rendered width: `--hero-media-*` (300 / 400 / 452px) × 420/452.
   * ⛔ Keep in step with those tokens — the head preload in `index.astro`
   * resolves the same candidate from this string, and a mismatch fetches the
   * still twice.
   */
  sizes: "(min-width: 1536px) 420px, (min-width: 1024px) 372px, 279px",
  stills: {
    dark: {
      src: `${HERO}/portrait-dark.webp`,
      srcset: `${HERO}/portrait-dark-420.webp 420w, ${HERO}/portrait-dark.webp 840w`,
    },
    light: {
      src: `${HERO}/portrait-light.webp`,
      srcset: `${HERO}/portrait-light-420.webp 420w, ${HERO}/portrait-light.webp 840w`,
    },
  } satisfies Record<Theme, { src: CdnUrl; srcset: string }>,
  /**
   * A clip is `${clipBase}to-${theme}-${take}.{webm,mp4}` — named for the theme
   * it lands on, so `to-dark-*` is the white suit turning black. Each one bakes
   * its DESTINATION card, because the page has already repainted by the time it
   * starts.
   */
  clipBase: `${HERO}/`,
  takes: ["smile", "neutral"],
  /**
   * ⛔ Names the VP9 profile AND level actually shipped (read back with
   * ffprobe). A bare `video/webm` lets a browser claim support by MIME and then
   * fail to decode — the blank-box failure the case-study loops already hit.
   * H.264 needs no test: every browser that runs this script decodes it.
   */
  webmType: 'video/webm; codecs="vp09.00.31.08"',
} as const;

/** The /card avatar: the same two stills, cropped to the face. */
export const profileAvatar: Record<Theme, CdnUrl> = {
  dark: `${HERO}/avatar-dark.webp`,
  light: `${HERO}/avatar-light.webp`,
};

/**
 * The navbar + footer profile link (`ProfileLink.astro`, 56px): Figma
 * `23129:329`'s picture re-exported at 3× with the avatars above — the rest
 * state keeps the dark LinkedIn badge, hover swaps in the cyan ring and badge.
 */
export const profileLinkImages = {
  dark: { rest: `${HERO}/profile-link-dark.webp`, hover: `${HERO}/profile-link-dark-hover.webp` },
  light: { rest: `${HERO}/profile-link-light.webp`, hover: `${HERO}/profile-link-light-hover.webp` },
} satisfies Record<Theme, { rest: CdnUrl; hover: CdnUrl }>;
