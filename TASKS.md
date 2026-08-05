# Tasks

The living checklist. Strategy, gates and the reasoning behind each milestone
live in **[`ROADMAP.md`](ROADMAP.md)**; operational truth about domains and
pipeline lives in **[`../../MEMORY.md`](../../MEMORY.md)**.

_Last reviewed: 2026-08-04_

> **Nothing is shipped yet.** Milestone **A** is the only one that can start
> immediately — it is independent of the Astro rebuild and repairs the live site.
> **Do not start B until A2 is pushed:** the working tree in this folder is
> currently the only copy of what is serving `juanpablosilva.com.br`, and B
> replaces this folder with a submodule.

---

## Environment notes (read once, they will bite)

- **`git push` hangs silently on the inherited Windows credential manager** — it
  opens an invisible prompt. Use, with the *empty* assignment first (load-bearing):
  ```bash
  GIT_TERMINAL_PROMPT=0 git -c credential.helper= \
    -c credential.helper='!gh auth git-credential' push
  ```
- **`astro dev` daemonizes under the agent environment.** Run it as
  `env -u CLAUDECODE npm run dev` when a foreground server is needed.
- **A dev-only Astro endpoint must not live in `src/pages/`** — the static build
  prerenders it anyway and emits a `dist/api/…` artifact. Inject it from
  `astro.config.mjs` when `command === "dev"` instead.
- `gh` is authenticated as `juansilvadesign` with `repo` scope (verified
  2026-08-04). `juansilvadesign/juansilva.design` does **not** exist yet.

---

## Milestone A — Rescue production 🟢

