# Tasks

The living checklist. Strategy, gates and the reasoning behind each milestone
live in **[`ROADMAP.md`](ROADMAP.md)**; operational truth about domains and
pipeline lives in **[`../../MEMORY.md`](../../MEMORY.md)**.

_Last reviewed: 2026-09-03_

> **The repo split, content architecture, Astro page port and the vCard are
> done.** Milestone **E closed 2026-08-12** (Sink alias live). Milestone **A** is
> closed except for one asset that is committed but unpublished, and **A4 was
> deleted outright** — see below.
>
> ✅ **Production republished 2026-08-12 and verified green — 21/21 gates.**
> `og-image.jpg` **200** and byte-identical, CSP + `Referrer-Policy` served for
> the first time, the custom 404 page reachable at last, zero JS and zero
> `is-a.dev` intact. **A3, A6 and A7 are closed.** The one residue is a LinkedIn
> Post Inspector re-scrape, which needs Juan's login.
>
> 🟢 **G's MAIN PATH IS PROVEN — a real email landed 2026-08-14T12:25:06Z.** Both
> Juan steps are done and independently verified: `wrangler secret list` reports
> **4 of 4**, and the docroot serves the post-G build (`Last-Modified`
> `Fri, 14 Aug 2026 12:20:34 GMT`, on the apex **and** `www`). A production
> submission produced Gmail thread `1a0003baf41b75e4`, subject *"New contact form
> submission from Real Test"* — the exact format from `smtp.ts:155`, carrying the
> form fields. ⭐ Because `send.ts` has **no Turnstile skip path** (missing token
> 403s at :112, `requiredSecret` throws on an unset secret, and success needs
> `success` **AND** the action match **AND** an allowlisted hostname at :126), that
> delivered mail proves the whole chain — CSP, cross-host post, Turnstile solve,
> SMTP — in one shot.
> ✅ **G is now CLOSED (2026-08-14).** The **429 gate is proven** — 6 POSTs into a
> fresh bucket gave `415`×5 then a real **`429` + `Retry-After: 220`**, with the KV
> counter stopping at **5** (a rejection returns before the `put`, so it cannot
> inflate its own window) and **no mail sent**. `server/` and `render.yaml` are
> **deleted**, and Render needed no switching off — `x-render-routing: no-server`
> says the service does not exist. `npm run check` green after the deletion.
> ⏳ Only a post-deletion browser re-submit remains, as a formality. Details below.
>
> 🟢 **The critical path is G, and it is UNBLOCKED as of 2026-08-12.** Apache
> cannot execute `functions/api/send.ts`, so the contact form has no runtime —
> but the hosting fork is now **decided: a standalone Worker on a `form.`
> subdomain, with the site staying on Apache.** The full Pages migration was
> rejected as a hosting migration bundled into a form fix. Fork (b) had been
> parked on a false premise (a CORS problem that cannot exist without JS — see G).
> Production remains a **manual upload of the built `dist/` into an Apache
> docroot** (deploy runbook: [`../../MEMORY.md`](../../MEMORY.md)); that is now
> **Milestone I**, tracked separately from G on purpose.
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
      home page in both locales. ~~Still uncommitted and undeployed.~~ — stale as
      written; committed and deployed since, see the line directly below.
- [x] ✅ **Verified 2026-08-12 after the cPanel upload:**
      `https://juanpablosilva.com.br/og-image.jpg` → **200**, `image/jpeg`,
      **226,633 bytes — byte-identical to the repo copy**, and the served
      `og:image`/`twitter:image` resolve to it. `last-modified` moved to
      2026-08-12 05:16 UTC, off the stale snapshot. **A3 is closed.**
- [ ] ⏳ Re-scrape once in LinkedIn's Post Inspector — the only step left, and it
      needs Juan's login. LinkedIn caches the old failed scrape, so shares will
      keep showing no preview until it is re-fetched **even though the asset is
      now live**.
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

### A7 — Repair `public/.htaccess` ✅ closed 2026-08-12

Found while identifying the host. `.htaccess` is the **real** production config
on this origin — `_headers` is decorative here — so these were live defects, not
cosmetics. All fixed, committed in `cf06062`, and verified on production.

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
- [x] ✅ **Committed (`cf06062`) and verified live 2026-08-12.** Gate 3:
      `Content-Security-Policy` and `Referrer-Policy` are now served, with
      `X-Frame-Options`/`X-Content-Type-Options` unregressed. Gate 4: a missing
      route returns a **real 5,279-byte HTML 404 under a correct 404 status**,
      with no `/nao-encontrada/` rewrite — D's `404.astro` renders in production
      for the first time. **A7 closed.**

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
      - ⛔ **The extra redirect hop is a Sink platform default and CANNOT be
            changed** (Juan, 2026-08-12). The alias resolves to `…/card`, and
            Apache's `DirectorySlash` adds the slash, so every NFC tap and QR
            scan costs 2 hops instead of 1. **Not a defect and not actionable —
            do not re-open it.** Cost is one extra round-trip on a redirect that
            already works; the landing page is unaffected.
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

## Milestone F — Master-portfolio evidence store ✅ CLOSED 2026-09-02 (50 records published)

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

## Milestone G — Contact form on a standalone Worker ✅ CLOSED 2026-08-14 *(one browser re-submit outstanding as a formality)*

Needs D. Deletes the Render service and the whole CORS failure class.

> ✅ **DECIDED 2026-08-12 (Juan): fork (b) — standalone Worker. The site stays on
> Apache.** `send.ts` is deployed as its own Worker on a `form.` subdomain, the
> form's `action` is re-targeted at it, and Apache keeps serving all 14 static
> pages unchanged. No apex DNS change, no re-verification of the 22 green gates,
> no `.htaccess` retirement. Fork (a) — the full Pages migration — was **not**
> chosen: it is a hosting migration wearing a form-fix costume, and its best
> argument (git-push deploys) was a *deploy* problem that has been split out to
> **Milestone I** so it can be judged on its own merits.
>
> 🔑 **Fork (b) had been rejected on a false premise, and that is why G looked
> blocked.** The old note said re-targeting "re-opens the cross-origin question
> A4 was deleted to avoid" — which assumes JavaScript. `Contact.astro:31` is a
> native `<form method="post">` with **zero JS**, and **native form posts are not
> subject to CORS**: the browser sends them cross-origin unconditionally and
> follows the `303 Location` back to `/contact/#sent`, which is already what
> `send.ts:394` emits (feedback is CSS `:target` fragments, never `fetch`).
> ⛔ **CORS gates JS *reading* a response, not the browser *sending* a form.**
> The Worker needs **no CORS headers at all**. Lesson: test a stated constraint
> before designing around it.
>
> Background (why the origin was never Pages): identified from `public/.htaccess`
> — tracked in git, copied into `dist/`, and setting *exactly* the four security
> headers and two `Cache-Control` values production returns. Corroborated by
> `GET /api/send` → **404**, by the `public/_headers` CSP being **absent from
> every live response**, and by the 2026-08-06 MCP inventory finding one Pages
> project (`moemail`) and none for this repo. Not deploy staleness: `_headers`,
> `_routes.json` and `functions/` all shipped in `1a3f0bb`, **26 hours before**
> the live snapshot.
> Full evidence: [`../../MEMORY.md`](../../MEMORY.md) → *How production actually publishes*.

- [x] Re-auth Wrangler OAuth — ✅ done by Juan 2026-08-12. Token carries
      `workers`/`workers_kv`/`workers_routes` **write** on account
      `f2c9e4938b8a761eac778d1a5708640c`.
- [x] Endpoint host: **`form.juanpablosilva.com.br`** (zone is already on
      Cloudflare DNS, so this is a route + CNAME, no nameserver change) over a
      `workers.dev` subdomain — same registrable domain reads as first-party to a
      visitor inspecting the form target.
- [x] ✅ **The `www` question is answered — both hostnames are live.**
      `curl` 2026-08-12: `juanpablosilva.com.br/contact/` and
      `www.juanpablosilva.com.br/contact/` both return **200 with a
      byte-identical 8,598-byte body** (same `<title>`, same form). `www` does
      **not** redirect to the apex. ⇒ **both must be allowlisted here and on the
      Turnstile widget**, or every `www` submitter is rejected.
- [x] `functions/api/send.ts` — added `SITE_ORIGIN` + `ALLOWED_PAGE_HOSTNAMES`
      and removed all three `request.url` derivations. Was 🔴 the Turnstile gate
      comparing siteverify's hostname to `new URL(request.url).hostname`, which
      cross-host **403s every submission** (widget solved on the page host,
      request lands on the Worker).
- [x] `functions/api/send.ts` — `localeFromRequest` now matches the `Referer`
      against the allowlist via a new `allowedRefererUrl` helper. Was 🔴 an
      origin comparison that cross-host always falls through to `en`.
      ⚠️ Scope correction: this governs only **pre-body-parse** failures (413 /
      415 / **429**), because line 81 overrides `locale` from the form's hidden
      `lang` field on every path that reads a body. The user-visible case is a
      rate-limited PT visitor landing on the English page — real, but narrower
      than "every PT submitter".
- [x] 🔴 **`respond()` — the third and worst one, found while patching.**
      `new URL(..., request.url)` built the `303 Location` against the **Worker's**
      host, so a successful submission would have redirected to
      `form.juanpablosilva.com.br/contact/#sent` — **a page that does not exist
      there.** This breaks the *success* path, not an edge case, and no amount of
      Turnstile/KV correctness would have masked it. Now resolves against the
      validated page origin, so a `www` submitter stays on `www`.
- [x] ✅ **`functions/` is typechecked as of 2026-08-12 — and the gate was proven
      to bite.** Fixed by a *separate* `functions/tsconfig.json` rather than adding
      `functions/` to the root one: the root extends `astro/tsconfigs/strict`,
      which loads the DOM lib, and `@cloudflare/workers-types` redeclares
      `Request`/`Response`/`Headers`/`fetch` — one program containing both fails
      with duplicate-identifier errors. Two programs is what makes this checkable
      at all. Wired in as `npm run check:worker`, chained into `npm run check`.
      Proof it is real, not a no-op: `--listFiles` shows all three handler files
      in the program, and a deliberate `const x: number = "s"` probe exits 2.
- [x] Re-point `Contact.astro` `action` at the Worker. The literal now lives in
      `src/data/contact.ts` as `contactFormEndpoint`, beside `website`, so
      milestone H edits one file. Still `method="post"`, still zero added JS.
- [x] Restructure for `wrangler deploy` — `functions/worker.ts` is the entry
      (`export default { fetch }`); `onRequestPost`/`PagesFunction`/`Cloudflare.Env`
      are gone, replaced by an explicit exported `Env` interface. `wrangler.jsonc`
      binds `CONTACT_RATE_LIMIT` and sets the custom domain. ⭐ The Worker must now
      do its OWN path/method routing — Pages gave that for free by file convention,
      and a standalone Worker receives the whole hostname. `workers_dev` is off:
      a `*.workers.dev` alias would be a second public surface onto the same SMTP
      path that could never satisfy the Turnstile hostname gate anyway.
- [x] Turnstile widget created 2026-08-12 — "juansilva.design contact form",
      mode `managed`, authorizing **both** `juanpablosilva.com.br` and
      `www.juanpablosilva.com.br`. Sitekey `0x4AAAAAAEOfkYQxd7Zc5QyO` is a
      build-time `PUBLIC_` var in the gitignored `.env`; the secret is a Worker
      secret. ⚠️ Because `.env` is gitignored, a rebuild on a machine without it
      silently produces a page with a **disabled** submit button (Contact.astro
      fails closed by design) — check that first if a rebuild looks broken.
- [x] 🔴 **CSP `form-action` — a silent killer caught before it shipped
      (2026-08-12).** A7 started serving a CSP nine days after the "no cross-origin
      problem" analysis was written, and it contained `form-action 'self'`. That
      analysis was right that **native form posts are not subject to CORS** — but
      `form-action` is a *separate* gate that polices exactly this, and under plain
      `'self'` the browser blocks the submission before any request leaves the page:
      no network entry, no error page, only a console violation. Fixed in
      `public/.htaccess` **and** `public/_headers` (kept byte-identical, asserted by
      a diff check) to `form-action 'self' https://form.juanpablosilva.com.br`.
      ⭐ The generalisable lesson is narrower than "test your assumptions": the
      earlier conclusion was *correct about the mechanism it named* and still
      wrong, because a second mechanism governed the same behaviour.
- [x] ✅ **Gmail secrets set by Juan 2026-08-14** — `wrangler secret list` now
      reports **4 of 4** (`GMAIL_USER`, `GMAIL_PASS`, `RATE_LIMIT_SECRET`,
      `TURNSTILE_SECRET_KEY`). Each `put` auto-published a version:
      `4d54b6bc` (12:19:19Z) and `311bab1e` (12:19:46Z), both `Source: Secret Change`.
      Corroborated out-of-band by Google's *"App password created … for
      juansilva-design contact form"* alert at 12:18:04Z.
- [x] ✅ **`dist.zip` uploaded 2026-08-14 — this time verified against the public
      URL, after the 2026-08-13 false report.** All four checks that failed
      yesterday now pass live, on the apex **and** `www`:

      | Check | Live 2026-08-14 |
      |---|---|
      | `Last-Modified` | `Fri, 14 Aug 2026 12:20:34 GMT` (was 12 Aug) |
      | form `action` | `https://form.juanpablosilva.com.br/api/send` |
      | CSP `form-action` | `'self' https://form.juanpablosilva.com.br` |
      | Turnstile sitekey | `0x4AAAAAAEOfkYQxd7Zc5QyO`, submit **not** `disabled` |

      ⛔ Keep the cPanel notes for Milestone I / any re-upload: **Show Hidden Files
      ON** or you cannot confirm `.htaccess` landed — and that file *is* the CSP fix;
      and `zip` is not installed on this machine, so the archive is built by
      `python3 zipfile` (a glob-based `zip -r ../dist.zip *` silently **omits
      `.htaccess`**).
- [x] ✅ **Delivery proven 2026-08-14T12:25:06Z** — a production submission landed
      in the inbox as Gmail thread `1a0003baf41b75e4`, subject *"New contact form
      submission from Real Test"*, body carrying Name / Email / Language / Message.
      Not a 200 — an actual message ⛔ [200 ≠ liveness].
- [x] ✅ **The `429` gate is PROVEN 2026-08-14** — 6 POSTs into the fresh bucket
      `1985234`, deliberately bad content-type so each one short-circuits *after* the
      limiter and isolates the gate under test:

      | Req | Status | Body |
      |---|---|---|
      | 1–5 | `415` | `{"success":false,"code":"form-error"}` |
      | **6** | **`429`** | `{"success":false,"code":"rate-limited"}` + `Retry-After: 220` |

      Three corroborations make this more than a status-code match: `Retry-After: 220`
      equalled the window's real remainder (219 s a second later), so the
      `(window+1)*windowMs - now` math is computed, not a constant; the KV counter
      finished at **`5`, not 6**, confirming a rejected request returns *before* the
      `put` (`send.ts:339-343`) and so cannot inflate its own window; and Gmail still
      held **exactly one** message, so the rejection sent no mail.
      🔴 **The `429` is only OBSERVABLE with `Accept: application/json`.** `respond()`
      returns **`303`** to `…/contact/#rate-limited` for any browser `Accept`
      (`send.ts:414-419`) — the status argument is used only on the JSON branch. A
      plain `curl` would have scored a correct rejection as a **FAIL**.
      ⛔ Read the counter with `--remote` or you will read an empty local store.
- [x] ✅ **`server/` and `render.yaml` DELETED 2026-08-14** — precondition (a real
      delivered message) met. The Render service needed no switching off: it is
      already gone, verified **by response** — `juansilva-backend.onrender.com` →
      `404` + `x-render-routing: no-server`, i.e. no such service, not a sleeping one.
      Safe to remove: a repo-wide sweep found **zero** references outside the deleted
      file itself, `TASKS.md`, and `functions/README.md`; root `package.json` has no
      `workspaces` and no `server` script. `npm run check` (Node 24) is green after
      the deletion — `astro check` + `tsc -p functions` + `astro build`, 16 pages.
      ⚠️ That check *rebuilds `dist/`*, so it was re-asserted afterwards: the built
      contact page still carries the Worker action, sitekey
      `0x4AAAAAAEOfkYQxd7Zc5QyO`, `action="turnstile-spin-v1"` and a **non-disabled**
      submit button, and `dist/.htaccess` is byte-identical to `public/.htaccess`.
      (This machine has the gitignored `.env`; a rebuild without it would silently
      have produced a disabled button.)
- [ ] ⏳ **Final formality: one more real-browser submit, Juan.** Everything above is
      verified, but the plan's own last step is a post-deletion submission.
      ⭐ Low risk by construction: neither deleted file was ever in the Worker bundle
      or in the uploaded `dist/`, so removing them cannot have touched the running
      production form. ⚠️ Wait for a fresh 15-min window — this session's probes left
      its own IP bucket at 5/5.

### ✅ 2026-08-14 — resolved: secrets set, upload landed, mail delivered

The block below is kept as the standing evidence for *why this project verifies
owner reports against the public URL*. Its four failing checks were all re-run on
2026-08-14 and all pass (table in the upload checkbox above).

⭐ **The lesson that survived, sharpened:** the 2026-08-13 session was right to
disbelieve "dist.zip deployed", and the cheapest decisive probe was the same both
times — one `curl -sI` for `Last-Modified`. It costs nothing, needs no knowledge of
which string is new, and it answered the question on both the false report and the
true one. Verify by public URL, never by the claim → [pushed ≠ published].

⭐ **What made 2026-08-14's verification cheap:** the delivered mail is a *chain*
proof. `send.ts` has no Turnstile skip path, so one inbox message retires the CSP
`form-action` fix, the cross-host `action`, the sitekey, the Turnstile solve, the
hostname allowlist, and the SMTP credentials simultaneously. Finding the one gate
that cannot be bypassed beats probing each surface separately.

⚠️ It does **not** retire the rate limiter — that path only runs on a 6th request,
and the KV counter proves it never ran. A chain proof covers exactly the gates the
chain passes through.

### 🔴 2026-08-13 — the upload was reported done, and verification says it was not

Session opened on *"dist.zip deployed"*. Three independent checks against the public
URL say the docroot still serves the **pre-G** build:

| Check | Live | Local `dist/` |
|---|---|---|
| form `action` | `/api/send` (relative — Apache 404s it) | `https://form.juanpablosilva.com.br/api/send` |
| CSP `form-action` | `'self'` ← **the silent killer, still live** | `'self' https://form.juanpablosilva.com.br` |
| Turnstile sitekey | absent, submit button `disabled` | `0x4AAAAAAEOfkYQxd7Zc5QyO`, enabled |
| `Last-Modified` | `Wed, 12 Aug 2026 05:16:32 GMT` | built 2026-08-13T00:04Z |

Both confounders were excluded rather than assumed: **cache** — `cf-cache-status:
DYNAMIC` on `/` and `/contact/`, and a `?cb=` cache-buster returns the identical
`Last-Modified`; **mis-extract into a subfolder** — `/dist/`, `/dist/contact/` and
`/dist/index.html` all 404. ⭐ `Last-Modified` is the cheapest decisive probe here:
one `curl -sI`, and it works without knowing which string is new.

