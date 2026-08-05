# Roadmap

Where the master portfolio is going, and why it left Next.js.

**Direction:** turn a hand-edited Next.js static export into an **Astro
content-driven master portfolio** — where every piece of copy is data, every
project is a typed content entry, and the UI layer can be replaced next year
without touching a single fact about Juan's work.

This file is the **status board**. The actionable checklist is
**[`TASKS.md`](TASKS.md)**. Business context — ICP, offer, positioning — lives in
the workspace at
[`workspace/juansilva.design/`](../../CLAUDE.md); operational truth (domains,
pipeline, rails) lives in [`MEMORY.md`](../../MEMORY.md).

_Last reviewed: 2026-08-04_

---

## The split: two sites, two repos, two jobs

Decided by Juan **2026-08-04**. Until now one repo
(`juansilvadesign/juansilva.is-a.dev`) held two different websites in two
different checkouts, and the live one had never been committed.

| | `juansilva.is-a.dev` | **`juansilva.design`** (new) |
| --- | --- | --- |
| Role | The **dev / v1** site — Juan's developer-facing page | The **master portfolio** — design *and* code |
| Stack | Next.js 14, static export | **Astro 7**, static, zero-JS baseline |
| Status | ✅ frozen, untouched | 🟢 this roadmap |
| Serves | `dev.juanpablosilva.com.br` | `juanpablosilva.com.br` → later `juansilva.design` |
| Workspace path | `projects/juansilva-is-a-dev/` (submodule, **never the edit surface**) | `projects/juansilva-design/` (becomes a submodule of the new repo) |

> ⛔ **`projects/juansilva-is-a-dev/` is frozen.** It is the pinned reference for
> the v1 site and nothing in this roadmap may modify it. Its SHA is asserted
> unchanged at the end of Milestone B.

---

## State of the world (verified 2026-08-04, by curl + DNS)

| Host | Reality | Serves |
| --- | --- | --- |
| `juanpablosilva.com.br` | 🟢 HTTP 200, Cloudflare | **Production** — the v2 Design-Engineer site |
| `dev.juanpablosilva.com.br` | 🟢 HTTP 200, Cloudflare | The v1 site (matches repo `main`) |
| `juansilva.is-a.dev` | 🔴 HTTP 200 but serves an empty `Index of /` | nothing — **the site is gone from here** |
| `juansilva.design` | ⛔ not bought, does not resolve | nothing |

Three facts that shape every milestone below:

1. **Production has never been committed.** `juanpablosilva.com.br` is built from
   the *uncommitted working tree* in `projects/juansilva-design/`. The repo's last
   commit (`c064588`, 2025-11-25) is still the v1 site. That working tree has been
   the only copy of the live site for ~8 weeks. **This is the single largest risk
   in the project and Milestone A exists to end it.**
2. **Production is invisible to its own codebase.** `juanpablosilva.com.br` appears
   in **zero** config files — it was scrubbed as "stale" during the June v2 edit,
   when it was in fact the live origin. Every domain constant points at a dead host
   (`is-a.dev`) or an unbought one (`.design`).
3. **Because the live code was never committed, production cannot be a
   git-connected Cloudflare Pages build** — a connected build can only build
   committed code. It must be a direct upload. Milestone A verifies this rather
   than assuming it, because it decides whether repo surgery can touch production.

---

## Milestones

`✅ shipped` · `🟢 active` · `⬜ queued` · `🔒 gated`

