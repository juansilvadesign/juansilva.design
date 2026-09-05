/**
 * Shared ordering and faceting for the /projects index.
 *
 * Both the Astro page (server render) and the React island (client filtering)
 * read from here, so the order a crawler sees and the order a visitor sees
 * after hydration are produced by the same function rather than two that drift.
 */

export interface EvidenceSignals {
  liveSite: boolean;
  sourceCode: boolean;
  designAndCode: boolean;
  productStack: boolean;
  storeListing: boolean;
  designArtifact: boolean;
}

/** The display-only projection handed to the island. Nothing private crosses this line. */
export interface ProjectSummary {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  preview: string;
  previewAlt: string;
  liveUrl: string;
  liveLabel: string;
  evidenceLink: string | null;
  evidenceLabel: string | null;
  dates: { start: string | null; end: string | null };
  evidenceWeight: number;
  evidenceSignals: EvidenceSignals;
  hasCaseStudy: boolean;
  href: string;
}

export interface ProjectAction {
  href: string;
  label: string;
  /** External links open in a new tab and carry the external-link affordance. */
  external: boolean;
  kind: "live" | "source" | "case";
}

export interface ProjectActionInput {
  /** The store's own verdict — `evidenceSignals.sourceCode`. */
  sourceCode: boolean;
  liveUrl: string;
  liveLabel: string;
  evidenceLink?: string | null;
  caseHref: string;
  caseLabel: string;
  liveFallbackLabel: string;
  /**
   * The one fixed source label. It travels on the action so every consumer
   * agrees on the wording; the rendered button is `SourceCodeButton`, which
   * reads the same key rather than accepting a label it could be handed wrong.
   */
  sourceLabel: string;
}

/**
 * The two actions a card shows, and only two.
 *
 * Cards used to render three: live, evidence, and a case-study link that read
 * "Case study soon" on every record that had none. The rule now is
 *   asserts source code → live site + source code
 *   everything else     → live site + case study
 * every project has a case-study page, so slot two is never empty.
 *
 * ⛔ The verdict is `evidenceSignals.sourceCode` and nothing else. This used to
 * re-derive it in the template layer — a code-looking stack crossed with a
 * repo-host allowlist over `evidenceLink` — which meant the store said one
 * thing and the page decided another. The exporter already owns that call, so
 * two answers could only ever drift. `evidenceLink` supplies the destination;
 * it is never consulted about whether the button belongs.
 *
 * A record asserting the flag with no link is a store defect. Slot two falls
 * back to the case study rather than rendering a button that goes nowhere, and
 * the caller reports it at build time.
 */
export function projectActions(p: ProjectActionInput): [ProjectAction, ProjectAction] {
  const live: ProjectAction = {
    href: p.liveUrl,
    label: p.liveLabel || p.liveFallbackLabel,
    external: true,
    kind: "live",
  };

  const second: ProjectAction =
    p.sourceCode && p.evidenceLink
      ? {
          href: p.evidenceLink,
          label: p.sourceLabel,
          external: true,
          kind: "source",
        }
      : { href: p.caseHref, label: p.caseLabel, external: false, kind: "case" };

  return [live, second];
}

/**
 * The date a record actually asserts.
 *
 * `start` is null for agency work that began before Juan joined, so those sort
 * on their delivery date. Reading `.start` directly throws on them.
 */
export function assertedDate(d: { start: string | null; end: string | null }): string {
  return d.end ?? d.start ?? "";
}

/**
 * The thumbnail for a locale.
 *
 * A record may override the shared `preview` per language when the artwork
 * itself carries copy. Every surface goes through here so the card, the index
 * and the detail page cannot disagree about which picture a locale gets.
 */
export function previewFor(
  data: { preview: string; copy: Record<string, { preview?: string }> },
  lang: string,
): string {
  return data.copy[lang]?.preview ?? data.preview;
}

export interface TimeframeCopy {
  dateRange: string;
  dateOngoing: string;
  dateDelivered: string;
}

/**
 * The record's timeframe as a sentence, for whichever surface shows it.
 *
 * Extracted from the case-study page so the featured card and the detail page
 * cannot drift. Handles all three shapes `dates` takes: a closed range, an
 * ongoing engagement, and agency work whose start predates Juan and therefore
 * asserts only a delivery date.
 */
export function formatTimeframe(
  dates: { start: string | null; end: string | null },
  lang: string,
  copy: TimeframeCopy,
): string | null {
  const month = (iso: string) =>
    new Date(`${iso.length === 7 ? `${iso}-01` : iso}T00:00:00Z`).toLocaleDateString(
      lang === "pt" ? "pt-BR" : "en-GB",
      { year: "numeric", month: "short", timeZone: "UTC" },
    );

  const { start, end } = dates;
  if (start && end) {
    return copy.dateRange.replace("{start}", month(start)).replace("{end}", month(end));
  }
  if (start) return copy.dateOngoing.replace("{start}", month(start));
  if (end) return copy.dateDelivered.replace("{end}", month(end));
  return null;
}

/**
 * Default order: evidence descending, then most-recent first, then slug.
 *
 * The weight distribution is bimodal — 23 records tie at 1 and 16 tie at 5 —
 * so weight alone leaves 39 of 50 cards in an order decided by directory
 * listing. Recency breaks those ties visibly, and slug makes it total, so the
 * build is reproducible.
 */
