# Storyboard — upOS · "The page, and the product behind it" · 1920×1080 · 30.0s · 60fps (1800f) · **silent, seamless loop, light**

> **Concept:** the landing page Juan designed *and coded* is the doorway; the eight-module product he designed alone is what is behind it. The loop travels in through the page, crosses the product front-desk-to-money, lands on the one real argument — access is a module — and settles back into the page it started on.
> **CTA:** none. This is inline case-study media, not an ad.
> **Engine:** HyperFrames (HTML → frames). ⛔ **Not** After Effects — see *Relationship to the AE build* below.
> **Slot:** `upos.json` → `caseStudy.<lang>.blocks[0]`, replacing `/assets/images/placeholders/desktop-fullhd-dark-placeholder.svg`.
> **Status:** DRAFT FOR REVIEW. Nothing is built. Juan reviews this before a single frame is rendered.

---

## Relationship to the AE build (decision, Juan 2026-09-10)

`upos-permissions-loop.storyboard.md` — 14s, dark, Figma → AEUX → After Effects, ~60% built, blocked on the
bridge panel — is **superseded for this slot**. Both files stay on disk so the two approaches can be compared
for later assets. This is a supersede, not a delete.

What moving to HyperFrames buys, concretely:

| The AE build's blocker | Status under HyperFrames |
|---|---|
| Bridge panel must be open; `panelResponsive: false` twice | **Gone.** No AE, no bridge, no panel. |
| Two divergent copies of `mcp-bridge-auto.jsx` (119,937 vs 75,293 bytes) differing by 22 commands | **Gone.** Not in the pipeline. |
| `MASTER_permissions_loop` has 95 layers at t=0, needs 4 | **Gone.** Scene timing is `data-start` / `data-duration` in HTML. |
| AEUX imports a raster twin of every comp; a master built on `.png` twins renders no animation | **Gone.** No AEUX. |
| Adding an existing comp as a layer has no bridge command → human drag | **Gone.** |

What it costs: the ~100 animation steps already specified against AE layer names do not transfer. The
*storyboard reasoning* transfers; the keyframe spec does not.

---

## Format decision

| | |
|---|---|
| Canvas | **1920×1080**, light |
| Frame rate | **60fps** |
| Duration | **30.0s = 1800 frames** |
| Audio | none (animated WebP carries none) |
| Loop | **seamless** — frame 1800 is composited identically to frame 0 |
| Delivery | **animated WebP inside the existing `<img>` block** — no new `video` block type |
| Path | `/assets/cases/upos/lp-app-showcase.webp` (+ `.poster.webp`) |

