/**
 * GitHub star counts, refreshed by `npm run stars:refresh`.
 *
 * Generated file — do not hand-edit. The build reads this instead of calling
 * GitHub so `astro build` stays offline and deterministic.
 *
 * Last refreshed: 2026-09-03
 */
export const REFRESHED = "2026-09-03";

/**
 * The counter renders only above this many stars. A single star reads as
 * self-starred on a portfolio, so one is not worth advertising — the button
 * simply shows no number until a repository clears the bar.
 */
export const STAR_FLOOR = 1;

export const GITHUB_STARS: Readonly<Record<string, number>> = {
  "allprice": 1,
  "celus": 0,
  "gestrif": 0,
  "psi-silvanacabral": 0,
  "spaceapps": 1,
  "syd": 0,
  "upos": 0,
};

/** The count to render, or `null` when there is nothing worth showing. */
export function starsFor(slug: string): number | null {
  const n = GITHUB_STARS[slug];
  return typeof n === "number" && n > STAR_FLOOR ? n : null;
}