| | Milestone | State | Gate / evidence |
| --- | --- | --- | --- |
| **A** | Preserve + repair the current site | ✅ | Source in a repo (`93dd7a9`); 4 defects fixed. Open: `og-image.jpg` (Juan's Figma export) |
| **B** | New repo + Astro scaffold + submodule swap | 🟢 | B1 + B3 ✅ 08-05. **B2 (Astro scaffold) is next** |
| **C** | Content architecture *(keystone)* | ⬜ | Needs B2 |
| **D** | Port the v2 pages to Astro | ⬜ | Needs C |
| **E** | vCard | ⬜ | Needs C |
| **F** | Master-portfolio evidence store | ⬜ | Needs C |
| **G** | Contact form on Cloudflare Pages Functions | ⬜ | Needs D. **Now the form's only path** — the Render service does not exist |
| **H** | Cutover to `juansilva.design` | 🔒 | Gated on the domain purchase — deliberately deferred |

Critical path is now **B2 → C → D**. **E** and **F** parallel D once C lands.
**G** closes the inbound loop. **H** waits on a purchase decision.

> **Scope correction, 2026-08-05.** A carried a Render step (A4) to keep the old
> contact-form backend alive as a stopgap. That contradicted the decision to move
> to Cloudflare — and the service turned out not to exist (`x-render-routing:
> no-server`). **A4 is deleted. There is no Render work in this plan.**
>
> A also pushed the rescue to a branch on `juansilva.is-a.dev`, the repo Juan
> fenced off. That branch was deleted and the code re-seeded here; the old repo is
> back to `main` + `gh-pages` exactly as it was. ⛔ Nothing lands in that repo.

---

### A — Rescue production 🟢

**Two unrelated things are wrong and both are cheap to fix.** This milestone is
deliberately first, separate, and shippable in an evening, because it repairs the
lane's only inbound channel *today* — independent of whether the Astro rebuild
ever happens.

**A1 — the source of production is uncommitted.** Fix: commit the v2 tree to a
`v2-next-production` branch on the *existing* repo and push it. `main` keeps the
v1 site, so the dev site is undisturbed and Juan's freeze holds. This is not a
throwaway branch — it is the provenance of what is currently serving traffic, and
it stays until H cuts over.

**A2 — three defects, all consequences of fact 2 above:**

1. **The OG image 404s.** `app/metadata.ts:7` points `metadataBase`, `og:url` and
   `og:image` at `https://juansilva.is-a.dev` — a dead host — and `og-image.jpg`
   returns **404 on both domains**. Every LinkedIn share of the portfolio renders
   with no preview card. The agency-overflow play routes its *only* door through
   LinkedIn, so this is a revenue defect, not a polish item.
2. **The contact form is CORS-blocked from production.** `server/index.js:65`
   allowlists `.design` and `is-a.dev` origins; `juanpablosilva.com.br` is absent,
   so the browser preflight fails.
3. **And it posts to a 404 anyway.** `components/sections/Contact.tsx:123` falls
   back to `''` when `NEXT_PUBLIC_API_URL` is unset, so the `fetch` resolves to a
   relative `/api/send` against a static host.

> The fix for 2 and 3 is deliberately *minimal* — add the origin, set the env var.
> Do not refactor the Express service: Milestone G deletes it.

### B — New repo + Astro scaffold + submodule swap ⬜

Creates `github.com/juansilvadesign/juansilva.design` (**public** — the repo is
itself portfolio evidence; an agency CTO can read the Astro source), scaffolds a
static Astro 7 project, and rewires the notes workspace so
`projects/juansilva-design/` is a submodule of it rather than a stray full clone.

**Astro 7 + Node 24**, matching the local precedent in
[`fecoelho-com-br-clone`](../../../../knowledge/projects/fecoelho-com-br-clone/)
— which is itself an ejection from `ai-website-cloner-template`, so its shape is
the one this workspace already knows how to produce and maintain.

The workspace's own routing documents currently say the portfolio is edited in a
clone of `juansilva.is-a.dev`. That becomes false the moment this milestone lands,
so [`CONTEXT.md`](../../CONTEXT.md) and [`CLAUDE.md`](../../CLAUDE.md) are edited
in the same change — a routing table that lies is worse than none.

### C — Content architecture ⬜ *(keystone)*

**This is the milestone the whole rebuild exists for.** Juan's stated goal is two
properties: *easy to update the content*, and *easy to replace the UI next year*.
Both are the same requirement — **content must not live in markup**.

Three layers, each with one job:

| Layer | Path | Owns |
| --- | --- | --- |
| **Copy** | `src/i18n/{en,pt}.ts` | UI strings — labels, headings, CTAs |
| **Content** | `src/content/` (Zod-schema'd collections) | Projects, experience, case studies |
| **Tokens** | `design-system/tokens.css` | Every reusable visual value |

A UI redesign then touches layouts, components and `tokens.css` — and provably
cannot lose a fact about Juan's work, because no fact is stored there.

**i18n: EN default at `/`, PT-BR at `/pt/`.** Decided 2026-08-04. The model is
[`spaceapps/landing-page`](../../../spaceapps/projects/landing-page/INTERNATIONALIZATION.md)'s,
not [`psiativa/landing-page-v2`](../../../psiativa/projects/landing-page-v2/)'s,
and the reasoning is recorded because it will be re-litigated:

- **Take from spaceapps: a real URL per language, and a base-language-derived
  type.** `type TranslationKeys = typeof en` makes a missing `pt` key a *build
  error*. That is the only mechanism in either reference that actually prevents
  translation drift.
- **Take from psiativa: copy as data, and both languages co-located per key**, so
  a gap is visible at a glance rather than hidden across two parallel files.
- **Reject psiativa's DOM-swap engine outright.** It ships one URL and injects
  translations client-side after `DOMContentLoaded`. The English copy therefore
  does not exist in the served HTML, so Google and every LLM crawler see only
  Portuguese — against a workspace rule this lane already paid for
  (*"LP must be static-first — client-rendered islands are invisible to AI
  crawlers"*). It also has no shareable language URL, flashes the wrong language
  on every foreign visit, and maintains two parallel mechanisms by hand
  (`data-i18n` + JSON for static markup, `L10n<{pt,en}>` + `pick()` for islands)
  under a `// @ts-nocheck`.
- **Reject spaceapps' cost, which Astro removes.** Its `useTranslations()` hook
  forces `"use client"` onto every component that renders text. In `.astro`
  components `t()` resolves at build time and ships **zero** JS.

Routes are generated by `getStaticPaths()` over the locale list, so **adding a
third language adds no route files** — only a translation module.

### D — Port the v2 pages to Astro ⬜

Home, projects, contact, 404, and the three legal pages. The port is a
**re-implementation against the content layer**, not a transliteration: every
string comes from `src/i18n/`, every project from `src/content/projects/`.

Visual parity with the current production site is the acceptance bar — this
milestone changes the stack, not the design. The redesign is next year's job, and
C is what makes it cheap.

Zero-JS baseline. An island needs a justification, not a default. Note that three
of the six current `'use client'` files are the legal pages, which are static
prose that never needed to be client components at all.

### E — vCard ⬜

A `/card/` route plus a downloadable `.vcf`, modelled on
[`fecoelho-com-br-clone`](../../../../knowledge/projects/fecoelho-com-br-clone/)
— `ProfileHeader` / `ContactLinks` / `ContactIcon` / `ContactFooter` over a typed
`ContactAction[]`.

**One deliberate improvement over the reference:** fecoelho serves a hand-written
`.vcf` from `public/`, which can silently drift from the contact details rendered
beside it. Here the `.vcf` is **generated by an Astro endpoint from the same
`src/data/contact.ts`** the page renders, so the two cannot disagree.

This is the NFC/QR landing target, which closes the *"tracked short link for
QR/NFC: not set up yet"* item that has been open in `MEMORY.md` since June.

### F — Master-portfolio evidence store ⬜

Built from scratch. One typed store of verified claims — project, role,
attribution, dates, live URL, evidence link — that renders the portfolio, the
master CV, and per-audience views from a single source.

This supersedes the store described in
[`_config/plans/master-portfolio-evidence-store.md`](../../_config/plans/master-portfolio-evidence-store.md)
by giving it a real home. Two constraints are inherited and non-negotiable:

- ⛔ **Every claim carries its attribution.** The workspace maintains a
  never-claim list ([`_config/linkedin-profile/README.md`](../../_config/linkedin-profile/README.md))
  precisely because false claims have already shipped on this lane. The store's
  schema makes attribution a **required field**, so an unattributed claim fails
  the build rather than reaching a buyer.
- The store is the *source*; the CV and portfolio views are **renders**. Never
  hand-edit a render.

### G — Contact form on Cloudflare Pages Functions ⬜

Replaces the Render Express service with a same-origin
`functions/api/send.ts`. This does not merely fix the current CORS defect — it
**deletes the category**: a same-origin function has no allowlist to get wrong and
no second host to keep alive.

Add Turnstile at the same time (the workspace has a `turnstile-spin` skill and a
hard-won note that an hCaptcha sitekey/secret mismatch 403s *silently*).

Retiring Render also removes the `NEXT_PUBLIC_API_URL` build-time trap that is
currently breaking the form in production.

### H — Cutover to `juansilva.design` 🔒

**Gated on the domain purchase, deliberately deferred** (Juan, 2026-08-04). The
new site ships to `juanpablosilva.com.br` first.

Deferring is the cheaper order — but it is not free, and the cost is recorded
here so the decision can be revisited with the real number:

- `site:` in `astro.config.mjs` is set once and changed once; canonical, OG,
  `hreflang` and the sitemap all derive from it, so the migration is one constant
  plus a redirect pass — small, but non-zero.
- The master plan's **Phase 4 stays blocked**: *"NO cold email from `is-a.dev` or
  any free domain — Phase 4 waits for the authenticated `.design`."*
- **`contact@juansilva.design` still cannot exist**, so the footer keeps showing a
  mailbox that does not receive mail. Until the domain lands, every address the
  site shows must be one that actually works.

---

## Standing rules

- ⛔ **Never edit `projects/juansilva-is-a-dev/`.** It is frozen v1.
- ⛔ **Never hand-edit a derived artifact** — `design-tokens.json`,
  `tailwind-v4.css`, `components.manifest.json` are caches; `tokens.css` is the
  file the project consumes. Same rule the fecoelho package ships with.
- ⛔ **No claim without attribution** — see F.
- **Content changes never touch components.** If a copy edit requires opening a
  `.astro` file, C has a gap; fix C rather than the component.
- **Selling beats building.** This rebuild is real work the master plan's §6
  anti-scope would otherwise refuse (*"NO new portfolio layout from scratch"*).
  It is authorised because the three things it unlocks — translations, vCard,
  evidence store — are all content-layer features that the Next static export has
  no cheap path to. That authorisation covers **this** scope. It is not a licence
  for the next build idea, which still goes to `_config/plans/` via `capture-idea`.
