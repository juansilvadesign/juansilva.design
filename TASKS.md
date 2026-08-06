# Tasks

The living checklist. Strategy, gates and the reasoning behind each milestone
live in **[`ROADMAP.md`](ROADMAP.md)**; operational truth about domains and
pipeline lives in **[`../../MEMORY.md`](../../MEMORY.md)**.

_Last reviewed: 2026-08-06_

> **The repo split, content architecture, and Astro page port are done. Milestone
> G is active on the critical path.** The current Next site is already live and
> stays live; it is not a thing to keep rescuing. Milestone **A** is closed except
> for one asset handoff, and **A4
> was deleted outright** — see below.
>
> ⛔ **`juansilvadesign/juansilva.is-a.dev` is off limits.** Juan's instruction is
> that it stays the dev/v1 site and nothing lands in it. An earlier draft of this
> file had A2 push a `v2-next-production` branch there; that was wrong, the branch
> has been deleted, and the repo is back to `main` + `gh-pages` exactly as before.
> The v2 code lives in **this** repo instead, which is where it should have gone.

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
- `gh` is authenticated as `juansilvadesign` with `repo` scope.
  `juansilvadesign/juansilva.design` **exists** (public, created 2026-08-05).
- **`git submodule add` also hangs on the credential manager** — it clones over
  HTTPS. It leaves a stale `.git/index.lock` behind when it wedges, which then
  makes every later git command fail with a misleading "another git process seems
  to be running". Use the same `-c credential.helper=` bypass for `submodule add`,
  not just `push`.

---

## Milestone A — Preserve + repair the current site ✅ closed 2026-08-05