**Why animated WebP and not WebM.** The `<img>` route was locked deliberately (Juan, 2026-09-09): the precedent
is `knowledge/projects/one-click-video-downloader/…showcase.webp`, verified `VP8X` + `ANIM` + 168 `ANMF` frames
in a plain `<img>`. It avoids the three-file `video`-block lockstep and keeps the case-study pages at **zero
first-party JS** (`TASKS.md` K0 #5). ⛔ The measured price is real: animated WebP costs **~2.3–3× WebM/VP9** for
identical content. That was accepted knowingly.

**Why light.** upOS is natively light — the live LP computes `#inicio` background as `rgb(21, 94, 239)` on white
page chrome, and every app screen is white-on-light. A dark grade would mean **recolouring the client's product**,
which is the one thing a design-evidence asset must not do. ⚠️ Note this diverges from the `*-dark-placeholder.svg`
practice used across the other records; upOS becomes the first light one. That is a deliberate, defensible break.

---

## ⛔ Claim guard — what this video may and may not assert

The case study's "What this is not" list binds the video exactly as it binds the prose.

| May show | May **not** show or imply |
|---|---|
| The LP as a page Juan **designed and coded** | That Juan **built the application** — he did not; Bubble first, then a Next.js rewrite by others |
| The product screens as **design evidence** | Any engineering claim about the app |
| **8** desktop modules | That all 8 exist on mobile — **2 of 8**, deliberately |
| **~26** view/edit permissions across **8** areas | The number **28** (see *Defect 2*) — and never "26" as an exact count |
| Profiles **Admin master · Técnico · Vendedor** | The discovery trio (`Cliente · Técnico · Vendedor`) — `Cliente` was never a system profile |
| Quoting → financial control | A cart, checkout, or payments — this is **invoicing** |
| — | Any performance metric. **None exists**, and that is a confirmed absence |

⚠️ **Two things on the page are the client's claims, not Juan's**: the stat band (`+10 anos de experiência real ·
+3.000 modelos cadastrados · Sistema feito sob medida`) and the four testimonials. They may pass by inside a
scrolling capture of the page — that is showing the page as it is. They may **not** be isolated, held on, or
turned into a stat hit. Doing so would adopt someone else's claim as evidence of Juan's work.

---

## Screen audit — all eight surfaces, verified by export

⚠️ **This section replaced a three-defect list after the Financeiro and Agenda frames were actually opened
(2026-09-11). Five of the eight surfaces carry placeholder defects, not three.** Nothing here is inferred; every
row was exported and looked at.

| Surface | Node | Scene | Camera | Verdict |
|---|---|---|---|---|
| Landing page (live capture) | — | S1 | scrolls | ✅ **Clean.** Real page, real content. |
| Agenda | `19096:4453` | S2 | **rests** | ✅ **FIXED in Figma 2026-09-11** — 24 distinct devices/customers/OS, `#OS2541`→`#OS2612` |
| Painel de Atendimento | `19341:21350` | S3 | passes | ✅ **Clean.** Two cards, stock photography, no fake records. |
| Kanban de OS | `19162:30610` | S3 | pans | ✅ **FIXED in Figma 2026-09-11** — **17** cards (not 10), each unique OS/date/prazo |
| Contas a receber | `19638:30562` | S3 | passes | ⚪ **Not fixed, not needed** — S3 crops to the stat band; the table is never in frame |
| Financeiro Receitas | `19116:7107` | S3 | alt | ⚪ **Not fixed, not needed** — same, alternate only |
| Perfis de usuários | `19142:36607` | S4 | **rests** | ✅ **FIXED in Figma 2026-09-11** — `08/01` · `22/01` · `14/02/2025` |
| Novo perfil (matrix) | `19146:22113` | S4 | **rests** | ✅ **FIXED by Juan 2026-09-11** — duplicate pair deleted; verified **26 / 8 areas** |
| Dashboard | `19402:35840` | S5 | **rests** | ✅ **Clean.** Varied figures, real ranking entries, varied sparklines. |

### ✅ The consequence — reversed by the Figma repair (2026-09-11)

The audit's original finding was that **every surface the camera rests on was defective and every clean surface
was one it passes**, which forced an HTML reconstruction of the product.

**Juan repaired the source instead.** Using the talk-to-figma fork, **126 text nodes** were rewritten in place
across three screens — placeholder *content* only, no layout, no component, no interface copy:

| Screen | Nodes | What changed |
|---|---|---|
| Perfis de usuários | 3 | The three `12/12/2025` cells → `08/01` · `22/01` · `14/02/2025`, chronological |
| Agenda | 72 | 24 chips × device/customer/OS → all distinct; **3 `#O12556` prefix typos corrected to `#OS`** |
| Kanban de OS | 51 | 17 cards × OS/date/prazo → all distinct |

Every batch returned `all_succeeded`, and — because a receipt is not a render — **each screen was re-exported and
looked at** before being called fixed.

**So the HTML reconstruction is dropped entirely.** Every scene now ships as raster off the repaired file —
simpler, sharper and truer to the delivered design than any rebuild.

⭐ **This is strictly better than reconstructing.** A rebuild would have produced clean pixels while the file stayed
wrong; repairing the source fixes the artifact itself, and every future export inherits it.

#### What survives the repair

- ✅ **Defect 2 was closed by Juan (2026-09-11)** — he deleted the duplicated pair himself, the one edit text could
  not reach. Verified by re-export and recounted off the render:
  `Painel técnico 4 · Assistência 6 · Clientes 4 · Financeiro 2 · Produtos 4 · Serviços 2 · Configurações 2 ·
  Relatórios 2` = **26 across 8 areas**, matching the `statRow` and the case study's *"roughly twenty-six"* exactly.
  ⚠️ The frame kept its fixed height of 2723, so ~2 rows of trailing whitespace now sit below Relatórios. Harmless —
  S4's travel ends at Relatórios, not at the frame edge.
- ⚪ **Defect 4 was left alone deliberately** — S3 crops Financeiro to its clean stat band, so the table with the
  repeated CPFs never enters frame. Its open context menu is a floating node, not text, so it was never text-fixable
  either.

#### The rule that governed the repair

> Reproduce the design exactly — layout, type, colour, spacing, components, interface copy.
> Replace **only** placeholder *content*: names, dates, OS numbers, amounts.
> ⛔ Change no layout decision, no component, no colour, and no copy that is part of the interface.

⚠️ **This edited the delivered agency file in place.** Figma version history is the undo path. Nothing was cloned,
renamed, moved or deleted; the `olivia@untitledui.com` **layer names** were left untouched, since only rendered
content was in scope.

### The defects in detail

### ✅ Defect 1 — FIXED · `7-3.1` rendered a fake date three times
The profiles table (`19142:36607`) has a `DATA DA CRIAÇÃO` column reading **`12/12/2025` on all three rows**.
**Resolved in Figma**, so the column **stays** — dropping it is no longer necessary and the design keeps its
designed shape. Verified by re-export: `08/01/2025` · `22/01/2025` · `14/02/2025`, chronological and correctly
earlier than the March–May activity on every other screen. Profiles, counts and status pills untouched.

### Defect 2 — the permissions matrix renders 28 rows, two of which are a duplicated pair
`7-3.3` (`19146:22113`) renders, counted from the 1.5× export:

| Area | Rows |
|---|---|
| Painel técnico | 4 |
| Assistência | **8 — of which `Ver lista de OS` / `Editar lista de OS` appears TWICE** |
| Clientes | 4 |
| Financeiro | 2 |
| Produtos | 4 |
| Serviços | 2 |
| Configurações | 2 |
| Relatórios | 2 |
| **Total rendered** | **28** |
| **Total de-duplicated** | **26** across **8** areas |

This is exactly why the record says *"roughly twenty-six"* and why the memory carries ⛔ **never 28**. Rendering
the frame flat would both show a visible duplication defect and contradict the shipped claim.
**Disposal:** rebuild the matrix in HTML with the duplicate pair removed → **26 rows, 8 areas**, matching the
`statRow` already on the page. The motion forces this anyway: the camera travels the matrix and individual
toggles animate, which needs them to be elements, not pixels in a raster.

### ✅ Defect 3 — FIXED · every kanban card read the same OS number and date
`2-3-Kanban de OS` (`19162:30610`, 2560×1836) renders **10 cards all numbered `#2556`**, all dated
`25/05/2025 · 1 dia restante`. Fine at Figma zoom; sloppy in a 1920-wide hero loop.
**Disposal:** the kanban appears in S3 as a **moving board, held under 2 seconds, never at full stop** — the
camera pans across it rather than resting on it. If review wants it held longer, the card layer gets rebuilt in
HTML with varied numbers and dates. **Juan's call — flagged, not silently decided.**

### Defect 4 — both Financeiro tables are built from one repeated fake record
`6-2.1 Contas a receber` (`19638:30562`) and `6-3.1 Financeiro Receitas` (`19116:7107`) each render:
- the CPF **`123.456.789-10` on every customer row** (8×), plus a dummy CNPJ `51.345.678.0001-00` for a customer
  literally named **`Fornecedor X`**;
- **`R$ 20.000` on every row** and **`25/03/2025` on every row**;
- a **context menu left open** (`Visualizar / Editar / Excluir`) floating over rows 2–4 and occluding their status
  pills — at 1920 wide that reads as a rendering bug, not a designed state;
- **`Olivia Bernardes`** as a customer name. ⭐ This is the Untitled UI `olivia@untitledui.com` residue surviving as
  *rendered* text, not merely as a layer name — the memory recorded it as the latter.
- `6-2.1` also mixes `A pagar` and `A receber` in its `TIPO DE CONTA` column on a screen titled *Contas a receber*.

⛔ A repeated, sequential fake CPF shown eight times in a portfolio piece is the worst of these — Brazilian tax IDs
are personally identifying, and eight identical ones read as unconsidered even though they are obviously synthetic.

**Disposal:** ⛔ **not usable as a flat raster in any crop that includes the table.** Two routes, in preference order:
1. **The stat band only** (recommended) — the three summary cards (`R$ 19.971,68 Receitas ↑2%` · `R$ 1.985,44 Despesas ↓5%`
   · `R$ 3.988,11 Contas a pagar ↑10%`) are **clean**: varied figures, varied deltas. Crop to that band. It is also the
   most legible expression of *financial control* at 1920 wide, and it sidesteps the table entirely.
   ⛔ Show them as the module designs them — a restrained rise-and-fade. **No count-up**, no isolation, no big-type
   treatment: the claim guard bars turning figures into a stat hit, and these are the client's demo numbers.
2. **Rebuild the table** in HTML under the reconstruction rule — varied dates, amounts and names, **no CPF column at
   all**, no open menu.

### ✅ Defect 5 — FIXED · every appointment in the Agenda was the same appointment
`1-1.1 Agenda` (`19096:4453`) renders roughly **25 appointments, every one reading `S22 Ultra · André Sant… #OS2556`**.
The prefix is inconsistent on top of that — `#OS2556` and `#O12556` both appear, which is a typo in the file.

⛔ **This is the most consequential of the five**, because the Agenda is where S2's entire push-through **lands and
holds**. It is the first product screen the viewer sees at full frame.

⚠️ **The landing page offers no escape.** `calendar.webp` (3512×2519), the marketing image in `#teste-gratis`, was
checked at native resolution: it is **the same frame with the same repetition**. There is no cleaner source anywhere.

**Resolved in Figma.** 72 text nodes across 24 chips: 24 distinct devices, 24 distinct customers, OS numbers
ascending `#OS2541` → `#OS2612`. The three `#O12556` prefix typos were corrected to `#OS` in the same pass.
Verified by re-export — the month grid, colour-coded chips, header controls and the component's designed text
truncation all survived; no chip broke on the longer names. `Abril 2025` kept.

⚠️ 23 of the 24 chips are visible in the export; one sits in a cell that clips. Pre-existing, not introduced.

> The audit's prediction — *what the camera rests on is exactly what is broken* — held, and was then **dissolved by
> repairing the source rather than working around it.** Four of five defects are gone from the file itself.

---

## Source strategy — "both", per the answer

| Material | Source | Why |
|---|---|---|
| The landing page | **Live capture of the real code** — `http://upos.juanpablosilva.com.br/`, Playwright, 1920×1080 @ **2× DPR**, `colorScheme: light` | It is the page Juan actually coded, and it is his own surviving copy. ✅ Captured this session: 1920×7871, **16/16 images decoded**, 10 sections. |
| App screens — the 3 clean ones | **Figma raster export @ 3×** from `upOS - Antônio`, page `↳ 💻 • Desktop` (`17005:453`) | Vector source, resolution-independent, light, no third-party dependency. |
| App screens — Agenda · Kanban · Perfis | **Figma raster export @ 3×**, post-repair | ✅ Repaired in place 2026-09-11; no reconstruction needed. |
| Permissions matrix | **Figma raster @ 2×** | Both reasons to rebuild are gone. ⛔ 2× not 3×: at 3× it projects to **31 MP**, over the exporter's 16 MP ceiling. |

⚠️ The earlier read that the LP's `i.ibb.co` images were dead was **wrong** — they are slow, not dead. Re-probed:
`hero.webp` returns **200, 715,230 bytes, 1.39s**, and a bounded per-image decode wait got **16/16**. Juan called this
correctly. The capture script keeps the 60s per-image decode wait so a slow host can never silently produce a
frame with a missing hero.

### Measured sharpness headroom (why nothing softens)

| Asset | Source px | Displayed at | Headroom |
|---|---|---|---|
| LP full-page strip | 3840 × 15742 (2× of 1920×7871) | 1920 wide | **2.0×** |
| LP hero dashboard `hero.webp` | 3504 × 2802 | 1168 × 934 on the page | **3.0×** — S5 scales it 1.64× to fill frame, well inside |
| Figma screen @ 3× | 3840 × 2160 | 1920 wide | **2.0×** |

⛔ **The Figma exporter refuses above 16 MP.** `7-3.3` at 3× projects to 3840×8169 = **31 MP** and would be refused.
Another reason the matrix is HTML, not a raster.

---

## Timeline

| Scene | Frames | Time | Beat |
|---|---|---|---|
| S1 | 0–480 | 0.0–8.0s | The page he built |
| S2 | 480–660 | 8.0–11.0s | Through the page, into the product |
| S3 | 660–1080 | 11.0–18.0s | Front desk to money |
| S4 | 1080–1560 | 18.0–26.0s | Permissions are a module |
| S5 | 1560–1800 | 26.0–30.0s | Back into the page — the seam |

---

## Scene 1 — The page he built  (t: 0.0–8.0s · f0–480)

- **Beat:** this is the artifact that is wholly his — designed *and* coded. Let it be a page, not a screenshot.
- **Look:** the real captured page, full colour, light. Nothing is added on top of it.
- **Layout:** frame 0 is the hero at scroll 0 — the frame that also becomes the poster.

```
┌────────────────────────────────────────────────────┐
│  upOS                          Preço  [Teste grátis]│  ← header, #f3f3f3
├────────────────────────────────────────────────────┤
│                                                    │
│      Sua assistência técnica mais eficiente,       │  ← h1, white on #155EEF
│                 sem complicação                    │
│         [ Testar o upOS grátis por 7 dias ]        │
│    ┌──────────────────────────────────────┐        │
│    │  Orçamentos · Vendas · Ordens de Serv│        │  ← hero dashboard
│    │  70 │ 90%~R$100K │ R$100K │ R$2.000  │        │     x376 y420 1168×934
│    └──────────────────────────────────────┘        │
└────────────────────────────────────────────────────┘
```

- **Motion — a stepped scroll, not a constant crawl.** Constant-velocity scrolling reads as a screen recording;
  eased steps with holds read as authored. Four moves, measured against the real page geometry:

  | Frames | From y | To y | Behaviour |
  |---|---|---|---|
  | 0–96 | 0 | 0 | **Hold** on the hero. 1.015× push on the strip only — motion without zoom. |
  | 96–186 | 0 | 1442 | Ease to `#desafios`. |
  | 186–228 | 1442 | 1442 | Hold. |
  | 228–318 | 1442 | 2892 | Ease to `#como-funciona`. |
  | 318–360 | 2892 | 2892 | Hold. |
  | 360–480 | 2892 | 3642 | Ease to `#teste-gratis` — the Agenda section — and **settle**. |

  Every move is `power2.inOut`. The final settle is slightly longer so S2 can begin from stillness.
- **Camera:** the scroll *is* the camera. No separate move.
- **Transition out:** none — S2 begins from the settled frame, continuous.

⚠️ The stat band (`#3685fb`, y1354–1442) and the testimonials (y5691) are *passed*, never held. The scroll stops
above the testimonials entirely, so they are never on screen. That is deliberate — see the claim guard.

---

## Scene 2 — Through the page, into the product  (t: 8.0–11.0s · f480–660)

- **Beat:** the page is selling something. Here is the thing it sells.
- **Look:** the LP's own Agenda screenshot grows until it is no longer a screenshot.
- **Layout:**

```
   f480                    f570                     f660
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Agenda organ.│      │  ┌────────┐  │      │ Agenda │ upOS│
│ ┌──────────┐ │  →   │  │ agenda │  │  →   │ ███ live ███ │
│ │  agenda  │ │      │  │ growing│  │      │ ███ module ██│
│ └──────────┘ │      │  └────────┘  │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
   on the page          pushing in            the product
```

- **Motion:** the LP strip scales up about its Agenda card's centre while everything around the card loses opacity.
  At the moment the card's edges reach the frame edges (≈f600), a **crossfade of 12 frames** swaps the LP's raster
  screenshot for the **repaired Figma export of the Agenda at 3×**. The swap is invisible because the two are the
  same screen at the same scale — what changes is resolution **and the demo records**.
  ⭐ The 12-frame crossfade does real work here: it is the moment the landing page's stale `#OS2556` chips become the
  repaired file's varied ones. At 60fps across 12 frames nobody reads a chip mid-dissolve.
  ⚠️ `calendar.webp` on the live landing page is the **pre-repair** frame and will stay stale until that site is
  rebuilt — which is fine, and is exactly why the crossfade lands where it does.
- **Camera:** single continuous push, `power2.in` then `power1.out` on the settle. No cut.
- **Transition out:** none — S3 continues from the settled product view.

> ⭐ This transition **is** the case study's argument in one gesture: the page and the product are the same job,
> and he did both halves of it. It replaces a sentence with a move.

---

## Scene 3 — Front desk to money  (t: 11.0–18.0s · f660–1080)

- **Beat:** a device, a promise and an amount of money travel through the business at different speeds. The system
  holds all three.
- **Look:** three real product screens, each moving, none held to a stop.
- **Layout:** the module rail on the left stays constant while the content area changes — the design's own
  continuity, used as the scene's continuity.

```
┌───┬────────────────────────────────────────────────┐
│ ▪ │  Atendimento › Painel de atendimento           │
│ ▪ │  ┌──────────┐  ┌──────────┐                    │
│ ▪ │  │ Produtos │  │ Serviços │      f660–800      │
│ ▪ │  └──────────┘  └──────────┘                    │
│ ▪ │                                                │
│ ▪ │  Assistência › Kanban de OS                    │
│ ▪ │  ┌────┐┌────┐┌────┐┌────┐      f800–940       │
│ ▪ │  │NOVO││ EM ││CONT││ AG │   ← camera pans →    │
│ ▪ │  └────┘└────┘└────┘└────┘                      │
│ ▪ │  Financeiro                     f940–1080      │
└───┴────────────────────────────────────────────────┘
```

| Frames | Screen | Motion |
|---|---|---|
| 660–800 | `1-0.1 Painel de Atendimento` (`19341:21350`) — ✅ clean, raster | The two cards (Produtos / Serviços) rise 8px + fade, staggered 6f. Slow 1.02× push. |
| 800–940 | `2-3 Kanban de OS` (`19162:30610`, 2560×1836) | **Horizontal pan** across the columns, `power1.inOut`. The board is wider than frame — the pan is the honest way to show it. ⛔ Never held: Defect 3. |
| 940–1080 | **Contas a receber** `19638:30562` — **stat band only** | Quoting → settlement. The three summary cards rise and fade in, staggered 5f. ⛔ Cropped above the table: Defect 4. ⛔ No count-up. |

- **Camera:** each screen gets one small, slow move. ⛔ No whip pans, no match cuts — this is a product being shown,
  not a trailer.
- **Transition between screens:** the content area cross-dissolves over 10f while the module rail holds. Cheap,
  invisible, and it keeps the rail as the spine.
- **Transition out:** the rail's `Configurações` icon highlights (f1064–1080), motivating S4.

⛔ **The rail may enumerate 8 modules. It may not imply they exist on mobile.** Nothing in this scene references
a phone. Mobile is 2 of 8 and this video does not make the responsive-coverage claim.

---

## Scene 4 — Permissions are a module, not three hardcoded screens  (t: 18.0–26.0s · f1080–1560)

- **Beat:** the obvious way to serve three roles is to draw three versions of every screen. upOS does the opposite.
- **Look:** the densest, most "this was really designed" stretch of the piece. **Raster off the repaired Figma file** — both defects that once forced an HTML rebuild are now fixed at source.
- **Layout — 4a, the profiles table (f1080–1260):**

```
┌────────────────────────────────────────────────────┐
│  Configurações › Permissões › Perfis               │
│  ┌──────────────────────────────────────────────┐  │
│  │ Perfis de usuários      🔍     [+ Novo perfil]│ │
│  ├──────────────────────────────────────────────┤  │
│  │ NOME DO PERFIL      USUÁRIOS      STATUS     │  │
│  │ Admin master            1        ( Ativo  )  │  │
│  │ Técnico                 3        ( Ativo  )  │  │
│  │ Vendedor               10        ( Inativo)  │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

⛔ **No `DATA DA CRIAÇÃO` column** (Defect 1). ⛔ No avatar cells, no email cells.
⛔ These three names are the **shipped** profiles. Never the discovery trio.

- **Motion (4a):** the card scales up using **width/height, not `scale`** — keeps the 1px stroke and radius crisp.
  Rows write on, staggered 5f, opacity + 8px Y. The `Ativo`/`Inativo` pills pop last with a small overshoot on a
  centred anchor.

- **Layout — 4b, the profile builder (f1260–1560):** the source is 1280×2723 — far taller than 16:9, so **the frame
  moves instead of shrinking**.

```
┌────────────────────────────────────────────────────┐
│  Novo perfil   [Nome do perfil. Ex.: técnico]      │
│  ┌──────────────────────────────────────┬───────┐  │
│  │ ▪ Painel técnico                     │  ⬤    │  │  ← 4 rows
│  │   Visualizar agenda / Editar agenda  │  ⬤    │  │
│  │ ▪ Assistência                        │  ⬤    │  │  ← 6 rows (de-duped)
│  │ ▪ Clientes                           │  ⬤    │  │  ← 4      camera
│  │ ▪ Financeiro   Ver / Editar          │  ⬤    │  │  ← 2      travels
│  │ ▪ Produtos                           │  ⬤    │  │  ← 4      down
│  │ ▪ Serviços · Configurações · Relat.  │  ⬤    │  │  ← 2+2+2
│  └──────────────────────────────────────┴───────┘  │
│                            ~26 permissões · 8 áreas │
└────────────────────────────────────────────────────┘
```

- **Motion (4b):** the matrix rises from below as 4a's card exits top — one continuous vertical move, not a cut.
  The camera then travels down the eight groups, `power1.inOut`, with a short hold on **Financeiro** — because
  `Ver financeiro` and `Editar financeiro` being *separate switches* is the clearest single proof of the claim.
  ⛔ **No per-toggle cascade.** That needed the matrix as elements; the repaired file ships as raster instead, which
  is the more faithful trade. In its place a soft **highlight band travels with the camera**, reading as a scan down
  the areas — a CSS gradient over the raster, no rebuild.
  ⛔ The travel stops at **Relatórios**, not at the frame edge — the deletion left trailing whitespace below it.
- **The only added type in the whole piece:** `~26 permissões · 8 áreas`, counting up on a hold-keyframed counter,
  landing at f1530. It mirrors the `statRow` already on the case-study page — it adds no claim.
  ⛔ The tilde is **not** decorative. It is the whole reason this number is safe.
- **Transition out:** the matrix loses opacity on a **luma wipe travelling bottom→top**, so it is cleared rather
  than cross-faded — the eye reads "done", not "dissolve".

---

## Scene 5 — Back into the page (the seam)  (t: 26.0–30.0s · f1560–1800)

- **Beat:** the product lives inside the page. End where it began so it can run forever.
- **Look:** the mirror of S2 — out, not in.
- **Motion:**

  | Frames | Behaviour |
  |---|---|
  | 1560–1620 | The Dashboard module composes in behind the clearing wipe — the same screen the LP hero shows. |
  | 1620–1760 | It **scales down** into the hero card's exact geometry (`x376 y420 1168×934`), `power2.inOut`, while the rest of the landing page fades up around it at scroll 0. |
  | 1760–1800 | Settle. Everything at rest. The 1.015× push of f0 is re-entered so velocity matches across the seam. |

- **The seam rule:** frame 1800 must be **compositionally identical to frame 0** — same scroll (0), same scale
  (1.015× at its start value), same opacity everywhere. ⛔ Not merely "similar": the loop is verified by rendering
  f0 and f1799 and diffing them. A visible pop at the seam fails the scene.
- **Transition out:** to frame 0. That is the loop.

---

## Asset manifest — HyperFrames

⚠️ **Adapted from `storyboard-director`'s Figma→AEUX→AE manifest.** The engine is HTML, so the contract is
**element `id`s and source files**, not AE layer names. Everything else about the skill's manifest discipline
holds: unique ids, one per moving thing, each carrying the principle it serves.

⛔ **HyperFrames id rules that bind this manifest** (`hyperframes-core`):
- Every `id` must be unique across the **assembled** page; inside a sub-composition, prefix with the composition id.
- Duplicate `<img>` ids render **blank** — the producer injects by `getElementById` and cross-file dupes pass `lint`.
- The root element carries `data-start="0"` or `lint` fails with `root_composition_missing_data_start`.
- ⛔ Never pair a CSS initial `transform` with a GSAP tween on the same property (`gsap_css_transform_conflict`) —
  set the initial state inside `gsap.fromTo()`.

### Scene 1 — the landing page
| id | type | source | design note (the principle it serves) |
|---|---|---|---|
| `upos-s1-lp-strip` | `<img>` | `media/lp-full@2x.png` (3840×15742) | The whole page as one strip; scrolled by `y`, never by `background-position`. Own wrapper so the 1.015× push and the scroll are separate transforms. |
| `upos-s1-viewport` | `<div>` | — | `overflow:hidden`, sized 1920×1080. The scroll happens on the child, the clip on the parent. |

### Scene 2 — the push-through
| id | type | source | design note |
|---|---|---|---|
| `upos-s2-agenda-raster` | `<img>` | crop of `lp-full@2x.png` at the Agenda card | The LP's own screenshot. Fades out across the 12f swap. |
| `upos-s2-agenda` | `<div>` | **HTML** | The reconstructed month grid. Fades in over 12f at identical geometry — the swap must be invisible. ⛔ Not the Figma export: Defect 5. |
| `upos-s2-appt-01..25` | `<div>` | **HTML** | One per appointment chip. Varied device, customer and OS number; the colour coding is the design's and is preserved. |
| `upos-s2-scaler` | `<div>` | — | Owns the push. Block-level and explicitly sized: a transformed element must be, or it collapses. |

### Scene 3 — front desk to money
| id | type | source | design note |
|---|---|---|---|
| `upos-s3-rail` | `<img>` | `media/app/rail@3x.png` | The module rail, held constant across all three screens — the scene's spine. Separate element so the content can dissolve beneath it. |
| `upos-s3-atendimento` | `<img>` | `media/app/1-0.1-painel@3x.png` | Passing screen → raster is correct. |
| `upos-s3-kanban` | `<img>` | `media/app/2-3-kanban@1x.png` (2560×1836) | Panned horizontally. ⛔ Under 2s, never at rest — Defect 3. Escalate to HTML if review wants it held. |
| `upos-s3-fin-band` | `<img>` | `media/app/6-2.1-statband@3x.png` | ✅ Resolved: `19638:30562`, **cropped to the three summary cards**. ⛔ The table below them is Defect 4 and is never in frame. |
| `upos-s3-fin-card-1..3` | `<div>` | overlay | Only if the rise-and-fade needs per-card stagger; otherwise the band moves as one. |
| `upos-s3-content` | `<div>` | — | The cross-dissolve host. Animate `autoAlpha`, never `display`. |

### Scene 4 — permissions (raster off the repaired file)
| id | type | source | design note |
|---|---|---|---|
| `upos-s4-profiles` | `<img>` | `media/app/7-3.1-perfis@3x.png` | The repaired table, dates varied. Scaled via a sized wrapper. |
| `upos-s4-matrix` | `<img>` | `media/app/7-3.3-matrix@2x.png` (2560×5446) | The travelled surface, taller than frame by design. ⛔ 2× — 3× exceeds the 16 MP export ceiling. |
| `upos-s4-scan` | `<div>` | CSS gradient | The highlight band that travels with the camera. Its own element — every reveal owns its matte. |
| `upos-s4-counter` | `<span>` | text | `~26 permissões · 8 áreas`. Hold-keyframed. ⛔ The tilde is load-bearing. |
| `upos-s4-wipe` | `<div>` | CSS | The luma wipe above the matrix at the scene's exit. |

### Scene 5 — the seam
| id | type | source | design note |
|---|---|---|---|
| `upos-s5-dashboard` | `<img>` | `media/app/1-2-dashboard@3x.png` | The screen the hero shows. Scales into the hero card's measured geometry. |
| `upos-s5-lp-strip` | `<img>` | `media/lp-full@2x.png` | ⛔ **A second element, not a re-use of `upos-s1-lp-strip`** — duplicate `<img>` ids render blank. |

### Imports (not authorable as HTML)
- `media/lp-full@2x.png` — Playwright capture of the live LP. ✅ already captured this session.
- `media/app/*@3x.png` — Figma exports, page `17005:453`. ⛔ Each must stay under the exporter's **16 MP** ceiling.
- Inter — the product's typeface (`font-family: 'Inter'` in the LP's `globals.css`). Must be embedded, not
  CDN-loaded: renders must be deterministic and offline-safe.

---

## Encode plan

**Render path — chosen for quality, not convenience:**

```
hyperframes render --format png-sequence      # lossless RGBA, 1800 frames
        ↓
ffmpeg -c:v libwebp_anim                       # animated WebP
        ↓
/assets/cases/upos/lp-app-showcase.webp
```

⛔ **Not `--format mp4` then convert.** MP4 is 4:2:0 chroma-subsampled; a WebP encoded from it inherits the chroma
damage exactly where this piece is weakest — the saturated blue (`#155EEF`) against white UI edges. PNG sequence
keeps the encoder's input lossless. HyperFrames' `render` supports `mp4 · webm · mov · gif · png-sequence` —
**animated WebP is not a native output**, so the ffmpeg step is required regardless.

**Size — what is actually known.** From Juan's own measured `libwebp_anim` sweep: 1024w/24fps/q75 = 348 KB;
1536w/30fps/q75 = 685 KB; 1920×1080/q75 ≈ **3.6 MB per 14s at 30fps**, 60fps roughly doubling it. Extrapolated to
this piece: **30s @ 60fps @ q75 ≈ 15 MB**. The 50 MB target implies roughly **q95**.

⛔ **These are extrapolations, not measurements.** The final number comes from a real sweep at q75 / q85 / q90 / q95
on the finished render, reported as measured bytes before anything is committed. A worst-case full-frame-pan proxy
cost only **1.19×** a calm scene, so the projection is stable — but S1's scroll and S3's kanban pan are both
full-frame moves, so this piece sits at the expensive end.

**Companion outputs:**
- `lp-app-showcase.poster.webp` — still frame 0, the hero. Serves both the poster hook and the reduced-motion source.
- `lp-app-showcase.seam.png` — frames 0 and 1799 side by side, for the seam check.

---

## Open decisions — each one is Juan's

1. 🔴 **Where a 50 MB file lives.** `image.src` is locked to local paths in **both** schemas
   (`src/content.config.ts` + `_config/portfolio/schema.mjs:566`), so an R2 URL is rejected today. A 50 MB WebP
   therefore lands in `public/` in the **public** portfolio repo, permanently in git history. Options: land the
   `cdn.juanpablosilva.com.br` host-allowlist first (⛔ host-allowlisted, **not** the `URL.canParse` pattern used by
   `preview`/`liveHref` — that would accept a Notion signed URL and re-open the exact hole the guard exists to close),
   use Git LFS, or accept the weight. **Blocking before commit, not before build.**
2. 🔴 **`prefers-reduced-motion`.** An animated WebP in a bare `<img>` cannot honour it, and K0 #6 requires a branch.
   The zero-JS fix is a `<picture>` wrapper with `<source media="(prefers-reduced-motion: reduce)" srcset="…poster.webp">`
   — ⭐ `media` on `<source>` **is** honoured inside `<picture>`, unlike inside `<video>`. This changes the shipped
   renderer, so it needs approval. At 30s and ~50 MB this is heavier than it was at 14s.
3. 🟡 **Poster-first.** A bare `<img>` has no `poster`. Zero-JS route: poster as a CSS `background-image` on
   `.cs-figure`, URL derived by convention (`…showcase.webp` → `…showcase.poster.webp`). No schema change.
4. ✅ **The Financeiro frame is resolved** (Juan supplied `19044:602`, 2026-09-11). The section holds **14 screens**;
   `6-2.1 Contas a receber` (`19638:30562`) is the choice — settlement is the far end of the quote→agreement→settlement
   arc and it is unambiguously *invoicing*, which reinforces the claim guard rather than straining it.
   ⛔ Opening it surfaced **Defect 4**, so only its stat band is usable. Alternate: `6-3.1 Receitas` (`19116:7107`) —
   same defect, same disposal.
5. ✅ **Kanban cards — moot.** Repaired at source; it can now be held as long as the edit wants.
6. ✅ **Defect 2 — closed.** Juan deleted the duplicated pair; verified at **26 / 8 areas**.
7. ✅ **Reconstruct, or ship the real frames? — answered by repairing the source.** Four of five defects were fixed
   in the Figma file itself, so the product section ships as real exports of the real screens. No reconstruction, and
   the file is better than it was.
8. 🟡 **Caption.** Block[0]'s caption is currently *"Placeholder — the landing page at desktop width."* It now needs to
   describe a loop covering the page **and** the product, in both `en` and `pt`.

---

## Build asset set — exported 2026-09-11, post-repair

All under the exporter's 16 MP ceiling. Headroom is source width ÷ 1920.

| File | Pixels | MP | Headroom | Scene |
|---|---|---|---|---|
| `lp-full@2x.png` | 3840 × 15742 | — | 2.00× | S1, S2, S5 |
| `1-1.1-agenda@3x.png` | 3840 × 2700 | 10.4 | 2.00× | S2 |
| `1-0.1-painel@3x.png` | 3840 × 2160 | 8.3 | 2.00× | S3 |
| `2-3-kanban@1.5x.png` | 3840 × 2754 | 10.6 | 2.00× | S3 |
| `6-2.1-statband@3x.png` | 3840 × 1040 | 4.0 | 2.00× | S3 |
| `7-3.1-perfis@3x.png` | 3840 × 2160 | 8.3 | 2.00× | S4 |
| `7-3.3-matrix@2x.png` | 2560 × 5446 | 13.9 | 1.33× | S4 |
| `1-2-dashboard@2.5x.png` | 3200 × 3640 | 11.6 | 1.67× | S5 |

⛔ Two assets sit below 2×, both against the 16 MP ceiling, not by choice: the matrix projects to **31 MP** at 3×
and the dashboard to **16.8 MP**. Both are tall frames shown a portion at a time, so the effective oversample in
frame is higher than the column suggests.

⭐ `6-2.1-statband@3x.png` is cropped to 1040px of a 2349px frame — navbar, the three clean summary cards, the table
title and its column headers, **stopping before the first data row**. Defect 4 is out of frame by construction, not
by camera discipline.

## Handoff

1. **Juan reviews this file.** Nothing is rendered before that.
2. `npx hyperframes init` in `motion/upos-lp-app-showcase/`; pin the CLI (`0.8.34` probed live this session).
3. Export the Figma screens at 3× (⛔ under 16 MP each); the LP strip is already captured.
4. Build the composition per the manifest — S4 in HTML, S1/S2/S3/S5 raster-on-HTML.
5. `npx hyperframes check` → 0 findings across lint, runtime, layout, motion, contrast.
6. `npx hyperframes snapshot --at 0,8,11,18,26,29.98` → eyeball six frames, including **the seam pair**.
7. `npx hyperframes preview --background` → Juan reviews motion in Studio.
8. `npx hyperframes render --format png-sequence` → ffmpeg `libwebp_anim` sweep → report **measured** bytes.
9. Resolve Open #1 and #2 **before** the file is committed.
