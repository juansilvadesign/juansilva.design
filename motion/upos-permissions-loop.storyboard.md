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
