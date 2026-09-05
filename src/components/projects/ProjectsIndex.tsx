import { useEffect, useMemo, useState } from "react";
import CountUp from "../text/CountUp";
import BorderGlow from "./BorderGlow";
import PillChip from "./PillChip";
import SpotlightCard from "./SpotlightCard";
import {
  EMPTY_FILTERS,
  SIGNAL_FACETS,
  applyFilters,
  facetCounts,
  recommend,
  stackFacets,
  type Filters,
  type ProjectSummary,
  type SignalFacet,
  type SortKey,
} from "../../lib/projects";

export interface IndexCopy {
  heading: string;
  countOne: string;
  countMany: string;
  filterLegend: string;
  stackLegend: string;
  sortLegend: string;
  viewLegend: string;
  searchLegend: string;
  searchPlaceholder: string;
  sortEvidence: string;
  sortRecent: string;
  viewGrid: string;
  viewList: string;
  clear: string;
  empty: string;
  emptyQuery: string;
  emptyHint: string;
  recommended: string;
  recommendedWhy: string;
  caseStudy: string;
  caseStudySoon: string;
  boardTotal: string;
  board: { boardTotal: string; liveSite: string; designAndCode: string; sourceCode: string };
  signals: Record<SignalFacet, string>;
  signalsShort: Record<SignalFacet, string>;
  stacks: Record<string, string>;
}

interface Props {
  projects: ProjectSummary[];
  copy: IndexCopy;
}

/** The signature element: which provenance signals this record actually carries. */
function EvidenceRail({ p, copy }: { p: ProjectSummary; copy: IndexCopy }) {
  const on = SIGNAL_FACETS.filter((s) => p.evidenceSignals[s]);
  if (on.length === 0) return null;
  return (
    <ul className="rail" aria-label={copy.filterLegend}>
      {on.map((s) => (
        <li key={s} className="rail__item" data-signal={s}>
          <span aria-hidden="true" className="rail__dot" />
          {copy.signalsShort[s]}
        </li>
      ))}
    </ul>
  );
}

function Card({ p, copy, view }: { p: ProjectSummary; copy: IndexCopy; view: "grid" | "list" }) {
  const inner = (
    <a className="pcard__link" href={p.href}>
      <span className="pcard__media">
        <img src={p.preview} alt="" width="800" height="450" loading="lazy" decoding="async" />
      </span>
      <span className="pcard__body">
        <h3 className="pcard__title">{p.title}</h3>
        <p className="pcard__tagline">{p.tagline}</p>
        <EvidenceRail p={p} copy={copy} />
        {/*
          uiverse-3. All spans: the card is already one anchor, and a <button>
          or nested <a> here would be invalid content plus a nested-interactive
          defect. The circle is decoration, so it is hidden from assistive tech
          and the label carries the meaning on its own.
        */}
        <span className="pcard__cta">
          <span aria-hidden="true" className="pcard__cta-circle">
            <span className="pcard__cta-arrow" />
          </span>
          <span className="pcard__cta-text">
            {p.hasCaseStudy ? copy.caseStudy : copy.caseStudySoon}
          </span>
        </span>
      </span>
    </a>
  );
  return (
    <li className="pcard" data-view={view}>
      {/*
        Both surfaces suit a tile, not a full-width row: the spotlight tracks a
        pointer across an area, and the border glow lights the edge nearest it.
        A list row is 1200px wide and neither reads. Nesting is deliberate —
        the glow owns the frame, the spotlight washes the interior.
      */}
      {view === "grid" ? (
        <BorderGlow>
          <SpotlightCard>{inner}</SpotlightCard>
        </BorderGlow>
      ) : (
        inner
      )}
    </li>
  );
}