So the live form is blocked **three ways at once** — disabled button, an action
Apache 404s, and a CSP that would block the cross-origin post regardless.

⭐ **GET probes are free.** `worker.ts` gates path *and* method **before**
`handleContactRequest`, so only `POST /api/send` spends a rate-limit token — and a
*failed* attempt spends one too, since the limiter runs before Turnstile and before
the body parse (`send.ts:93`). Re-run the free static probes above **before** any
POST; if the 429 gate later misbehaves, suspect a Turnstile challenge mid-run before
suspecting the limiter.

🔴 **Gmail App Password — strip the spaces.** Google shows it as `abcd efgh ijkl
mnop`. `requiredSecret()` trims only the **ends** (`send.ts:392`) and
`assertCredential()` deliberately permits interior spaces, rejecting only CR/LF/NUL
(`smtp.ts:209`) — so whatever is pasted reaches `AUTH PLAIN` verbatim. Paste 16
characters, no spaces. `GMAIL_USER` must be a bare mailbox (`assertMailbox()` rejects
spaces and angle brackets — never `Juan <a@b.com>`), and the form **mails itself**:
`MAIL FROM` and `RCPT TO` are both `GMAIL_USER` (`smtp.ts:138-139`).

⛔ `wrangler secret put` needs a real **TTY** — run it in your own terminal, never
piped (`echo 'pass' | …` puts the App Password in shell history). A secret change
**auto-publishes a new Worker version**; no `wrangler deploy` follows it.

**Verification method, decided 2026-08-13:** `GMAIL_USER` = `jaypy.uxdesign@gmail.com`,
so delivery is provable by matching the mail's `Message-ID` against the `messageId` in
the `contact_email_accepted` log line. **Juan submits in a real browser while
`wrangler tail` runs** — ⛔ headless Playwright was rejected: managed-mode Turnstile is
tuned to pass a human browser, a headless one is likely to be challenged, and that
burns a token and reads as a **false FAIL** of the mail path.

**Also confirmed 2026-08-13:** the deployed Worker bundle **is** the patched code —
deploy `2026-08-12T23:57:55Z` is 2 minutes after the last edit to `functions/api/send.ts`
(`23:55:51Z`); live version is now `47a3fbb3-ff94-4fe1-8b7c-94a5da153d2d` (two
`Secret Change` deploys superseded the `9a22c747` upload, same code). `GET /` → 404 and
`GET /api/send` → 405 + `Allow: POST` re-probed green. `wrangler secret list` = **2 of 4**.

**Proven live on 2026-08-12, before any Gmail secret existed** (`curl` against
`form.juanpablosilva.com.br`, results read from headers, not assumed):

| Probe | Result | What it proves |
|---|---|---|
| `GET /` | `404` | the Worker's own path gate |
| `GET /api/send` | `405` + `Allow: POST` | method gate |
| `POST /api/send`, bad content-type | `303` → `https://juanpablosilva.com.br/contact/#form-error` | 🔑 the `respond()` cross-host fix — `Location` is the **page** host, not the Worker's |
| same + `Referer: www…/pt/contact/` | `303` → `https://www.juanpablosilva.com.br/pt/contact/#form-error` | the `www` allowlist **and** `localeFromRequest` both work cross-host |
| KV after both | key `contact:<hmac>:1985087` = **`2`** | the rate limiter genuinely writes, HMACs the IP, and increments |

⛔ **`wrangler kv key list` defaults to the LOCAL miniflare store.** It reported
an empty namespace while the counter was in fact being written — pass `--remote`
or you will read an empty local store and conclude the binding is broken.

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
G resource to reuse. ⚠️ **Superseded by the 2026-08-12 decision:** the next
infrastructure step is ~~a dedicated Pages project~~ a **standalone Worker**, a
`CONTACT_RATE_LIMIT` KV namespace/binding, and a production Turnstile widget
after confirming whether the allowed hostname set is only `juanpablosilva.com.br`
or also `www`. Wrangler OAuth remains expired; the authenticated Cloudflare MCP
completed the inventory without mutating the account.

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

---

## Milestone I — Retire the manual docroot upload ✅ CLOSED 2026-08-15 (FTP, deployed + verified)

> 🔴 **2026-08-14, Juan — the transport is FTP, not SSH.** Verbatim: *"SSH does not
> work, always use FTP. Currently we are at 88/100 (88%) of number of processes, we
> need to terminate all empty processes before proceeding."*
>
> The cPanel account sits near its **entry-process cap**; exceeding it refuses
> processes **account-wide**, which would take down every site sharing `<cpanel-account>`
> (juansilva.design, psiativa, newcar). ⚠️ **SSH connected fine and rsync did
> deploy on 2026-08-14 — working is not the same as allowed.** The constraint is
> quota and blast radius, not authentication, so ⛔ do not re-test SSH and conclude
> this note is stale.
>
> **Consequence for I3 below:** the build assertions and the public-URL
> verification stand unchanged — they are transport-independent. Only the transfer
> step is wrong. ⛔ It cannot be a like-for-like port: **FTP has no `--delete`**
> (exact mirroring, which Juan chose, needs an explicit remote listing + delete
> pass) and **FTP clients hide dotfiles by default**, so `.htaccess` — the single
> file serving the CSP, the security headers and `ErrorDocument 404` — needs
> deliberate handling that `rsync dist/` provided for free.
>
> ✅ **The process count was measured, not assumed** (cPanel UAPI
> `ResourceUsage/get_usages` over HTTPS:2083, read-only): **`lvenproc` 88/100 —
> Juan's number is live, not stale.** But the neighbouring row matters as much:
> **`lveep` (entry processes) is 8/50.** ⛔ **This host exposes NO way to terminate
> anything** — `FTP`, `ProcessManager` and `LveInfo` UAPI modules are all absent
> (`Can't locate Cpanel/API/*.pm`), there are no Passenger apps, and the only
> in-panel tool that could is Terminal, which is SSH. Clearing them is a human
> step, or a <host-provider> support ticket.
>
> ⭐ **The deploy was never actually blocked on it.** The gate was calibrated against
> rsync-over-SSH; **one held FTP connection costs ~2 slots and 12 are free.** The
> script now reads that number itself before connecting and refuses when ≤3 slots
> remain, so the constraint is enforced rather than remembered.

**Split out of G on 2026-08-12, deliberately.** "git-push deploys" kept being
used as an argument *for* the full Pages migration, which let a deploy-pipeline
problem ride along inside a contact-form decision. They are independent: G is now
a Worker, and this milestone stands or falls on its own regardless of where the
static site is hosted.

**The problem.** Publishing is a manual cPanel File Manager step — build locally,
zip the *contents* of `dist/`, upload, extract, overwrite (runbook in
[`../../MEMORY.md`](../../MEMORY.md)). Consequences already paid for:

- 🔴 **A commit is not a deploy.** `og-image.jpg` was committed in `d62265a` and
  sat unpublished, 404ing on every LinkedIn/X/WhatsApp share — the agency-overflow
  play's only door — because the live snapshot predated it by 19 hours.
- 🔴 The live docroot silently drifts *behind* `main` (3 commits, 2026-08-07) and
  nothing reports it.
- ⚠️ The zip must carry the `.htaccess` **dotfile**, which is exactly the file
  most archive tools drop by default. That single file is now the only thing
  serving the CSP, the security headers, and `ErrorDocument 404`.
- ⚠️ Stale files from prior builds linger in the docroot; only hashed `_astro/`
  assets are safe. Checked by hand today.

### I1 — The origin was identified, and it is already reachable ✅ 2026-08-14

🔑 **`juanpablosilva.com.br` is served from `<cpanel-host>` (<origin-ip>)
— the same cPanel account psiativa already deploys to over scp-over-SSH.** Proven
non-invasively before any credential was used: a `curl --resolve` of the origin IP
with `Host: juanpablosilva.com.br` returned the site itself — same
`last-modified: Fri, 14 Aug 2026 12:20:34 GMT` as the public URL, and the full A7
header set including the post-G CSP. ⛔ DNS could never have shown this (the zone is
proxied); the *origin-IP + Host header* probe is the tool that can.

That collapsed the milestone's cost: the transport, the key and the account were
already in production use on adjacent work.

**Read-only inventory of the docroot,
`/home/<cpanel-account>/domains/mydomains/juanpablosilva.com.br/juanpablosilva.com.br`:**

| Finding | Consequence |
|---|---|
| `rsync` **is** on the host (`/usr/bin/rsync`) | mirror-with-delete is available, no zip step at all |
| `node`/`npm` are **MISSING** | ⛔ kills the cPanel-git-hook option outright — the host cannot run `astro build` |
| 102 files, list **identical** to local `dist/` | no stale files today; the drift risk is prospective, not current |
| `.htaccess` sha256 matches `public/.htaccess` | live config is the tracked one |
| 🔴 `.well-known/acme-challenge/` exists | **AutoSSL renewal path — not ours.** `rsync --delete` removes extraneous *directories*, so a literal mirror would delete it |
| `cgi-bin/` exists, empty | cPanel fixture, likewise not from the repo |

### I2 — Decision: local `npm run deploy`, mirroring with `--delete` ✅ 2026-08-14

Juan's call. Rejected alternatives and why:

- **GitHub Actions on push** — the real fix for "a commit is not a deploy", but it
  requires the production cPanel SSH key to live as a secret in a **public** repo.
  Deferred, not dismissed; revisit if the manual trigger starts getting skipped.
- **cPanel Git Version Control** — ⛔ **structurally impossible**: no Node on the
  host, so the build cannot happen there, and the alternative (committing a built
  `dist/` branch) re-introduces the manual step it was meant to remove.
- **Drift-check only** — kept, but as a *mode* of the deploy tool rather than the
  whole milestone (`npm run deploy:status`).

### I3 — Built ✅ 2026-08-14

`scripts/deploy.mjs` + `.env.deploy` (gitignored; `.env.deploy.example` tracked).

```
npm run deploy:check    build + assert + rsync --dry-run + read the live site   (no writes)
npm run deploy          build + assert + rsync --delete + verify by public URL
npm run deploy:status   verify the live site only — the drift check             (no build)
```

Each hazard the File-Manager dance carried is now structural, not procedural:

- **The `.htaccess` dotfile can no longer be dropped.** `rsync dist/` with a
  trailing slash carries dotfiles unconditionally — the failure mode the zip
  method needed a hand-written `python3 zipfile` builder to avoid (⛔ `zip` is not
  installed locally, and a glob `zip -r ../dist.zip *` silently misses it).
- **The build is asserted before anything is uploaded**, and a failure aborts with
  nothing written: `.htaccess` byte-identical to `public/.htaccess`, CSP
  `form-action` naming the Worker, `ErrorDocument 404`, no orphan `</IfModule>`,
  and — on **both** `/contact/` and `/pt/contact/` — the Worker action, a present
  sitekey, the `turnstile-spin-v1` action, and a **non-disabled** submit button.
  ⭐ That sitekey check is the guard against the gitignored-`.env` trap: a rebuild
  on a machine without `.env` ships a dead form and looks fine.
- **"Deployed" is no longer a claim.** The tool records `Last-Modified` on the apex
  **and** `www` before uploading and asserts it *moved* afterwards, then re-reads
  the served CSP, both contact pages, `og-image.jpg`, and a deliberate miss (which
  must return a real **404**, not a 404 body under 200 — the pre-A7 defect).
- **`--delete` mirrors exactly**, with `/.well-known/` and `/cgi-bin/` excluded so
  an exact mirror of *our* content cannot take out certificate renewal. Permissions
  are forced (`--chmod=D755,F644`) rather than inherited from the local umask;
  `-a` is deliberately not used, since preserving owner/group fails as a non-root
  user on shared hosting.

- [x] Dry run green 2026-08-14 — 16/16 pre-upload assertions, **0 deletions**
      ("docroot has no stale files"), 12/12 live-site checks.
- [ ] First real `npm run deploy` against production.
- [ ] Re-run `deploy:status` after the next content change to confirm drift is
      actually detected rather than merely reported green.

### I4 — Re-based onto FTP ✅ 2026-08-14

`scripts/deploy.mjs` now transfers over FTP via `basic-ftp` (zero dependencies).
The three modes and their names are unchanged. **Stages 1 and 3 — the 16 build
assertions and the 12 public-URL checks — were not touched: they are
transport-independent, which is exactly why the split was worth making.**

What FTP could not inherit from rsync, and what replaced it:

| rsync gave us free | FTP replacement |
|---|---|
| `--delete` | explicit remote walk → diff → delete files, then now-empty dirs deepest-first. Uploads run **first**, so the live site is never missing a file that is about to be replaced |
| `--checksum` | ⛔ nothing — FTP has no content hash, and `astro build` rewrites every mtime. **Every file is uploaded every run**; size differences are reported but never used to skip. Unconditional upload is the only thing that actually guarantees convergence |
| dotfiles carried by `dist/` + trailing slash | the upload set is walked locally, so `.htaccess` is not a special case. If the *remote* listing returns no dotfiles at all the script warns that the delete pass may be partial (that direction only under-deletes, which is safe) |
| `--exclude` on a mirror | `/.well-known/` and `/cgi-bin/` are never listed into and never deleted — same contract, checked in the delete pass |
| one SSH process | **one FTP control connection held for the whole run**, closed in a `finally` on every path out. A dangling session is a leaked process on an account at 88 % |

Guards that did not exist before, because FTP made them necessary:

- 🔴 **Refuses to mirror into a cPanel account home.** The login is the *main*
  account, whose home holds every site — a wrong `CPANEL_DOCROOT` plus
  mirror-with-delete would take out psiativa and newcar too. Three or more of
  `domains/ public_html/ mail/ etc/ …` in the target ⇒ hard stop, unconditional.
- The docroot must name the apex host, **or** `CPANEL_FTP_SCOPED=true` must be
  declared (a per-directory FTP login is chrooted, so its docroot is `/` and
  cannot name the site). Declared, never inferred.
- The target must already hold an `index.html`, or be empty.
- The process-quota preflight above, with `--force` as the explicit override.

**Proven 2026-08-14, and how:**

- [x] 16/16 build assertions green; the quota preflight read 88/100 live.
- [x] **The mirror contract was proven end-to-end against a local fake FTP server
      before it was ever pointed at production** — 102 files uploaded, 3 stale
      files + 1 stale dir deleted, `.htaccess` landed, `.well-known/acme-challenge/`
      and `cgi-bin/` survived, and the result diffed **byte-identical to `dist/`**
      with no extras and no misses. ⭐ Worth keeping: the first failure that run
      produced was a bug in the *fake server*, not the deploy script.
- [x] Fails closed on the security downgrade instead of leaking (below).
- [x] **Scoped FTP account created 2026-08-15** — `deploy@<site-domain>`,
      jailed to the docroot (confirmed by `Ftp::listftp`, not assumed). ⭐ Created
      over **cPanel API2** (`POST /json-api/cpanel`, `Ftp::addftp`, password in the
      form body so it never lands in an access log). ⚠️ The earlier claim that this
      "cannot be scripted, the `FTP` UAPI module is missing" was **wrong**: `Ftp`
      and `Cron` are **API2** modules, not UAPI — absence from `/execute/` proves
      nothing. `.env.deploy` now carries `CPANEL_DOCROOT=/`,
      `CPANEL_FTP_SCOPED=true`, `CPANEL_API_USER=<cpanel-account>`, `CPANEL_FTP_TLS=false`.
- [x] **`deploy:check` green against production 2026-08-15** — 102 local vs 102
      remote, **0 deletions, 0 size differences**, identity guards passed on the
      chrooted path. ⭐ The dry run earned its keep: it caught that the mirror would
      have deleted **`.ftpquota`**, pure-ftpd's own quota bookkeeping file in the
      FTP account's home. Now preserved, and `PRESERVE` entries distinguish subtree
      prefixes (`/.well-known/`) from exact files (`/.ftpquota`).
- [x] **The process cap cleared itself once the cause was found** — Juan killed the
      backlog via **cPanel → Terminal** on 2026-08-15 and `lvenproc` went **88/100 →
      0/100** (`lveep` 8 → 0). 🔴 **They were leftover agent SSH sessions from
      earlier deploys on other projects** — not steady-state daemons, as this
      session had wrongly inferred from the count sitting still for 24 h. ⭐ That is
      the strongest argument yet for the FTP rule: the tooling was polluting the
      account it deploys to. ⚠️ Terminal **is** available on this account.
- [ ] ~~Blocked:~~ 🔴 **This host has no working FTPS** —
      the banner advertises `[TLS]` and `FEAT` lists `AUTH TLS`/`PBSZ`/`PROT`, yet
      every scheme (`AUTH TLS`, `AUTH SSL`, `AUTH TLS-C`) answers **`500 This
      security scheme is not implemented`** as the first command on a clean
      connection, and implicit FTPS on `:990` is **refused**. So a login here
      crosses the internet in cleartext. Juan's call (2026-08-14): create a cPanel
      FTP account whose directory **is** the juanpablosilva.com.br docroot, so a
      captured credential can write that one folder and cannot reach cPanel,
      psiativa or newcar. ⛔ It cannot be scripted: the `FTP` UAPI module is
      missing on this server. Then set `CPANEL_FTP_USER`/`CPANEL_FTP_PASSWORD`,
      `CPANEL_DOCROOT=/`, `CPANEL_FTP_SCOPED=true`, `CPANEL_API_USER=<cpanel-account>`
      and `CPANEL_FTP_TLS=false`.
- [x] **First real `npm run deploy` against production ✅ 2026-08-15, exit 0.**
      102/102 uploaded, **0 deleted** (preserve list respected), and — the
      acceptance test — `Last-Modified` **moved on the apex AND `www`**
      (`Fri, 14 Aug 13:44:13` → `Sat, 15 Aug 22:31:46`), followed by 12/12
      public-URL checks green: CSP with the Worker in `form-action`, security
      headers, both contact pages with a live sitekey and an enabled submit,
      `og-image.jpg` 200, a real 404 on a miss. ⭐ Deliberately run while the
      docroot already matched `dist/`, so the write path was proven end to end
      with byte-identical content and nothing to delete.
- [x] **The transport cost was verified, not assumed:** `lvenproc` **0/100** and
      `lveep` **0/50** immediately after the deploy — one connection, held for the
      run, closed in a `finally`, nothing leaked. Contrast the 88 that
      rsync-over-SSH left behind across previous sessions.
- [ ] Re-run `deploy:status` after the next content change to confirm drift is
      actually detected rather than merely reported green.
- [ ] ⚠️ Revisit if <host-provider> ever enables FTPS: `CPANEL_FTP_TLS=false` is a scoped
      credential in cleartext, accepted knowingly — not a permanent verdict.

⛔ **Do not port this back to SSH.** rsync-over-SSH works on this host — it deployed
successfully on 2026-08-14 — and is still forbidden. The constraint is the
account-wide process cap and its blast radius, not authentication.

**Still true whatever happens next:** the acceptance test is **verify by public
URL, not by a green build** — and read the body, not the status code.

## Milestone J — Every project published + the `/projects` architecture ✅ CLOSED 2026-09-02

