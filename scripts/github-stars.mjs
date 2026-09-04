/**
 * Refresh the committed GitHub star counts used by the Source-code button.
 *
 * The build stays offline and deterministic: `astro build` reads
 * `src/data/github-stars.ts`, never the network. This script is the only thing
 * that talks to GitHub, and it is invoked deliberately (`npm run stars:refresh`)
 * so a stale number is always a choice rather than an accident — which is why
 * the generated file records the date it was refreshed.
 *
 * The set of repositories is derived from the store's own
 * `evidenceSignals.sourceCode` flag, the same boolean the button renders off.
 * Nothing here re-derives "is this a repo?" from the URL.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = "src/content/projects";
const OUT_FILE = "src/data/github-stars.ts";

/** `https://github.com/owner/repo` -> `owner/repo`. Anything else is a defect. */
function repoPath(href) {
  if (!href || !URL.canParse(href)) return null;
  const url = new URL(href);
  if (url.hostname !== "github.com" && !url.hostname.endsWith(".github.com")) return null;
  const parts = url.pathname.split("/").filter(Boolean);
  return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null;
}

async function main() {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".json")).sort();

  const targets = [];
  for (const file of files) {
    const data = JSON.parse(await readFile(path.join(CONTENT_DIR, file), "utf8"));
    if (data.evidenceSignals?.sourceCode !== true) continue;

    const slug = file.replace(/\.json$/, "");
    const repo = repoPath(data.evidenceLink);
    if (!repo) {
      // A record that claims source code but carries no repository link is a
      // store defect, not something to paper over with a missing count.
      console.error(
        `[stars] ${slug}: evidenceSignals.sourceCode is true but evidenceLink ` +
          `is not a GitHub repository (${data.evidenceLink ?? "absent"}).`,
      );
      process.exitCode = 1;
      continue;
    }
    targets.push({ slug, repo });
  }

  if (process.exitCode === 1) return;

  const counts = {};
  for (const { slug, repo } of targets) {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { accept: "application/vnd.github+json", "user-agent": "juansilva.design-stars" },
    });
    if (!res.ok) {
      console.error(`[stars] ${slug}: GitHub returned ${res.status} for ${repo}.`);
      process.exitCode = 1;
      return;
    }
    const body = await res.json();
    counts[slug] = body.stargazers_count;
    console.log(`[stars] ${slug.padEnd(20)} ${repo.padEnd(38)} ${body.stargazers_count}`);
  }

  const refreshed = new Date().toISOString().slice(0, 10);
  const entries = Object.keys(counts)
    .sort()
    .map((slug) => `  "${slug}": ${counts[slug]},`)
    .join("\n");

  const out = `/**
 * GitHub star counts, refreshed by \`npm run stars:refresh\`.
 *
 * Generated file — do not hand-edit. The build reads this instead of calling
 * GitHub so \`astro build\` stays offline and deterministic.
 *
 * Last refreshed: ${refreshed}
 */
export const REFRESHED = "${refreshed}";

/**
 * The counter renders only above this many stars. A single star reads as
 * self-starred on a portfolio, so one is not worth advertising — the button
 * simply shows no number until a repository clears the bar.
 */
export const STAR_FLOOR = 1;

export const GITHUB_STARS: Readonly<Record<string, number>> = {
${entries}
};

/** The count to render, or \`null\` when there is nothing worth showing. */
export function starsFor(slug: string): number | null {
  const n = GITHUB_STARS[slug];
  return typeof n === "number" && n > STAR_FLOOR ? n : null;
}
`;

  await writeFile(OUT_FILE, out, "utf8");
  console.log(`[stars] wrote ${OUT_FILE} (${targets.length} repositories, refreshed ${refreshed})`);
}

await main();
