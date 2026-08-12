# Tasks

The living checklist. Strategy, gates and the reasoning behind each milestone
live in **[`ROADMAP.md`](ROADMAP.md)**; operational truth about domains and
pipeline lives in **[`../../MEMORY.md`](../../MEMORY.md)**.

_Last reviewed: 2026-08-12_

> **The repo split, content architecture, Astro page port and the vCard are
> done.** Milestone **E closed 2026-08-12** (Sink alias live). Milestone **A** is
> closed except for one asset that is committed but unpublished, and **A4 was
> deleted outright** — see below.
>
> 🔴 **The critical path is no longer G — it is the deploy itself.** Verified
> 2026-08-12: production is a **manual upload of the built `dist/` into an
> Apache docroot**, and the live copy is a snapshot from **2026-08-07 01:30 UTC**.
> Three commits have landed since; none are live, `og-image.jpg` among them, so
> every social share of the site currently renders a broken preview card.
> **A3 and A6 close the moment someone uploads a current `dist/` — no code
> change is involved.** G does not: Apache cannot run `functions/api/send.ts`,
> so G is blocked on a hosting decision (see G).
>
> A verified, current `dist/` is **built and waiting** in the working tree
> (2026-08-12, 16 pages, `og-image.jpg` included, zero JS, zero `is-a.dev`).
> Evidence: [`../../MEMORY.md`](../../MEMORY.md) → *How production actually publishes*.
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
- [x] ✅ **`public/og-image.jpg` supplied by Juan 2026-08-07** — verified as
      **JPEG, exactly 1200×630, 221 KB**. Confirmed referenced from the built
      home page in both locales. **Still uncommitted and undeployed.**
- [ ] Verify after deploy: `curl -sI https://juanpablosilva.com.br/og-image.jpg`
      returns **200**, and the `og:image` in the served HTML resolves to it. Then
      re-scrape once in LinkedIn's Post Inspector.
      - 🔴 **Checked 2026-08-12: still 404, and it is a DEPLOY gap, not a code
        gap.** The file is committed (`d62265a`) and correct on disk (JPEG,
        1200×630, 221 KB), and the served HTML already emits the right
        `og:image`/`twitter:image` URL — but the live snapshot predates the
        commit by 19 hours, so the asset was never uploaded.
      - 📦 **Upload package built and verified 2026-08-12, waiting on Juan.**
        `scratchpad/juanpablosilva-dist-2026-08-12.zip` — 102 files, 4.93 MB,
        archive root is `dist/` *contents* (no wrapper), integrity-checked, and
        confirmed to contain `.htaccess`, `og-image.jpg`, `404.html` and
        `juan-silva.vcf`. Deploy method is **cPanel File Manager** (Juan,
        2026-08-12) — runbook in [`../../MEMORY.md`](../../MEMORY.md).
      - ✅ Post-deploy gate written: `scratchpad/verify-deploy.sh`, 21 checks
        across bodies **and** headers. Run against the pre-upload site as a
        control: **14 pass, 7 fail**, and the 7 are exactly the defects this
        upload fixes — so a green run afterwards means something.

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

- [x] `curl` the live HTML and confirm `og:url` / `og:image` on
      `juanpablosilva.com.br`, `og-image.jpg` → 200, and no `is-a.dev` anywhere in
      the served output. ⛔ Read the **body**, not the status code — `is-a.dev`
      answered 200 for weeks while serving an empty directory listing.
      **Ran 2026-08-12 against the served body, 3 of 4 pass:**
      | Check | Result |
      |---|---|
      | `og:url` = `https://juanpablosilva.com.br/` | ✅ |
      | canonical + `hreflang` en/pt-BR/x-default | ✅ correct |
      | `is-a.dev` anywhere in the body | ✅ **zero occurrences** |
      | `og-image.jpg` → 200 | 🔴 **404** — see A3, deploy gap |
      Bonus: the home page references **one** `<script>`, and it is Cloudflare's
      injected `email-decode.min.js` — the site itself still ships **zero JS**,
      so D's zero-JS baseline holds in production, not just locally.
- [ ] Update [`../../MEMORY.md`](../../MEMORY.md): mark the defects closed.
      *(Partly done 2026-08-12 — defect 1 rewritten with its true cause, defects
      2–3 supersede into G, which is now blocked. Close them when G resolves.)*
- ~~Contact-form submission test~~ — moved to **G**. There is no backend to test.

### A7 — Repair `public/.htaccess` 🟡 fixed in tree 2026-08-12, ships with the next upload

Found while identifying the host. `.htaccess` is the **real** production config
on this origin — `_headers` is decorative here — so these were live defects, not
cosmetics. All three fixed in the working tree and **uncommitted**.

- [x] **Removed an orphan `</IfModule>`.** One opening tag, two closings. An
      unbalanced `.htaccess` is normally a fatal 500 for the entire docroot; this
      one shipped 2026-08-06 and the host happened to tolerate it. A tag-balance
      check now runs over the built artifact before packaging.
