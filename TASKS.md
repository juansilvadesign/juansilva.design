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

**Island scoping:** React hydrates on `/projects` **only** (~61 KB gz). The
homepage, `/contact`, and all 100 case-study pages ship **zero JS**.

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

### J4 — Next (not started)

- [ ] **Case-study prose** — `caseStudy` is `null` on all 50. Draft from the store per project via individual interviews; Juan reviews. ⛔ Never populate it from the store's `attribution`/`impact` prose — that is private and names third parties.
- [ ] **Phase 3 media** — motion via talk-to-figma-fork + AEUX + After Effects MCP, demo/walkthrough, hyperframes. 🔴 `/media-engine` is blocked on Juan issuing `RUNWAYML_API_SECRET`.