export function byEvidence(a: ProjectSummary, b: ProjectSummary): number {
  if (b.evidenceWeight !== a.evidenceWeight) return b.evidenceWeight - a.evidenceWeight;
  const da = assertedDate(a.dates);
  const db = assertedDate(b.dates);
  if (da !== db) return db.localeCompare(da);
  return a.slug.localeCompare(b.slug);
}

/** Most-recent first, for the "Newest" view option. */
export function byRecency(a: ProjectSummary, b: ProjectSummary): number {
  const da = assertedDate(a.dates);
  const db = assertedDate(b.dates);
  if (da !== db) return db.localeCompare(da);
  return byEvidence(a, b);
}

export const SORTS = {
  evidence: byEvidence,
  recent: byRecency,
} as const;

export type SortKey = keyof typeof SORTS;

/**
 * Signal filters, ordered by how much they narrow.
 *
 * `designArtifact` is last because it is the weakest signal and the most
 * common — 44 of 50 records carry it. It is included rather than hidden: it
 * is what the design-only work actually has, and leaving it out left the
 * evidence rail blank on 23 cards that were not in fact evidence-free.
 */
export const SIGNAL_FACETS = [
  "liveSite",
  "designAndCode",
  "sourceCode",
  "productStack",
  "storeListing",
  "designArtifact",
] as const satisfies readonly (keyof EvidenceSignals)[];

export type SignalFacet = (typeof SIGNAL_FACETS)[number];

export interface Filters {
  signals: SignalFacet[];
  stacks: string[];
  /**
   * Free-text narrowing. Held raw and tokenised at match time rather than
   * pre-parsed into state, so the island stores exactly what the visitor typed
   * and `Clear filters` has one thing to reset.
   */
  query: string;
}

export const EMPTY_FILTERS: Filters = { signals: [], stacks: [], query: "" };

/**
 * Lower-case, and strip the accents.
 *
 * NFD splits an accented letter into its base plus a combining mark, so
 * dropping the U+0300–U+036F block leaves the base behind and "gestao" finds
 * "Gestão". The PT titles and taglines are full of accents a visitor types
 * inconsistently; this is the alternative to a hand-kept alias list.
 */
function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * The text a card actually prints, plus the stack ids behind its filter chips.
 *
 * Deliberately not `role`: it is one non-localised English string that no card
 * on this page shows, so searching it would match PT cards on words a PT
 * visitor cannot see and has had no chance to read.
 */
function haystack(p: ProjectSummary): string {
  return fold(`${p.title} ${p.tagline} ${p.stack.join(" ")}`);
}

/**
 * Every whitespace-separated token must appear somewhere in that text.
 *
 * AND across tokens, substring inside one, so the visitor never has to know
 * which field holds which word: "landing figma" crosses a title and a stack id
 * and returns 6. Substring-within-token is also what keeps a run-together
 * stack id reachable as two words — "open source" would find `opensource`
 * without an alias table — though no record carries that id today.
 *
 * A blank or all-whitespace query matches everything, so a stray space never
 * empties the grid.
 */
export function matchesQuery(p: ProjectSummary, query: string): boolean {
  const tokens = fold(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const text = haystack(p);
  return tokens.every((t) => text.includes(t));
}

/**
 * A project matches when it carries every selected signal, at least one
 * selected stack, and the query.
 */
export function matches(p: ProjectSummary, f: Filters): boolean {
  if (f.signals.some((s) => !p.evidenceSignals[s])) return false;
  if (f.stacks.length > 0 && !f.stacks.some((s) => p.stack.includes(s))) return false;
  if (!matchesQuery(p, f.query)) return false;
  return true;
}

export function applyFilters(all: ProjectSummary[], f: Filters, sort: SortKey): ProjectSummary[] {
  return all.filter((p) => matches(p, f)).sort(SORTS[sort]);
}

/**
 * Counts for each facet given the *other* active filters, so a facet never
 * reads as zero-when-clicked.
 *
 * The probes are built by spreading `f`, so the query rides along with them
 * for free: a chip's count always describes the set the visitor can actually
 * see, never the unsearched 50.
 */
export function facetCounts(all: ProjectSummary[], f: Filters) {
  const signals = {} as Record<SignalFacet, number>;
  for (const s of SIGNAL_FACETS) {
    const probe: Filters = { ...f, signals: [...new Set([...f.signals, s])] };
    signals[s] = all.filter((p) => matches(p, probe)).length;
  }
  const stacks: Record<string, number> = {};
  for (const s of stackFacets(all)) {
    const probe: Filters = { ...f, stacks: [s] };
    stacks[s] = all.filter((p) => matches(p, probe)).length;
  }
  return { signals, stacks };
}

/** Every stack token present in the set, most common first. */
export function stackFacets(all: ProjectSummary[]): string[] {
  const n: Record<string, number> = {};
  for (const p of all) for (const s of p.stack) n[s] = (n[s] ?? 0) + 1;
  return Object.keys(n).sort((a, b) => n[b] - n[a] || a.localeCompare(b));
}

/**
 * The filter-reactive recommendation: the strongest record still in view, plus
 * the signals that earned it. Returns null when the visible set is too small
 * for "recommended" to mean anything beyond "the only one".
 */
export function recommend(visible: ProjectSummary[]): { project: ProjectSummary; reasons: SignalFacet[] } | null {
  if (visible.length < 2) return null;
  const project = [...visible].sort(byEvidence)[0];
  if (project.evidenceWeight <= 1) return null;
  const reasons = SIGNAL_FACETS.filter((s) => project.evidenceSignals[s]);
  return { project, reasons };
}