- [x] **Made the custom 404 page reachable.** The catch-all rewrote every miss to
      `/nao-encontrada/` — a **Next.js-era route the Astro build does not emit** —
      so D's `404.astro` has never rendered in production; misses fall through to
      the host's generic 1,251-byte error page. Replaced with
      `ErrorDocument 404 /404.html`, which also corrects the status: the old
      `RewriteRule` would have served the 404 body under **HTTP 200**.
- [x] **Ported the CSP + `Referrer-Policy` from `_headers`** (Juan's call,
      2026-08-12), byte-identical so the two cannot drift. Pre-flighted against
      the build first: every external origin is a plain `<a href>`, all four
      `@font-face` sources are self-hosted, there are zero `<script>` tags, and
      the one inline `<style>` is covered by `style-src 'unsafe-inline'`.
      `_headers` **kept** — it becomes live again if G moves the site to Pages.
- [x] Dropped a duplicate `mod_deflate` block declaring a strict subset of the
      types already covered above it.
- [ ] Commit A7 + verify the headers land after the upload (gates 3 and 4 of
      `verify-deploy.sh`).

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

## Milestone E — vCard ✅ closed 2026-08-12

Needs C. Reference:
[`fecoelho-com-br-clone`](../../../../knowledge/projects/fecoelho-com-br-clone/).