Two unrelated problems, both cheap. Ships in an evening, independent of
everything below. Rationale: [ROADMAP](ROADMAP.md#a--rescue-production-).

### A1 — Find out how production actually deploys

- [ ] Open the Cloudflare dashboard → Pages → the project serving
      `juanpablosilva.com.br`. Record **git-connected or direct upload**, the
      build command, the output directory, and every environment variable set at
      build time.
- [ ] Record the same for `dev.juanpablosilva.com.br`.
- [ ] Write both into [`../../MEMORY.md`](../../MEMORY.md) under *Domain &
      hosting* — they are currently unknown, and A4/A6 cannot be done safely
      without them.

> **Expectation, not an assumption to act on:** because the live code was never
> committed, this cannot be a git-connected build — a connected build can only
> build committed code. Confirm it. If it *is* git-connected, then something
> other than this working tree is the real source and A2 changes shape entirely.

### A2 — Commit the live site before touching anything ✅ 2026-08-04

- [x] Branch `v2-next-production` created off `c064588`.
- [x] Committed the v2 working tree as **`767c764`** — **18 paths**: 12 modified,
      3 deleted (`LandingQuiz.tsx`, `app/context/LandingContext.tsx`,
      `app/layout-client.tsx`), 3 new images (`calculadora.webp`, `n8n.webp`,
      `quiz.webp`). *(An earlier draft of this file said "15 modified … 21 paths";
      the real diff is 18.)*
- [x] Pushed to `juansilvadesign/juansilva.is-a.dev`. **`main` untouched at
      `c064588`** — still the v1 site behind `dev.juanpablosilva.com.br`.
- [x] Verified: `origin/v2-next-production` resolves; `git diff origin/main
      origin/v2-next-production --stat` = 18 files, +132 / −668.

> ✅ **The 8-week single-copy risk is closed.** The live site's source now exists
> somewhere other than one laptop's working tree, and B3 is unblocked.

### A3 — Fix the OG card + the broken asset references ⚠️ mostly done 2026-08-04

Scope grew once the assets were actually checked: **four** referenced files 404'd,
not one, and the footer's version switcher was dead too. All committed in `3ea4567`.

- [x] `app/metadata.ts` — `metadataBase` and `og:url` → `https://juanpablosilva.com.br`.
      Relative asset URLs resolve against `metadataBase`, so `og:image` followed.
- [x] **The icons were never missing — they were unroutable.** `favicon-32x32.png`,
      `favicon-16x16.png`, `apple-touch-icon.png` and both `android-chrome-*.png`
      sat in `app/`, where Next auto-serves **only** `favicon.ico`, `icon.*` and
      `apple-icon.*`. Moved to `public/`; `app/favicon.ico` left where it works.
- [x] Added `public/site.webmanifest` — referenced by `metadata.ts`, never created.
- [x] `components/sections/Footer.tsx` — the site-version switcher's only live entry
      pointed at the dead `is-a.dev` host (the 2026 entry was commented out).
      Now 2026 → `juanpablosilva.com.br`, 2025 → `dev.juanpablosilva.com.br`.
- [x] Verified locally: `next build` green, 10/10 static pages, all five assets
      emitted to `dist/`, and **zero `is-a.dev` references anywhere in `dist/`**.
- [ ] 🔴 **`public/og-image.jpg` (1200×630) still does not exist** — the one defect
      left open. This is a real design asset, not a config fix.
- [ ] Verify after deploy: `curl -sI https://juanpablosilva.com.br/og-image.jpg`
      returns **200**, and the `og:image` in the served HTML resolves to it. Then
      re-scrape once in LinkedIn's Post Inspector.

### A4 — Unblock the contact form (minimal fix only) ⚠️ code done, deploy pending

- [x] `server/index.js` — added `https://juanpablosilva.com.br` and
      `https://www.juanpablosilva.com.br` to the production CORS allowlist. The
      `.design` pair stays so the H cutover needs no server change.
- [ ] Set `NEXT_PUBLIC_API_URL` to the Render service origin **at build time** in
      the Cloudflare Pages project (needs A1). Unset, `Contact.tsx:123` falls back
      to `''` and posts to a relative `/api/send` — a 404 on a static host.
- [ ] Redeploy the Render service so the new allowlist is live.

> ⛔ **Do not refactor `server/`.** Milestone G deletes it. This is a two-line
> change to stop the bleeding, nothing more.

### A5 — Point every visible address at something that receives mail ✅ 2026-08-04

- [x] `constants/links.ts` — `MAIL` was `contact@juansilva.design`, which **cannot
      receive mail** (domain unregistered, and per the H gate it stays that way).
      The footer both linked *and* displayed it. Because that email sits behind a
      dropdown, a failed attempt to reach Juan left no trace anywhere.
- [x] Both `MAIL` and `MAIL_CTA` now point at the working mailbox — already public
      via the hero CTA, so no new exposure; it just stops the two disagreeing.
      Decision: Juan, 2026-08-04. Both flip back at milestone H.
- [x] Verified: `next build` green, **zero `contact@juansilva.design` in `dist/`**,
      11 `mailto:` occurrences all resolving to the working address. `67a7ce9`.

### A6 — Verify the rescue end to end

- [ ] Rebuild and redeploy production.
- [ ] `curl` the live HTML and confirm: `og:url` and `og:image` on
      `juanpablosilva.com.br`, `og-image.jpg` → 200, no `is-a.dev` reference
      anywhere in the served output.
- [ ] Submit the contact form against production from a browser and confirm the
      mail arrives — not that the request returns 200. Two separate defects were
      hiding behind that form; only a delivered email proves both are gone.
- [ ] Update [`../../MEMORY.md`](../../MEMORY.md): mark all three defects closed
      with the date, and record the deploy method from A1.

---

## Milestone B — New repo + Astro scaffold + submodule swap ⬜

**Blocked on A2 being pushed.** Rationale:
[ROADMAP](ROADMAP.md#b--new-repo--astro-scaffold--submodule-swap-).

### B1 — Create the repo

- [ ] `gh repo create juansilvadesign/juansilva.design --public` with a
      description matching the positioning line. **Public** — the repo is itself
      portfolio evidence.
- [ ] Add `LICENSE` and a `README.md` stating what the site is, how to run it, and
      the route table (fecoelho's README is the shape to copy).

### B2 — Scaffold Astro

- [ ] Astro **7**, `output: "static"`, Node **24** (`.nvmrc`), matching
      [`fecoelho-com-br-clone`](../../../../knowledge/projects/fecoelho-com-br-clone/).
- [ ] `astro.config.mjs`: `site: "https://juanpablosilva.com.br"` — the H gate
      changes this to `https://juansilva.design` and nothing else.
- [ ] i18n block: `defaultLocale: "en"`, `locales: ["en", "pt"]`,
      `routing: { prefixDefaultLocale: false }` → `/` is EN, `/pt/` is PT.
- [ ] Scripts: `dev`, `build`, `preview`, and `check` = `astro check && astro build`.
- [ ] `.gitignore` covering `dist/`, `.astro/`, `node_modules/`.

### B3 — Swap this folder to a submodule

The risky step. Order matters.

- [ ] Confirm A2's branch exists on the remote. If this folder is lost now, the
      live site's source is lost with it.
- [ ] From the notes repo root, remove `projects/juansilva-design/` from the index
      and delete the working folder.
- [ ] `git submodule add https://github.com/juansilvadesign/juansilva.design.git
      workspace/juansilva.design/projects/juansilva-design`
- [ ] Commit the new `.gitmodules` entry and the submodule pointer.
- [ ] Verify `git submodule status` lists **both** portfolio submodules, and that
      `projects/juansilva-is-a-dev/` still pins **`c064588`** — unchanged. ⛔ If
      that SHA moved, the freeze was broken; reset it before continuing.

### B4 — Fix the workspace routing documents

They describe the old arrangement and will actively mislead the next session.

- [ ] [`../../CONTEXT.md`](../../CONTEXT.md): the shape block and the *Projects*
      section both say `juansilva-design/` is a working clone of
      `juansilva.is-a.dev`. Rewrite for the two-repo split; update the routing
      table row *"Edit the portfolio site"*.
- [ ] [`../../CLAUDE.md`](../../CLAUDE.md): same correction in *Project-specific
      logic*.
- [ ] Both files still describe `juansilva.is-a.dev` as the live site. It is not —
      it serves an empty directory listing. Correct it, pointing at
      [`../../MEMORY.md`](../../MEMORY.md) for the verified table.

---

## Milestone C — Content architecture ⬜ *(keystone)*

The milestone the rebuild exists for. Rationale, and the full spaceapps-vs-psiativa
comparison: [ROADMAP](ROADMAP.md#c--content-architecture--keystone).

### C1 — i18n

- [ ] `src/i18n/en.ts` — the **base** language. `export type TranslationKeys = typeof en`.
- [ ] `src/i18n/pt.ts` — typed `satisfies TranslationKeys`, so a missing key is a
      **build error**. This is the single mechanism that prevents translation
      drift; neither reference project has it on both sides.
- [ ] `src/i18n/index.ts` — locale list, `t(lang)` lookup, and the `hreflang` pair.
      Resolution happens at **build time** in `.astro` components. No hook, no
      `"use client"`, no client JS.
- [ ] ⛔ Do **not** port psiativa's `data-i18n` DOM-swap engine or its
      `useSiteLang`/`pick()` island bridge. Both are excluded on the record in the
      roadmap — the copy would not exist in the served HTML.
- [ ] Verify: delete one key from `pt.ts` and confirm `npm run check` **fails**.
      An i18n layer that cannot fail this test is not providing the guarantee.

### C2 — Content collections

- [ ] `src/content/config.ts` with Zod schemas. `projects` first: title, role,
      **attribution** (required — see F), dates, stack, impact string, live URL,
      evidence link, `featured`, and per-locale copy.
- [ ] Migrate the three live proof cards out of `components/sections/Projects.tsx`
      into content entries — PsiAtiva funnel, PsiAtiva AI agents, Spaceapps.
- [ ] Verify: a project's copy can be edited without opening a `.astro` file. If
      it cannot, the schema is wrong.

### C3 — Design tokens

- [ ] `design-system/tokens.css` as the consumed file, `src/styles/clone.css`
      importing it — the fecoelho package shape.
- [ ] Extract every colour, spacing step, radius and type ramp from the current
      production CSS into tokens. Components reference tokens only.
- [ ] ⛔ `design-tokens.json`, `tailwind-v4.css` and `components.manifest.json` are
      **derived caches** if emitted — never hand-edited.
- [ ] Verify: changing one token value visibly changes every surface that uses it.

---

## Milestone D — Port the v2 pages to Astro ⬜

Needs C. Visual parity with current production is the bar — this changes the
stack, not the design.

- [ ] `src/layouts/BaseLayout.astro` — metadata, canonical, OG, `hreflang`, favicon,
      all derived from `site` + the active locale.
- [ ] Routes via `getStaticPaths()` over the locale list, so a third language adds
      **no route files**: `/`, `/projects/`, `/contact/`, `/404`, and the three
      legal pages — each with its `/pt/` twin.
- [ ] Port the sections — Hero, Projects grid, Navbar, Footer — reading copy from
      `src/i18n/` and projects from `src/content/`.
- [ ] The three legal pages become plain `.astro` (or MDX). They are static prose
      and were `'use client'` in Next for no reason.
- [ ] Zero-JS baseline: an island needs a written justification. The theme toggle
      is the only likely candidate.
- [ ] Verify: `npm run check` green; every page renders both locales; the
      positioning copy is present in the **static HTML** (`curl | grep`), not
      injected; total JS on `/` is smaller than the current production bundle.

---

## Milestone E — vCard ⬜

Needs C. Reference:
[`fecoelho-com-br-clone`](../../../../knowledge/projects/fecoelho-com-br-clone/).

- [ ] `src/data/contact.ts` — the single source: name, title, phone, email, socials,
      as a typed `ContactAction[]` (fecoelho's `src/types/contact.ts` shape).
- [ ] Port `ProfileHeader` / `ContactLinks` / `ContactIcon` / `ContactFooter` to
      `/card/`, both locales.
- [ ] **Generate** the `.vcf` from `src/data/contact.ts` via an Astro endpoint —
      do *not* copy fecoelho's hand-written `public/*.vcf`. A static file drifts
      from the page rendered beside it; a generated one cannot.
- [ ] Wire it as the NFC/QR target and record the tracked short link in
      [`../../MEMORY.md`](../../MEMORY.md) — open since June.
- [ ] Verify: download the `.vcf` and import it on a real phone. Every field
      matches the rendered card.

---

## Milestone F — Master-portfolio evidence store ⬜

Needs C. Built from scratch. Supersedes
[`../../_config/plans/master-portfolio-evidence-store.md`](../../_config/plans/master-portfolio-evidence-store.md).

- [ ] Schema first: claim, project, role, **attribution (required)**, date range,
      live URL, evidence link, verification status.
- [ ] ⛔ **Attribution is a required field**, so an unattributed claim fails the
      build. This lane has already published false claims; the schema — not
      discipline — is what prevents the next one.
- [ ] Seed from the audited sources already in the workspace rather than from
      memory: [`_config/linkedin-profile/`](../../_config/linkedin-profile/) and
      [`_config/service-catalog.md`](../../_config/service-catalog.md), honouring
      the never-claim list.
- [ ] Render the portfolio project cards from the store — one source, many views.
- [ ] Master CV as a second render of the same store.
- [ ] Verify: add a claim with no attribution and confirm the build **fails**.

---

## Milestone G — Contact form on Cloudflare Pages Functions ⬜

Needs D. Deletes the Render service and the whole CORS failure class.

- [ ] `functions/api/send.ts` — same-origin, so **no allowlist exists to get wrong**.
- [ ] Port the mail send; keep rate limiting.
- [ ] Add Turnstile (workspace has a `turnstile-spin` skill). ⛔ Note the recorded
      trap: a sitekey/secret mismatch **403s silently** and the secret never goes
      in a `PUBLIC_` variable.
- [ ] Delete `server/` and the Render service once a real message is delivered
      through the new endpoint.
- [ ] Verify: submit from production and confirm **delivery**, not a 200. Then
      confirm the Render service is off and nothing broke.

---

## Milestone H — Cutover to `juansilva.design` 🔒

**Gated on the domain purchase — deferred by decision 2026-08-04.** Listed so the
deferred cost stays visible.

- [ ] Buy `juansilva.design`; record registrar and date in `../../MEMORY.md`.
- [ ] Set up `contact@juansilva.design`; flip `MAIL_CTA` back to `MAIL` and restore
      the footer address (undoes A5).
- [ ] `astro.config.mjs` → `site: "https://juansilva.design"`. Canonical, OG,
      `hreflang` and sitemap all follow.
- [ ] Redirects from `juanpablosilva.com.br`; keep `dev.` on the v1 site.
- [ ] Unblocks the master plan's **Phase 4** (cold email), which explicitly waits
      on an authenticated `.design`.
- [ ] Verify: both hosts resolve, redirects land, OG re-scrapes clean, and — the
      lesson this project already paid for — **read the response body, not the
      status code**. `juansilva.is-a.dev` answered 200 for weeks while serving an
      empty directory listing.