export default function ProjectsIndex({ projects, copy }: Props) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("evidence");
  const [view, setView] = useState<"grid" | "list">("grid");
  /*
    uiverse-9. The field holds its own value so typing is never held up, and
    the committed query lands in `filters` a beat later. Both halves are
    needed: the input must feel instant, while re-running 12 facet probes and
    rewriting the role="status" count on every keystroke would make a screen
    reader read a tally per letter.
  */
  const [draft, setDraft] = useState("");

  /*
    250ms: above a fast typist's inter-key gap, below the ~300ms that starts to
    read as lag. The equality guard keeps `Clear filters` from being undone —
    it zeroes both halves, and without the guard this timer would then commit
    an identical empty string and re-render for nothing.
  */
  useEffect(() => {
    const id = window.setTimeout(
      () => setFilters((f) => (f.query === draft ? f : { ...f, query: draft })),
      250,
    );
    return () => window.clearTimeout(id);
  }, [draft]);

  const stacks = useMemo(() => stackFacets(projects), [projects]);
  const visible = useMemo(() => applyFilters(projects, filters, sort), [projects, filters, sort]);
  const counts = useMemo(() => facetCounts(projects, filters), [projects, filters]);
  const pick = useMemo(() => recommend(visible), [visible]);

  /* Counted off `draft`, not `filters.query`, so the button appears on the
     first keypress instead of 250ms into it. */
  const active = filters.signals.length + filters.stacks.length + (draft.trim() ? 1 : 0);

  const clearAll = () => {
    setDraft("");
    setFilters(EMPTY_FILTERS);
  };

  const toggle = <K extends "signals" | "stacks">(key: K, value: Filters[K][number]) =>
    setFilters((f) => {
      const list = f[key] as string[];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...f, [key]: next } as Filters;
    });

  const board = useMemo(
    () => [
      { k: "boardTotal", n: projects.length, label: copy.board.boardTotal },
      // Count labels, not filter labels — "21 Live site" reads as a name, not a tally.
      ...(["liveSite", "designAndCode", "sourceCode"] as const).map((s) => ({
        k: s,
        n: projects.filter((p) => p.evidenceSignals[s]).length,
        label: copy.board[s],
      })),
    ],
    [projects, copy],
  );

  return (
    <div className="pindex">
      <ul className="board" aria-label={copy.heading}>
        {board.map((c, i) => (
          <li className="board__cell" key={c.k}>
            {/* Staggered by cell so the row reads left to right, not as one jump. */}
            <CountUp className="board__n" to={c.n} delay={i * 90} />
            <span className="board__label">{c.label}</span>
          </li>
        ))}
      </ul>

      <div className="controls">
        <fieldset className="controls__group">
          <legend className="controls__legend">{copy.filterLegend}</legend>
          <div className="chips">
            {SIGNAL_FACETS.map((s) => {
              const n = counts.signals[s];
              const on = filters.signals.includes(s);
              return (
                <PillChip
                  key={s}
                  label={copy.signals[s]}
                  count={n}
                  pressed={on}
                  disabled={!on && n === 0}
                  onToggle={() => toggle("signals", s)}
                />
              );
            })}
          </div>
        </fieldset>

        {/*
          Stack filters and the sort/view tools share one row on desktop. They
          were stacked before, which left the tools marooned at the far left of
          a 1200px container under a legend that only named the dropdown.
        */}
        <div className="controls__row">
          <fieldset className="controls__group">
            <legend className="controls__legend">{copy.stackLegend}</legend>
            <div className="chips">
              {stacks.map((s) => {
                const n = counts.stacks[s] ?? 0;
                const on = filters.stacks.includes(s);
                return (
                  <PillChip
                    key={s}
                    label={copy.stacks[s] ?? s}
                    count={n}
                    pressed={on}
                    disabled={!on && n === 0}
                    onToggle={() => toggle("stacks", s)}
                  />
                );
              })}
            </div>
          </fieldset>

          <div className="tools">
            {/*
              uiverse-9 — `splendid-starfish-73`. Two departures from the note,
              both load-bearing:

              It keeps itself open with `required` + `:not(:invalid)`, which
              tells assistive tech an empty search box is an invalid required
              field. `:not(:placeholder-shown)` is the same "has content" test
              told truthfully — so the placeholder is structural here, not
              decoration, and must never be dropped.

              And the note's own <title>Search</title> is gone with the icon
              hidden: this sits in the same labelled `.tool` wrapper as Sort and
              View, so the visible legend already names the field. Keeping both
              would announce the control twice.
            */}
            <label className="tool">
              <span className="tool__label">{copy.searchLegend}</span>
              <span className="search">
                <input
                  type="search"
                  className="search__input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={copy.searchPlaceholder}
                  autoComplete="off"
                  spellCheck={false}
                />
                <span aria-hidden="true" className="search__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                      d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
                      fill="none"
                      stroke="currentColor"
                      strokeMiterlimit={10}
                      strokeWidth={32}
                    />
                    <path
                      d="M338.29 338.29L448 448"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeMiterlimit={10}
                      strokeWidth={32}
                    />
                  </svg>
                </span>
              </span>
            </label>

            <label className="tool">
              <span className="tool__label">{copy.sortLegend}</span>
              <select
                className="tool__select"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                <option value="evidence">{copy.sortEvidence}</option>
                <option value="recent">{copy.sortRecent}</option>
              </select>
            </label>

            <div className="tool">
              <span className="tool__label" id="pindex-view-legend">
                {copy.viewLegend}
              </span>
              <div className="toggle" role="group" aria-labelledby="pindex-view-legend">
                <button
                  type="button"
                  className="toggle__btn"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                >
                  {copy.viewGrid}
                </button>
                <button
                  type="button"
                  className="toggle__btn"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                >
                  {copy.viewList}
                </button>
              </div>
            </div>

            {active > 0 && (
              <button type="button" className="clear" onClick={clearAll}>
                {copy.clear}
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="count" role="status">
        {visible.length === 1 ? copy.countOne : copy.countMany.replace("{n}", String(visible.length))}
      </p>

      {pick && (
        <section className="rec" aria-label={copy.recommended}>
          <p className="rec__eyebrow">{copy.recommended}</p>
          <a className="rec__link" href={pick.project.href}>
            <span className="rec__media">
              <img src={pick.project.preview} alt="" width="800" height="450" loading="lazy" decoding="async" />
            </span>
            <span className="rec__body">
              <h3 className="rec__title">{pick.project.title}</h3>
              <p className="rec__tagline">{pick.project.tagline}</p>
              <p className="rec__why">
                {copy.recommendedWhy}{" "}
                {pick.reasons.map((r) => copy.signalsShort[r]).join(" · ")}
              </p>
            </span>
          </a>
        </section>
      )}

      {visible.length === 0 ? (
        <div className="empty">
          {/* A query and a chip combination fail for different reasons, and
              "no project carries that evidence" is simply wrong when the cause
              was a typo. Echo the term back so the visitor can see it. */}
          <p className="empty__title">
            {filters.query.trim()
              ? copy.emptyQuery.replace("{q}", filters.query.trim())
              : copy.empty}
          </p>
          <button type="button" className="clear" onClick={clearAll}>
            {copy.emptyHint}
          </button>
        </div>
      ) : (
        <ul className="grid" data-view={view}>
          {visible.map((p) => (
            <Card key={p.slug} p={p} copy={copy} view={view} />
          ))}
        </ul>
      )}
    </div>
  );
}