Needs F. Delivered in two phases in one session; **not deployed** (Juan's call, FTP).

### J1 — Phase 1: all 50 projects published

- [x] 43 records given `publish` blocks; `node _config/portfolio/export.mjs` → **✔ 50 card(s)**, 0 errors.
- [x] Store totals: **58 valid · 50 publishable · 8 withheld** (5 describe-only, 2 role records, `cambioflow`).
- [x] Gates re-verified at close: **0 of 7 private keys** (`attribution`, `impact`, `neverClaim`, `confirmedOn`, `notes`, `internal`, `context`) in the emitted JSON **or the built HTML** · **50/50** preview paths resolve · all 50 card files tracked and committed.
- ⛔ `cambioflow` remains unpublishable — no recoverable date. Not a bug.

> **The defect this exposed:** `Projects.astro` was rendered by *both* the homepage
> and `/projects` and filtered on `featured` — so only **3 of 50** projects were
> reachable. The data was never the gap; the routing was.

### J2 — Phase 2: the three surfaces (via `knowledge/skills/ui-design-router/`)

- [x] **Homepage** — the 3 featured, existing full-bleed treatment kept (CLAUDE.md's "ruthless edits, no new layout" honoured); gained the evidence rail + a case-study link.
- [x] **`/projects`** — evidence board, evidence-weighted default order, signal + stack filters with live counts, Grid/List toggle, and a **filter-reactive Recommended slot**. One React island, `client:load`.
- [x] **`/projects/<slug>`** — 50 projects × 2 locales = **100 pages**. Prose is "coming soon"; the page still carries a real provenance brief (role · timeframe · stack · evidence rail · links) from the store.
- [x] **116 pages built** (was 16). Build green.

**⭐ Homepage trio — Juan's decision, 2026-09-02.** `syd` (w13) · `upos` (w12) ·
`psiativa-ai-operations` (w6). The two ranking criteria disagreed and Juan chose
**positioning coverage over raw evidence**: `psiativa-ai-operations` is the *only*
card of 50 evidencing **Python**, and the only one evidencing **automation** — two
of the three pillars of *"Design Engineer | Next.js, Python & Scalable Growth
Automation"*. ⛔ **Do not reorder the homepage to match evidence weight.**
`psi-silvanacabral` (w13, joint-top) is deliberately on `/projects` only.

**⛔ Tailwind and shadcn were deliberately NOT added.** Both target React+Tailwind;
this site is zero-dependency Astro with a bespoke token system, so adding them is a
re-platform, not an edit. React Bits' `SpotlightCard` is used per-project only —
it is **MIT + Commons Clause**, never to be vendored into a shared template.

**Island scoping — corrected 2026-09-07 (K7).** As written, React hydrated on
`/projects` **only** (~61 KB gz). **K1's `HeroHeadline` + `CurvedLoop` islands added
`/` to that list** — `dist/index.html` now loads `_astro/HeroHeadline.*.js` +
`_astro/CurvedLoop.*.js` + the client runtime, re-measured against the fresh build
2026-09-07. `/404` also gained an island the same milestone (`FuzzyText`, K1). What
still holds: **`/contact` and all 100 case-study pages (50 EN + 50 PT) ship zero
first-party JS** — re-verified with a strict `_astro/*.js` token scan (not a
substring match, which false-positives on unrelated `.js` text like the GTM
snippet) across every one of the 100 pages, zero hits.

### J3 — Rungs 5 and 6 (both run, neither skipped)

Rung 5 caught three defects that code review structurally could not:

1. 🔴 **The navbar is `position: fixed` and takes no space in flow** — 98px ≤768, **134px** ≥1280. `/projects`' `<h1>` rendered **38px underneath it**; the case-study back-link collided with the wordmark. Fixed with per-page clearance (120 / 128 / 170px). ⛔ **Every new page must reserve its own.**
2. "21 **LIVE SITE**" — the evidence board was reusing *filter* labels as *count* labels.
3. The new case-study link cramped the card actions row into 2–3 line wraps at ≥1280 (fixed 340px primary + flexible secondary). Moved out of the flex row.

Rung 6, measured rather than assumed:

- [x] **Contrast computed** on all three surfaces — every text token passes AA, tightest **4.75:1**.
- [x] **0 horizontal overflow at 360px**, both new page types.
- [x] **Focus ring proven by a real Tab press** — `solid 2px rgb(44,214,255)`, offset 3px.
- [x] **Tap targets** — every *new* control ≥44px.
- [x] **Tokens honoured** — each referenced token verified present; no hard-coded hex.
- [x] **Signature element** (the evidence rail) on **50/50** cards.

⚠️ **Known, NOT fixed — 8 pre-existing chrome elements fail the 44px tap target:**
`.skip-link` (40h), `.navbar__brand` (24h), the PT switch (40×40), and **five footer
social icons at 28×48** (fail on width). None introduced here; the footer icons are a
real mobile defect, offered and awaiting Juan's go-ahead.

⚠️ Also pre-existing: the navbar is translucent (`--color-white-a02`), so scrolled
content shows through it.

**A correction worth keeping:** `designArtifact` was first excluded from the displayed
signals, which left **23 of 50 cards with a blank evidence rail**. Those records are not
evidence-free — they carry a live Figma file and nothing else. ⛔ **Excluding the most
common signal from a display list silently blanks exactly the population that only
carries it.**

### J4 — Case-study prose 🟡 **3 of the top 3 written 2026-09-07** · ⛔ **NOT DEPLOYED** · Phase 3 media open

> ⛔🔴 **"Shipped" was true of the REPO, not of the SITE — verified 2026-09-09.** All three case studies are
> committed, pushed (`main` in sync with `origin/main`) and present in the local `dist/`, and production
> still serves the **"coming soon" aside**. Measured live vs `dist/`:
>
> | record | live | local `dist/` |
> |---|---|---|
> | `psi-silvanacabral` | 22,855 B · `cs-figure` **0** · `soon` present | 39,208 B · `cs-figure` ✅ |
> | `syd` | 22,538 B · `cs-figure` **0** · `soon` present | 38,315 B ✅ |
> | `upos` | 22,516 B · `cs-figure` **0** · `soon` present | 39,263 B ✅ |
> | `agenda-geek` | 38,658 B · `cs-figure` 2 ✅ (already live) | 45,836 B — **also drifted** |
>
> There is **no CI workflow** (`.github/workflows/` is empty) — deploy is manual, `npm run deploy`
> (`scripts/deploy.mjs`, reads `.env.deploy`). ⛔ **Nothing in J4 or the K milestone is in front of a
> prospect until someone runs it**, `agenda-geek`'s drift included. Grep the byte size or `cs-figure`
> count on the live page — a 200 and a page that renders are not the same claim.

> 🔧 **Two claims in the previous version of this section were STALE and are corrected here (re-probed 2026-09-07).**
> It read *"`caseStudy` is `null` on all 50"* — it was null on **49**; `agenda-geek` was already populated
> (100 EN / 106 PT blocks, imported from its Notion export) and is the reference for the block grammar.
> It also read that `/media-engine` is blocked on `RUNWAYML_API_SECRET` — **that key was issued 2026-09-02**
> and `knowledge/projects/media-engine/ROADMAP.md` marks Phase 1 ✅ COMPLETE. ⛔ **A recorded blocker needs a
> re-probe before it is quoted as current.**

**Coverage: 4 of 50 records carry a case study; 46 still render the "coming soon" aside.**

- [x] **Case-study prose — top 3 by evidence weight**, EN + PT, long form with blocks — `psi-silvanacabral`
      (21/21), `syd` (18/18), `upos` (20/20). Written from the store's confirmed `summary`/`contribution`/
      `context`, structured around each record's `neverClaim` list, and closing on a **"What this is not"**
      section — on a portfolio whose standing risk is overclaiming, publishing the limits is what makes the
      rest legible. The three `/projects` cards flipped to "Read the case study" in both locales.
  - ⭐ **The ⛔ was enforced mechanically, not by discipline.** A gate compares 8-word shingles of the drafted
        prose against the record's `attribution`/`impact`/`internalOnly` and refuses the write on any overlap.
        **Both legs proven:** injecting real `attribution` text caught 23 shingles and wrote nothing; the clean
        run passes. It also caught one of the author's *own* sentences mid-session, which was rephrased.
        Final state: **0 overlaps** on all three. ⛔ A gate that has never failed is decoration — prove the
        known-bad leg before trusting a pass.
  - ⚠️ **Images are placeholders** (`/assets/images/placeholders/*.svg`), captioned with the shot each frame
        is waiting for. Swapping in a real asset is a one-field `src` change per block.
  - ⛔ **Portrait placeholders were removed after Rung 5 caught them.** `.cs-figure img { width: 100% }` scales
        a 240×520 portrait frame to **770×1666px**. All 18 case images are landscape (800×450 / 800×600) —
        heights now 434/578. **See the open defect below: this already affects `agenda-geek` in production.**
  - **Verified, not assumed:** 116 pages build clean · 0 horizontal overflow at 1280 **and 360** · stat tiles
        wrap 2×2 at 360 · PT accents intact · no locale bleed either direction · **zero-JS invariant holds —
        0 `astro-island` and 0 `_astro/*.js` across all 100 case-study pages** (K0 #5).
  - **Corrections the interview produced**, all now live: the AI-imagery claim was wrong (Juan *asked* for
        photographs and got **one 150×150 profile picture**, then generated imagery to hold the ship date —
        the source calls that lesson worth more than the project); the one-week-vs-16-day conflict is closed
        as **both true** (deployed in week one, week two was client-requested fixes) and written into
        `dates.source` with a do-not-reopen; the imgur disclosure was cut; the "~5%" figure was dropped for
        *"helped on the app, adjustments and fixes only"*.
  - ⭐ **`upos` gained a claim from a Figma audit** (channel `3pdicfop`, 2026-09-07): the permission system is
        designed and in the file — `7-Config` holds a profiles table (**Admin master · Técnico · Vendedor**,
        user counts 1/3/10) and a **1280×2723 matrix of ~26 view/edit permissions across 8 areas**. The store's
        `neverClaim` was **revised, not deleted** — *built* is still false. New source:
        [`sources/portfolio/figma/upos.md`](../../sources/portfolio/figma/upos.md).
        ⛔ Discovery's actors (`Cliente · Técnico · Vendedor`) are **not** the shipped profiles.
- [ ] **Case-study prose — the remaining 46.** ⛔ Not a batch job: each is written from its own record and
      interviewed for the gaps the store cannot hold (the decisions, the constraints, the why). Next by
      evidence weight: `spaceapps` (9) — ⚠️ the record previously wrong in *both* directions, so handle with
      the most care — then `allprice` (8), `celus` (8), `gestrif` (8).
- [ ] **Phase 3 media** — demo/walkthrough, hyperframes, motion via talk-to-figma-fork + AEUX.
      ✅ **Runway is unblocked** — key issued 2026-09-02, cost baseline measured (500 → 344 credits;
      ~10 credits per 2s `gen4_turbo` clip, and ⛔ `cancelTask` on a live image job costs 20 **with no refund**).
      > 🔧 **The AE blocker was re-probed 2026-09-09 and is NARROWER than recorded.** The line below read
      > *"no `AfterEffectsMCP` server is connected"*. The server **is** connected now (36 tools exposed);
      > `bridge-status` returns **`panelResponsive: false`, 8.1s timeout**, `bridgeDir`
      > `/mnt/c/Users/melor/Documents/ae-mcp-bridge`. ⛔ **Tool presence is not bridge liveness** — the
      > remaining step is inside AE: `Window > mcp-bridge-auto.jsx`, tick **Auto-run commands**, and it must
      > be **reopened after every AE restart** (AE 2025+: floating window only).
      **Decisions taken 2026-09-09 (Juan), replacing "cheapest first":** quality over speed — the rule is now
      **a real video per case study, with stills as the fallback**. Form = **silent inline loop** (10–20s,
      muted, autoplay, looping, poster = the still). Source = **Figma → AEUX → AE**. First subject = **upOS**.
      The Loom-style walkthrough (master plan Phase 3, item 2) is **not** the entry point any more.
  - [x] **Storyboard + named-layer asset manifest — `upos-permissions-loop`**, written 2026-09-09 to
        [`motion/upos-permissions-loop.storyboard.md`](motion/upos-permissions-loop.storyboard.md).
        14.0s · 30fps · 1920×1080 · 4 scenes, seamless (f420 ≡ f0). Carries **one** claim —
        *permissions are a module, not three hardcoded screens* — grounded in the verified node IDs from
        [`sources/portfolio/figma/upos.md`](../../sources/portfolio/figma/upos.md), not re-scanned.
  - ⭐ **The format gate changed the delivery, and the reason is local, not in the pack.**
        [`web-motion-delivery-decision`](../../../../knowledge/design/guides/web-motion-delivery-decision.md)
        routes non-interactive **UI vector** work to **Lottie**. ⛔ **Lottie is ruled out here: it needs a
        runtime script, and all 100 case-study pages ship zero first-party JS (K0 #5).** A player would be the
        first island on a case-study page. `<video autoplay muted loop playsinline poster>` is pure HTML and
        keeps the invariant — so **WebM**, which is also what `animating-ui-cards-for-web` specifies.
        **Considered deviation:** the pack's *"MP4 is not a web-delivery format"* is about **transparent**
        motion; this asset is opaque inside `.cs-figure`, so MP4 ships as a **fallback `<source>`** for Safari.
        ⛔ Not two theme variants — `<source media>` is not honoured for video, so a theme-switched video
        would need JS. Opaque + dark, matching the `*-dark-placeholder.svg` practice across all 50 records.
  - ⛔ **The `video` block type does not exist, and adding it is a THREE-file lockstep change.**
        `_config/portfolio/schema.mjs` (`validateCaseStudyBlocks`) · `src/content.config.ts` (the Zod
        discriminated union) · `src/pages/[...lang]/projects/[slug].astro` (the renderer). Both schemas
        reject an unknown type **loudly**, but **the renderer's last branch is a fallback `else`, not a
        `type === "image"` check** — a `video` block that ever got past them renders as
        `<img src=undefined>`. The schema file says it in its own comment: *"the two are halves of one
        release and must change together."*
  - ⛔ **Asset hazard, carried into the storyboard:** frame `7-3.1` (`19142:36607`) visibly renders Untitled UI
        placeholder residue — `12/12/2025` ×3 and `olivia@untitledui.com`. **It must not be exported as a
        flat image.** The storyboard rebuilds that table as live text and drops the `Data da criação` column
        entirely, which kills the residue *and* satisfies the keep-text-live rule text animators need.

#### Defect found during J4 — pre-existing, in production · ✅ **FIXED 2026-09-09** (Juan's go-ahead)

⛔ **`.cs-figure img { width: 100% }` blew portrait case images up to the full reading column.**
`agenda-geek` ships **5 portrait images of 20**, the worst a 1440×4522 that rendered **770×2418px** — a single
image over three viewport-heights tall. The other four rendered 1685 / 914 / 856 / 838px. Introduced by neither
J4 nor K; latent since the block renderer landed, and only visible once a second record used `image` blocks.

**The fix is scoped by ORIENTATION, not applied to every image** — three edits in `[slug].astro`:

1. the renderer marks `cs-figure--portrait` **at build time** from each block's own `width`/`height`;
2. `.cs-figure img` is **left untouched**, so all 15 landscape images render byte-identically to before;
3. `.cs-figure--portrait img` gets `width:auto; max-width:100%; max-height:80vh; margin-inline:auto`, and is
   **excluded from the ≥1024px bleed** — that rule widens the figure past the measure, which on a narrowed
   portrait only stranded the caption far left of the image.

⭐ **The obvious one-rule fix was measured and REJECTED.** Capping every image with `max-height:70vh` +
`width:auto` would have (a) shrunk `140304280f04.webp` from 770 → **356px**, its intrinsic width, and
(b) clipped the near-square `1072×1035`. The orientation split exists because there is a **clean gap in the
data**: at the 770px figure width (`--content-copy` 610 + `--space-px-160`), the tallest **landscape** image
renders **743px** and the shortest **portrait 838px**. ⛔ *A cap that catches portraits cannot be derived from
a viewport fraction — it has to come from the corpus's own measurements.*

**Verified, not assumed** — 116 pages build clean · **5/20** figures marked portrait on `agenda-geek` and
**0/3** on each of `psi-silvanacabral` / `syd` / `upos` (both legs) · worst image **2418px → 720px**, aspect
preserved (231×720 for a 1440×4522) · **CLS 0.0018** across a full scroll of the 24,676px page · **0**
horizontal overflow at 360px. ⚠️ Measured geometry via Playwright `getBoundingClientRect`, **not** a visual
confirm — the screenshot file was not reachable from this filesystem.
⚠️ **First measurement was an ARTIFACT and was discarded:** flipping `loading` to eager and reading boxes in
the same tick reported the portraits at **2×2px**. ⛔ *A `width:auto` image that has not loaded reserves no
box — await `onload` before measuring, or you will "find" a defect you just invented.*

---

## Milestone K — Binder UI refactor (11 canvas notes) 🟢 **CLOSED 2026-09-07** — K1–K4 closed 09-03 · K5 closed 09-07 (uiverse-9 09-05 · 5 + 10 09-06 · **2 09-07**) · **K9 off-binder 09-07** (uiverse-11, the `/projects` view toggle) · **K10 off-binder 09-07** (stack marks in the `/projects` filter chips)

Source of record: the Maestri fichário **"Fichário"** on the `juansilva.design UI Refactor`
canvas — `react-bits-changes` + `uiverse-1..10`. Read it with `maestri note read "<name>"`.

Needs J (closed). Scope is **ruthless edits to existing controls**, per CLAUDE.md — no
new page layouts except the 404 repair and the loading screen, both of which the binder
asks for explicitly.

### K0 — The eight constraints that govern every item below

1. ⛔ **The uiverse.io URLs are NOT fetchable.** The site sits behind a Cloudflare
   interstitial — WebFetch and a browser-UA `curl` both return **403 Attention Required**.
   **The notes are the source, not the links.** Each note's `StyledWrapper` template
   literal already carries the complete, plain-CSS rule set (`.button {…}`, `.svgIcon {…}`),
   so nothing needs fetching.
2. ⛔ **`uiverse-6`'s URL is wrong** — it repeats `uiverse-5`'s `loud-chicken-53`, but the
   two notes hold *different* components (5 = a 50px circular icon button that widens to
   140px; 6 = `.animated-button`, a text CTA with two arrows and a circle hover fill).
   Had the URLs been fetchable, #6 would have been built from #5's CSS. **Use the note's
   own code for #6 and ignore its link.**
3. ⛔ **No styled-components, no Tailwind.** J2 settled this: zero-dependency Astro with a
   bespoke token system, so both are a re-platform, not an edit. Every component is ported
   as **plain CSS** into a scoped `<style>` block (`.astro`) or a file in `src/styles/`.
4. ⛔ **Tokens only — no hard-coded hex.** A Rung-6 gate. Every uiverse snippet ships raw
   values (`rgb(181,160,255)` lavender, `rgb(20,20,20)` near-black) that must be re-mapped
   onto `--primary` cyan / `--secondary` pink / the neutral ramp before it lands.
5. ⛔ **Protect the zero-JS pages.** *(K2 spends an island on the **homepage**, which
   already hydrates `HeroHeadline`. The island-free pages below are the ones this rule
   is about, and they are still island-free.)*
   > ⚠️ **The 2026-09-03 evidence for this line was STALE and is corrected here
   > (re-probed 2026-09-06).** It read "case-study pages **and the 404** hydrate nothing".
   > The **404 no longer qualifies** — K1 put `FuzzyText` on it, and `dist/404.html` now
   > carries **2 `astro-island`s + `_astro/FuzzyText.*.js`**. Two further corrections from
   > the same probe: **`/contact` is island-free but not JS-free** — it loads third-party
   > Cloudflare Turnstile (`challenges.cloudflare.com/turnstile/v0/api.js`); and every
   > case-study page carries **one inline `<script type="module">`**, the pre-existing
   > navbar `data-scrolled` handler. The rule as enforced is therefore **no
   > `astro-island` and no `_astro/*.js`**, not "no script of any kind".
   Re-verified in `dist/` on **2026-09-06**, after uiverse-5 and uiverse-10: **the 100
   case-study pages hydrate nothing** — 0 `astro-island`, 0 external `.js`. Four binder items
   target exactly those pages. Prefer CSS-only (`:target`, `@keyframes`,
   `animation-timeline: scroll()`) over a React island; where an island is unavoidable,
   say so and price it.
   > ✅ **Corrected 2026-09-07 (K7)** — the J2 "island scoping" line above now states
   > current reality: `/` hydrates (`HeroHeadline` + `CurvedLoop`), `/404` hydrates
   > (`FuzzyText`), `/contact` and all 100 case-study pages still ship zero
   > first-party JS.
6. ⛔ **Every effect carries a `prefers-reduced-motion: reduce` branch.** House rule —
   already honoured in 5 of 6 stylesheets.
7. ⛔ **Every new label lands in BOTH `src/i18n/en.ts` and `src/i18n/pt.ts`.** EN is the
   client-facing default; PT is a full locale, not a fallback.
8. ⛔ **The navbar is `position: fixed` and takes no space in flow** (98px ≤768, 134px
   ≥1280) — J3's first defect. The loading screen and the repaired 404 must each reserve
   their own clearance.

⭐ **React Bits is MIT + Commons Clause.** Items K1–K3 are React Bits effects. Per J2 they
are used **per-project only and never vendored into a shared template** — that holds here.
`ShinyText` and a straightened `CurvedLoop` are both reproducible as pure CSS, which keeps
the licence surface to `FuzzyText` alone.

### K1 — `react-bits` #1: shiny text on every H1 ✅ 2026-09-03

Juan's call: **chain the effect on the two animated H1s** — the typewriter runs first,
the shimmer starts on completion. No element ever runs two effects at once.
⛔ **`ProfileHeader.astro` is out of scope** (Juan, 2026-09-03) — page H1s only, and that
one is the vCard/`card` header. **6 surfaces, not 7.**

- [x] New **`src/styles/shiny-text.css`** — pure CSS, no React Bits dependency. The effect
      is only a travelling gradient behind clipped glyphs, so it needs no JS at all.
      Imported once in `BaseLayout.astro` beside `clone.css`: this is a site-wide H1
      treatment, not a per-feature stylesheet.
- [x] **4 static H1s** carry `.shiny-text`: `NotFound.astro`, `[slug].astro`
      (`.case__title`), `LegalPage.astro`, `Contact.astro` (`#contact-title`).
- [x] **2 typed H1s chained** — `HeroHeadline.tsx` swaps the class onto the settled lead
      when `leadDone` fires; `TypedHead.tsx` does the same on `titleDone`. Both flags
      already existed to gate the lede, so the chain added state to neither.
- [x] Reduced-motion: animation off, gradient parked at flat base colour.

⭐ **Three details that decide whether this works rather than merely renders:**
1. The rule is wrapped in `@supports (background-clip: text)`, because the failure mode of
   an unsupported `background-clip` is **invisible text** — outside the guard nothing is
   declared and `color: var(--text-heading)` from `clone.css` still applies.
2. `-webkit-text-fill-color` beats `color` **regardless of specificity**, which is what
   lets one global class light up `.case__title` without out-specifying that component's
   scoped rule. No `!important` anywhere.
3. The hero's **rotating** term is deliberately left plain — it types and deletes for the
   life of the page, so shimmering it would be the two-effects-at-once case this milestone
   exists to avoid.

⚠️ `onDone` was verified to fire under `prefers-reduced-motion` too (`TextType.tsx:109`
calls `finish()` immediately), so the chain does not silently never arm.

> 🔴 **Motion corrected 2026-09-03 — the first pass invented its own sweep.** Juan
> supplied upstream's source and it differed on every axis: `200% auto` not `300% 100%`,
> a **120°** gradient not 100°, stops at **0/35/50/65/100** not 42/50/58, position
> **150% → -50%** not 100% → 0%, over **2s** not 6s. All five now match.
> ⭐ Unlike CurvedLoop, the CSS reproduction here is **exact rather than approximate**,
> and that was checked rather than assumed: upstream's `motion/react` machinery exists
> for `yoyo`, `delay`, `direction` and `pauseOnHover`, but with the defaults the binder
> uses, the animation is a *linear interpolation of one property*, which is precisely
> what a CSS keyframe is. (`pauseOnHover` is `:hover`; `yoyo` would be `alternate`;
> `delay` is a keyframe percentage.) The four static H1s therefore still hydrate nothing —
> **verified on `/projects/syd/` with 0 islands on the page.**
>
> ✅ **Settled 2026-09-03 — upstream's horizontal sweep with `box-decoration-break:
> clone`, and the effect REMOVED from case-study titles.** Juan's call after seeing the
> staggered build: revert to the original motion, drop the line-spans, stay script-free.
>
> **Where it applies now — 2 static surfaces** (was 3; ⛔ **K3 removed the 404**, whose
> headline is a canvas now): the legal pages and `/contact`, each wrapping its text in an
> inline `<span class="shiny-text">`. Plus the
> two typed headlines, which chain it on completion (K1 above). ⛔ **`[slug].astro` no
> longer carries it at all** — the case-study title is plain `--text-heading` again,
> verified `animation: none` and solid fill on `/projects/syd`.
>
> ⛔ **The class must sit on an INLINE box.** `background-clip: text` paints the element
> box, so on a block heading one 120° band cuts diagonally across every line at once;
> `box-decoration-break: clone` gives each line its own copy, but only fragments an
> inline box. `display` is deliberately not set on the class — `.ttype--reserve` is a grid
> that reserves height to stop reflow, and forcing `inline` would break that.
>
> 🔴 **Two rejected attempts, kept because both looked plausible and neither was cheap:**
> a **vertical** sweep progressed top-to-bottom but read as a band crossing the lines
> rather than travelling along each one; a **JS line-splitter** did produce a true
> one-line-at-a-time stagger — CSS cannot select a line box, so the breaks had to become
> elements — but it was bugged in use and cost the script-free property. Both are gone;
> `src/scripts/` is deleted and nothing in `src/` or `dist/` references them.
>
> ⭐ **Script-free is restored and measured.** Case studies, the 404 and the legal pages
> ship **0 React islands** and exactly **one 255-byte inline script — the pre-existing
> navbar scroll handler**, which they always carried. No splitter chunk in `dist/_astro/`.
>
> **Verified:** `/contact` runs the sweep live (`200% auto`, `2s`, `120deg`, `clone`,
> position moving 45.01% -> 10%), and the case-study title is inert.
>
> ⏭️ Knobs: `--shiny-shine` (brand cyan vs upstream white), the 35/65 stop width,
> `--shiny-spread`, `--shiny-speed`.

### K2 — `react-bits` #2: straight metrics marquee under the hero ✅ 2026-09-03

- [x] **`src/components/text/CurvedLoop.tsx`** — React Bits' component ported, not
      imitated. Mounted `client:visible` from `src/components/Marquee.astro`, below
      `<Hero />`.
- [x] Copy lives in `i18n` as a plain `marquee.items` array in **both locales** — reorder,
      add or drop a line there and the strip follows.
- [x] **A11y split matches the typed headlines:** the island is `aria-hidden` and the real
      copy ships server-rendered in a `.typed-real` list, so assistive tech reads each
      entry once and never the repeated filler the loop needs to stay seamless.
      `TypedFallback.astro` handles no-JS. `Marquee.astro` imports `text-type.css` itself
      rather than inheriting it from Hero's import.

> 🔴 **A correction worth keeping — the first attempt shipped a lookalike.** K2 was
> initially built as a CSS `translateX` marquee, justified by "a straight loop needs no
> JavaScript". **Both halves of that were wrong.** `curveAmount: 0` only flattens the
> path — `M-100,40 Q500,40 1540,40` — while the mechanism is untouched; and the CSS
> version silently dropped the two behaviours that make the component what it is: the
> **pointer drag** and the **direction flip on release**. Juan caught it on sight.
> ⛔ **Reproducing an effect's appearance is not porting it.** Read the source before
> deciding what a component's JavaScript is *for*.

⭐ **Deviations from upstream, each because the difference is not visible:**
1. **No per-frame `setState`.** Upstream writes `startOffset` imperatively *and* mirrors
   it into state every animation frame, re-rendering ~60x a second to reapply the value it
   just wrote. The offset lives in a ref here, so the attribute is the single source of
   truth and no re-render can snap the text back to a stale position.
2. **`prefers-reduced-motion` bails out of the rAF loop** — the text still renders along
   the path, it just does not travel.
3. **Cursor is CSS.** Upstream derives `grabbing` from `dragRef.current` during render, but
   a ref mutation triggers no re-render, so that state never actually paints. `:active`
   does it correctly.
4. **`touch-action: pan-y`.** `setPointerCapture` on `pointerdown` otherwise swallows a
   vertical swipe that merely *started* on the strip, trapping page scroll on a phone.
5. **The viewBox is matched to the measured pixel width**, not fixed at `1440 × 120`.
   ⛔ Upstream's box is scaled by `width: 100%`, which makes every unit inside it
   *proportional to the viewport*: at 375px a 34-unit type rendered at **~8.9 real
   pixels**, and the strip's own height shrank with it, so it could only sit centred at
   one specific width. A `ResizeObserver` feeds the real width in, so one user unit is
   one CSS pixel — `fontSize` is literal and `height` is constant at every breakpoint.

**Juan's sizing call, 2026-09-03: 20px, vertically centred at every viewport.** Measured
on the built page at **375 / 768 / 1280 / 1440**: rendered type **exactly 20px** and the
glyph box **18px above, 18px below** in the 60px strip at all four.

> ⚠️ **An instrument correction worth keeping.** `getBBox()` / `getBoundingClientRect()`
> on the `<text>` reported a 54px-tall box sitting 15px off-centre, which looked like a
> real defect and nearly triggered a "fix" to working geometry. Both return the **union
> box of the whole element** — including the path's ±100 overhang and the characters that
> fall off the ends — not where the glyphs are. `getExtentOfChar()` asks about an actual
> glyph and showed it spanning y 18–42 in a 0–60 box: already perfectly centred.
> ⛔ **Probe the glyph, not the element, when asking where text sits.**

- [x] **Seam fixed.** `items.join(SEP)` only separates *entries*, so the join between
      repeats read "…GMT-3 100+ projects delivered" with no bullet. The string now closes
      with the separator too. Verified: every seam in the rendered `textPath` carries it.
- [x] **`client:visible={{ rootMargin: "300px" }}`** rather than bare `client:visible` —
      at 768 and 375 the strip is below the fold, so it had not hydrated at all when the
      viewport checks ran. It now hydrates just before entry, with no pop-in.
- [x] **16px below 768, 20px at and above it** (Juan, 2026-09-03). Resolved from the
      width the `ResizeObserver` already tracks rather than a second `matchMedia`
      listener, so the size follows a real resize instead of only the width at hydration.
      `width === 0` (the pre-measure frame) deliberately resolves to the desktop size, or
      the strip would measure its spacing at the wrong type and re-lay out.
      Measured: **375 → 16px**, **768 → 20px**, **1280 → 20px**, centred at all three
      (20.5/20.5 and 18/18).

✅ **K2 accepted by Juan 2026-09-03** — *"K2 feeling is great, drag works."* The touch-feel
check that was outstanding is closed.

> **⭐ Decision — Juan, 2026-09-03: ship the suggested figures.** Asked whether to gate the
> strip on the evidence store, Juan's answer: *"They are not false claims, I can show my
> figma with +100 projects from different companies, and none of them complained about my
> design work."* Recorded, and the strip is built with his numbers.
>
> ⚠️ **Two wording risks worth one line each, because this site already carries an open
> unsourced-claims track** (`_config/master-cv.md` §5 — `100+ projects` is still marked
> unsourced pending the Sagitta audit):
> - *"+100 empresas impactadas"* — the evidence behind it is **100+ projects**, and
>   `_config/` records those as *projects*, not *companies*. An agency's 100 projects
>   routinely span far fewer clients, so this figure **raises** the claim rather than
>   restating it. **"100+ projects delivered" is defensible today with the same Figma
>   account** and needs no audit.
> - *"100% NPS"* — NPS is a surveyed 0–10 recommendation score (%promoters −
>   %detractors). *"Nobody complained"* is real evidence of **zero detractors**, but it is
>   not a measured NPS, and a CTO who asks *"what was your sample size?"* has no answer.
>   **"Zero client complaints"** or **"100% delivery record"** says the same thing and
>   survives the question.
>
> ✅ **Juan took both edits, 2026-09-03.** Shipped copy is **"100+ projects delivered"**
> and **"Zero client complaints"** (PT: *"+100 projetos entregues"*, *"Zero reclamações de
> clientes"*), plus two further lines that need no audit — *"2 years at agency pace"* and
> *"Nearshore from Rio · GMT-3"*. The reasoning is recorded in `en.ts` above the array, so
> the next person to edit the strip inherits the constraint rather than the conclusion.

### K3 — `react-bits` #3: fuzzy text + a repaired 404 ✅ 2026-09-03

**Four decisions from Juan opened this one, the binder's second half having been
unspecified:** the fuzz goes on the **headline itself**, not on a big `404` numeral; the
page keeps its **centred** composition and gains real escape routes; the **PT 404 gap gets
fixed**; and the effect **idles at upstream's `baseIntensity` and rises on hover** rather
than sitting still until a pointer arrives — the only choice that also works on touch.

⭐ **Upstream's source is fetchable after all — K0.1 does not generalise.** `uiverse.io` is
behind a Cloudflare interstitial, but React Bits is a public GitHub repo and
`raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-default/TextAnimations/FuzzyText/FuzzyText.tsx`
returns **200**. K1 and K2 both had upstream handed over by Juan; this one did not need it.
⛔ The K2 lesson still governs — *read the source before deciding what the JavaScript is
for* — and reading it is what surfaced the six adaptations below.

- [x] **`src/components/text/FuzzyText.tsx`** — ported. The mechanism is a text bitmap
      copied to a visible canvas one scanline at a time, each row nudged sideways.
- [x] ⚠️ **This one costs the 404 its zero-JS status**, as priced. Verified in `dist/`:
      **exactly 1 island** on `/404.html` and `/pt/404/`, and still **0** on `/contact`,
      `/pt/contact`, the legal pages and the case studies.
- [x] **The 404 UI**, built to Juan's picks: navbar clearance reserved (`--nf-clearance`,
      104px → 140px ≥1280), a second route to `/projects/`, and the **`<Footer />` the page
      never had** — `BaseLayout` mounts the navbar but not the footer, so the old 404's only
      way out was one "Return Home" button.
- [x] **`public/pt/.htaccess`** — see the production defect below.

⭐ **Six adaptations, each because upstream's default assumes a page this is not:**
1. **Multi-line.** Upstream draws one line and never wraps. "Not Found" is 9 characters and
   "Página não encontrada" is **21**, so one line renders PT at less than half EN's size.
   The break is **authored per locale** in `i18n` (`notFound.titleLines`) — same division as
   `hero.title` against `hero.typeLead` — and drawn as rows of one buffer, so the
   displacement still runs continuously down the whole block instead of per line.
2. **The size is solved from the container, not passed in.** Upstream measures once, so any
   resize or rotation leaves the text at the size it was born at — the defect class K2 fixed
   with its `ResizeObserver`. Here the largest size whose widest line *plus its own fuzz
   clearance* still fits is re-solved on every resize.
3. **`fuzzRange` is a ratio of the font size (30/128), not a flat 30px.** Upstream pairs 30px
   with a `clamp(2rem, 8vw, 8rem)` display size; at this site's heading sizes a flat 30px
   displaces further than a glyph is tall and the word stops being readable.
4. **Device-pixel resolution, CSS-pixel noise.** Upstream sizes the canvas in CSS pixels, so
   retina upscales the bitmap and the glyphs go soft. Drawing the buffer at an integer device
   scale while displacing **one CSS pixel row at a time** is the only combination that
   sharpens the type without making the noise finer than upstream's.
5. **Pointer events, no `preventDefault`.** Upstream's `touchmove` handler is
   `{ passive: false }` and cancels the event, swallowing a vertical swipe that merely
   *started* on the headline. Identical to K2's `touch-action: pan-y` fix.
6. **`fontWeight` is 500, not upstream's 900.** ⛔ **Only Spectral 400 and 500 are
   `@font-face`d** (`clone.css:4-18`). Asking for 900 gets a synthesised bold in the canvas,
   which is not what any other H1 on the site renders.

> 🔴 **Two defects that only appeared in a browser — Rung 5 earning its place again.**
>
> 1. **The canvas never painted at all.** `canvas.parentElement` is not `.fuzzy`: Astro wraps
>    a hydrated component in **`<astro-island>`**, an element unknown to the UA and therefore
>    `display: inline` — and ⛔ **`clientWidth` is 0 for every inline element by definition.**
>    That reads exactly like a collapsed container, so the component sat at the canvas
>    default 300×150 with **0 lit pixels** while every layout check around it passed. The fix
>    walks past any inline or `display: contents` wrapper to the first real block box.
>    Same family as the recorded "an island's children get no `data-astro-cid`".
> 2. **The width budget overshot by 3px.** The solve subtracted the edge buffer but not the
>    per-side slack or the three `ceil`s, so `PT@375` came out **330px inside a 327px host**
>    and lost 3px of clearance to the clip. `overflow: hidden` hid it from every page-level
>    overflow check — the page measured 0 horizontal overflow the whole time.

⭐ **Measured, not assumed — 8 viewport × locale cases, glyph ink read out of the canvas
rather than the element** (the K2 `getExtentOfChar` lesson: probe the glyphs, not the box):

| | 320 | 375 | 768 | 1280 |
|---|---|---|---|---|
| **EN** canvas width | 205 | 205 | 205 | 205 |
| **PT** canvas width | 270 | 325 | 341 | 341 |
| host width | 272 | 327 | 720 | 1232 |

Every case: **fits the host**, **0 horizontal page overflow**, ink present (4,303 px EN /
5,792–9,055 px PT), **0 console errors**, both buttons **52–58px** tall, footer present,
navbar gap **185–234px** (no overlap at any width). EN sits at the **64px ceiling**
(`--text-64`, the top of the type scale) from 320px up; PT is width-limited to ~61px at 375
and reaches the ceiling by 768. ⭐ Had the headline stayed on one line, PT would have
rendered at **~27px** — the whole reason for adaptation 1.

⭐ **Both legs of the reduced-motion gate proven, not just the refusal one:** with
`prefers-reduced-motion: reduce` the canvas still carries **4,303 lit pixels** (it paints a
still frame — the text does not vanish) and two samples 180ms apart are **byte-identical**
(it does not animate). Without the preference the same two samples **differ**.

🔴 **A production defect the binder never asked about — the PT 404 was unreachable.**
`public/.htaccess:94` is `ErrorDocument 404 /404.html`: **one English page for every miss on
the site**, `/pt/*` included. `dist/pt/404/index.html` has been built since milestone D and
production had no way to serve it — a Portuguese visitor following a dead link got English.
Fixed with **`public/pt/.htaccess`**, an `ErrorDocument` scoped to the Portuguese tree.
- ⛔ **Deliberately a second file, not an `<If>` block in the root one.** This host is
  uploaded by hand and a directive Apache rejects makes the *whole file* fatal for
  everything below it — the root `.htaccess` warns about exactly this at its own line 39.
  A second file keeps the blast radius inside `/pt/`.
- ⛔ **Nothing else may go in that file.** A mod_rewrite directive there would stop the
  docroot's rewrite rules from applying to `/pt/`.
- ⚠️ It points at `/pt/404/index.html`, not `/pt/404/` — the directory form leans on mod_dir
  resolving an internal subrequest, and the file is what the build emits.
- Verified in `dist/`: `dist/pt/.htaccess` is **byte-identical** to the source and the
  `public/pt/` copy did **not** clobber the generated `dist/pt/` tree (`index.html`, `404/`,
  `card/`, `contact/`, `cookies/`, `privacy-policy/`, `projects/` all present).
- ⏳ **Owner action — this is the one claim no local check can close.** There is no Apache
  here, so the scoped `ErrorDocument` is verified as *built*, never as *served*. After the
  next `dist/` upload: `curl -sI https://juanpablosilva.com.br/pt/nao-existe/` must return
  **404** with the **Portuguese** body, and `/nao-existe/` must still return the English one.
  ⛔ Until that runs, "the PT 404 works" is a claim, not a result — [[feedback_pushed_is_not_published]].

🔴 **K1's surface count drops from 3 to 2.** The `.shiny-text` treatment K1 put on this
headline is **gone**: the visible glyphs are canvas pixels now and `background-clip: text`
has no text to clip. Verified in `dist/`: **0** occurrences on `/404.html` and `/pt/404/`,
still **1** each on `/contact/` and `/privacy-policy/`. K1's static surfaces are the legal
pages and `/contact`.

⚠️ **`dist.zip` grows by one entry.** The manual-upload archive was asserted at **102
entries**; `public/pt/.htaccess` makes it 103, and ⛔ a glob-based zip would silently miss a
dotfile *inside a subdirectory* just as it missed the root one (`pack_dist.py` uses
`python3 zipfile`, which does not).

⏭️ **Knobs, in the order Juan is most likely to want them:** `maxFontSize` — currently
**64**, the top of the type scale, which reads modestly in a 1,232px column and is the one
thing that looks small in the desktop screenshot; `baseIntensity` **0.18** / `hoverIntensity`
**0.5**; `fps` **30** (upstream's 60 halved — indistinguishable on random noise, half the
CPU for a loop that never stops); `fuzzRatio` **30/128**; `lineHeight` **1.05**; and the
authored breaks in `notFound.titleLines`.

### K4 — Existing-control swaps (uiverse 1, 3, 4, 6) ✅ **CLOSED 2026-09-03** — all four shipped, plus the off-binder LinkedIn swap and the 09-04 action-row consistency pass

#### uiverse-1 — Source-code button ✅ 2026-09-03

- [x] New **`src/components/SourceCodeButton.astro`** + **`src/styles/source-button.css`**,
      rendered on **14 case-study pages** (7 records × 2 locales) and on the **2 homepage
      cards** (`syd` + `upos` are the only `featured: true` records of the seven).
- [x] **The URL regex is deleted, not bypassed.** `projectActions()` chose slot two with
      `isCodeProject(stack) && isRepoLink(evidenceLink)` — a stack allowlist crossed with a
      repo-host allowlist. Both functions are **gone**; the verdict is
      `evidenceSignals.sourceCode` alone. `evidenceLink` supplies the destination and is
      never consulted about whether the button belongs.
- [x] ⭐ **The swap was provably a no-op for current output.** Boolean and old derivation
      agree on **all 50 records**, so nothing moved on the page — which is what made it
      safe. The change is about which one is *authoritative* from here on.
- [x] Fixed label from the existing `projects.sourceFallback` — **"Source code" /
      "Código-fonte"** (Juan's call). No new label key was needed; `spaceapps`'s own
      *"Source and evidence"* no longer renders here.

⭐ **The note is the one binder item that is NOT plain CSS.** uiverse-1 ships **Tailwind
utility classes**, not a `StyledWrapper` template literal like the rest, so K0.1's "the
note already carries the complete rule set" does not hold for #1 — every class was
re-derived. It also ships `<button href="#">`, which is invalid; it renders as an `<a>`.

🔑 **The star counter was the real decision, and the floor is `> 1`.** The note is a *"Star
on GitHub"* button with a hardcoded `6`. The live counts are **0,1,1,0,0,0,0**. Juan's first
rule was `> 0`; on seeing that the only two non-zero repos sit at exactly **1** — which on a
portfolio reads as self-starred — he moved it to **`> 1`** (`STAR_FLOOR` in the generated
file). ⇒ **the counter renders nowhere today**, and the markup stays dormant until a
repository clears the bar. ⭐ It also retired the `allprice` wrap: without the 59px star
group that button is back to 186px and its row fits again.

- ⛔ **The count is a committed cache, never a build-time fetch.** `astro build` stays
  offline and deterministic; `scripts/github-stars.mjs` (`npm run stars:refresh`) is the
  only thing that talks to GitHub, and it writes `src/data/github-stars.ts` with the date
  it ran. A number that goes stale is then a choice, not an accident.
- ⭐ **The script is also the store's consistency gate** — and it is the *only* one, by
  construction: the build cannot catch a `sourceCode: true` record whose link is not a repo,
  precisely because K4 forbids it from looking at the URL. The script exits **1** and names
  the record. Proven against a deliberately broken record, not assumed.

**Verified in `dist/`, not asserted:**

| Gate | Result |
|---|---|
| Pages carrying the control | **14** case-study + **2** homepage — exactly the 7 slugs × 2 locales |
| Star counter | **0 pages** — both non-zero repos sit at 1, under the `> 1` floor |
| a11y name | "1 star on GitHub" / "1 estrela no GitHub" — the numeral itself is `aria-hidden` |
| K0.4 tokens | **zero** colour literals in the shipped `.source-button` rules |
| K0.5 zero-JS | 0 islands on all 14 — control pages show **9**, so the gate can see |
| K0.6 reduced motion | branch shipped; the sweep is `display: none`, not a 1 ms flash |
| 27 non-repo links | unchanged — Figma files and archive snapshots keep the plain button |
| `npm run check` | 0 errors, 0 warnings, 0 hints · 116 pages |

⭐ **Two-leg mutation test on the source records** (⛔ never on `dist/`): flipping
`a-tua-vaga` — whose link is a **Figma** URL — to `sourceCode: true` made the control appear
*pointing at Figma*, and flipping `celus` off removed it despite its real repo link. Both
legs bite in opposite directions, which is what proves the URL genuinely has no say. Records
restored, rebuild re-verified.

⭐ **Seen in a browser, not just built** (the rung K2 was caught skipping). Measured on the
real element: same height as its sibling (**58px** both), tap target ≥44px, and the sweep
travels **48 → −160 across 56 distinct positions**, settling at ~1030 ms against the
declared 1000 ms. 🔴 The first sampling attempt reported "does not animate" — the 2.5 s
window closed before the hover landed. A dead read path, not a defect; the fix was a window
long enough to contain the event, recording `:hover` alongside the position.

**Responsive pass on `.brief__actions` (Juan, 2026-09-03) — case-study surface only:**

- **Centred below 1280px**, `flex-start` at ≥1280. The homepage card is untouched; it owns
  `.case-card__actions` and was re-measured to confirm nothing leaked.
- **Both actions fill the column below 768px** — primary *and* source. ⭐ The first pass
  filled only the source button, as asked, and the `syd` screenshot showed why that reads
  wrong: a narrow *"Live site"* pill above a full-width secondary **inverts the emphasis**.
  Juan's correction ("both mobile buttons are fill") went in. This covers the plain
  secondary too, so all 50 case-study pages behave the same.
- Written mobile-first, matching the file's `min-width` convention: fill in the base rule,
  `width: auto` in the 768px block. Boundaries proven at **767 → 768** and **1279 → 1280**,
  not assumed.

⏭️ **Knobs:** `STAR_FLOOR` (**1**, so the counter needs ≥2); `--sweep-duration`
(**1000ms**, upstream's); the ≥1280 breakpoint for the centre/left flip.

#### uiverse-3 — "View project" on the `/projects` cards ✅ 2026-09-03

- [x] `ProjectsIndex.tsx` gains the circle + arrow + label spans; `projects-index.css`
      replaces the flat `.pcard__cta` rule with the ported `learn-more` effect. **50 cards
      × 2 locales**, grid **and** list.
- [x] 🔑 **It is a `<span>`, never a button.** The card is already one
      `<a class="pcard__link">` wrapping media, title, rail and CTA, so a `<button>` or
      nested `<a>` here would be invalid content **and** a nested-interactive defect. Every
      new node is a span, the circle is `aria-hidden`, and the label keeps the meaning.
- [x] ⇒ the effect is driven from **`.pcard__link:hover`** (Juan's call: the tile is what
      people aim at, and it matches SpotlightCard/BorderGlow, which are already card-keyed).
      `:focus-visible` carries the same three rules, so keyboard gets parity.

⚠️ **It shares its element with uiverse-6.** The span renders
`hasCaseStudy ? caseStudy : caseStudySoon`, and **1 of 50** records (`agenda-geek`) has a
case study — so 49 cards read *"View project"* and one reads uiverse-6's *"Read the case
study"*, growing as J4 drafts prose. The effect is bound to the **element, not the label**:
a grid where one card animates differently is a defect. uiverse-6 remains the homepage
`ProjectCard` button, which is a genuinely different element.

⛔ **`width: 12rem` was dropped, and it had to be.** The note fixes the control at 192px;
PT's *"Ler o estudo de caso"* does not fit. The label sizes the control and the circle is
absolutely positioned over it. Enumerated the whole slot rather than the labels we expected:
**0 clipped** across 375/600/768/1024/1440 × EN/PT, narrowest control 244px.

⭐ **Colour roles are local custom properties, for Milestone L.** Juan asked that the future
light theme restore the note's *original* mapping rather than inherit this inverted one, so
`--cta-fill` / `--cta-mark` / `--cta-label` / `--cta-label-active` sit in one block with the
originals recorded beside them. ⛔ **Deliberately not shipped as a
`prefers-color-scheme: light` block** — there is no light palette yet, so that would fire on
light-preference visitors *today* against a dark-only page.

**Verified against the build, not the dev server:**

| Gate | Result |
|---|---|
| Cards carrying it | **50** per locale, 0 console errors |
| Animation | circle 40 → 319 across **24** positions, arrow 0 → 16 across 12, settling **445ms** vs 450 declared |
| Shaft materialises | `rgba(0,0,0,0)` → `rgb(12,14,18)` — the note's actual mechanism, not a lookalike: at rest only the chevron shows |
| Contrast | inverted label on cyan fill **9.85:1** (site's Rung-6 tightest is 4.75) |
| K0.4 tokens | zero colour literals in the shipped `.pcard__cta*` rules |
| K0.6 reduced motion | `--cta-duration: var(--motion-reduced)` — the fill stays, it just stops sweeping |
| K0.5 | untouched: this stylesheet loads **only** on `/projects/` + `/pt/projects/`, never on the homepage or the 100 case-study pages |

🔴 **Three defects found only by looking, all fixed:**

1. **The circle was an ellipse.** `height: 100%` of a text-sized box made it 40×54. The
   control now takes its height from `--cta-size` and the circle is square at rest.
2. **List view rendered a 1056px cyan bar.** `.pcard__body` is a flex column, so the CTA
   stretches to the card — which *is* the right look in a 260px grid tile and is absurd in a
   wide row. `align-self: flex-start` in the list block sizes it to its label (**168px**
   hovered). ⭐ Same reason the file already restricts SpotlightCard and BorderGlow to grid.
3. **The chevron sat right-of-centre** (Juan, on review). Measured **6.54px** off in a 40px
   circle, from two compounding offsets.

⭐ **Why the chevron was off, and why the note is off too.** A 45°-rotated square puts
**all** of its ink on the right half of its own box: the two arms end at the box centre and
the apex reaches `+S·√2/2`, so the ink centre is `+S·√2/4 ≈ 0.354·S`. The note then anchors
that box at `right: 0` of the shaft, whose right edge is past the circle centre — so the
error is the sum of the two. The note carries the same flaw (~2.5px in its 48px circle);
it is just less visible at that size. ⛔ **Not fixable by nudging `left`** — that treats one
symptom. Two declarations, each meaning exactly one thing:
`right: calc(S / -2)` centres the **box** on the shaft's right end, and
`translateX(calc(S * -0.354))` pulls it back so the **ink** centres there too. The shaft's
right end is itself pinned to the circle centre via
`left: calc(var(--cta-size) / 2 - var(--space-px-16))`.

⭐ **Measured, not eyeballed.** An instrument reading the real computed `::before` box and
simulating the rotation's ink extent reported **6.54 → 0.00px** from centre, confirmed at 8×
magnification against a centre line, and again in list view. ⛔ The instrument had to be
extended to add the new `translateX` from the computed matrix first — left as it was, it
would have read the pre-transform position and **passed a still-broken chevron**.
Hover clearance re-checked after the move: apex reaches 39.5px, the label starts at 54px.

🔴 **A dead read path nearly cost a false diagnosis.** `python3 -m http.server 4321` silently
failed to bind — **Astro's dev server already owned 4321** — so the first measurements came
from live dev output: 0 cards and `_jsxDEV is not a function`. The tell was that the error
also fired in `TypedHead.tsx`, a file this work never touched. ⛔ Serve `dist/` on a port the
toolchain does not use, and confirm what answered before trusting a failure.

#### uiverse-4 — Hero CTA ✅ 2026-09-03

- [x] **One label shipped: "Get in Touch" / "Entre em contato"** (Juan's call). The other
      two wordings stay parked in K8 until measurement exists. PT moved off *"Enviar
      e-mail"*, which presumed the channel the same way the retired EN *"Email me"* did.
- [x] `Hero.astro` gains a leading plane + a label span; the effect is a scoped `<style>`
      block, **not** a file in `src/styles/`. Unlike uiverse-1's 16 surfaces this control
      has exactly **one instance on the site**, so a site-wide stylesheet would be dead
      weight on every page that does not render it.
- [x] **Icon at 16px, not the note's 24px** — it matches the external-link mark on the
      LinkedIn button in the same row. Every transform in the note is `em`-based, so the
      effect scales down intact.

⛔ **Upstream's `translateX(5em)` is wrong for every label we ship, and copying it would
have failed silently.** The note clears its own 4-character *"Send"*; measured on the real
element, **"Get in Touch" is 125.7px and "Entre em contato" is 175.9px**, against 5em ≈ 90px.
The travel is re-derived from the element instead —
`calc(100% + var(--control-padding-inline) + var(--border-width-strong))` — where 100% carries
the label's left edge to where its right edge was and the padding+border covers the rest of
the way to the clip boundary. ⭐ The label's right edge measured **exactly 20px** from that
boundary, which is the 18px + 2px the formula adds. Same class of defect as uiverse-3's
`width: 12rem`, and the same fix: **derive from the box, never from the note's constant.**

🔑 **The label exit runs on `:hover` but deliberately NOT on `:focus-visible`** — a divergence
from uiverse-3's parity rule, and the reason is that this effect *hides the control's name*.
Hover is transient and self-cancelling; focus is **persistent**, so a keyboard user would be
parked on a button whose label they can no longer read. Focus gets the plane launch and the
ring; the label holds. Measured at **125.7px still readable** under `:focus-visible`.

⛔ **The effect is gated to `≥768px and (hover: hover) and (pointer: fine)`.** Below 768px
`.hero__actions .button` is `width: 100%`, the label sits centred with room to spare on the
right, and the derived travel — which only reaches the clip edge on a content-sized box —
would slide the text sideways instead of clipping it. Verified OFF at 390px.

⚠️ **The `aria-label` was rewritten, and it was a real conformance fix, not cosmetics.**
It read *"Send Juan Silva an email"* against a visible *"Email me"* — the accessible name did
not contain the visible label, a **WCAG 2.5.3 Label in Name (Level A)** failure that was
already live before this task and would have been made more obvious by the new wording. It
now reads *"Get in Touch, send Juan Silva an email"* / *"Entre em contato, envie um e-mail
para Juan Silva"*: the visible label is contained, and the mail channel is still disclosed to
screen readers even though the visible text no longer names it.

**Verified in a browser on `dist/`, not asserted:**

| Gate | Result |
|---|---|
| Row geometry | send **58px** / LinkedIn **58px**, tops level to <0.5px |
| Tap target | 58px ≥ 44 (52px at 390px, still ≥44) |
| Label exit, EN | 721 → 866.7 = **145.7px**, visible width 125.7 → **0** |
| Label exit, PT | *"Entre em contato"* 175.9px wide → visible **0** |
| Transition | `transitionrun` → `transitionend@300ms`, **19 distinct positions**, monotonic |
| Plane launch | `rotate(45°) scale(1.1) translateX(21.6px)`; bob oscillates **3.6px** |
| `:focus-visible` | label **holds** at 125.7px readable; plane launches; no bob |
| K0.4 tokens | **zero** colour literals in the shipped rules |
| K0.6 reduced motion | all transforms `none`, animation `none` — removed, not shortened |
| K0.5 zero-JS | homepage islands still **2**; no `client:` directive added |
| `npm run check` | 0 errors, 0 warnings, 0 hints · 116 pages |

🔴 **The first hover reading was a PRE-transition artefact and nearly shipped as proof.**
Sampling right after the hover call returned *1 distinct label position* — the 300ms
transition had already finished during the tool round-trip, so the endpoints looked right
while the travel itself was never observed. The fix was to arm a `transitionrun`/`transitionend`
sampler **before** moving the pointer. 🔴 A second reading was worse: a `:focus-visible` probe
reported the label flying out, which would have condemned the a11y branch as broken — the
mouse was still parked on the button from the previous step. The `isHovered` gate in the probe
is what caught it. ⛔ **Assert the state you think you are measuring, inside the measurement.**

🔴 **Corrected 2026-09-03 after Juan's review — two defects, one of them shipped blind.**

1. **The plane finished 44.2px LEFT of centre.** Upstream's `translateX(1.2em)` is tuned to
   its own 4-character *"Send"*; against these labels the glyph stopped short and, with the
   label gone, read as a half-finished animation. ⭐ **Second constant in this one note that
   does not survive a different label** — after the `5em` travel. The fix derives it: the
   travel moved from `transform` to **`left`** (so it composes with the bob, which owns
   `transform` on that element), and a flex item's percentage offsets resolve against the
   flex container's **content box** — which at `width: auto` *is* the content — so
   `calc(50% - (var(--send-plane-size) / 2))` lands the glyph's centre on the button's.
   Measured **0.0px offset in BOTH locales**, PT's wider button included, which is what
   proves it is label-independent.
2. 🔴 **`:focus-visible` overlapped the label by 20px** — the plane travelled while the label
   stayed. ⛔ **The original gate could not see it: it asserted the label's `transform` was
   `none` and never that the glyph had not collided with it.** Focus now takes the tilt and
   **no travel**; overlap **0**, clearance 1.6px on the bounding box (the rotated arrow's ink
   is well inside that — [[feedback_an_svg_text_bbox_is_not_where_the_glyphs_are]]).

⛔ **Both readings had to be taken on the `svg`, not the `.button__plane` wrapper.** The
launch transform sits on the child, so the wrapper's `getBoundingClientRect()` never moves —
the first probe read the wrapper and reported *centred* and *no overlap*, both false.

⭐ `--send-plane-size` now sizes the glyph **and** feeds the centring maths, so the rendered
size and the arithmetic cannot drift apart.

⏭️ **Knobs:** `--send-bob-duration` (**600ms**, upstream's); `--send-plane-size` (**16px** —
drives both the glyph and the centring); the 768px gate, which tracks `.hero__actions`'s own
`width: auto` breakpoint and must move with it.
#### uiverse-6 — Case-study CTA ✅ 2026-09-03 — **K4 CLOSED**

- [x] `ProjectCard.astro`'s secondary anchor becomes `.case-cta` — two arrows, a label span
      and the flood circle, styled in the component's scoped block. ⛔ Built from the note's
      **code**; its URL repeats uiverse-5's `loud-chicken-53` and points at a different
      component (K0.2), exactly as predicted.
- [x] **Accent `--primary`, dark label on the flood** (Juan's call). It rhymes with
      `.case-card:hover`, which already borders in `--primary`, so the control reads as part
      of that gesture rather than a second accent.
- [x] **Pill at rest → `--radius-control` on hover, ring kept** (Juan's call). Defensible on
      this card specifically: with no source-code action, this button is the only route into
      the project.

🔑 **It renders on ONE card, and that had to be checked rather than assumed.** The homepage
shows **3** featured records; `syd` and `upos` both carry `sourceCode`, so slot two is
uiverse-1's SourceCodeButton on those two and this control appears only on
**`psiativa-ai-operations`** — 1 card × 2 locales. Same shape as uiverse-1's star counter,
which also ships mostly dormant. It spreads on its own as records lose/gain a repo link.

⛔ **The note's 220px circle does not cover this button, and the failure is mobile-only.**
Below 768px the control is `width: 100%`: measured **290px wide, diagonal 294.6px**, so a
fixed 220px circle would leave the corners unflooded — while passing on desktop, where the
diagonal is 218.5px and 220px *just* covers. Re-derived as `width: 150%` with
`aspect-ratio: 1`, which exceeds the diagonal at every width and stays a circle rather than
an ellipse as it grows. Measured **310px vs 218.5** desktop and **429px vs 294.6** mobile.
⭐ Third upstream constant in this binder that only fits its own demo box.

⚠️ **The label was wrong on this surface, and fixing it was the honest half of the task.**
`ProjectCard` passed `copy.projects.caseFallback` — *"Read the case study"* — unconditionally,
while `/projects` renders `hasCaseStudy ? caseStudy : caseStudySoon` for the very same
record. `psiativa-ai-operations` has **`caseStudy: null`**, so the homepage promised prose
that does not exist and the two surfaces disagreed about one record. It now reuses the
index's own predicate and its two labels; both surfaces read **"View project" / "Ver o
projeto"**, verified on the rendered index, and both will flip to the case-study wording on
their own as J4 lands prose. ⛔ The near-duplicate `projects.caseFallback` key was **deleted
from both locales** — it had exactly one consumer, and leaving a second key holding the same
string is how the two surfaces drifted in the first place.

⭐ **Full `:focus-visible` parity here — deliberately the opposite of uiverse-4.** That
effect hides its label, so a persistent focus state could not carry it; this one only shifts
the label 12px and floods *behind* it, so uiverse-3's parity rule applies unchanged.

**Verified in a browser on `dist/`, not asserted:**

| Gate | Result |
|---|---|
| Rest | pill `9999px`, 2px `rgb(0,200,255)` ring, cyan label, 210.7 × **58px** |
| Hover | radius → **8px**, ring → `0 0 0 12px` transparent, label → `rgb(15,18,23)` |
| Arrow swap | out `16px → -51.7px`, in `-51.7px → 16px` |
| Flood coverage | **310px vs 218.5** desktop · **429px vs 294.6** mobile — covers both |
| Contrast, rest | **9.24:1** — cyan ink on `rgb(19,22,27)`, measured from pixels. PASS AA |
| Contrast, flooded | **9.57:1** — `rgb(15,18,23)` ink on `rgb(0,200,255)`. PASS AA |
| `:focus-visible` | full parity, label readable, 2px ring intact |
| Tap target | 58px desktop · 52px at 390px — both ≥44 |
| K0.6 reduced motion | travel removed (arrows parked, label unshifted); flood kept as an instant colour change |
| Label agreement | homepage **"View project"** = `/projects` **"View project"** |
| `npm run check` | 0 errors, 0 warnings, 0 hints · 116 pages |

⏭️ **Knobs:** `--case-accent` / `--case-ink-active` (the Milestone L swap points);
`--case-duration` (**800ms**) and `--case-ring-duration` (**600ms**, upstream's);
`--case-arrow-size` / `--case-arrow-inset` / `--case-shift`; `--case-ease`, the note's own
`cubic-bezier(0.23, 1, 0.32, 1)` — kept as a local knob because no easing token matches it
and K0.4 governs colour, not motion.

#### K4.6 — Action-row primary, the consistency pass ✅ 2026-09-04

Juan's follow-up to uiverse-6: *"fix the main button of the featured card as well, to keep
its consistency with View project."* K4 stays closed — this is the swap's consequence, not a
fifth binder item.

🔑 **The mismatch was hierarchy, not just shape.** The primary was a grey
`--surface-interactive` fill while the new secondary carried `--primary` cyan — so the
**secondary outshouted the primary**. Shipped: the primary is now the **filled twin** of the
outlined `.case-cta` — cyan fill, `--background` ink, `--radius-pill` — and on hover it
inverts to the outline and takes the same pill → `--radius-control` morph, so hovering either
half of the pair speaks one motion language.

⛔ **The primary is ONE element across three cards, and only one of them has the cyan
secondary.** `syd` and `upos` pair it with uiverse-1's SourceCodeButton, so restyling the
primary alone would have traded card 3's mismatch for a new one on cards 1–2. Juan's call:
**SourceCodeButton moves to `--radius-pill` too** — radius only, the shine sweep and the
`STAR_FLOOR` logic untouched — so all three rows share one shape while colour keeps the
meaning (cyan = the two "go look at it" actions, dark = source).

⭐ **Shared stylesheet, not a scoped block — the opposite call from uiverse-4/6, on purpose.**
Those have one instance each; this renders on the homepage cards **and** all 100 case-study
pages (`.brief__actions`), so it lives in `src/styles/action-row.css` and is imported by both.
Copying it into two components is the exact two-copies-drift that had one surface saying
*"Read the case study"* while the other said *"View project"* about the same record.

⛔ **Scoped to the action rows, never to `.button`.** The hero uses the same class; Juan's
call was cards + case-study rows only. The selector is
`.case-card__actions .button:not(.button--secondary)` — the `:not()` matters because the
secondary carries `.button` too, so a bare descendant selector would have restyled the very
control this was meant to pair with.

🔴 **Filling the button broke its icon, invisibly.** The external-link mark was an `<img>`
carrying a hard-coded `stroke="#CECFD2"` — **~1.4:1 on the cyan fill**, i.e. gone. `<img>`
cannot see `currentColor`, so it was **inlined** as an SVG with `stroke="currentColor"` and
now inverts with the label. ⚠️ Only ProjectCard's copy was inlined; `Hero.astro` still uses
the `<img>` and is deliberately unchanged.

**Verified in a browser on `dist/`, not asserted:**

| Gate | Result |
|---|---|
| All 3 card rows | primary + secondary both `9999px`, both **58px**, tops level <0.5px |
| Primary rest | `rgb(0,200,255)` fill, `rgb(15,18,23)` ink |
| Primary hover | radius → **8px**, background transparent, label + border `--primary` |
| Contrast, filled | **9.57:1** on all three — card 3, card 1, and the case-study row. PASS AA |
| Case-study page | same pill, same fill, **58px** — homepage and `/projects/<slug>/` agree |
| 390px | primary and secondary both **290 × 52**, equal width, stacked, ≥44 tap target, 0 overflow |
| K0.6 reduced motion | `transition: none`; the inversion still applies as a state change |
| Hero untouched | still `8px` / `rgba(255,255,255,0.1)` / `rgb(247,247,247)` |
| `/projects` index | 0 action rows present — `action-row.css` cannot reach `.pcard` |
| `npm run check` | 0 errors, 0 warnings, 0 hints · 116 pages |

⏭️ **Knobs:** the fill/ink pair is `--primary` / `--background` inline in `action-row.css` —
**a third Milestone L swap point**, alongside `--li-flood` and `--case-accent`.

#### K4.5 — LinkedIn control (hero) ✅ 2026-09-03

Not a binder item — Juan supplied an `adamgiebl` uiverse component mid-session for the hero's
secondary action. Logged here because it is the same class of work as K4: an existing-control
swap on an element the binder already touches.

- [x] `Hero.astro`'s LinkedIn anchor gains a leading LinkedIn glyph and a label span; the
      flood is a scoped `<style>` block beside uiverse-4's, same one-instance reasoning.
- [x] **Glyph leads, external mark trails** (Juan's call). The note ships neither, but the
      link carries `target="_blank"`, which makes the trailing mark a usability obligation
      rather than decoration. Structure now mirrors the primary CTA's leading icon.
- [x] **Geometry follows `.button`, not the note.** The note is a 25px pill at `5px 15px`
      padding, which renders ~30px tall and would break the row; shipped at
      `--radius-control` 8px and **58px**, level with the primary CTA (Juan's call).

🔑 **The flood is NEUTRAL, and brand blue is deferred to Milestone L — Juan's call, with a
measurement behind it.** `rgb(0, 119, 181)` is LinkedIn's own blue and it **fails AA as rest
text on this site: 3.85:1** against `--background`. It is not rescuable by tinting either —
lightening it to clear 4.5:1 at rest drops white-on-fill to 3.88:1, so **no single blue serves
both states** on a dark surface. It becomes usable only against the light surface Milestone L
introduces. Shipped instead: `--surface-interactive-hover`, the grey `.button--secondary`
already fades to, so the secondary action never outshouts the primary CTA beside it.

⭐ **Colour roles are local custom properties with the originals recorded beside them** —
`--li-flood`, and the note's brand blue in the comment on the same line. ⛔ Deliberately **not**
shipped as a `prefers-color-scheme: light` block: there is no light palette yet, so that would
fire on light-preference visitors today against a dark-only page. Exactly uiverse-3's shape.

⛔ **The note's `z-index: -1` was not ported.** A negative index escapes the button entirely
unless something happens to form a stacking context, which would paint the flood behind the
hero instead of behind the label. Shipped as `::before { z-index: 0 }` with
`.button--linkedin > * { z-index: 1 }`, which has no such dependency.

⚠️ **`.button--secondary:hover`'s flat fill had to be neutralised** or it would paint over the
sweep and make the effect invisible. The scoped attribute selector Astro adds outranks the
global rule, so `background: var(--color-transparent)` on hover is what lets the circle do the
work. ⚠️ The note also ships `className="bi bi-twitter"` on a LinkedIn glyph — a copy-paste
artefact, dropped. Third binder-style defect after K0.2's wrong URL and uiverse-1's
`<button href>`.

**Verified in a browser on `dist/`, not asserted:**

| Gate | Result |
|---|---|
| Row geometry | **58px**, 8px radius, tops level with the primary CTA |
| Flood sweep | `box-shadow@500ms`, **20 distinct spreads**, 0 → 180px, monotonic |
| Flood coverage | final `inset 0 0 0 180px` = half the 20em circle ⇒ **85.6% of pixels** |
| Contrast, flooded | **5.44:1** — measured from rendered pixels, ink `rgb(206,207,210)` on `rgb(75,77,81)`. PASS AA |
| K0.6 reduced motion | `::before` `display: none`; falls back to the flat `.button--secondary` fill |
| Structure | glyph `aria-hidden`, label, external mark — in that order, both locales |
| K0.5 zero-JS | homepage islands still **2** |

🔴 **The first contrast number was produced by a dead instrument and it PASSED.** The probe
parsed `--li-flood`'s resolved value `#ffffff40` with a `[\d.]+` regex, got `["40"]`, failed a
length check, silently fell back to the page background and reported **12.04:1** — a real
number, for the rest state, presented as the flooded state. The correct **5.44:1** came from
decoding an element screenshot and sampling actual pixels. ⛔ **A contrast probe that cannot
parse its own colour reports the background it defaulted to, not the one under the text.**

⏭️ **Knobs:** `--li-flood` (the Milestone L swap point); `--li-flood-duration` (**500ms**,
upstream's); `--li-flood-size` / `--li-flood-offset` (**20em / -5em**, upstream's — the offset
is what makes the sweep read as arriving from the left). ⏭️ The rest state is unchanged and
still borderless; adding the note's outline is a one-line change if Juan wants more presence.

### K5 — New controls (uiverse 2, 5, 9, 10) — 🟢 **CLOSED 2026-09-07.** 9 shipped 09-05 · 5 + 10 shipped 09-06 · **2 shipped 09-07**

- [x] **uiverse-2 — Download resume.** ✅ **SHIPPED 2026-09-07**, both halves: the résumé
      itself and the control that serves it.
      🔴 **The gate was far wider than "§5's attribution flags."** `master-cv.md` opened with
      ⛔ *"THIS IS NOT A CV YET. DO NOT CITE, SEND, OR COPY FROM IT"* — it is a **demand spec**,
      a slot list of what claims would need backing, not claims. There was nothing to render.
      Closing it took an interview across Slots 0–6, not a §5 patch. What it surfaced:
      - 🔴 **Slot 0 pointed the CV at a DEAD domain.** `juansilva.is-a.dev` answers HTTP 200
        over an empty Apache `Index of /` (MEMORY.md, since 2026-08-04). **A résumé that prints
        a dead portfolio link fails at the exact moment it is being checked.** Now
        `juanpablosilva.com.br`, plus a real contact block.
      - 🔴🔴 **`projects/shipd-resume/` claimed a degree Juan does not hold** — *"Bachelor's
        Degree in Digital Design, 2021"*, when he **left Anhembi Morumbi in January 2022**.
        Same class as the Fulbright error the LinkedIn pass already caught, on a harder
        credential. Five more defects beside it (two retired Spaceapps dates, a Sagitta level
        inflation, the dead URL, the do-not-render Cambridge cert). Sent to Olympus for
        **personhood verification, not credential evaluation**, so the exposure is narrow —
        but it was the workspace's only résumé artifact and therefore the default thing any
        future pass would copy. All six corrected in source; ⚠️ **its `.pdf`/`.docx`/`.html`
        renders are still stale.**
      - ⭐ **That same file carried the best evidence in the workspace, unrecorded:** six
        merged PRs into repos Juan does not own. **Verified 6/6 against the GitHub API** —
        +4.936 / −254 across 79 files, incl. **`grab/cursor-talk-to-figma-mcp` (6.994★,
        org-owned)**. It is now Slot 6 and its own section on the résumé: the only evidence
        judged by someone other than Juan, and the only answer to *"sole author on 28 repos"*,
        which otherwise reads as **never code-reviewed**.
      - ⛔ **Two URL traps caught before they reached the PDF.** `syd.app.br` is the SYD
        product app (118 screens, Thiago's) and `katinvestimentos.com.br` is KAT's marketing
        site — Juan's KAT work was the **internal** account manager. Either one on a résumé
        claims work that is not his. ⭐ Conversely `sydapp.com.br` was re-probed and is **back
        up** (200, 375 KB, real title), discharging the record's own *"(recheck)"*.
      **📄 The résumé** — `resume/juan-silva-resume.html` → **`public/juan-silva-resume.pdf`**
      (A4, 2 pages, 78.710 B) via `knowledge/skills/html-to-pdf/`. First render **split the
      open-source table across the page break** and wrapped the contact line; fixed with
      `break-inside: avoid` and a two-line contact block, re-rendered. **Verified on the
      extracted PDF text, not by eye:** ⛔ absent — `syd.app.br` · `katinvestimentos` ·
      `is-a.dev` · `Bachelor` · `graduated` · `Cambridge` · `20h` · `full-stack` ·
      `full-scale`; ✅ present — `sydapp.com.br` · `15h/week` · `100+ projects` ·
      `left in January 2022` · `Mar 2025 – Sep 2025`.
      **🎛️ The control** — new **`src/components/ResumeButton.astro`** (scoped `<style>`),
      third in `.hero__actions` after the email CTA and the LinkedIn control.
      ⛔ **The note ships `<div className="button">`; a download is a LINK.** A div is not
      focusable, not keyboard-activatable and carries no `download` semantics. Built as
      `<a href download>`, with the effect bound to `:hover` **and** `:focus-visible` —
      **measured identical on both paths** (icon `topRel` 44 → 14, tooltip visible, 2px ring).
      ⛔🔴 **`--width: 100px` deliberately NOT ported.** K4 settled that a fixed control width
      breaks PT. Width comes from `.resume__sizer`, an in-flow copy of the label, so each
      locale sizes its own box — **measured EN 174px vs PT 138px, from one rule.**
      ⭐ **Why a sizer and not just an in-flow label:** the animated layers must be
      full-button-height for `translateY(±100%)` to clear the box exactly; an in-flow label is
      only line-height tall and −100% would leave a **sliver of text showing**. The sizer holds
      the box, the layers do the motion.
      ⛔ **`overflow: hidden` is on `.resume__well`, NOT on `.resume`.** The tooltip is drawn
      with `.resume`'s pseudo-elements and an overflow on the same element **clips it away**.
      The note makes the same split; it is not incidental.
      ⛔ **`font-family` named explicitly** — uiverse-5 shipped a control that rendered in Lora
      because it named none, and there is no implicit UI font here. **Measured `Inter`.**
      ⚠️ **The tooltip is hover-only and never fires on touch**, so its two facts (format,
      weight) are repeated in `aria-label` — where a phone user and a screen reader get them.
      ✅ **Verified in `dist/` + Chromium:** control present on **both** homepages with both
      locale strings, `/juan-silva-resume.pdf` serves **200 `application/pdf` 78.710 B**, and
      **K0.5 holds — 100/100 case-study pages still report 0 `astro-island`, 0 external
      `<script src>`** (this control ships no JS at all).
      ⏭️ **Left open:** regenerate or delete the stale `shipd-resume` renders · write
      `sources/portfolio/opensource/` records · Banco Lucrativo's `What I did` · the optional
      university start year.
- [x] **uiverse-5 — Back to top on case-study pages.** ✅ **2026-09-06.** Built as
      specced: no island, `@supports (animation-timeline: scroll())` with an
      always-visible fallback, 50px tap target (≥44px, Rung 6). New
      **`src/components/BackToTop.astro`** (scoped `<style>`), wired into
      `[slug].astro` outside `<main>`; label `navigation.backToTop` in both locales.
      **Verified in `dist/` + Chrome 153:** on **100/100** case-study pages, which still
      report **0 `astro-island`, 0 external `.js`** — K0.5 holds. Reveal tracks the
      declared `animation-range: 240px 480px` exactly (scrollY 240 → 0.00, **360 → 0.50**,
      480+ → 1.00); click returns `scrollY` to 0; accessible name "Back to top" with the
      visible label and the SVG both `aria-hidden`. Reduced motion: animation `none`,
      control always visible.
      ⭐ **It targets `#main-content`, not a new `#top`.** That anchor already exists on
      every page as the skip-link target, so a second one would be a duplicate landmark.
      ⭐ **Icon is Lucide `arrow-big-up`** (Juan, 2026-09-06 — *"their svg does not exist
      anymore"*). The note carried a solid-filled **Font Awesome** `arrow-up` on a 384×512
      viewBox, whose source is gone and which brought CC BY attribution with it. Lucide is
      **ISC** — no attribution clause — and ships 24×24, `fill="none"`, 2px stroke, round
      caps, the same idiom as the site's Untitled UI set, so it sits beside them untuned.
      Path taken verbatim from upstream and independently confirmed against the copy Juan
      pasted — byte-identical. Rendered at 18px; measured `hasInk`, bbox ≈ x4 y3.41
      w16 h16.59, stroke following `currentColor`.
      *(An interim step used Untitled UI `arrow-narrow-up`, derived by rotating
      `arrow-narrow-right` −90°. Superseded by Juan's call; kept here only so the
      rotation trick is not rediscovered from scratch: (x,y) → (y, 24−x).)*
      ⛔🔴 **A hidden-but-in-flow label pushed the icon clean out of the button.**
      The label sat in the flex line at `opacity: 0` while keeping its full **75px** of
      width, so the line needed 18 + 8 + 75 = **101px inside a 50px circle**;
      `justify-content: center` split the 51px overflow evenly and `overflow: hidden`
      clipped the result. Measured **icon.left 1180 vs button.left 1206 — fully outside,
      42px off centre**: the resting control was an **empty circle on all 100 pages**.
      The note's `font-size: 0` existed precisely to keep the label out of layout; it was
      replaced with `opacity: 0` for a sound reason (font-size animation relayouts text
      per frame) but without replacing its layout effect. Fix = `position: absolute` on
      the label, which keeps both properties. Now measured `offCentreX 0, offCentreY 0`,
      `ICON_FULLY_INSIDE true`; on hover the pill goes 50→140px, the icon slides up 36px
      (−200%) and out **by design**, and the label fades in centred.
      ⛔🔴 **A UI control outside `<main>` inherits the SERIF body font.** The label
      set no `font-family`, and `body` sets `--font-body` = `"Lora", Georgia, serif` —
      this site's prose font is deliberately a serif — so "Back to top" rendered in Lora
      (Juan's screenshot, 2026-09-06). There is no implicit UI font to fall back to:
      every other control names `--font-ui` explicitly (`source-button.css:32`,
      `curved-loop.css:38`). Fixed by naming it. **Verified by comparison, not by
      assertion:** the same string in the label and in uiverse-1's `.source-button__label`
      now measure **90.13px, family Inter**, against prose at **90.28px, Spectral**.
      *(Aside: Inter is NOT among the page's `@font-face` faces — only Spectral and Lora
      are — so `--font-ui` resolves through to a local Inter or `system-ui`. That is
      site-wide pre-existing behaviour shared by every UI control, not this component's.)*
      ⭐ **Label centring is `inset: 0` + `place-items: center`, not `top/left: 50%` +
      translate.** The devtools reading Juan flagged — **top 25px, bottom 11px** — was the
      PRE-transform box (25 = 50% of 50px; 11 = 50 − 25 − 14), with the translate then
      correcting it, so the box was centred but a `line-height: 1` box was: the glyphs sat
      where the font metrics left them. Filling the button and centring the line box is
      the mechanism the flex container already uses for the icon, and it reads **top 0 /
      bottom 0** in devtools. **Measured on the glyph ink, not the box:**
      `inkTopGap 18 · inkBottomGap 18 · inkOffCentrePx 0`.
      ⚠️ **The lesson: "the colours and the size are right" is not "the user can see it."**
      The first verification pass measured ink, dimensions, contrast and behaviour, and
      passed all four, while the control was invisible. Nothing checked the icon's
      position *relative to its own button*.
      ⛔🔴 **NEVER put an `animation` shorthand in the same rule as `animation-timeline`.**
      The first build did, and **lightningcss merged them** into
      `animation: linear both btt-reveal scroll(root)`. `animation-timeline` is not a
      component of that shorthand, so **Chrome rejected the whole declaration** —
      computed `animation-name` came back `none`, and because the `@supports` block had
      already applied `opacity: 0; visibility: hidden`, **the button was invisible at
      every scroll position in Chrome** (measured at 0/400/1200/2317). The `@supports`
      guard cannot catch this: the *condition* parses, the *declaration inside* dies.
      Fix = longhands only (`animation-name` / `-timing-function` / `-fill-mode` /
      `-timeline` / `-range`). A probe through lightningcss confirmed the shorthand is
      merged in every arrangement, including declaring the timeline in a second rule.
#### uiverse-9 — Search on `/projects` ✅ 2026-09-05

- [x] `query` joins **`Filters`** in `src/lib/projects.ts`, so it flows through `matches`
      into `applyFilters` **and** `facetCounts` — the probes are built by spreading `f`, so
      the chip counts describe the searched set for free. Recommended reacts, zero-count
      chips disable, and `Clear filters` zeroes both halves.
- [x] `ProjectsIndex.tsx` holds the field in its own `draft` state and commits to `filters`
      on a **250ms debounce**. Both halves are load-bearing: typing must not wait on 12
      facet probes, and the `role="status"` count would otherwise read a tally *per
      keystroke*. `Clear filters` is counted off `draft`, so it appears on the first key,
      not 250ms in.
- [x] New copy in **both** locales (K0.7): `searchLegend` · `searchPlaceholder` ·
      `emptyQuery`. The empty state now branches — *"No projects carry that combination of
      evidence"* is simply wrong when the cause was a typo, so a query echoes itself back.

🔑 **Scope is title + tagline + stack — `role` was dropped, against the binder line.**
`role` is one **non-localised English** string that no `/projects` card prints (it renders
only on the case-study page, `[slug].astro:89`), so searching it would match PT cards on
words a PT visitor cannot see and has had no chance to read. `tagline` replaces it: it is
on every card. Matching is fold-then-AND — NFD-strip the accents, then every whitespace
token must be a substring — so PT **`gestao` finds `Gestão` (2 records, verified live)**,
`landing figma` crosses a title and a stack id (6), and whitespace-only never empties the
grid. ⛔ No record carries the `opensource` stack id today (histogram: figma 45, typescript
8, tailwind 8, javascript 2, python 1), so that path is reasoned, not measured.

⭐ **The note's `required` + `:not(:invalid)` was replaced by `:not(:placeholder-shown)`.**
That trick is how the component stays open once typed, and it works by declaring an empty
search box an **invalid required field** to assistive tech. The `:placeholder-shown` swap is
the identical "has content" test told truthfully — which makes the placeholder *structural*
here, never decoration. The note's own `<title>Search</title>` went with it: the control
sits in the same labelled `.tool` wrapper as Sort and View, so the visible legend already
names it and keeping both would announce it twice. Verified: `required` **false**,
accessible name **"Search" / "Buscar"** from the real `<label>`.

⛔ **44px, not the note's 40 — and the first port was a 46×44 ellipse.** Rung 6 sets the tap
floor. Setting only `padding-left` left Chromium's UA `padding: 1px 2px` on the right, and
under `border-box` a width smaller than its own padding **floors at the padding**: 44+2. The
icon sat 2px off centre. Fixed with the longhand `padding: 0 0 0 var(--search-size)`, right
padding restored only in the open state, where there is room. Now **44×44 exactly**, icon
concentric.

⛔ **The toolbar's row mode moved 768 → 1024, and it had to.** Search is the **fourth**
control in `.tools`, which is `flex: 0 0 auto` — every pixel it takes comes out of the chips
beside it, the flexible half. Measured at 768 with the field open: the stack column was
crushed to **68px** and its labels clipped mid-word (*"Tailwin"*, *"TypeSc"*, *"JavaScr"*).
1024 is an existing breakpoint (4 other uses), not a new one. Below it the two stack — the
layout phone width has always used. After: 768 gives the chips the full **672px in both
states, 0 clipped, 0 horizontal overflow**. This is K4.6's shape again — the swap's
consequence, not a new item. ⏭️ At 1024 the chip block still re-wraps 130px→182px while the
field opens; nothing clips, and 1280 is motionless (84px→84px).

**Rung 5 — seen** at 360 / 768 / 1024 / 1280, EN **and** PT, open and closed.
**Rung 6 — measured:** collapsed **44×44**, open 200px ending at x=216 of 360 ·
`document.scrollWidth === innerWidth` at every width · focus ring proven by a **real Tab
press** (lands on `.search__input`, `:focus-visible` true, `2px solid rgb(44,214,255)` =
`--focus-ring`, and **`border-radius` stays 9999px** — the reason it got its own rule instead
of joining the shared focus group, which forces `--radius-sm` and would square the pill) ·
**no note hex survived** (`#191A1E` / `#0e0e0e` / `#5f5e5e` / `rgb(95 94 94)`: 0 hits in
`dist/_astro/*.css`; the built shadow resolves to `--background-deep` + `--color-white-a10`) ·
AA on every new pair — typed text **11.64:1**, placeholder **6.19:1**, icon at rest
**6.19:1**, icon active **9.24:1**, legend **6.40:1** ·
reduced-motion **asserted under emulation, not just declared**: 0.3s → **0.001s**, and the
field still reaches 200px, because the width *is* the open/closed state and removing it
would make the two identical.

**JS budget:** no new island — the field lives inside the `ProjectsIndex` island that
already existed. `dist/` re-measured: case-study pages and `/contact` still hydrate
**nothing** (0 `astro-island`, 0 `_astro/*.js`), so K0.5 holds.

- [x] **uiverse-10 — Loading page + the DVD corner hit.** ✅ **SHIPPED 2026-09-06.**
      New **`src/components/Splash.astro`** + an `is:inline` arming script in the
      homepage's `head` slot. **Homepage only** (Juan's call, from the measurement below),
      so the 100 island-free case studies gain nothing and K0.5 holds — verified: the
      splash markup appears on `dist/index.html` + `dist/pt/index.html` and **nowhere
      else**, and no case study carries the script.
      ⭐ **Gate is `localStorage`, not `sessionStorage` — "first load EVER"** (Juan,
      2026-09-06: *"only appears in the first loading ever"*). A returning visitor has a
      warm cache and no gap left to cover. Dismissed on the real `load` event, never a
      timer; a 6s JS timeout and a pure-CSS `splash-failsafe` animation sit behind it so
      no failure can strand a visitor behind the overlay. **Fail-safe direction is "no
      splash"**: the element is CSS-hidden by default and only the head script's
      `data-splash` attribute reveals it, so a throwing `localStorage` (private mode
      throws on *access*), a script error, or JS-off all yield the plain page.
      **Verified in Chrome 153:** first visit → armed then `data-splash="done"` with the
      storage flag set; second visit → **never armed**; H1 paints underneath throughout;
      `z-index` 60 vs navbar 50.
      ⛔ **The bounce animations are gated on `[data-splash="on"]`.** Declared bare, they
      kept running forever on the hidden splash on **every later visit** — infinite
      compositor work on the heaviest page, in a feature justified as *performance*.
      Caught by measurement (a second visit still reported `splash-x` active), not review.
      ⭐ **The corner hit is derived, not tuned, and holds at any viewport.** Each axis
      gets its own `alternate` animation crossing exactly its own span, so
      `vx/vy = (W-w)/(H-h)` is just the ratio of the two durations — 1.2s (x) and 1.8s
      (y). **Measured at 1280×720** (spans 1060 × 671), driving both axes to exact times:
      **t=0 → (0,0) CORNER · 1200 → right wall only · 1800 → bottom wall only · 2400 →
      left wall only · 3600 → (1060,0) CORNER · 7200 → (0,0) CORNER** — i.e. every
      lcm(1.2, 1.8) = 3.6s, as derived. Both axes share one `startTime` (delta 0ms),
      which is the precondition for any of it.
      ⚠️ **On a fast first load the splash is gone well before 3.6s, so most visitors
      will never see a corner hit.** That is the honest outcome this task predicted, not
      a defect — the alternative is holding the cover up longer than the load needs.
      ⭐ **Mark is `logo-full.svg` masked, not an `<img>`** (Juan's call): a single
      white-filled `<path>`, no rects or gradients, so `mask` + `background-color` gives
      the wordmark silhouette in **`--primary` → `--secondary`**. The note's `DVD` /
      `FWDJC` text and its red/blue/green/yellow/purple rainbow are gone — the handle was
      the uiverse author's, and the rainbow is exactly what K0.4 forbids.
      Reduced motion: no bounce at all — the mark sits static and centred (measured at
      the exact viewport centre, 530×335).
      ORIGINAL NOTE — ✅ **Resolved (Juan,
      2026-09-03): a first-load splash.** It covers the gap before the site finishes
      loading, so a visitor sees something deliberate instead of leaving early.
      ⚠️ **Then it is a performance feature and must be measured as one** — a splash that
      outlives the load makes the site *feel* slower, not faster. Gate it on the real
      first-paint window, dismiss it the moment the page is ready (never on a fixed
      timer), show it only on a first visit (`sessionStorage`), and never let it block the
      H1 from painting. If the page is already fast, the honest outcome is that the splash
      barely appears.
      The corner-hit half is a solved geometry problem: a DVD bouncer only reaches a
      corner when its horizontal and vertical travels are commensurable, i.e.
      `vx / vy = (W - w) / (H - h)` up to an integer ratio. Derive the velocity from the
      measured box rather than tuning it by eye, and it hits the corner every cycle.

### K6 — `/projects` sort dropdown (uiverse-8) ✅ **SHIPPED 2026-09-07** — the panel came back, and it turned out to be the LOW-risk path

- [x] ⭐ **The 09-03 de-risking call was reversed on evidence, and the heading's "highest
      a11y risk" with it.** That call was *"keep the native `<select>`, take only
      `loud-puma-8`'s visual properties"* — *"It does not make any difference."* It made a
      large one. Reading the note showed **roughly half its CSS (its lines 94–177) is the
      submenu**: a panel that fades and slides in, whose four items each carry their own
      sweep. The trigger alone is half a component, and this file already said so —
      *"if the reference's open panel is the point of the design, that is the moment to
      reconsider."* It was.
- [x] ⛔ **A legacy `<select>` genuinely cannot carry it — MEASURED, not asserted.** With
      the picker **open**, an `<option>`'s `getBoundingClientRect()` is **0×0**: it is
      never a CSS box at all, so per-item sweeps there are *structurally impossible*, not
      merely inconsistent across browsers. ⛔ The first probe "confirmed" a legacy
      `option::before` painting at 50×10 — a **phantom**. `getComputedStyle(el, '::before')`
      resolves whether or not a box is ever generated; both modes returned identical
      numbers, which was the tell. **Layout geometry is the instrument; computed style is
      not.**
- [x] ✅ **`appearance: base-select` gets the panel back without giving up the element.**
      Measured in Chrome 153: the same `<option>` lays out at **197×24**, `display: flex`,
      a `::before` genuinely paints (**24px → 80px** tall), and `background-size` animates
      to 100% on a real hover. Roving focus, Home/End/Escape, type-ahead, outside-click and
      the mobile OS picker all survive **because the element is still a `<select>`** — so
      this is the *low*-a11y-risk path, and strictly better than the hand-rolled listbox
      that was the alternative.
- [x] ⛔ **Support is Chrome/Edge 135+ and Safari 27+, NOT Firefox** (behind a flag through
      158) — caniuse global **71.56%**. Everything is inside `@supports (appearance:
      base-select)`, so Firefox keeps exactly the control it has today: styled trigger,
      OS-drawn panel, fully working. That fallback is the whole reason the markup did not
      change.
- [x] ⛔ **Zero markup change — no `<button><selectedcontent>` child was added.** The picker
      works without one (verified: the select's `innerHTML` is still just its two
      `<option>`s and no button is generated), which keeps the **HTML parser** out of it —
      a `<button>` inside a `<select>` is dropped by parsers predating the feature, and
      `ProjectsIndex` is **SSR'd into `dist/`**. The port is CSS only.
- [x] **Ported to tokens (K0.4).** `#0a3cff` → `--primary`; the label flips to
      `--background`, **not** the note's `#ffffff` — white on cyan-400 fails AA, and
      dark-on-cyan is the exact pair `action-row.css` already ships on the case-card CTAs.
      The note's `scaleX` + `transform-origin` flip survives as a `background-size` ramp
      with a `background-position` pair (`right` at rest, `left` while lit, untransitioned)
      so the fill still retracts from the side it did not enter. **0 note hex in `dist/`**
      (`0a3cff`, `cccccc`: 0 hits); the only `#ffffff` in the file is inside the comment
      explaining why it was rejected.
- [x] ⭐ **The chevron rotates on `:open`, not on hover.** The note rotates on
      `.item:hover`, but on a control that opens on *click* a flipped chevron would be
      claiming something untrue. `::picker-icon` + `:open` says what the rotation means.
- [x] 🔴 **`:focus-visible`, NOT `:focus` — and Rung 5 is what caught it.** The note is
      **hover-only** (every effect hangs off `.item:hover`), so a keyboard user gets none
      of it; uiverse-3's parity rule says each `:hover` needs a twin. A `:focus` twin
      **lit both options at once**: opening with the mouse moves DOM focus to the *checked*
      option while the pointer sits on the other, and the panel rendered as **one solid
      cyan block** with nothing to distinguish the option under the cursor. Measured both
      ways — mouse-open gives the checked option `focus=true` but **`focus-visible=false`**,
      while arrowing gives the moved-to option **`focus-visible=true`**. So
      `:focus-visible` is precisely the "the keyboard is driving" test. After the fix:
      **exactly 1 option lit in each mode**, mouse and keyboard renders identical.
- [x] 🔴 **Split out of the shared focus group — a second defect only a real Tab press
      found.** That group sets `border-radius: var(--radius-sm)` on the element it rings,
      which snapped this control **8px → 4px for exactly as long as it was focused**. Same
      class of defect as uiverse-9's search pill, and fixed the same way: its own focus
      rule, same outline, no radius. Fixed **outside `@supports`** — Firefox had the
      identical wobble today.

**Rung 5 — seen** at 360 / 768 / 1280, EN **and** PT, closed and open, mouse-driven and
keyboard-driven.
**Rung 6 — measured:** trigger **46px** (48 at 1280) and each option **46px**, both over the
44px floor · `scrollWidth - innerWidth === 0` at every width in both locales · focus ring
proven by a **real Tab press** (`2px solid rgb(44,214,255)` = `--focus-ring`, and
`border-radius` now **holds at 8px** focused *and* resting) · AA on every re-coloured pair —
swept option label **9.57:1**, resting option **11.64:1**, committed option **9.24:1**,
chevron at rest **6.19:1**, chevron hot **9.24:1** · reduced motion **asserted under
emulation, not just declared**: 0.3s → **0.001s** across trigger, options *and*
`::picker-icon`, and the picker **still opens and still sweeps** — the risk there is
`allow-discrete` at 1ms, so it was checked rather than assumed.
**Still sorts:** driven by keyboard only (focus → Enter → ArrowDown → Enter), the value went
`evidence` → `recent`, the grid reordered, and `:checked` followed. PT reads
*"Evidência mais forte" / "Mais recentes"* under legend *"Ordenar"* — no new strings, so
K0.7 was already satisfied.

**JS budget (K0.5): zero change — the port is pure CSS.** Re-measured on `dist/`: the **100
case-study pages carry 0 `astro-island` and 0 `_astro/*.js`**, `/contact` likewise (its
Turnstile is third-party), and `/projects` still has the one pre-existing `ProjectsIndex`
island. ⛔ **The first instrument under-reported and was thrown out**: a
`src=`-attribute regex found **0** JS on the homepage, which demonstrably loads
`_astro/HeroHeadline.*.js` — Astro emits these as dynamic imports inside inline module
scripts, not `src=` attributes. The literal `/_astro/*.js` scan was validated against that
known-good page *before* its case-study result was believed.

⏭️ **Not deployed.** Per K7, deploy is a separate explicit step.

### K7 — Gates before this milestone closes ✅ verified 2026-09-07, deploy held for go-ahead

- [x] `npm run check` green — **0 errors, 0 warnings, 0 hints** (`astro check`, 57 files),
      worker tsc clean, `astro build` **116 pages**.
- [x] **Rung 5 — seen in a browser**, against the fresh `dist/` on a local preview server:
      `/` and `/projects/` at 360 / 768 / 1280 (EN), `/pt/projects/` at 1280, `/404` —
      all clean, zero horizontal overflow, zero console errors. **Combined-interaction
      check**, the thing a per-item pass cannot catch: switched `/projects` to List view,
      changed Sort to "Most recent", and pressed the TypeScript stack chip **all three at
      once** — count recalculated to 8, chip/button pressed-states and evidence counts all
      correct, zero console errors. Per-effect Rung 5 (all six page types, both locales,
      mouse *and* keyboard) already stands individually recorded under K1–K6, K9, K10.
- [x] **Rung 6 — measured**, consolidating the per-control evidence already recorded under
      K1–K6, K9, K10 (AA contrast ratios, real-Tab-press focus rings, 0 overflow at 360px,
      ≥44px targets, 0 hard-coded hex, reduced-motion branches) rather than re-deriving it.
      🔴 One defect this pass caught that no contrast/overflow/focus measurement
      could have — see the Analytics fix below.
- [x] JS budget re-measured against the fresh `dist/`, per page type, with a strict token
      scan (`astro-island` literal + a clean `_astro/[name].[hash].js` token). ⛔ A looser
      substring scan (`_astro/.*\.js`) was tried first and **false-positived on 49 of 50
      case-study pages** — `.*` bridged from an unrelated `_astro/*.css` reference all the
      way to the literal `.js` inside the page's own Google Tag Manager snippet, on the
      same minified line. Thrown out once the mechanism was seen; the strict token scan is
      what the numbers below are from.
      | Page type | astro-island | first-party JS |
      |---|---|---|
      | `/`, `/pt/` | 1 | `HeroHeadline` + `CurvedLoop` + client runtime |
      | `/projects/`, `/pt/projects/` | 1 | `ProjectsIndex` + `TypedHead` + client runtime |
      | `/404` | 2 | `FuzzyText` + client runtime |
      | `/contact/`, `/pt/contact/` | 0 | 0 (third-party Turnstile only) |
      | 100 case-study pages (50 EN + 50 PT) | 0 | 0 — all 100 individually confirmed |
- [x] Corrected the stale J2 "island scoping" line (above, J2 section) — it now states `/`
      and `/404` hydrate, `/contact` and all 100 case studies still ship zero first-party JS.
- [x] 🔴 **Found and fixed during Rung 5 — outside K's own scope, but shipping in the same
      build this deploy would publish.** `src/components/Analytics.astro`'s GTM snippet
      called its IIFE with **4 arguments, not 5**:
      `(window,document,'dataLayer',gtmId)` against a `function(w,d,s,l,i)` signature.
      Missing the `'script'` literal shifts every parameter down one slot, so
      `d.getElementsByTagName(s)` searched for `<dataLayer>` elements — not a real tag —
      got an empty collection, and `f.parentNode.insertBefore(...)` threw
      `TypeError: Cannot read properties of undefined (reading 'parentNode')` on **every**
      page load. GTM has never actually loaded in production. Invisible to `astro
      check`/tsc — a runtime bug inside a template string — surfaced only by Rung 5's real
      browser console. Fixed by adding the missing `'script'` argument; rebuilt, reloaded,
      **zero console errors**. ⚠️ **Separate and NOT fixed — a data gap, not a bug**:
      `PUBLIC_GOOGLE_TAG_ID=AW-` in `.env` / `.env.deploy` is an incomplete Google Ads
      conversion ID. It doesn't throw (`gtag('config', 'AW-')` is silently accepted), so
      the console check couldn't catch it either — but Ads conversion tracking is
      presumably inert. Juan's call whether to fill in the real ID or drop the line.
- [x] ✅ **Deployed 2026-09-07T18:28:54Z**, Juan's explicit go-ahead given after reviewing
      the `npm run deploy:check` dry run. `npm run deploy` (FTP mirror to
      `juanpablosilva.com.br`'s cPanel docroot): **261/261 files uploaded**, 4 stale files
      deleted (2 orphaned hashed build artifacts + `assets/icons/{javascript,typescript}.svg`,
      confirmed zero remaining references in `dist/` before the run — K10 inlined those two
      instead of file-referencing them). **Verified by public URL, not by the script's own
      claim** — `Last-Modified` moved on both apex and `www`
      (`Sat, 15 Aug 2026 22:31:46 GMT` → `Mon, 07 Sep 2026 18:28:54 GMT`), plus all 12
      post-deploy checks (CSP, security headers, contact form both locales, Turnstile,
      `og-image.jpg` → 200, missing-page → 404, zero `is-a.dev`). The Analytics GTM fix
      confirmed live by direct curl: `https://juanpablosilva.com.br/` now serves
      `(window,document,'script','dataLayer','GTM-KL3Q3MGN')` — 5 arguments, matching the
      fix, not the broken 4-argument call this deploy replaced.
      ⚠️ **Noted, not blocking:** the FTP connection runs `CPANEL_FTP_TLS=false`
      (pre-existing config — this host advertises FTPS then refuses every AUTH scheme, per
      `deploy.mjs`'s own comments) — the password crosses the network in cleartext on every
      deploy. And `PUBLIC_GOOGLE_TAG_ID=AW-` is still an incomplete Google Ads ID — Juan's
      call whether to fill it in or drop it.

### K8 — Logged, not built

- [ ] Hero CTA **A/B test** (`uiverse-4`). ✅ **Label settled 2026-09-03 — "Get in Touch"
      shipped**; *"Reach out via email"* and *"Reach Out"* stay parked here.
      ⛔ **The site ships no analytics of any kind** —
      no gtag, Plausible, Umami, PostHog or CF Insights — so a variant split today would
      produce no data. Juan's call 2026-09-03: **pick one label now, A/B when measurement
      exists.** Gated on an analytics decision, which is its own task.


### K9 — Off-binder: the `/projects` view toggle (uiverse-11) ✅ 2026-09-07

Not a binder note — Juan supplied `uiverse.io/Javierrocadev/bright-catfish-97` directly on
2026-09-07, the way K4 took the off-binder LinkedIn swap. Every K0 constraint still applies.

- [x] **The two buttons were kept, not the note's checkbox.** The note is one `<label>`
      around an `sr-only` checkbox. The whole port is CSS either way — the knob is a
      pseudo-element on the track in both constructions — so the checkbox bought no pixels
      and cost the reading: a switch announces *"on/off"* for a choice between two peers,
      where the pair announces *"Grid, pressed" / "List, not pressed"* and each half takes
      focus. Juan's call, asked before building.
- [x] **`data-view` on the track moves the knob** — not the note's `peer-checked:`, and not
      a `:has()` on the pressed button. It is the same attribute `.grid` and every `.pcard`
      already carry for this state, and it keeps the CSS ignorant of which child is which.
      ⛔ The codebase contains **no `:has()` anywhere**; this did not become the first.
- [x] **lucide `layout-grid` / `layout-list`, inlined** — upstream geometry verbatim,
      **fetched from the lucide repo rather than written from memory**. No `lucide-react`:
      an icon dependency for two glyphs is the same re-platform K0.3 refused for Tailwind.
      The two icons share their left-hand rects, so only the right half switches.
- [x] **No new copy, so K0.7 was already satisfied.** `viewGrid` / `viewList` stop being
      visible labels and become the accessible names inside `.visually-hidden`. Verified in
      `dist/pt/projects/index.html`: **"Grade" / "Lista"**.
- [x] **Reduced-motion branch** (K0.6). The knob's travel *is* the selection, so it drops to
      `--motion-reduced` instead of being removed — same reading as the search field beside
      it. Measured under `prefers-reduced-motion: reduce`: **0.001s**, still landing at
      `translateX(48px)`. The hover `scale(.95)` goes with it, which is the decorative half.

⭐ **The palette was inverted after the first build, on Juan's call.** It shipped cyan-track
/ near-black-knob first — faithful to the note's filled track, but a solid `--primary` pill
outweighed everything else in the toolbar. Inverted, the track wears the same `--surface`
+ 1px `--border-default` as the `<select>` beside it and cyan is spent only on the 40px
knob, so **the accent marks the selection rather than the control**. The ring is an inset
`box-shadow`, not a `border`, so the box model stays exactly 96 × 48 and the knob arithmetic
needs no second set of numbers.

⛔ **The `.tool__select` comment was WRONG, and is corrected in place.** It claimed
`min-height: 46px` made the select 46px "to match the toggle beside it". Measured in the
browser, the select rendered **48px** — the floor is a minimum, and a `<select>`'s intrinsic
content clears it — so the old reasoning bought a 2px misalignment instead of curing one.

- [x] **All three tools levelled, on Juan's call after the swap shipped.** They carried
      three different heights — search 44, select 48 (unintentionally), toggle 46 — and
      `align-items: flex-end` hid it at the bottom edge while exposing it at the top, so
      the three legends sat on three lines. **`--tool-h: 48px` on `.tools` is now the row's
      single height**, and each control derives from it: the select **states** 48 instead of
      inheriting whatever the UA gives a `<select>` at this font size, `--search-size` takes
      it (a bigger tap target as a side effect), and the toggle is `--tool-h` tall by two
      wide — which is also the note's own 2:1. The search icon's padding became
      `calc((size - 20px) / 2)` so its **glyph stays 20px, identical to the toggle's**;
      a fixed 12px would have grown it to 24 at the new size.
      **Measured at 768 / 1280 / 1440: all three heights 48, all three tops equal, all three
      legends on one line.** At 360 the toggle wraps to its own line — normal `flex-wrap`,
      and Search and Sort still agree.
      ⚠️ The `.chip` filter rows are a separate rhythm at `min-height: 44px` and were
      deliberately left alone.

⭐ **`--toggle-h` aliases `--tool-h` with a fallback, once.** Every number in the toggle
derives from that one value, so a reparented toggle would resolve five invalid values at
once — and an invalid `translateX` computes to `none`, i.e. a knob that silently stops
moving rather than a visible break. `.search` already aliased its size the same way.

⛔ **A comment claiming var() in `transform` breaks transitions was left contradicting the
code, and is fixed.** The hover rules are written out per state, and the note explaining why
read as a blanket ban — but `translateX(var(--toggle-h))` sits two rules above it. Measured
mid-flight, the knob **does** interpolate through it: 0 → 5.4 → 27.6 → 40.9 → 46.5 → 48px
across the 300ms. The real distinction, now stated: `--toggle-h` is a **constant**, so it
substitutes once and the two endpoints are genuinely different values. A var that changed
*per state* would leave the endpoints differing only by substitution, which is the case
engines have historically failed to interpolate.

⛔ **`.toggle__btn` left the shared `:focus-visible` group**, for the reason the select and
the search pill left it: the group sets `--radius-sm` and `outline-offset: 3px`, which
squares off the pill and pushes the ring off the track — and the toggle's old
`overflow: hidden` was clipping that ring anyway. It is now inset (`-4px`) at the pill
radius, and the colour flips with the state because one pairing does not read (cyan-300
over the cyan knob). Measured: **10.51:1** unpressed (cyan-300 on the surface track) and
**9.57:1** pressed (near-black on the knob). Glyphs: **6.19:1** and **9.57:1**.

🔑 **Rungs 5–6, measured against `dist/` on `localhost:4400`, 2026-09-07:** the knob is a
true 40px circle, concentric with both 48 × 48 targets (centres at 24 and 72) · 0 horizontal
overflow at 360px · `npm run check` green — `astro check` **0 errors, 0 warnings, 0 hints**
across 57 files, worker tsc, 116 pages built · the 100 case-study pages still hydrate
nothing, so **K0.5 holds**. ⚠️ **Not deployed** — `npm run deploy` is a separate, explicit
step, per K7.

---

### K10 — Off-binder: stack marks in the `/projects` filter chips ✅ 2026-09-07

Not a binder note — Juan asked directly on 2026-09-07 to reuse the case-study stack icons in the
`/projects` chips, then to reorder and trim the evidence row. Every K0 constraint still applies.

- [x] **The icon map moved to `src/lib/stack.ts`.** `StackBadge.astro` and the chips could not
      share before for one reason: a React island cannot import an Astro component. The paths
      now have one home and both surfaces read it.
- [x] **The pressed chip knocks the mark back to a dark silhouette**, the same inversion the
      label already does — Tailwind's cyan and TypeScript's blue both dissolve into `--primary`
      otherwise. Masking the icon's own alpha and painting `--background` through it.
- [x] ⛔ **Except a mark that IS a filled tile.** TypeScript and JavaScript are a full-bleed
      brand square with the glyph in *white paint, not a hole*, so an alpha mask resolves the
      whole square and returns a featureless block. Luminance masking does not rescue it — the
      tile bleeds ~35 % on TS, and the polarity is inverted on JS (black glyph, bright tile), so
      no single recipe serves both. Those two are **inlined** instead, which puts the `fill`
      under CSS control; the first `<path>` becomes `var(--stack-tile)` and the rest
      `var(--stack-glyph)`, **by position, not by colour**.
- [x] ⛔🔴 **The Figma clip-path wrapper is stripped before inlining.** Its `clipPath` is a rect
      the size of the viewBox — it clips nothing — but the id is baked in, so inlining twice per
      chip put `clip0_23114_5` and `clip0_23114_40` in the document **twice each**. Duplicate ids
      are invalid and `url(#id)` binds to the first; it rendered correctly only because the clip
      is a no-op. Now 0 `clipPath` in the document.
- [x] **A 24 px themed export was rejected on measurement, not taste** — 3 paths, identical node
      counts, every coordinate exactly 2× the 12 px file to within 0.00005. Same artwork, only
      the fills differ, so it bought no precision at the 16 px rendered. The import points at the
      **tracked** `typescript.svg` / `javascript.svg`; four redundant files were deleted.
- [x] **Evidence row reordered and trimmed** to `Product stack · Designed and coded · Design file
      · Source code`. `storeListing` (1 record of 50) and `liveSite` (21 of 50) are **commented
      out, not deleted** — Juan's call, redundant or too low in qty; re-enabling is one line.
- [x] 🔑 **`SIGNAL_FILTER_FACETS` is separate from `SIGNAL_FACETS` on purpose.** The canonical
      list still draws every card's evidence rail *and* the Evidence row on each case-study page,
      so pruning it directly would have **hidden** signals from projects that carry them.
      Verified after the change: rails still render all six.
- [x] **Rung 6 — measured:** `npm run check` clean (0/0/0), 116 pages built · EN + PT rows both
      correct · 390 px no horizontal overflow, 44 px tap targets held · case-study badges
      unaffected · 0 `clipPath` ids in `dist/projects/index.html`.
- [ ] ⚠️ **Known duplication, not yet resolved:** the rest-state brand colours live in the `.svg`
      *and* in `.chip__icon[data-stack="…"]`. Re-export with a different brand blue and the CSS
      needs the same edit — nothing fails loudly.


## Milestone L — Light/dark theme toggle (uiverse-7) ✅ closed 2026-09-07

Split out of the binder by Juan's call on 2026-09-03, because it is **not a button swap**.
The historical scope below was closed on 2026-09-07.

At deferral, `design-system/tokens.css` defined **exactly one palette** — `--background:
var(--color-neutral-950)` and a neutral ramp built for a dark surface. There is **no
`prefers-color-scheme` block, no `data-theme` switching, and no light token set anywhere
in `src/` or `design-system/`** (the single `data-theme="dark"` at `Contact.astro:138` is
a local attribute, not a system). Shipping the `strong-squid-82` toggle therefore means:

- a second **semantic** token layer — every `--background`/`--surface`/`--text-*`/
  `--border-*`/gradient re-derived for light, not just inverted;
- a **contrast re-audit** across all 6 page types (Rung 6 measured AA, tightest currently
  4.75:1 — an inverted ramp will not inherit that);
- the **no-flash** problem: a static site needs a blocking inline script in `<head>` to
  apply the stored preference before first paint, on a site whose case-study pages
  currently ship zero JS;
- the decorative layers that assume a dark ground — `border-glow.css`, the cyan gradient
  rules, the translucent navbar, and every `rgb(255 255 255 / x%)` paint in the token file.

⛔ **Do not half-ship it.** A toggle that works on the homepage and breaks 100 case-study
pages is worse than no toggle. Scope it as its own milestone with its own gates.

### Delivered 2026-09-07

- [x] **Light is a semantic token layer, not an inversion.**
      `:root[data-theme="light"]` re-derives backgrounds, surfaces, text, borders, controls,
      selection, nav paints, project/LinkedIn CTA roles, and light-safe decorative treatments.
      Dark remains the server-safe fallback.
- [x] **`uiverse-7` is an accessible native control.** `ThemeToggle.astro` ports
      `Galahhad/strong-squid-82` without styled-components, preserves the source's sun/moon,
      clouds and stars, has EN/PT action labels, a 44px hit target, visible keyboard focus, and
      a reduced-motion branch. Choice persists under `jsd:theme`, follows the OS when unset,
      syncs cross-tab changes, and emits `themechange` for dependent UI.
- [x] **No theme flash.** The layout runs a blocking head script before generated stylesheets,
      applies the saved/system choice to `<html data-theme>`, and advertises `light dark` to
      native controls. The contact Turnstile widget explicitly re-renders on a theme change.
- [x] **Global coverage.** The navbar owns the control on every BaseLayout page; light handling
      covers the logo/footer art, translucent navigation, contact background, CTAs, search and
      project-card controls.
- [x] **Rung 6.** `npm run check` is green: Astro **0 errors, 0 warnings, 0 hints**, worker
      TypeScript clean, **116 pages** built. Live 320px checks covered home, project index,
      case study, contact, legal, contact card, PT home and 404 with no horizontal overflow.
      The light semantic text pairs measured **4.70:1 or higher** (the tightest is
      `--primary-ink` on the page ground).
