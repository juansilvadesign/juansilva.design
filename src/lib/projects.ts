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
}

export const EMPTY_FILTERS: Filters = { signals: [], stacks: [] };

/** A project matches when it carries every selected signal and at least one selected stack. */
export function matches(p: ProjectSummary, f: Filters): boolean {
  if (f.signals.some((s) => !p.evidenceSignals[s])) return false;
  if (f.stacks.length > 0 && !f.stacks.some((s) => p.stack.includes(s))) return false;
  return true;
}

export function applyFilters(all: ProjectSummary[], f: Filters, sort: SortKey): ProjectSummary[] {
  return all.filter((p) => matches(p, f)).sort(SORTS[sort]);
}

/** Counts for each facet given the *other* active filters, so a facet never reads as zero-when-clicked. */
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
