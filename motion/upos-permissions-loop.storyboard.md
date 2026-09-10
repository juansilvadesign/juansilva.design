# Storyboard — upOS · "Permissions are a module" · 1920×1080 · 14.0s · 30fps (420f) · **silent, seamless loop**

> **Concept:** the obvious way to design for three roles is to draw three versions of every screen. upOS does the opposite — access is one declarative module. The loop shows the refutation, then the module.
> **CTA:** none. This is inline case-study media, not an ad. It ends where it began so it can run forever.
> **Claim carried:** exactly one — *permissions are a module, not three hardcoded screens*.

---

## Format decision (run BEFORE building — [[web-motion-delivery-decision]])

The pack's two-question gate, answered for this asset:

1. **Reacts to user input?** No — muted autoplay loop. → not Rive.
2. **Clean vector (UI)?** Yes, in principle → the gate says **Lottie**.
3. **Raster / blur / shadow / effects?** Yes, once graded. → **WebM**.

⛔ **Lottie is ruled out here for a reason outside the pack: it needs a runtime script, and every one of the 100 case-study pages ships zero first-party JS** (TASKS.md K0 #5 — `0 astro-island`, `0 _astro/*.js`). A Lottie player would be the first island on a case-study page. `<video autoplay muted loop playsinline poster>` is pure HTML and keeps that invariant intact. **WebM it is** — which is also what [[animating-ui-cards-for-web]] specifies for exactly this job.

**One considered deviation from the pack.** It says *"MP4 is not a web-delivery format here — no alpha, and it distorts dark colours."* That verdict is about **transparent** UI motion. This asset is **opaque** (it sits inside `.cs-figure`, which already paints a border and a surface), so alpha buys nothing and the dark-colour caveat is handled in the grade, not the container. Ship both sources, WebM first:

```html
<video autoplay muted loop playsinline preload="metadata"
       poster="/assets/cases/upos/permissions-loop.poster.webp"
       width="1920" height="1080">
  <source src="/assets/cases/upos/permissions-loop.webm" type="video/webm">
  <source src="/assets/cases/upos/permissions-loop.mp4"  type="video/mp4">
</video>
```

The MP4 is a **fallback source**, not the delivery format — Safari's VP9/WebM support is not something to bet a US client's first impression on. The `poster` **is** the "images as fallback" rule, built into the element.

⛔ **Opaque, dark, one version.** Not two theme variants: `<source media>` is not honoured for video, so a theme-switched video would need JS and break the invariant. Dark matches the existing `*-dark-placeholder.svg` practice across all 50 records.

---

## Scene 1 — The obvious way, refuted  (t: 0.0–3.6s · f0–108)

- **Beat:** you *could* draw three variants of all eight modules. Twenty-four screens, and every future change made three times.
- **Look:** cold wireframe ghosts on near-black; no colour yet. Pack: [[animating-ui-cards-for-web]] (Size-not-Scale on the cards).
- **Layout:**

```
┌──────────────────────────────────────────────┐
│                                              │
│   ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐           │
│   └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘  Admin    │
│   ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐           │
│   └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘  Técnico  │
│   ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐           │
│   └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘  Vendedor │
│                                              │
│              3 × 8                           │
└──────────────────────────────────────────────┘
```

- **Motion:** row 1 staggers in left→right (f6–f30, 2f offset per card). Rows 2 and 3 *duplicate downward* — the same row sliding into place twice more (f30–f66), so the eye reads "again, and again" rather than "three groups". `3 × 8` counts up on a Hold-keyframed `source text` as the cards land.
- **Camera:** slow 1.02× push on `S1_null_cam` — motion, not zoom.
- **Transition out:** the whole ghost grid loses opacity on a **luma matte wipe** travelling left→right (f90–108), so the grid doesn't fade uniformly — it gets *wiped away*, which reads as rejection rather than a crossfade. Principle 5 (mattes are the reveal primitive).

⛔ These three names are the **shipped** profiles (`Admin master · Técnico · Vendedor`). Never the discovery trio (`Cliente · Técnico · Vendedor`) — `Cliente` was never a system profile. The two lists differ by one name and reconciling them from memory is the documented trap in this record.
⛔ The 24 cards are **hypothetical and must read that way** — 25% opacity, 1px stroke, no fills, no real content. Nothing here may look like a screen that was designed.

---

## Scene 2 — One module instead  (t: 3.6–7.8s · f108–234)

- **Beat:** access lives in Configuration as its own module — a profiles table with named roles.
- **Look:** the real product surface arrives; first colour in the piece. Pack: [[animating-ui-cards-for-web]].
- **Layout:**

```
┌──────────────────────────────────────────────┐
│  Configurações › Permissões › Perfis         │
│  ┌────────────────────────────────────────┐  │
│  │ Perfis de usuários        [Novo perfil]│  │
│  ├────────────────────────────────────────┤  │
│  │ Admin master        1 usuário    Ativo │  │
│  │ Técnico             3 usuários   Ativo │  │
│  │ Vendedor           10 usuários  Inativo│  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

- **Motion:** the table card scales up from the wipe's trailing edge using **Size, not Scale** (keeps the border-radius and 1px stroke crisp — [[animating-ui-cards-for-web]]). Rows write on with a text animator, staggered 4f, opacity + 8px Y. The `Ativo/Inativo` pills pop last with a small overshoot (centred anchor).
- **Camera:** hold. After the ghost-grid motion, stillness is the contrast.
- **Transition out:** the table card slides up and out of frame top while Scene 3's matrix rises from below — one continuous vertical move, not a cut.

### ⛔ The residue hazard, and how this scene disposes of it

Frame `7-3.1` (`19142:36607`) **visibly renders Untitled UI placeholder residue**: the date `12/12/2025` three times, and `olivia@untitledui.com` node names. The audit flags it as still sitting in the shipped file.

**Do not export `7-3.1` as a flat image.** Rebuild the table in Figma as named **live-text** layers, per the manifest below. That kills the residue at the source *and* satisfies the "keep text LIVE, not outlined" rule that text animators need — the hazard fix and the motion requirement are the same action.

- ⛔ **The `Data da criação` column is dropped entirely.** It carries no part of the argument and it is the sole vector for the fake dates.
- ⛔ **No avatar cells, no email cells.** That is where `olivia@untitledui.com` lives.
- ✅ Keep: profile name, user count, status. Those three are the argument.

---

## Scene 3 — Roughly twenty-six permissions, eight areas  (t: 7.8–12.4s · f234–372)

- **Beat:** and a profile builder underneath it, so the shop can define a profile nobody anticipated.
- **Look:** the matrix — the densest, most "this was really designed" frame in the piece.
- **Layout:** source frame is **1280×2723**, far taller than 16:9, so the frame moves instead of shrinking.

```
┌──────────────────────────────────────────────┐
│  Nome do perfil. Ex.: técnico                │
│  ┌────────────────────────────────┬───┬───┐  │
│  │ Painel técnico                 │Ver│Ed.│  │
│  │   Visualizar agenda            │ ✓ │ ✓ │  │  ← camera travels
│  │   Editar orçamentos            │ ✓ │ ✓ │  │     down the groups
│  │ Assistência                    │   │   │  │
│  │   Lista de OS · Kanban de OS   │ ✓ │ ✓ │  │
│  │ Clientes · Financeiro · …      │ ✓ │ ✓ │  │
│  └────────────────────────────────┴───┴───┘  │
│                        ~26 · 8 áreas         │
└──────────────────────────────────────────────┘
```

- **Motion:** vertical camera travel down `UI733_matrix` (f234–f348), eased at **both** ends. Checkmarks tick on in a staggered cascade slightly *ahead* of the camera, drawn with **Trim Paths** on open stroke paths (never a fade — a check should draw). `~26` and `8 áreas` count up on Hold keyframes, landing f348.
- **Camera:** the travel *is* the camera — `S3_null_cam` Y position, F9 then shaped in the Graph Editor. Never linear (principle 2).
- **Transition out:** matrix continues up and out; the field returns to near-black for the seam.

⛔ **"roughly 26", never 28.** 28 rows render but only 26 are distinct — `Ver / Editar lista de OS` is duplicated under Assistência, most likely a design slip. **Build 26 distinct rows; do not reproduce the duplicate.** Never present it as evidence of a second surface.
⛔ No metric appears anywhere. None exists for this project — a *confirmed absence*, not an uncollected one.

---

## Scene 4 — Seam  (t: 12.4–14.0s · f372–420)

- **Beat:** none. This scene exists so the loop has no visible cut.
- **Motion:** everything is off-frame by f396. f396–420 holds the empty near-black field that Scene 1 opens on — **f420 must be pixel-identical to f0.**
- **Loop rule** ([[animating-ui-cards-for-web]]): symmetric curves — **max velocity at both cut keyframes, easing mirrored (1,90 / 90,1)**. The eye must not be able to find the join.
- ✅ **Verify by scrubbing across the seam**, not by watching the timeline end. Play f400→f020 as a continuous range.

---

## Asset manifest (design in Figma with THESE names)

Tiered, because screens recur and the source already numbers them — `7-3.1` → `UI731`, `7-3.3` → `UI733`. Dots stripped and never leading-digit: both break AE expressions that reference layers by name.

### Brand / library (design once, reuse)

| layer name | type | role | design note (encodes the principle) |
|---|---|---|---|
| `BRAND_bg_field` | shape | base field | full-frame near-black; own layer so the grade and vignette sit above it (P7) |
| `LIB_card_ghost` | component | the S1 wireframe card | 1px stroke, no fill, 25% opacity. **Centre the anchor** — it overshoot-scales (P2) |
| `LIB_check` | shape | the tick | **single OPEN path, not a filled glyph** — Trim Paths cannot draw a closed fill (P5) |
| `LIB_row_perm` | component | one matrix row | label + two check slots; live text |
| `LIB_pill_status` | component | Ativo / Inativo | centred anchor for the overshoot pop |

### Scene 1

| layer name | type | role | design note |
|---|---|---|---|
| `S1_bg` | shape | background | instance of `BRAND_bg_field`; separate layer for parallax (P4) |
| `S1_grid_row_admin` | group | 8 ghost cards | 8 × `LIB_card_ghost`, pre-comped so one null drives the row (P6) |
| `S1_grid_row_tecnico` | group | 8 ghost cards | duplicate of the above; **do not re-lay-out** — it must read as the same row again |
| `S1_grid_row_vendedor` | group | 8 ghost cards | ditto |
| `S1_txt_admin` | **live text** | row label | "Admin master" — ⛔ shipped profile name, never the discovery trio |
| `S1_txt_tecnico` | **live text** | row label | "Técnico" — accent must survive AEUX; check the font carries it |
| `S1_txt_vendedor` | **live text** | row label | "Vendedor" |
| `S1_txt_count` | **live text** | the `3 × 8` | keep LIVE — driven by `source text` + Hold keyframes (P3) |
| `S1_matte_wipe` | shape | the rejection wipe | sits **above** the three grid rows; luma-matte source. Its own layer, per P5 |
| `S1_null_cam` | null | camera parent | the 1.02× push parents here, never to a layer (P6) |

### Scene 2

| layer name | type | role | design note |
|---|---|---|---|
| `S2_card_table` | frame | the profiles card | ⛔ **rebuilt, not exported from `7-3.1`.** Animate **Size, not Scale**, to hold the radius + 1px stroke |
| `S2_txt_breadcrumb` | **live text** | `Configurações › Permissões › Perfis` | live |
| `S2_txt_title` | **live text** | "Perfis de usuários" | live |
| `S2_btn_novo_perfil` | group | the action button | centred anchor; lands last with a small overshoot |
| `S2_row_admin` | group | table row | name + count + status **only**. ⛔ No date cell, no avatar, no email |
| `S2_row_tecnico` | group | table row | ditto |
| `S2_row_vendedor` | group | table row | ditto — status is `Inativo`, which is real and worth keeping |
| `S2_pill_admin` / `S2_pill_tecnico` / `S2_pill_vendedor` | instance | status pills | `LIB_pill_status`; stagger 4f, do not pop in unison (P2) |
| `S2_null_card` | null | group parent | the whole card moves from this (P6) |

### Scene 3

| layer name | type | role | design note |
|---|---|---|---|
| `UI733_matrix` | frame | the permission matrix | the one **tall** asset (1280×2723 source). **26 distinct rows — omit the duplicated `Ver/Editar lista de OS`** |
| `UI733_group_painel` … `UI733_group_relatorios` | group ×8 | the 8 areas | one pre-comp per group so checks cascade per group, not as 26 unrelated layers (P6) |
| `S3_checks_cascade` | group | all tick paths | instances of `LIB_check`; Trim Paths `end` 0→100, staggered *ahead* of the camera |
| `S3_txt_placeholder` | **live text** | `Nome do perfil. Ex.: técnico` | real field placeholder from the file — keep verbatim |
| `S3_txt_count` | **live text** | `~26` | ⛔ the tilde is **not decoration** — 28 render, 26 are distinct |
| `S3_txt_areas` | **live text** | `8 áreas` | live |
| `S3_null_cam` | null | camera parent | the vertical travel lives here; F9 + Graph Editor, never linear (P2) |

### Scene 4 / global finish

| layer name | type | role | design note |
|---|---|---|---|
| `GLOBAL_adj_grade` | adjustment | colour grade | Curves S-curve + Tint to unify (P7). **Grade to Rec.709** |
| `GLOBAL_adj_vignette` | adjustment | vignette | steers the eye centre without moving anything (P7) |
| `GLOBAL_adj_noise` | adjustment | banding kill | 2–5% Noise **+ project at 16-bpc** — dark near-black fields band badly otherwise (P8) |

## Imports (not designable as vectors)

- **None.** Every asset is vector or live text by design — which is what lets Scene 2 dispose of the placeholder residue instead of retouching a raster.
- ⛔ Explicitly **not** imported: a flat PNG/JPG export of `7-3.1`. That is the one asset that would drag `12/12/2025` and `olivia@untitledui.com` into the render.

## Self-check (Phase 5)

- ✅ Every layer that moves has a unique, scene-prefixed name; no collisions across S1–S4.
- ✅ Every reveal has its own matte: `S1_matte_wipe`; Trim Paths on `S3_checks_cascade`.
- ✅ All animating text is LIVE, not outlined — required by the text animators *and* by the residue fix.
- ✅ Open paths where a stroke draws (`LIB_check`).
- ✅ Centred anchors flagged on everything that overshoots.
- ✅ f420 ≡ f0 for the seam.
- ⚠️ **Accents (`Técnico`, `áreas`, `Configurações`, `Assistência`) must be confirmed in the chosen font before AEUX export** — a missing glyph shows up in AE, not in Figma. Run `check_fonts` on the frame first.

## Handoff

1. Design in Figma using the manifest names — **rebuild `7-3.1` as live text; do not export it**.
2. Run `check_fonts` for the accented strings, then AEUX export → After Effects.
3. `motion-director` (imported-assets mode) with this manifest → the motion spec.
4. `motion-animator` builds it. ⛔ AE bridge panel must be open: `Window > mcp-bridge-auto.jsx`, "Auto-run commands" ticked, reopened after every AE restart.
5. Render QuickTime `.mov` → convert to **WebM** + an **MP4** fallback source + a `.webp` poster frame.
6. The `video` block type does not exist yet — see the three-file lockstep note in TASKS.md before the asset can land on the page.

---

## Built in Figma — 2026-09-10 (channel `zqdqgvsf`)

Page **`MOTION • upos-permissions-loop`** (`22009:2609`), created in `upOS - Antônio` as page 22 of 22.
⛔ **A new page, deliberately** — nothing was written into any of the 21 existing design pages.

**Scene 2 is built and visually verified. Scenes 1, 3 and 4 are NOT built** — storyboard only.

| layer | node id | notes |
|---|---|---|
| `S2_scene` | `22009:2610` | 1920×1080, fill `#0B0D0F` |
| `S2_card_table` | `22009:2611` | 1280 wide, VERTICAL auto-layout, HUG height, radius 16 |
| `S2_txt_breadcrumb` | `22009:2612` | `Configurações › Permissões › Perfis` |
| `S2_card_head` | `22009:2614` | HORIZONTAL, SPACE_BETWEEN |
| `S2_txt_title` | `22009:2615` | `Perfis de usuários` |
| `S2_btn_novo_perfil` | `22009:2616` | cyan `rgb(44,214,255)`, radius 10 |
| `S2_btn_novo_perfil_label` | `22009:2617` | `Novo perfil` |
| `S2_row_head` | `22009:2618` | header row, radius 8 |
| `S2_head_nome` / `S2_head_usuarios` / `S2_head_status` | `22009:2619` / `2620` / `2621` | ⛔ **no `Data da criação` column** |
| `S2_row_admin` | `22009:2622` | → `_nome` `2623` · `_count` `2624` · `S2_pill_admin` `2625` · label `2626` |
| `S2_row_tecnico` | `22009:2627` | → `_nome` `2628` · `_count` `2629` · `S2_pill_tecnico` `2630` · label `2631` |
| `S2_row_vendedor` | `22009:2632` | → `_nome` `2633` · `_count` `2634` · `S2_pill_vendedor` `2635` · label `2636` |

**Verified by export + inspection** (`22009:2611`, PNG @0.75 → 960×309): all three counts share a left edge ·
accents correct in `Configurações`, `Permissões`, `usuários`, `Técnico` · **`fontSubstituted: false` on every
one of the 11 text writes** · **zero residue**: no `12/12/2025`, no `olivia@untitledui.com`, and neither
English Untitled UI string.

### Notes for whoever continues this

- ⛔ **`set_layout_sizing` fails on TEXT nodes** — *"Node type TEXT does not support layout sizing"*. The
  equivalent is `set_text_style { textAutoResize: NONE }` **then** `resize_node`. The failed attempt cost
  nothing because `apply_batch` prevalidates and `onError:"stop"` wrote **zero** of its 14 operations —
  ⭐ prefer that over `"continue"` for any batch where a partial apply would be worse than none.
- ⚠️ **Name cells are still HUG**, so `SPACE_BETWEEN` positions each count box relative to its own row's name
  width. The counts align well enough to read, but if the video pushes in on the table, convert the three
  `_nome` cells to fixed-width cell FRAMES (text nodes cannot take `FILL`).
- ⚠️ **`apply_batch` takes `set_fill_color` as `{color:{r,g,b,a}}`**, not the standalone tool's flat `r,g,b,a`.
- **`create_text` refuses an unloadable font rather than substituting** — which is why the `check_fonts`
  preflight is load-bearing and not ceremony.

### Still open on this asset

1. **Scenes 1, 3, 4 not built.** Scene 3 needs the 26-row matrix — the largest remaining piece.
2. ⛔ **Encode weight is UNMEASURED and the storyboard's 14s / 30fps / 1920px is a GUESS.** The
   `one-click-video-downloader` precedent is **2.83 MB for 168 frames** (~5.6s); naïvely extrapolated a 14s
   loop is ~7 MB, which is far too heavy for a case-study page. Flat UI on near-black should compress much
   better than that screen recording, but **measure a real encode before locking duration/fps/width.**
   Levers, in order of cheapness: pixel width (it renders at ≤770px, so 1540 is ample — not 1920) → fps
   (24 or even 15 reads fine for UI motion) → duration.
3. ⛔ **`image.src` is locked to local paths in BOTH schemas**, so an R2 CDN URL is rejected today.
   The fix is **host-allowlisted** to `cdn.juanpablosilva.com.br` — ⛔ **not** the `URL.canParse` pattern used
   by `preview`/`liveHref`, which would accept a Notion signed URL and re-open the exact hole the guard's own
   error message exists to close. Loosening it needs a known-bad rerun proving a Notion URL still refuses.

---

## Encode measured — 2026-09-10 · ⛔ resolves open question #2 above

**Throwaway test built and rendered in AE 24.2.1x2.** Comp `S2_encode_test` 1536×864 · 30fps · 4.2s (126f) ·
Scene 2's card only (opacity 0→100, scale 92→100 then a slow 100→102 push, position rise) → lossless AVI
**501,656,080 bytes** → ffmpeg 6.1.1 `libwebp_anim`.

⚠️ **A static hold was deliberately avoided** — identical frames would have flattered the encode.

### Animated WebP (`<img>` delivery — the chosen path)

| config | 4.2s actual | KB/s | 14s projected |
|---|---:|---:|---:|
| 1536w 30fps q75 | 685 KB | 163.2 | ~2.2 MB |
| 1536w 24fps q75 | 558 KB | 132.9 | ~1.8 MB |
| 1024w 30fps q75 | 433 KB | 103.3 | ~1.4 MB |
| **1024w 24fps q75** | **348 KB** | **82.9** | **~1.1 MB** |
| 768w 30fps q75 | 267 KB | 63.6 | ~0.9 MB |
| 1024w 24fps q55 | 235 KB | 56.0 | ~0.8 MB |

⭐ **The ~7 MB fear from the `one-click-video-downloader` precedent was WRONG, and the reason matters:**
that 2.83 MB/168f asset is a **screen recording of video playback** — high entropy. Flat dark UI is low
entropy and lands **~3–6× cheaper**. ⛔ *Do not size an encode from a precedent whose CONTENT differs in
entropy; measure the actual material.*

⭐ **Size here is only weakly motion-dependent.** A worst-case proxy — a continuous full-frame pan standing in
for Scene 3's camera travel — cost **413 KB vs Scene 2's 348 KB, just 1.19×**. So the 14s projection is a
**stable estimate, not a floor**, and Scene 3 will not blow it up.

### What the `<img>` path costs, measured against `<video>`

| | 4.2s | 14s |
|---|---:|---:|
| WebP 1024w 24fps q75 | 348 KB | ~1.1 MB |
| **WebM/VP9 1024w 24fps crf32** | **117 KB** | **~0.4 MB** |
| WebP 1536w 30fps q75 | 685 KB | ~2.2 MB |
| WebM/VP9 1536w 30fps crf32 | 298 KB | ~1.0 MB |

**Animated WebP costs ~2.3–3× WebM's bytes for identical content.** That is the price of avoiding the
three-file `video` block lockstep — a real trade, not a free win. **Recommendation: 1024w · 24fps · q75**, and
trim the loop to ~10s (≈0.8 MB) since 10s is ample for an inline autoplay loop.

### ⛔ House-rule conflict the `<img>` path introduces

An animated WebP in a bare `<img>` **cannot honour `prefers-reduced-motion`** — CSS cannot stop it — and
K0 #6 requires a reduced-motion branch on every effect. Fix, still zero-JS:

```html
<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="/assets/cases/upos/permissions-loop.poster.webp">
  <img src="/assets/cases/upos/permissions-loop.webp" alt="…" width="1024" height="576" loading="lazy">
</picture>
```

⭐ **`media` on `<source>` IS honoured inside `<picture>` — unlike inside `<video>`**, which is exactly why the
theme-variant idea was rejected earlier in this file. Same attribute, opposite answer depending on the parent
element. A `<picture>` wrapper is a small renderer change that benefits every image block and is far cheaper
than a new block type.

## ⛔ AE bridge gotchas earned in this session

1. ⛔🔴 **`compIndex` is the PROJECT-PANEL index, not the comp id.** `create-composition` replied `"id": 1`,
   but after `import-footage` the footage sat at panel index **1** and the comp at **2**. Seven keyframes sent
   to `compIndex: 1` all returned *"Composition not found at index 1"*.
2. ⛔🔴 **Fire-and-forget hides per-command FAILURES.** Those seven were fired without polling; the bridge
   keeps **one** result file, so every failure was overwritten and unread, and the comp looked built.
   ⭐ The first diagnosis — "the bridge drops unread commands" — was **wrong**: the commands ran fine and
   *failed*, which is a different bug with a different fix. **Poll `get-results` after every mutation.**
3. ⛔ **`save-frame` can report failure AFTER succeeding.** Both probes returned *"saveFrameToPng reported no
   error but the output file was not created"* — and **both files existed**, written moments later. The
   existence check races AE's write. ⛔ *Check the artifact on disk before believing the error.*
4. ⚠️ **`get-layer-details` returns no transform or keyframe data**, so it cannot verify a keyframe landed.
   Verify by rendering two frames and comparing bytes: identical `29,255 / 29,255` proved the keyframes were
   absent; `7,210` (empty, opacity 0) vs `43,439` (card visible) proved they applied.
5. ✅ **A `render-video` tool now EXISTS** (AE 24.2.1x2, `Lossless` template → AVI). The recorded
   "MVP = build-only, human renders / no render tool exists yet" is **out of date**.

---

## Scene 3 built in Figma — 2026-09-10

`S3_scene` **22012:2637** (1920×1080) · `UI733_matrix` **22012:2638** — 1280×**1234**, VERTICAL auto-layout, HUG.
`S3_txt_placeholder` 22012:2639 · `S3_row_colhead` 22013:2736 (`Permissão | Ver | Editar`: 2737/2738/2739).
`LIB_check` master **22012:2640** — a single **open** path from SVG (`M2 10 L9 16.5 L24 2.5`, no fill), so
Trim Paths can draw it.

⚠️ **This is a REBUILD at 1280×1234, not a replica of the 1280×2723 source frame.** Tighter spacing and 13
rows carrying 26 permissions; the camera travel still works, but do not describe it as the source frame.

| group | node | rows (node · label · ck_ver · ck_ed) |
|---|---|---|
| `UI733_group_painel` | 22012:2642 | `agenda` 2644·2645·2646·2648 · `orcamentos` 22013:2706·2707·2708·2710 |
| `UI733_group_assistencia` | 22012:2650 | `lista_os` 2652·2653·2654·2656 · `agenda_os` 22013:2712·2713·2714·2716 · `kanban_os` 22013:2718·2719·2720·2722 |
| `UI733_group_clientes` | 22012:2658 | `lista_clientes` 2660·2661·2662·2664 · `kanban_clientes` 22013:2724·2725·2726·2728 |
| `UI733_group_financeiro` | 22013:2666 | `financeiro` 2668·2669·2670·2672 |
| `UI733_group_produtos` | 22013:2674 | `estoque` 2676·2677·2678·2680 · `pedido_pecas` 22013:2730·2731·2732·2734 |
| `UI733_group_servicos` | 22013:2682 | `servicos` 2684·2685·2686·2688 |
| `UI733_group_configuracoes` | 22013:2690 | `configuracoes` 2692·2693·2694·2696 |
| `UI733_group_relatorios` | 22013:2698 | `relatorios` 2700·2701·2702·2704 |

Rows are `UI733_row_<slug>`, labels `…_label`, checks `UI733_ck_<slug>_ver` / `_ed`.

**Verified by export + inspection** (1280×1234 → PNG @0.5): **13 rows · 26 checks · 8 groups** — matches the
audited "roughly 26 distinct" exactly, and the duplicated `Ver / Editar lista de OS` row **is not reproduced**.
All 8 accented headers correct; **`fontSubstituted: false` on all 60+ text writes**.

### Figma gotchas earned here

1. ⛔🔴 **A VERTICAL auto-layout frame created with a fixed `height` CLIPS its children.** All 8 groups were
   made at `height: 120` with `clipsContent: true`; the second row of every multi-row group rendered
   **sliced**, and the first export looked plausible enough to miss at a glance. `layoutSizingVertical: HUG`
   was set on the *matrix* but never on the *groups*. ⛔ *HUG is per-frame; setting it on the parent says
   nothing about the children.* Caught only by exporting and looking.
2. ⭐ **`clone_node` appends the clone as a SIBLING in the source's parent** — the 5 extra row clones all
   landed inside group A, not on the page. Convenient here, but it means a clone's parent is never the page
   unless the source was on the page.
3. ⭐ **`set_parent` accepts an `index` in `apply_batch`**, so it doubles as a reorder — that is how
   `S3_row_colhead` got from "appended last" to index 1.
4. ⭐ **Clone IDs are sequential and predictable, but verify once.** One `get_node_info` on a single clone
   established the child order (label · ck_ver · ck_ed), and one read of the whole matrix then supplied all
   67 IDs at once — cheaper and safer than guessing per clone.

## Remaining on this asset

- [ ] **Scene 1** — 24 ghost cards (`LIB_card_ghost` ×24 in 3 rows), 3 profile labels, `3 × 8` counter,
      `S1_matte_wipe`. Build by clone, same pattern as Scene 3.
- [ ] **Scene 4** — the seam; near-empty, cheapest.
- [ ] **AEUX export** — ⛔ **a human step.** AEUX is a Figma plugin with no MCP surface, so Juan runs it.
      The PNG-import path used for the encode test is NOT equivalent: it flattens live text, which kills the
      text animators and the `source text` counters the storyboard depends on.
- [ ] ⚠️ **AE animation cost, named before it is discovered:** the bridge needs
      `setLayerKeyframe` **+ a `get-results` poll per keyframe**, and the full piece is ~60–100 keyframes →
      **~150–200 MCP round trips**. Three ways out, Juan's call: grind it, have Juan key it by hand from this
      spec (fast for a designer), or add a predefined batch-keyframe script to the bridge (`run-script` only
      runs *predefined* scripts — arbitrary JSX cannot be sent).
- [ ] **Production encode** at 1920×1080 · 30fps · 14s, quality **above** q75 — measure the real bytes
      rather than trusting the 1536×864 pixel-scaling (~3.6 MB projected at q75).

---

## Scenes 1 & 4 built in Figma — 2026-09-10 · all four scenes now exist

| layer | node | notes |
|---|---|---|
| `S1_scene` | 22013:2740 | 1920×1080 |
| `S1_grid` | 22013:2741 | VERTICAL, HUG width, itemSpacing 24, at (404, 360) |
| `S1_grid_row_admin` | 22013:2742 | HORIZONTAL, HUG, itemSpacing 16 |
| `S1_card_admin_1..8` | 22013:2743–2750 | ghost cards, 110×72, 1px stroke @28% alpha, **no fill** |
| `S1_txt_admin` | 22013:2751 | `Admin master` |
| `S1_grid_row_tecnico` | 22013:2752 | `S1_card_tecnico_1..8` = 2753–2760 · `S1_txt_tecnico` 2761 |
| `S1_grid_row_vendedor` | 22013:2762 | `S1_card_vendedor_1..8` = 2763–2770 · `S1_txt_vendedor` 2771 |
| `S1_txt_count` | 22013:2772 | `3 × 8`, 56px |
| `S1_matte_wipe` | 22013:2773 | white 1920×1080, parked **off-frame left at x = −1920** — its wipe START position, so AE animates X rightward. ⛔ Do not "fix" it to 0,0: over the frame it just washes the scene out in Figma |
| `S4_scene_seam` | 22013:2774 | empty dark field; f420 must equal S1's f0 |

⚠️ **`S1_null_cam` / `S3_null_cam` are NOT in Figma** — Figma has no null objects. They are created in AE.
⚠️ **24 ghost cards are uniquely named** (`S1_card_<profile>_<n>`), not 24 × `LIB_card_ghost`. The manifest's
"8 × LIB_card_ghost" would have been a 24-way collision in AE.
✅ Labels are the **shipped** profiles — `Admin master · Técnico · Vendedor`, never the discovery trio.

### ⛔🔴 The positioning bug that silently emptied two scenes

Both Scene 1 and Scene 3 rendered as **an empty dark rectangle**, and the cause was **two different mistakes
that produce the identical symptom**:

1. ⛔ **`create_frame`'s `x`/`y` are RELATIVE TO THE PARENT when `parentId` is given.** `S1_grid` was created
   at `x: 4804` (page-style coords) inside a scene already at page 4400 → absolute **9204**, far outside a
   `clipsContent: true` frame.
2. ⛔ **`UI733_matrix` was created with NO `parentId` at all** — so it was a *page-level sibling* of
   `S3_scene`, never a child, and its `x` read back as absolute, which is what made cause #1 look like the
   explanation for both. The `set_parent` receipt settled it: on adoption the node reported
   **`x: -1880`** (page 320 − the scene's 2200), proving it had been outside the frame entirely.

⭐ **The lesson is about the instrument, not the coordinates:** exporting `UI733_matrix` **directly** showed a
perfect matrix, because exporting a node ignores its parent's clipping. Only exporting the **SCENE** revealed
that the scene was empty. ⛔ *Export the frame you will actually render, not the artwork you just built — a
node export cannot see the clip that will delete it.*

⚠️ Also: a HORIZONTAL auto-layout row at a **fixed** width clipped `Admin master` to `Admin ma:`. Same class
of bug as the Scene-3 group heights — `HUG` on 3 rows fixed it. ⛔ *A fixed-size auto-layout frame is a
crop, and `clipsContent` makes the crop invisible in the layer list.*

## State: Figma side is COMPLETE

All four scenes exist, are correctly parented and positioned, and every animatable element carries a unique,
AE-safe name. **Next step is AEUX — a human step, Juan runs the plugin.** Then the AE animation, whose
~150–200 round-trip cost is documented above.

---

## AEUX import VERIFIED in After Effects — 2026-09-10 (AE 24.2.1x2)

`listCompositions` returned **~95 comps**: all four scenes plus one comp per Figma frame (AEUX turns every
frame/group into its own comp). **Every unique name survived the round trip** — 24 `S1_card_*`, 26
`UI733_ck_*_ver/_ed`, 13 `UI733_row_*`, 8 `UI733_group_*`, all `S2_*`, and `UI733_matrix` at
**1280×1234 / 11 layers**. The naming discipline held end to end: Figma → AEUX → AE.

Scene comps: `S1_scene` (id 978, 4 layers) · `S2_scene` (27, 2) · `S3_scene` (212, 2) · `S4_scene_seam` (1404, 1).
⚠️ `S2_encode_test` (id 1, 1536×864, 30fps) is the throwaway from the encode test and is still in the project.

### ⭐ Both load-bearing capabilities PROVEN by direct probe, not inferred

1. ✅ **Shape paths survived.** `apply-trim-paths` on `UI733_ck_agenda_ver` layer 1 (named `Vector`) →
   *"Trim Paths applied"*. ⛔ A layer **named** `Vector` is not proof it is a shape layer — the capability
   probe is. The open-path decision is what makes the draw-on possible.
2. ✅ **Live text survived.** `add-text-animator` on `S2_txt_title` in `S2_card_head` → *"Text animator added"*.

⭐ **Together these retroactively justify the whole "rebuild `7-3.1` as live text, never export it flat"
call.** A flat PNG export would have made both impossible — the residue fix and the animation requirement
were the same decision.

### Three structural facts about the import

1. ⭐ **Everything came in at 60fps**, not the storyboard's 30. Given the standing "best quality, no
   size-driven compromises" rule (Juan, 2026-09-10) this is an **upgrade and is being kept**. Animated WebP
   handles 60fps (~16.67 ms frames); it roughly doubles bytes vs 30fps, which is accepted.
   ⛔ **Update the header of this file when the render lands: it says 30fps (420f); the asset is 60fps (840f).**
2. **Every comp is 5s.** Scene targets (3.6 / 4.2 / 4.6 / 1.6s) all fit, so animate in place and render the
   exact range with `render-video`'s `startTime` + `duration`. No comp-settings change needed.
3. ⛔🔴 **The bridge cannot nest an existing comp inside another comp.** `create-composition`, `precompose`
   and `import-footage` are the only structural tools, and none of them adds a comp as a layer. The 14s master
   timeline is therefore **a human step** — Juan built `MASTER_permissions_loop` (1920×1080 · 60fps · 14s,
   scenes at 0 / 3.6 / 7.8 / 12.4s) by hand. ⭐ Animation *inside* a scene comp carries through when nested,
   so scene-internal work does not wait on the master.

### ⛔ The API asymmetry that dictates the animation strategy

| takes `compName` | requires `compIndex` (project-panel index) |
|---|---|
| `apply-trim-paths` · `add-text-animator` · `set-keyframe-ease` · `apply-effect` · `get-layer-details` · `save-frame` · `render-video` | **`setLayerKeyframe`** · **`setLayerExpression`** |

⛔ **With ~95 comps this is a real obstacle**, and `listCompositions`' order is **not** the project item index
(folders and footage occupy indices too), so position-in-that-list cannot be used as `compIndex`.
⭐ Consequence: drive as much as possible through the **compName** tools (all 26 check draw-ons, every text
reveal), and reserve index-addressed keyframes/expressions for the few comps whose index is confirmed.
⭐ A safe way to *identify* an index: `setLayerExpression` with `expressionString: ""` removes an expression —
a harmless no-op whose receipt names the layer it resolved, which identifies the comp.

⚠️ **`getLayerInfo` silently IGNORES a `compName` parameter** and always reads the *active* comp — it returned
`S4_scene_seam` when asked for `UI733_ck_agenda_ver`. ⛔ *A predefined script that accepts a parameter object
is not the same as a script that reads it.* Use `get-layer-details` (which does honour `compName`).

### 🔴 Blocked here: bridge panel stopped responding

Two consecutive `bridge-status` probes failed (10s and 15s, `panelResponsive: false`) immediately after the
master comp was created — a modal dialog (e.g. Composition Settings) or a panel reopen will do this.
To restore: in AE open **Window > mcp-bridge-auto.jsx**, tick **Auto-run commands**, dismiss any open dialog.
⛔ It must be reopened after every AE restart.

**Applied so far (2 of ~100 animation steps):** Trim-Paths draw-on `0→100%` over 0.35s on
`UI733_ck_agenda_ver`; opacity text animator `S2_title_reveal` on `S2_txt_title` (start 0.2s, reveal 0.6s).
The remaining **25** check draw-ons and all scene motion are outstanding.

---

## Bridge restored + master comp INSPECTED — 2026-09-10

✅ Bridge back after an AE restart (`panelResponsive: true`, 2.1s). ⭐ **The project is now saved as
`upos-test.aep`** — `bridge-status` reports the project name, which is how you can tell a saved project from
an unsaved one before trusting that anything survived a restart. Everything did.

✅ `MASTER_permissions_loop` exists — id 1420, **14s · 60fps · 1920×1080**. Correct settings.

### ⛔🔴 But the master's CONTENT is wrong: 95 layers, not 4

`numLayers: 95`, every layer at `startTime: 0` — the whole project panel was dragged in at once.
Sampled: layer 1 = **`S1_scene_22013-2740.png`**, layer 2 = `S1_card_admin_1`.

⛔ **AEUX imports BOTH a comp AND a flattened PNG for every Figma frame, and the PNG is a silent trap.**
A master built on the `.png` items renders *nothing* we animated — no live text, no shape paths, so the text
animators and Trim-Paths draw-ons are simply absent from them. They look identical to the comps in the
viewer, which is what makes this dangerous.
⭐ **Telling them apart:** a comp is named exactly `S1_scene`; the raster carries the Figma node id and an
extension — `S1_scene_22013-2740.png`.

**Required content:** exactly **4 layers** — `S1_scene`, `S2_scene`, `S3_scene`, `S4_scene_seam` — at
**0 / 3.6 / 7.8 / 12.4s**.

⛔ **This cannot be fixed through the bridge, and the reason is worth recording:** there is **no delete-layer
tool**, and **`move-layer` reorders the STACK only, not time** (`front`/`back`/`before`/`after`/`toIndex` —
no time argument). Combined with the inability to nest a comp, the master comp is a **human-only artifact**
from creation through to layer timing.

⚠️ `getLayerInfo` returns `{"error":"No active composition"}` when no comp is open in the UI — so the
one call that dumps every layer at once is unavailable unless a comp is actually open. `get-layer-details`
works regardless but costs one round trip per layer, which is why the 95 layers were **sampled, not
enumerated**.