- [x] `src/data/contact.ts` — the single source: name, title, phone, email, socials,
      as a typed `ContactAction[]` (fecoelho's `src/types/contact.ts` shape).
- [x] Port `ProfileHeader` / `ContactLinks` / `ContactIcon` / `ContactFooter` to
      `/card/`, both locales.
- [x] **Generate** the `.vcf` from `src/data/contact.ts` via an Astro endpoint —
      do *not* copy fecoelho's hand-written `public/*.vcf`. A static file drifts
      from the page rendered beside it; a generated one cannot.
- [x] Wire `/card/` as the stable NFC/QR landing target in the production notes
      and record it in [`../../MEMORY.md`](../../MEMORY.md).
- [x] ✅ **Click-counting short alias created by Juan and verified 2026-08-12:**
      **`https://jaypy.com.br/card`**, served by **Sink** (self-hosted on
      Cloudflare). Provider + exact alias recorded in
      [`../../MEMORY.md`](../../MEMORY.md). Chain verified by curl: `308` →
      `juanpablosilva.com.br/card` → `301` → `/card/` → `200`.
      - [ ] ⚠️ **Retarget the alias to include the trailing slash.** It currently
            points at `…/card` (no slash), so the redirect costs **two** hops
            instead of one on every NFC tap and QR scan. One field in the Sink
            dashboard.
      - ⛔ Still no scan count may be quoted — Sink records clicks, but none have
            been read out of the dashboard. Uncollected ≠ zero.
- [x] Verify: download the `.vcf` and import it on a real phone. Every field
      matches the rendered card.

Local verification (2026-08-06): Node `v24.18.0`, Astro `7.1.6`, zero check
diagnostics, 16 static pages, EN/PT card copy present in static HTML, no card-page
JavaScript, and `file` recognizes the emitted download as vCard 3.0. The artifact
uses CRLF, terminates cleanly, folds physical lines at ≤75 bytes, and contains the
same name, title, phone, email, website, LinkedIn, and GitHub facts supplied by
`src/data/contact.ts`. Juan confirmed on 2026-08-06 that `/card/` is deployed and
the `.vcf` is verified on a real phone.

**Live re-verification 2026-08-12** (production, not local): `/card/` **200**,
`/pt/card/` **200**, and `/juan-silva.vcf` **200** as `text/x-vcard` (359 bytes)
carrying the same name, title, phone, email, URL, LinkedIn and GitHub the page
renders. The Sink alias resolves to it. **E is closed**; the only residue is the
trailing-slash retarget noted above, which is a Sink dashboard edit, not repo work.

---

## Milestone F — Master-portfolio evidence store 🟢 core shipped 2026-08-07

Needs C. Built from scratch. Supersedes
[`../../_config/plans/master-portfolio-evidence-store.md`](../../_config/plans/master-portfolio-evidence-store.md).

> ⛔ **The store does NOT live in this repo, and the plan's banner saying it does
> was unsafe.** This repo is **public** (`gh repo view` → `PUBLIC`); the notes
> repo is **private**. The full corpus — every showability tier — lives in
> [`../../_config/portfolio/`](../../_config/portfolio/), and a validating
> exporter writes only 🟢-showable records into `src/content/projects/`.
> **Filtering in the Astro loader would not have worked**: the source JSON would
> already be public regardless of what the loader rendered. Storing ≠ publishing.
> Architecture chosen by Juan, 2026-08-07.

- [x] Schema first — [`_config/portfolio/schema.mjs`](../../_config/portfolio/schema.mjs).
      Dependency-free ESM (the notes repo has no `package.json` and gains no
      `node_modules`). **Provenance is per FIELD, not per record**: every
      load-bearing field carries `{ value, status, source, confirmedOn }`.
      Chosen because this store's actual failures were per-field — a `(verified)`
      stack line asserted four frameworks with zero imports, `Period` was derived
      from `pushed_at` on six repos, and `spaceapps` was wrong in *both*
      directions under a ✅ ROLE CONFIRMED badge. A record with a confirmed role
      and a blank outcome is now citable for the role alone.
      - `status: "absent"` is distinct from `"unconfirmed"` — "no metrics exist,
        confirmed absent, not merely uncollected" is a finding, and recording it
        stops a later pass from hopefully re-opening the question.
- [x] ⛔ **Attribution required and must be CONFIRMED** — merely present is not
      enough. Both halves verified below.
- [x] Seeded from the audited sources, never from memory — **7 records** (5
      projects, 2 roles), each naming the source file it was compiled from.
      Cleared records only, per Juan 2026-08-07: `spaceapps`, `allprice`,
      `gestrif`, `psiativa-funnel`, `psiativa-ai-operations`, `role-spaceapps`,
      `role-agenda-geek`. The never-claim lists are carried **into the schema**
      as a first-class `neverClaim` array, and 🔒 internal facts as
      `internalOnly` — which no renderer ever emits.
- [x] Portfolio cards render from the store — `export.mjs` emits 3 cards; the
      three previously hand-written ones are now generated and stamped
      `_generated`. `src/content.config.ts` accepts the stamp. **Emission is by
      allowlist, never blocklist**, so a field added to the store later is
      private by default and cannot leak by being forgotten.
- [x] Master CV as a second render — [`render-cv.mjs`](../../_config/portfolio/render-cv.mjs)
      → `_config/portfolio/master-cv.generated.md`. Confirmed fields only;
      unconfirmed ones are omitted rather than hedged, and each block names what
      it withheld. **Writes a sibling file, NOT `_config/master-cv.md`** — that
      is the hand-written demand spec and it holds slot material the store does
      not carry yet. This does answer that file's own open question ("prose or a
      rendered view?"): rendered view. Reconciling the two is a human call.
- [x] **Verified — five gates, each leaving the public repo byte-unchanged:**
      | Probe | Result |
      |---|---|
      | attribution missing entirely | `exit 1`, nothing written |
      | attribution present but `unconfirmed` | `exit 1`, nothing written |
      | non-showable record carrying a `publish` block | `exit 1`, nothing written |
      | non-showable record, no publish block | `exit 0`, correctly withheld |
      | `mirror` link with no disclosure | `exit 1`, nothing written |
      Plus **defense in depth**: stripping `attribution` from an already-exported
      card fails `npm run check` too — `InvalidContentEntryDataError … attribution: Required`.
      And the CV render was leak-probed for six `internalOnly` strings: **0 hits**.

### F-next — what is NOT done

- [ ] **17 UNCONFIRMED Sagitta records are not in the store.** They need Juan's
      interview pass first; the contaminated-brief trap means mechanical
      compilation would inject false claims. Store scope was deliberately
      "cleared records only".
- [ ] The remaining audited-but-uninterviewed records (`figma/superselos`,
      `figma/miaki`, `figma/syd`, `figma/psi-silvanacabral`, `github/psi.silvanacabral`,
      `github/celus`, `github/upos`, …) — interviewed 7 of 15, so most of the
      corpus is still outside the store.
- [ ] `allprice` and `gestrif` carry no `publish` block (no preview asset), so
      they are evidence-only. Add previews to publish them.
- [ ] Reconcile `_config/master-cv.md` (hand-written spec) against
      `master-cv.generated.md` (render).
- [ ] `service-catalog.md` tiers still ship `❓` — the store now supports lifting
      several. Not done.

---

## Milestone G — Contact form on Cloudflare Pages Functions 🔴 BLOCKED

Needs D. Deletes the Render service and the whole CORS failure class.

> 🔴 **BLOCKED 2026-08-12 — the origin is Apache, which cannot execute a Pages
> Function.** `functions/api/send.ts` has no runtime at `juanpablosilva.com.br`.
> Identified from `public/.htaccess`: it is tracked in git, Astro copies it into
> `dist/`, and it sets *exactly* the four security headers and two
> `Cache-Control` values production returns. Corroborated by `GET /api/send` →
> **404**, by the CSP in `public/_headers` being **absent from every live
> response**, and by the 2026-08-06 MCP inventory finding one Pages project in
> the account (`moemail`) and none for this repo. ⚠️ None of that is explained by
> deploy staleness — `_headers`, `_routes.json` and `functions/` all shipped in
> `1a3f0bb`, **26 hours before** the live snapshot.
>
> ⛔ **Do not continue G by writing more handler code — it is already written and
> unreachable.** G needs a hosting decision, and the two options are real forks:
> **(a)** move the site to Cloudflare Pages/Workers — `functions/` and `_headers`
> begin working, `.htaccess` stops being read, and the `_routes.json`/Turnstile
> design lands as written; or **(b)** stay on Apache and re-target the form at a
> standalone endpoint (a Worker on the existing account would do), which
> re-opens the cross-origin question A4 was deleted to avoid.
> Full evidence: [`../../MEMORY.md`](../../MEMORY.md) → *How production actually publishes*.

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