Closed except for one asset handoff. The current Next site is live and stays
live; it is not the project. Rationale:
[ROADMAP](ROADMAP.md#a--rescue-production-).

### A1 — How production deploys — ⬜ superseded

Originally: read the Cloudflare project's deploy method before touching it.
Overtaken by the repo split — the question that matters now is where **this**
repo's Workers Build points, not how the old direct-upload deploy worked.

- [ ] When wiring Cloudflare Workers Builds, connect it to
      `juansilvadesign/juansilva.design`, branch `main`. ⛔ **Never** to
      `juansilva.is-a.dev` — its `main` is the v1 site and a build from it would
      replace the live site with the old one.
- [x] Before the first git-connected build, fix `package.json`: `build` runs
      `npm run clean`, which is `powershell -File build-clean.ps1`. **There is no
      PowerShell on Cloudflare's Linux builder.** `clean:fallback` already does
      the same job in Node — make it the default. Superseded cleanly by the Astro
      package scripts; D removed the orphaned PowerShell file.
- [x] Delete `.github/workflows/pages.yml`. It deploys `main` to GitHub Pages and
      uploads `./out`, a directory `next.config.js` does not produce (`distDir`
      is `dist`). It has been silently broken and is now actively misleading.
      Removed with the final Next/Tailwind cleanup in D.

### A2 — Get the v2 source into a repo ✅ 2026-08-05

- [x] Committed the v2 working tree — **18 paths**: 12 modified, 3 deleted
      (`LandingQuiz.tsx`, `app/context/LandingContext.tsx`, `app/layout-client.tsx`),
      3 new images (`calculadora.webp`, `n8n.webp`, `quiz.webp`).
      *(An earlier draft said "15 modified … 21 paths"; the real diff is 18.)*
- [x] **Landed in `juansilvadesign/juansilva.design` as `93dd7a9`** — the initial
      commit of this repo, fresh history, plus `ROADMAP.md` and `TASKS.md`.
- [x] ⛔ **Correction.** The first attempt pushed this to a `v2-next-production`
      branch on `juansilva.is-a.dev`, against Juan's instruction to leave that
      repo alone. The branch was deleted; that repo is back to `main` (`c064588`)
      + `gh-pages` (`edd7508`), byte-identical to before. Nothing was lost —
      the commits were re-seeded here.
- [x] Verified: new repo `main` = 125 files; `git ls-remote` on the old repo shows
      exactly two branches again.

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

### A4 — ~~Unblock the contact form via Render~~ ❌ DELETED 2026-08-05

**This task should never have existed.** Juan chose Cloudflare Pages Functions for
the contact form on 2026-08-04 — Render is being retired. A4 was work to wire a
service back up that was already scheduled for deletion.

Then the probe made it moot anyway:

```
https://juansilva-backend.onrender.com  →  404, x-render-routing: no-server
```

`no-server` is Render saying **no service exists at that hostname** — not that a
free instance is asleep. So there is no backend to point `NEXT_PUBLIC_API_URL` at,
and the CORS allowlist edit that shipped in `93dd7a9` is inert. Harmless, and it
disappears with `server/` at milestone G.

⛔ **Do not set `NEXT_PUBLIC_API_URL`. Do not recreate the Render service.** The
contact form's only remaining path is **[G](#milestone-g--contact-form-on-cloudflare-pages-functions-)**
— a same-origin route needing no env var, no allowlist, and no second host.

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

### A6 — Verify, whenever the current site is next deployed

Not urgent: the fixes are committed, the live site works, and the Astro rebuild
replaces this build anyway. Fold into the next deploy rather than forcing one.

- [ ] `curl` the live HTML and confirm `og:url` / `og:image` on
      `juanpablosilva.com.br`, `og-image.jpg` → 200, and no `is-a.dev` anywhere in
      the served output. ⛔ Read the **body**, not the status code — `is-a.dev`
      answered 200 for weeks while serving an empty directory listing.
- [ ] Update [`../../MEMORY.md`](../../MEMORY.md): mark the defects closed.
- ~~Contact-form submission test~~ — moved to **G**. There is no backend to test.

---

## Milestone B — New repo + Astro scaffold + submodule swap 🟢

B1–B3 shipped 2026-08-05; the B1 README handoff and B4 remain. Rationale:
[ROADMAP](ROADMAP.md#b--new-repo--astro-scaffold--submodule-swap-).

### B1 — Create the repo ✅ 2026-08-05

- [x] `juansilvadesign/juansilva.design` created **public** — the repo is itself
      portfolio evidence.
- [x] Seeded at `93dd7a9` with the v2 Next site + `ROADMAP.md` + `TASKS.md`
      (125 files, fresh history). Per Juan: start as the Next site, Astro replaces
      it in place.
- [ ] Rewrite `README.md` — it is still the old site's. State what this is, how to
      run it, and the route table (fecoelho's README is the shape to copy).

### B2 — Scaffold Astro ✅ 2026-08-05

- [x] Astro **7**, `output: "static"`, Node **24** (`.nvmrc`), matching
      [`fecoelho-com-br-clone`](../../../../knowledge/projects/fecoelho-com-br-clone/).
- [x] `astro.config.mjs`: `site: "https://juanpablosilva.com.br"` — the H gate
      changes this to `https://juansilva.design` and nothing else.
- [x] i18n block: `defaultLocale: "en"`, `locales: ["en", "pt"]`,
      `routing: { prefixDefaultLocale: false }` → `/` is EN, `/pt/` is PT.
- [x] Scripts: `dev`, `build`, `preview`, and `check` = `astro check && astro build`.
- [x] `.gitignore` covering `dist/`, `.astro/`, `node_modules/`.
- [x] Verified under Node `v24.18.0`: Astro `7.1.6`, zero check diagnostics,
      static build complete, and `npm audit` reports zero vulnerabilities. The
      build intentionally emits zero pages until milestones C and D add routes.

### B3 — Swap this folder to a submodule ✅ 2026-08-05

- [x] Confirmed the code was on the new remote before deleting anything on disk.
- [x] Removed the stray full clone; added the submodule pointing at
      `juansilvadesign/juansilva.design`.
- [x] Committed `.gitmodules` + both gitlinks in the notes repo (`590af1d`).
- [x] Verified: `git submodule status` lists both portfolio submodules, and
      `projects/juansilva-is-a-dev/` **still pins `c064588`** — the freeze held.

> Two traps hit here, both now in *Environment notes*: `git submodule add` clones
> over HTTPS and so **hangs on the Windows credential manager** exactly like
> `push` does, and when it wedges it leaves a stale `.git/index.lock` that makes
> every subsequent git command fail with a misleading "another git process seems
> to be running". Check `pgrep -a git` and the lock's timestamp before believing
> that message.

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

## Milestone C — Content architecture ✅ 2026-08-05 *(keystone)*

The milestone the rebuild exists for. Rationale, and the full spaceapps-vs-psiativa
comparison: [ROADMAP](ROADMAP.md#c--content-architecture--keystone).

### C1 — i18n

- [x] `src/i18n/en.ts` — the **base** language. `export type TranslationKeys = typeof en`.
- [x] `src/i18n/pt.ts` — typed `satisfies TranslationKeys`, so a missing key is a
      **build error**. This is the single mechanism that prevents translation
      drift; neither reference project has it on both sides.
- [x] `src/i18n/index.ts` — locale list, `t(lang)` lookup, and the `hreflang` pair.
      Resolution happens at **build time** in `.astro` components. No hook, no
      `"use client"`, no client JS.
- [x] ⛔ Did **not** port psiativa's `data-i18n` DOM-swap engine or its
      `useSiteLang`/`pick()` island bridge. Both are excluded on the record in the
      roadmap — the copy would not exist in the served HTML.
- [x] Verified: temporarily removed `hero.dribbbleAriaLabel` from `pt.ts`;
      `npm run check` failed with the missing property, then the key was restored.
      An i18n layer that cannot fail this test is not providing the guarantee.

### C2 — Content collections

- [x] `src/content.config.ts` with a strict Zod schema. Astro 7's Content Layer
      loads collection config from this root path; the former
      `src/content/config.ts` convention is legacy. `projects` includes title, role,
      **attribution** (required — see F), dates, stack, impact string, live URL,
      evidence link, `featured`, and per-locale copy.
- [x] Migrated the three live proof cards out of `components/sections/Projects.tsx`
      into content entries — PsiAtiva funnel, PsiAtiva AI agents, Spaceapps.
- [x] Verified: each project's EN/PT copy lives in its JSON entry and can be
      edited without opening a `.astro` file. Temporarily removing Spaceapps'
      required `attribution` made Astro fail with `attribution: Required`; it was
      restored immediately.

### C3 — Design tokens

- [x] `design-system/tokens.css` is the consumed source, with
      `src/styles/clone.css` importing it — the fecoelho package shape.
- [x] Extracted the production colour, spacing, radius, type, motion, and layout
      values, reconciled against Figma channel `r3momw0k`. New component-facing
      CSS references tokens only; the legacy Next/Tailwind files remained as
      migration evidence through C and were removed once D's replacement passed.
- [x] ⛔ `design-tokens.json`, `tailwind-v4.css` and `components.manifest.json` are
      **derived caches** if emitted — never hand-edited.
- [x] Verified with a temporary Astro smoke route: changing `--text-heading` from
      neutral to pink propagated into all four compiled consumers. The original
      neutral value was restored and the temporary route removed.
> Figma inspection found one important source-of-truth mismatch: the primary
> swatch captions still show retired purple hex values, while their actual fill
> paints and the Desktop frames use cyan. The token source follows the paints
> (`#B6EEFF`, `#2CD6FF`, `#00C8FF`, `#009CD4`, `#007CAB`, `#065674`), not the stale labels.

---

## Milestone D — Port the v2 pages to Astro ✅ 2026-08-05

Needs C. Visual parity with current production is the bar — this changes the
stack, not the design.

- [x] `src/layouts/BaseLayout.astro` — metadata, canonical, OG, `hreflang`, favicon,
      all derived from `site` + the active locale.
- [x] Routes via `getStaticPaths()` over the locale list, so a third language adds
      **no route files**: `/`, `/projects/`, `/contact/`, `/404`, and the three
      legal pages — each with its `/pt/` twin. Astro's required root `404.astro`
      is the only static-route exception; every non-default 404 is generated by
      the same locale path helper.
- [x] Port the sections — Hero, Projects grid, Navbar, Footer — reading copy from
      `src/i18n/` and projects from `src/content/`.
- [x] The three legal pages become plain `.astro` (or MDX). They are static prose
      and were `'use client'` in Next for no reason.
- [x] Zero-JS baseline: an island needs a written justification. No island was
      needed: language switching is links, the version picker is native
      `<details>`, and the contact form uses browser validation.
- [x] Verify: `npm run check` green; every page renders both locales; the
      positioning copy is present in the **static HTML** (`curl | grep`), not
      injected; total JS on `/` is smaller than the current production bundle.
      Result: 14 static pages, zero diagnostics, zero emitted JS, and the EN/PT
      positioning copy present in the built HTML. Current production references
      134,331 compressed JS bytes across nine scripts (95,908 bytes without its
      legacy `nomodule` polyfill); the Astro home references 0.

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

## Milestone G — Contact form on Cloudflare Pages Functions 🟢

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

Implementation in progress (2026-08-05): the same-origin handler, bounded form
validation, Gmail SMTP/TLS adapter, KV quota, Turnstile action/hostname checks,
localized fragment feedback, fail-closed missing-sitekey state, and Pages security
headers are now in the working tree. `server/` and `render.yaml` remain on purpose:
the production inbox-delivery gate above has not happened yet.

Turnstile is the one justified exception to D's zero-JS baseline. The contact page
loads Cloudflare's hosted widget script only when a public sitekey exists; there
is still no custom client-side submission bundle or Astro island.

Cloudflare account inventory (authenticated MCP, 2026-08-06): the account has one
unrelated Pages project (`moemail`), two existing KV namespaces
(`moemail-moemail-kv` and `sink`), and zero Turnstile widgets. None is a Milestone
G resource to reuse. The next infrastructure step is a dedicated Pages project
for `juansilvadesign/juansilva.design` on `main`, a `CONTACT_RATE_LIMIT` KV
namespace/binding, and a production Turnstile widget after confirming whether the
allowed hostname set is only `juanpablosilva.com.br` or also `www`. Wrangler OAuth
remains expired; the authenticated Cloudflare MCP completed the inventory without
mutating the account.

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
