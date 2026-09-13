# Integrating the upOS loop into the case study

✅ **APPLIED 2026-09-13.** Sections 1–4 are in the source and verified by build. Section 5 is
partly blocked — see *Status* at the bottom. The original spec-only warning no longer applies.

## What exists

`motion/upos-lp-app-showcase/renders/out/`

| File | Role |
|---|---|
| `upos-lp-app-showcase.webm` | VP9 **Profile 1 / yuv444p**, CRF 24, BT.709 — primary |
| `upos-lp-app-showcase.mp4` | H.264 High / yuv420p, CRF 18, BT.709, faststart — fallback |
| `upos-lp-app-showcase.poster.webp` | frame 1; poster **and** the reduced-motion still |
| `upos-lp-app-showcase.poster.jpg` | poster fallback |

1798 frames @ 60fps = **29.967s**. ⛔ Not 1800: frames 1799–1800 duplicate frame 1, and encoding
them freezes the loop join for 8 frames (~133ms) once the head hold is counted.

## 1. The markup

⛔ **The `type` string must name the VP9 profile.** A bare `type="video/webm"` lets Safari claim
support by MIME, fail to decode Profile 1, and show nothing — the fallback never fires.

```html
<video autoplay muted loop playsinline preload="metadata"
       poster="…/upos-lp-app-showcase.poster.webp"
       width="1920" height="1080">
  <source src="…/upos-lp-app-showcase.webm" type='video/webm; codecs="vp09.01.41.08"'>
  <source src="…/upos-lp-app-showcase.mp4"  type='video/mp4;  codecs="avc1.640029"'>
</video>
```

⚠️ **UNVERIFIED: there is no Safari in this environment.** The Profile-1 fallback path is reasoned,
not tested. Check it on a real device before shipping — the failure mode is a blank box, not a
visibly broken video.

## 2. Reduced motion — CSS, no JS

`<source media>` is **not** honoured inside `<video>` (unlike inside `<picture>`), so the swap has to
be a display toggle over two elements. Zero JS, which keeps the case-study pages at `0 astro-island`.

```html
<div class="cs-loop">
  <video class="cs-loop__motion" …>…</video>
  <img class="cs-loop__still" src="…poster.webp" alt="…" width="1920" height="1080">
</div>
```
```css
.cs-loop__still { display: none; }
@media (prefers-reduced-motion: reduce) {
  .cs-loop__motion { display: none; }
  .cs-loop__still  { display: block; }
}
```
⛔ Give the `<video>` `preload="metadata"`, not `auto` — under reduced motion it is `display:none`
but still in the DOM, and `auto` would pull ~18 MB for something never shown.

## 3. The schema — two guards, both still closed

⛔ A Cloudflare **CORS policy does not affect this.** CORS is an HTTP response header governing
cross-origin *fetch*; these are build-time string validations that reject the URL before any request
is made — and a plain `<video src>` embed needs no CORS at all. The R2 URL currently **fails the
build**, not the browser.

| File | Line | Guard |
|---|---|---|
| `src/content.config.ts` | 79 | `src: z.string().startsWith("/", …)` |
| `_config/portfolio/schema.mjs` | 565 | `else if (!b.src.startsWith("/")) errors.push(…)` |

Both need a host-allowlist branch pinned to `cdn.juanpablosilva.com.br`.
⛔ **Not** the `URL.canParse` pattern used by `preview`/`liveHref` — that accepts a Notion signed URL
and re-opens the exact hole those error messages exist to close. Loosening a gate needs a known-bad
rerun: assert that a Notion-style signed URL still fails.

## 4. `caseStudy.blocks` has no video type

The storyboard assumed an animated WebP inside the existing `image` block. Moving to `<video>` means
`caseStudyBlockSchema` needs a new member — three paths (webm, mp4, poster) plus `alt`, and the same
host rule as above. This is the "three-file lockstep" the `<img>` route was originally chosen to
avoid; it is back on the table because `<video>` won on both performance and accessibility.

## 5. Order of operations

1. Upload the three delivery files to R2 under `juansilva.design/cases/upos/`.
2. Land the schema allowlist **and** the new block type. ⛔ Until both are in, the page cannot
   reference R2 — and `/dist` cannot be emptied, because the local path is what currently deploys.
3. Add the block to `_config/portfolio/records/upos.json`, re-run the exporter.
4. Replace `blocks[0]` — today `desktop-fullhd-dark-placeholder.svg`, captioned *"the landing page at
   desktop width"*. The caption now has to cover the page **and** the product, in `en` and `pt`.
5. Deploy (`npm run deploy`; there is no CI), then verify the video actually plays in production —
   ⛔ pushed is not published, and a 200 on the page says nothing about the media.


---

## Status after applying

### ✅ Done and verified

| Change | File | Proof |
|---|---|---|
| Host-pinned asset guard | `src/content.config.ts` (`isCaseAssetSrc`) | build refuses 3 known-bad URLs, permits the real one |
| Same guard + `video` case | `_config/portfolio/schema.mjs` | module loads; upos validates with 0 errors |
| `video` block renderer | `[slug].astro` | emitted HTML carries both profile-bearing `<source>` types |
| Reduced-motion CSS swap | `[slug].astro` | rule present in `dist/_astro/_slug_.*.css` |
| Block swapped in the record | `_config/portfolio/records/upos.json` | en + pt, replacing the dark placeholder |

**Known-bad rerun** — the gate was loosened, so refusal *and* permit were both proven:

| Case | Result |
|---|---|
| Notion signed S3 URL | ✅ refused |
| Lookalike host `cdn.juanpablosilva.com.br.evil.example` | ✅ refused |
| `http://` on the allowed host | ✅ refused |
| The real `https://cdn.juanpablosilva.com.br/…` | ✅ permitted, 118 pages built |

⭐ `astro-island` count on the case-study page is still **0** — the zero-JS invariant survived.

### 🔴 Blocked, and not mine to unblock

1. **The exporter cannot run.** `node export.mjs` aborts with 11 validation errors, **all on
   `rafa-brito`** — `showability: "internal"` and nine `status: "machine_verified"` fields. ⛔ This is
   **pre-existing**: with the committed schema it fails with *13* errors (the extra 2 being
   "unknown block type: video"), so the pipeline was already red. ⛔ Not fixed here — the blocking
   error is `attribution: must be status "confirmed"`, which is the exact claim the store exists to
   police. Fixing it is an attribution decision, not a code change.
   ⚠️ Because of this, `src/content/projects/upos.json` was written **by hand**. It was verified
   equal to `record.publish.caseStudy` (the exporter is a verbatim passthrough), so re-running the
   exporter once `rafa-brito` is fixed should be a **no-op for upos** — but the provenance banner in
   that file currently lies about how it was produced.

2. **The three delivery files are not on R2 yet.** The record points at
   `cdn.juanpablosilva.com.br/juansilva.design/cases/upos/…`. ⛔ The build passes regardless — the
   guard checks the *shape* of the URL, never that the object exists. Upload before deploying, or
   production serves a poster-less blank frame. ⭐ Nothing was copied into `public/`, so `dist/`
   stays clean by construction; the "remove it from /dist" step is already satisfied.

3. **Safari is still untested.** No Safari in this environment.
