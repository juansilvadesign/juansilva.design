---
title: SYD (SaveYourDay) Showcase Storyboard — v2
duration: 30.0
fps: 60
resolution: 1920x1080
music: none
theme: light
slug: syd-showcase
supersedes: syd-showcase.storyboard.md (v1, shipped 2026-09-13)
status: DRAFT — awaiting Juan's review. Nothing renders before that.
date: 2026-09-14
---

# Storyboard — SYD · "Three readers don't share a question" · 1920×1080 · 30.0s · 60fps (1800f) · **silent, seamless loop, light**

> **Concept:** Three audiences arrive at the same product with three different questions. One page
> cannot answer all three, so there are three pages — and the same person designed and built every
> one of them. The video argues that, rather than cataloguing it.
> **CTA:** None. Case-study hero media and portfolio evidence, not an advertisement.
> **Engine:** HyperFrames (HTML / GSAP → PNG sequence → ffmpeg).
> **Slot:** `syd.json` → `publish.previewMotion` + the `video` block in `caseStudy[lang].blocks`.

---

## Why v1 is being replaced

v1 shipped on 2026-09-13 and is live on the CDN now. It is not broken — it is **thin**, and it was
built on sources that did not have the pixels its own manifest claimed. Both problems are measured
below, not asserted.

### v1's delivery encode was never the problem

| measurement | v1 result | gate |
|---|---|---|
| SSIM `syd-showcase.mp4` vs its master | 0.9967 (Y) | ≥0.98 ✅ |
| SSIM `syd-showcase.webm` vs its master | 0.9916 (Y) | ≥0.98 ✅ |
| PSNR between the two stills | 45.4 dB | ~40+ ✅ |
| `ffprobe` H.264 | High / L4.0 / yuv420p / bt709 | `avc1.640028` ✅ |
| `ffprobe` VP9 | Profile 0 / yuv420p | `vp09.00.40.08` ✅ |

Every Gate-4 number passes. Re-tuning CRF would have bought nothing. The ceiling sat upstream.

### ⛔ v1's asset manifest claimed resolutions the files did not have

v1's storyboard and `REGENERATE.md` both list the captures as `2880×1800 (@2x)`, `2560×1600 (@2x)`,
`750×1624 (@2x)`. **Every file on disk was 1×** — `paciente-hero-1440.png` measured 1440×900, the
1280s 1280×800, the mobiles 375×812. There was no 2× asset anywhere in the project, and
`capture/screenshots/` was 1×1920×1080 as well. So every glyph was a 1× screenshot displayed 1:1 and
then pushed to 1.03–1.04 by the camera — *upscaled*, with no detail reserve.

The fingerprint of how it happened is still in `REGENERATE.md` §4: every encode command carries
`-vf scale=1920:1080`, a **no-op on a 1920×1080 source**. The recipe was copied from the
4K-master pipeline without being adapted, and the supersampling step was dropped with it.

### v1's other measured gaps

- **30fps / 750 frames**, against its own header spec of **60fps / 1500 frames** — whose stated
  rationale was "butter-smooth typography and viewport morph transitions".
- **The master was itself lossy H.264 at 5.3 Mbps**, so the deliverables are 2nd-generation. And
  because SSIM was measured *against that master*, the measurement is structurally blind to the
  first generation of loss — the exact trap Gate 4 names.
- **It never scrolls.** The camera sits on the hero and pushes 3%. The pages have ten sections each.

---

## ⛔ Claim guard — what this video may and may not assert

Inherited from `_config/portfolio/records/syd.json`, which carries the store's sharpest scope guard.

| May show & assert | May NOT show or imply |
|---|---|
| Juan **designed and coded the three landing pages** | That Juan designed or coded the **118-screen app** — Thiago's, and the product design was finished before Juan arrived |
| 3 audience pages: **Paciente · Profissional · RH** | That this is one page with three tabs |
| The built layer reflows across **1440 · 1280 · 375** | ⛔ That **nine states were designed in Figma** — see *Screen audit*, this is now in question |
| Built twice: **Vite + React Router, then Next.js** | That the earlier repo was Next.js (it was Vite) |
| Real live pages from `sydapp.com.br` | Any conversion or performance metric — confirmed absent, none was ever collected |
| Design-to-code continuity by one person | That Juan **built the component system** — the page leans on a remote library |

⛔ **Never show Figma page `2-App` (`14:2`).** Not one frame. It is Thiago's 118 screens and showing
it invites precisely the misattribution the record exists to prevent. Only `3-LP` (`1068:5433`) is in
scope, and this build touched nothing else.

⛔ **Never put the live `sitemap.xml` date on screen.** It publishes `lastmod 2024-02-20` across all
six URLs — a hardcoded placeholder predating the first commit by ~16 months. Juan reviewed it and
elected not to fix it, so the guard is the only thing holding.

---

## Screen audit — what the sources actually contain

### ✅ Live capture — 9/9 states, every image decoded

Captured this session, `sydapp.com.br`, Playwright, **deviceScaleFactor 2**, `colorScheme: light`,
`reducedMotion: reduce` so entrance animations cannot make frames non-deterministic.

| State | Hero @2× | Strip @2× | scrollHeight | images decoded | scrollY |
|---|---|---|---|---|---|
| `paciente-1440` | 2880×1800 | 2880×9200 | 8757 css · stable | **8/8** | 0 ✅ |
| `paciente-1280` | 2560×1600 | 2560×9200 | 8757 css · stable | **8/8** | 0 ✅ |
| `paciente-375` | 750×1624 | 750×9200 | 11202 css · stable | **8/8** | 0 ✅ |
| `profissional-1440` | 2880×1800 | 2880×9200 | 7595 css · stable | **8/8** | 0 ✅ |
| `profissional-1280` | 2560×1600 | 2560×9200 | 7628 css · stable | **8/8** | 0 ✅ |
| `profissional-375` | 750×1624 | 750×9200 | 9556 css · stable | **8/8** | 0 ✅ |
| `rh-1440` | 2880×1800 | 2880×9200 | 7785 css · stable | **7/7** | 0 ✅ |
| `rh-1280` | 2560×1600 | 2560×9200 | 7785 css · stable | **7/7** | 0 ✅ |
| `rh-375` | 750×1624 | 750×9200 | 10801 css · stable | **7/7** | 0 ✅ |

### ⛔ The first capture pass was silently scrolled — caught by GATE 1, not by the script

The first run reported `stable` and `8/8` on all nine and **still produced wrong frames**. Every hero
opened mid-headline with no navbar: the page was captured partway down. Cause: the site sets
`scroll-behavior: smooth`, which turns the script's closing `window.scrollTo(0, 0)` into an
*animation*. A fixed 500ms wait then screenshots the page mid-return.

This is the same shape as upOS's 2708px-instead-of-7871px failure: **a fixed wait silently
invalidating everything downstream, while every other signal reads healthy.** Nothing in the report
was wrong — the report simply did not measure the thing that broke.

The fix, and why the third column above now exists:
1. `addStyleTag` forcing `scroll-behavior: auto !important` before any scrolling.
2. `history.scrollRestoration = 'manual'`.
3. **Poll until `window.scrollY === 0`** rather than waiting a fixed time.
4. ⭐ **Report the final `scrollY` per state and mark the row ⛔ when it is non-zero.** An assertion
   that is not printed is an assumption. This is the durable part of the fix.

⛔ Re-verified by eye after the second pass — navbar, full headline and both CTAs present on all
three 1440 heroes. A green row is not an inspection.

### ⛔ …and the SAME failure class was hiding in the strip column

The second pass reported `stripCss: 4600, stripClipped: true` for all nine states. **Every strip on
disk was viewport-sized** — 2880×1800, not 2880×9200. Two separate causes, both worth keeping:

1. **Playwright's `clip` intersects with the VIEWPORT.** Without `fullPage: true` alongside it, a
   clip taller than the viewport is silently truncated to the viewport. No error, no warning.
2. ⛔ **The report echoed the REQUEST, not the RESULT.** `stripCss: 4600` was the number passed *in*.
   Nothing ever read the written file back, so the report asserted a 4600px strip while shipping a
   900px one — and it did so in the very same run where the `scrollY` fix was added.

⭐ **The rule this pass earned, and it generalises past captures:** a gate that prints its own input
is not a gate. The report now reads **width and height straight out of each written PNG's IHDR**,
compares them against what was asked for, and marks the row ⛔ on mismatch. Fixing `scrollY` by
adding a *measured* field while leaving `stripCss` as a *declared* one is exactly how one of these
survives a fix aimed at the other.

⛔ **The per-image decode wait is load-bearing and must stay.** The live site serves its hero art from
`i.imgur.com` — 21 files in the public repo, including all three `Hero.tsx`. Third-party and slow.
A fixed delay would have produced heroes with missing art, exactly as upOS's `i.ibb.co` nearly did.
The script waits for every `document.images` entry to report `naturalWidth > 0` on a 60s budget and
**reports the count**, so a short capture can never pass silently.

⛔ **Reveal-on-scroll needed stepping.** 400px steps at 90ms, full descent then back to 0, so every
`IntersectionObserver` fired before the screenshot.

⚠️ **`paciente` 1440 and 1280 report an identical 8757px scrollHeight** — this is a coincidence of
total height, **not** an identical layout. Measured: PSNR **14.7 dB** between the two content
columns cropped to matched width. They genuinely reflow. The responsive beat is real.

### ⛔ The Figma "1440" frames are lorem-ipsum stock wireframes, not SYD designs

This is the finding that changed Scene 4, and it reaches past the video.

`sources/portfolio/figma/syd.md` publishes a table under the heading **"13 full-page designs
≥2000px tall"** whose 1440 column reads Paciente 9,681px · Profissional 7,692px · RH 7,528px. Those
are nodes `1070:1339`, `1113:12563`, `1113:14100`. **All three were exported and looked at this
session. All three are the component library's stock template** — "Medium length hero heading goes
here", "Long heading is what you see here in this feature section", lorem-ipsum body, grey
placeholder image icons, a stock `$19 / $29 / $49` pricing table, a `Logo` wordmark, generic FAQs.
There is nothing SYD in any of them.

| Node | Named | Width | Verified | Verdict |
|---|---|---|---|---|
| `1070:1339` | Paciente | 1440 | ✅ exported & looked at | **lorem-ipsum stock wireframe** |
| `1113:12563` | Profissional | 1440 | ✅ exported & looked at | **lorem-ipsum stock wireframe** |
| `1113:14100` | RH | 1440 | ✅ exported & looked at | **lorem-ipsum stock wireframe** |
| `1082:2387` | Paciente | 375 | ✅ exported & looked at | **lorem-ipsum stock wireframe** (open mobile menu, "Link One…Seven") |
| `1082:1875` | Paciente | 1280 | ✅ exported & looked at | **real SYD design** |
| `1113:11360` | Profissional | 1280 | ✅ named by Juan 2026-09-14 | **real SYD design** |
| `1113:12904` | RH | 1280 | ✅ named by Juan 2026-09-14 | **real SYD design** |
| `1155:5211` | Paciente | 375 | ✅ exported & looked at | **real SYD design**, mobile-specific copy |
| `1155:9741` | Profissional | 375 | inferred from section + size pairing | design (unverified) |
| `1155:10989` | RH | 375 | inferred from section + size pairing | design (unverified) |

⭐ **The 375 design is genuinely mobile-specific, not a squeeze.** `1155:5211` changes the headline to
*"Atendimento psicológico quando você mais precisa, **sem filas**."* and collapses the two app-store
buttons into a single **"Comece agora"**. That is real responsive design work and it is worth showing.

The section naming does not help: the section literally named `Wireframe` (`1113:5030`) contains the
1440 frame **and** a 375 frame, while the section named `LP` (`1113:5031`) contains the 1280 and a
different 375. Frames have been moved between sections; the names are not a reliable index — which is
why every verdict above rests on an export that was looked at, not on the section a node sits in.

**The corrected count:**

| Stage | Breakpoints | States |
|---|---|---|
| Wireframed | 1440 · 375 | **6** (stock template, lorem-ipsum) |
| Designed | 1280 · 375 | **6** |
| Built | 1440 · 1280 · 375 | **9** (measured live this session) |

*(12 full-page frames + the standalone `Pricing / 20 /` block at 375×2,109 = the 13 the source doc
counts — but it counts all 13 as "designs".)*

**Consequence — 🔴 a published claim does not match the file, and the fix is Juan's call, not mine.**
Case-study block 8, live on the site, reads *"Each page went wireframe first, then design at 1440,
1280 and 375, then code. **Nine designed states, all of them mine.**"* Verified: the wireframe→design→
code *process* is real, but the breakpoints are wrong and the count is **six designed, not nine**.
Juan confirmed the shape independently on 2026-09-14: *"3-LP stores both wireframes and designed
versions … the latest version of the landing page is live at `sydapp.com.br`, not in Figma"* — i.e.
the 1440 state exists in **code**, never as a Figma design. See **Open decisions #1**.

⛔ **This also kills v1's Scene-4-as-planned.** Putting a lorem-ipsum stock template on screen as
"the wireframe stage" would be visually dead *and* would invite the "you assembled a template"
reading the record's own component-library caveat warns about. Scene 4 is now **design → code**.

---

## Source strategy

| Material | Source | Why |
|---|---|---|
| All nine built states | **Live capture @2× DPR** (above) | The shipped result, and the thing that is wholly his. Real pixels beat a reconstruction. |
| Paciente design hero | **Figma raster from `3-LP`** — `1101:7209` + `1082:2357` @3×, stitched | A verified real SYD design at a desktop width. Vector source, 3× headroom. ⛔ Exported from Juan's session duplicate of the file; the record's key `5UgctLxZLh0CFoxJpaFpAB` is the original and is correct. |
| Logo / brand marks | Existing `assets/logo-full.svg`, `logo-footer.svg` | Already extracted, already verified. |

### Measured sharpness headroom — why nothing softens

| Asset | Source px | Displayed at | Headroom |
|---|---|---|---|
| Hero 1440 | 2880×1800 | 1440 wide in frame | **2.0×** |
| Hero 1280 | 2560×1600 | 1280 wide | **2.0×** |
| Hero 375 | 750×1624 | 375 wide | **2.0×** |
| Strip 1440 (S1 scroll) | 2880×9200 | 1440 wide | **2.0×** |
| Figma 1280 design hero | **3840×2340** | 1280 wide | **3.0×** |

**Nothing in the piece is below 2×.** ✅ Resolved — Open #2 is closed.

⛔ **The Figma exporter refuses above 16 MP**, and the whole artboard could not clear it: `1082:1875`
at 1280×9410 is 12.0 MP at 1× and projects to **48 MP** at 2×. Solved by exporting the **hero
sub-frames only**, which is all S4 ever shows:

| Node | Name | Size | @3× | MP |
|---|---|---|---|---|
| `1101:7209` | `Navbar / 2 /` | 1280×80 | 3840×240 | 0.9 ✅ |
| `1082:2357` | `Header / 30 /` | 1280×700 | 3840×2100 | 8.1 ✅ |

Stitched with `vstack` into `figma-paciente-1280-hero@3x.png` — **3840×2340**, i.e. 1280×780 CSS at
3×. Exported and inspected this session: real SYD content, no placeholders.

⛔ **Do not pass `allowLargeExport`.** A timed-out Figma export cannot be cancelled and leaves the
plugin unresponsive — the same wedge that cost upOS a session.

---

## Timeline

| Scene | Frames | Time | Beat |
|---|---|---|---|
| S1 | 0–480 | 0.0–8.0s | A session tonight — the page, scrolled |
| S2 | 480–840 | 8.0–14.0s | Three readers don't share a question |
| S3 | 840–1200 | 14.0–20.0s | The same layer, three widths |
| S4 | 1200–1560 | 20.0–26.0s | Designed it, then built it |
| S5 | 1560–1800 | 26.0–30.0s | Back to the top — the seam |

---

## Scene 1 — A session tonight  (t: 0.0–8.0s · f0–480)

- **Beat:** this is a real page that answers one person's real question, and it is wholly his.
  Let it be a page, not a screenshot.
- **Look:** the live Paciente capture at 1440, full colour, light. Nothing added on top.
- **Layout:** frame 0 is the hero at scroll 0 — and that frame becomes the poster.

⛔ **A stepped scroll, not a constant crawl.** Constant velocity reads as a screen recording; eased
moves with holds read as authored. Four moves against the real captured geometry:

| Frames | From y | To y | Behaviour |
|---|---|---|---|
| 0–96 | 0 | 0 | **Hold** on the hero — urgency headline + both store CTAs. 1.015× push on the strip only: motion without zoom. |
| 96–186 | 0 | ~1180 | Ease to *"Cuidar da sua saúde emocional nunca foi tão simples"* — the 3-step. |
| 186–228 | ~1180 | ~1180 | Hold. |
| 228–318 | ~1180 | ~2340 | Ease to *"Por que escolher o SYD?"* — the value timeline. |
| 318–360 | ~2340 | ~2340 | Hold. |
| 360–480 | ~2340 | ~3450 | Ease to the **R$ 1,99 / minuto** pricing band and **settle**. |

All moves `power2.inOut`; the final settle runs slightly long so S2 opens from stillness.
⚠️ Exact y values are pinned at build time by querying the live section offsets, never guessed.

✅ **GATE 1 on the strip — inspected at 2880×9200.** The traversed band contains, in order: hero ·
*"Cuidar da sua saúde emocional nunca foi tão simples"* + the numbered 3-step · *"Por que escolher o
SYD?"* + the value timeline · *"Transparência e liberdade"* + the **R$ 1,99/minuto** pricing pair ·
the corporate band. No dummy identifiers, no repeated rows, no stray menus on any resting surface.

⛔ **Do not extend the S1 scroll past 4600 css px without re-running GATE 1.** Just below the cut is
*"Psicólogos disponíveis agora"*, a practitioner grid carrying names and session counts
(`Tati Nantes 48`, `Carina Souza 72`, `Maksem Noyer 30`, `Jessica Luz 27`). Those were **not
inspected** because the camera never reaches them, and they have the shape of seeded demo records.
They are published on the live site either way — but putting them on screen in portfolio media is a
different act from them existing on a page, and it needs a look first.

- **Camera:** the scroll *is* the camera. No separate move.
- **Transition out:** none — S2 begins from the settled frame.

---

## Scene 2 — Three readers don't share a question  (t: 8.0–14.0s · f480–840)

> ⭐ **This scene is the case study's argument in one gesture.** It replaces a sentence with a move,
> and the sentence it replaces is already in the record: *"The temptation on a project like this is
> one landing page with three tabs. It does not work, because the three readers do not share a
> question."*

- **Beat:** same product, same visual system, three incompatible questions.
- **⛔ The gesture is NOT a slide between three near-identical pages.** The three heroes share an
  illustration system and a layout. Sliding between them would read as a text swap. Instead:
  **hold the page chrome and the illustration fixed, and let the argument change inside it.** The
  shared system becomes the control; the changing argument is the variable. That is the claim.
- **What actually changes — verified against the re-captured heroes, not assumed:**

| | Nav items | Nav CTA | Hero headline | Hero CTA |
|---|---|---|---|---|
| **Paciente** | Início · Como funciona · Benefícios · **Planos** · Contato · FAQ | Entrar · **Agendar consulta** | *"Atendimento psicológico quando você mais precisa."* | Play Store · App Store |
| **Profissional** | Início · Como funciona · Benefícios · FAQ | Entrar · **Cadastre-se** | *"A plataforma feita por psicólogos para psicólogos."* | Play Store · App Store |
| **RH** | Início · Como funciona · Benefícios · Contato · FAQ | **Agendar apresentação** | *"Apoio psicológico imediato para colaboradores, sem burocracia."* | **"Fale com nosso time"** |

⭐ **Three different conversion paths, and that is the whole argument:** book a session · sign up as a
provider · book a demo. The nav *structure* differs too — only Paciente carries `Planos`, because only
the patient is buying a plan. This is far more than a headline swap, and it is all verifiable on screen.

⭐ **The illustration is identical across all three** — confirmed by eye on the re-captured heroes.
That is the control. Everything that moves in this scene is an argument changing; everything that
holds still is the product staying the same. ⚠️ An earlier PSNR test appeared to show the
illustrations differing — that test was aimed at mismatched layout offsets and measured nothing.

- **Motion:** f480–600 Paciente → Profissional, f600–720 hold, f720–840 → RH. Each transition is a
  12-frame crossfade on the copy block with a 40px `power2.out` rise; the browser chrome and the
  illustration never move. Each audience holds ~2.0s — long enough to read the headline.
- **Label:** a small audience chip (`PACIENTE` / `PROFISSIONAL` / `RH`) cuts with each swap.

---

## Scene 3 — The same layer, three widths  (t: 14.0–20.0s · f840–1200)

- **Beat:** it was not designed once and squeezed. It reflows.
- **Motion:** the 1440 desktop window contracts to 1280 (f840–960), holds (f960–1020), then the
  1280 collapses into the 375 phone chassis (f1020–1140) and holds. At f1140 the frame pulls back
  into the **3 × 3 matrix** — three audiences across, three widths down — and settles at f1200.
- ⛔ **Scale and translate cannot share an element.** `transform-origin` resolves in the scrolled
  space and turns a small centre push into tens of pixels of drift. Outer scaler, inner track.
- ⛔ **Two `<img>` sharing one `src`** trips HyperFrames' duplicate-media detection and can render
  **blank**. The matrix reuses heroes that also appear in S1–S2; every reuse gets its own filename.
- **Claim note:** this scene shows the **built** layer, which is what the captures prove. It carries
  no Figma provenance and must not be captioned as "nine designed states" — see *Open decisions #1*.

---

## Scene 4 — Designed it, then built it  (t: 20.0–26.0s · f1200–1560)

- **Beat:** the design and the code are the same job, and one person did both halves.
- **⛔ REVISED from v1's plan.** The wireframe stage is **cut**: all three 1440 "wireframes" are
  lorem-ipsum stock template, so showing one would be visually dead and argumentatively risky.
  The beat is now **design → code**, which is the confirmed claim on the record
  (*"Designed and coded the landing pages — not the product"*, status `confirmed`).
- **Motion:** the Figma Paciente **1280** hero sits in frame at f1200 with a thin artboard label.
  f1290–1350: a **60-frame crossfade** into the live **1280** coded capture at *identical scale and
  position*. f1350–1470 the camera holds on the agreeing band. f1470–1560 pulls back and begins the
  return.

- ⛔ **Frame the band where the two AGREE — the design and the build are not identical.** Measured by
  overlaying the exported hero against the corrected capture:

| | Figma design | Live build |
|---|---|---|
| SYD logo lockup + *"Saúde mental a um clique"* | **present**, above the headline | **dropped** |
| Nav right side | `Agendar consulta` only | **`Entrar` added** + `Agendar consulta` |
| Headline wrap | 2 lines | **3 lines** |
| Hero background | soft green-tinted gradient | near-white |
| Body copy · both store CTAs | — | **match closely** |

  ⛔ **REVISED once the offsets were actually measured.** The first plan was to frame only the band
  where the two agree and crop the lockup out. That does not work: the headline wraps **2 lines in
  Figma and 3 in code**, so the "agreeing" band is 301 css px on one side and 411 on the other. No
  crop aligns them. Building to that spec would have meant forcing the assets to match a plan
  written before the measurement.

  **⛔ And then TWO transitions were built, looked at, and rejected — recorded so nobody rebuilds them:**

  | attempt | what it looked like | why it failed |
  |---|---|---|
  | 60-frame **crossfade** | both headlines legible at once, ghosted lockup over the body copy | the 2-line and 3-line headlines sit at different `y`, so mid-dissolve the frame carries two readable headlines. Reads as a rendering fault. |
  | 1.3s **left-to-right wipe** + lit seam | build's text chopped mid-glyph against the design's at every edge position; nav row renders `FAContato FAQ` | a wipe only works when the two sides agree *within each row*. These agree nowhere — nav spacing differs, and the vertical offset means the same row holds different content on each side. |

  **What ships: a clean CUT at 21.9s**, with a 0.45s scale settle (1.028 → 1.0) so it reads as an
  authored shot change rather than a dropped frame. Two shots, two origins, one page.

  ⭐ The cut is not a compromise — it is the *only* option that shows both versions truthfully. A
  dissolve or wipe would have smeared the very differences that make the argument: across the cut
  the lockup vanishes, `Entrar` appears, the headline rewraps 2 → 3 lines and the tinted hero
  background goes white, all in one frame, all legible.

- ⭐ **The differences are the point, not a problem.** Dropping a hero lockup and adding an `Entrar`
  affordance are *build-time* decisions. Someone who only handed off a design does not make them.
  This is the record's confirmed claim — *"Designed and coded the landing pages"* — shown rather than
  stated. Same crossfade technique upOS used to hide a resolution upgrade; here it carries an argument.
- ✅ The Figma side is **3840×2340 = 3.0× headroom** at its 1280 display width, and is never pushed
  past 1.04×. It is the sharpest asset in the piece, not the softest.

---

## Scene 5 — Back to the top — the seam  (t: 26.0–30.0s · f1560–1800)

- **Motion:** the 1280 view returns to 1440 and the scroll runs back to y=0, arriving **settled**
  ~20 frames before the end so the join is on a still frame, not mid-move.
- **GATE:** frame 0 and frame 1799 must be **byte-identical** (`sha256sum`). "They look similar" is
  not the test.
- ⛔ **Trim redundant head/tail frames before encoding.** Identical frames either side of the join
  freeze the loop for a beat — upOS encoded 1798 of 1800 for exactly this reason. Count the
  pixel-identical run at both ends and trim before ffmpeg, not after.

---

## Encode plan

**Render path — chosen for quality, not convenience:**

```
npx hyperframes render --format png-sequence --fps 60    # lossless RGBA, 1800 frames, ~420 MB
        ↓
ffmpeg from the PNG sequence directly — never from an intermediate MP4
```

⛔ **Not `--format mp4` then re-encode.** That is what v1 did, and it is why v1's deliverables are
2nd-generation from a 5.3 Mbps lossy master. The PNG sequence keeps the encoder's input lossless and
makes the SSIM reference honest.

**Delivery set — matching the upOS 60fps loop, per Juan 2026-09-14 (no file-size limit):**

```bash
SEQ=renders/seq/frame_%06d.png
TAG="-color_primaries bt709 -color_trc bt709 -colorspace bt709"

# H.264 High L4.2 — the universal fallback, and what Safari will actually play
ffmpeg -framerate 60 -i $SEQ -an -c:v libx264 -profile:v high -level 4.2 \
  -pix_fmt yuv420p -crf 18 -preset slow $TAG -movflags +faststart syd-showcase.mp4

# VP9 Profile 1 / yuv444p — see the chroma finding below
ffmpeg -framerate 60 -i $SEQ -an -c:v libvpx-vp9 -pix_fmt yuv444p -profile:v 1 \
  -crf 24 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 $TAG syd-showcase.webm
```

### ⛔ Why Profile 1 / 4:4:4 — and why it must be re-measured on SYD, not inherited

upOS measured its own encodes on brand blue against white UI text and found the ceiling was **not**
quantization but **chroma subsampling**: mean absolute channel delta 9.87 with max **91** at
yuv420p, against 6.38 and max **29** at yuv444p. Max error falling 91 → 29 *is* the visible glyph
fringing disappearing.

SYD's accent is `#6460BE` and its pages are purple-on-white type throughout — structurally the same
failure mode. ⛔ **But the finding was upOS's, not SYD's**, so it was re-measured here rather than
inherited.

### ✅ MEASURED on SYD — 2026-09-14

Probe: **frame 600** (S2, the Paciente hero at full size). **55,559 saturated-purple pixels**
sampled — upOS sampled 1,218. Each candidate encoded over a **121-frame window** (540–660) so
inter-frame prediction is realistic, then compared against the **lossless PNG source**, never
against another lossy encode.

| encode | mean abs delta | **max** | MB / 121f |
|---|---|---|---|
| VP9 P0 · yuv420p · crf 24 | 5.86 | **65** | 0.37 |
| **VP9 P1 · yuv444p · crf 24** | **3.88** | **15** | 0.46 |
| H.264 High · yuv420p · crf 18 | 6.09 | 72 | 0.23 |

**Max channel error falls 65 → 15 for 1.25× the bytes.** That is the visible glyph fringing
disappearing, and it is the same shape as upOS's 91 → 29. **Profile 1 ships.**

⚠️ SYD's absolute errors are milder than upOS's (max 65 vs 91 at 4:2:0) because `#6460BE` is less
saturated than upOS's `#155EEF`. The conclusion matches, but the numbers do not — which is the
argument for re-measuring rather than inheriting.

⚠️ H.264 at crf 18 scores marginally *worse* than VP9 P0 at crf 24 (6.09/72 vs 5.86/65) at two
thirds the size. That is expected and fine: it is the fallback, and it has to be 4:2:0 — H.264
4:4:4 needs High 4:4:4 Predictive, which browsers effectively do not decode.

### ⛔ Level 4.2, not 4.0

1920×1080**60** exceeds H.264 level 4.0's macroblock rate. The published `<source type>` codecs
string must describe the file actually shipped — read it back with
`ffprobe -show_entries stream=profile,level` and derive the string from *that*:

| File | Expected | Codecs string |
|---|---|---|
| `syd-showcase.mp4` | H.264 High, level 4.2 | `avc1.64002A` |
| `syd-showcase.webm` | VP9 Profile 1, 1080p60 → level 4.1 | `vp09.01.41.08` |

⛔ v1 ships `vp09.00.40.08` (Profile 0, level 4.0) and both change here. A bare
`type="video/webm"` re-opens the blank-box failure for every record at once.

⚠️ **Safari is untested in this environment against every VP9 profile already live.** Profile 1 is
the *third* profile in the portfolio. Safari never touches the WebM **if** the `<source>` order puts
MP4 within reach and the `avc1` string is right — so proving the H.264 fallback fires is the real
work, and it is required regardless of which profile ships.

### The poster

⛔ **The poster is usually not frame 0** — but here it deliberately is, because S1 opens on a settled
hero with a 96-frame hold. That makes frame 0 both a legitimate poster *and* a safe `hoverStart: 0`.
Verify by sampling the opening at 0.25s steps and looking; do not assume it because v1 assumed it.

Both stills come from the **same PNG frame**, so `<picture>` can never show two different pictures:

```bash
ffmpeg -i renders/seq/frame_000001.png -c:v libwebp -quality 82 -preset picture syd-showcase.webp
ffmpeg -i renders/seq/frame_000001.png -q:v 4 syd-showcase.jpg
```

GATE: PSNR between the two stills ≈ 40 dB+, not ≈ 8 dB.

---

## Delivery — one file doing both jobs

Per Juan 2026-09-14: **one 60fps 30s file** wired to both `publish.previewMotion` and the body
`video` block. He will cut the shorter hover/mockup variant himself from this render afterwards.

⚠️ **Recorded so it is not forgotten:** a 30s 60fps clip on the homepage card hover is the shape
behind the measured 31.6 MB autoload incident. The `IntersectionObserver` start (never `autoplay`),
the `no-js` class, and the reduced-motion early-return all remain mandatory on the card — they are
what make a heavy clip safe there, and they are non-negotiable regardless of file size.

---

## Open decisions — each one is Juan's

1. 🔴 **The "nine designed states" claim — the only blocking one, and it is about COPY, not the render.**
   Case-study block 8 is live and reads *"Each page went wireframe first, then design at 1440, 1280
   and 375, then code. Nine designed states, all of them mine."*

   Verified: the wireframe → design → code *process* is real and the *built* layer does reflow at all
   three widths. But the breakpoints are wrong and the count is **six designed, not nine** — 1440
   exists only as a stock wireframe and as shipped code, never as a Figma design.

   Proposed rewrite, carrying only what is measured:

   > *Each page went wireframe first, then design, then code — six designed states across three
   > audiences at 1280 and 375, and a built layer that reflows across 1440, 1280 and 375.*

   ⚠️ Also worth a second look: the wireframes are the component library's **stock lorem-ipsum
   template**, unmodified. That is ordinary practice and the record already volunteers the
   library caveat — but "went wireframe first" reads as bespoke wireframing to a stranger, and it
   is the kind of gap this store normally closes before someone else finds it.

   ⛔ **Not blocking the render.** S3 is deliberately captioned with no Figma provenance, so the
   video is correct under either wording.

2. ✅ **CLOSED — S4's Figma export route.** Hero sub-frames at 3× (`1101:7209` + `1082:2357`),
   stitched to 3840×2340. Nothing in the piece is below 2× headroom.

3. 🟡 **Re-measure the chroma finding on SYD before shipping Profile 1**, per the encode plan. One
   sweep on SYD's own `#6460BE` glyph edges; removes an assumption inherited from upOS. I will run
   this during the build — it is not a decision for Juan.

---

## Build log — what the render exposed (2026-09-14)

Two defects reached a finished 1800-frame render and neither was visible in any
green check. Both were caught by measuring the frames themselves.

### ⛔ The master was 17% TRANSPARENT, and it would have encoded against black

`png-sequence` output came back `rgba`, and frame 1 measured **357,949 non-opaque
pixels (17.26%)** with alpha as low as **72**. Encoding that composites against
**black** by default — dark halos through every ambient glow and every window
box-shadow, on a light-themed piece.

The cause was in this composition's own CSS, not the tool. `#ground` was
`radial-gradient(circle at 50% 28%, rgba(100,96,190,0.055) 0%, …)` — the first stop
is **5.5% opaque**, so the backdrop was nearly transparent at the centre and relied
on `body`'s white showing through. A browser composites that correctly. An
**alpha-capturing render does not.**

⛔ **A flatten-over-white at encode time is NOT the fix.** It was measured and it does
work — it lifts frame 1 from PSNR 37.9 dB to 48.3 dB against the verified snapshot.
It was rejected anyway: a master that is only correct when someone remembers to
flatten it is a fragile master, and the next re-render or format change silently
brings the halos back. The fix belongs in the composition:

```css
background:
  radial-gradient(circle at 50% 28%, rgba(100,96,190,0.055) 0%, #F8F9FD 68%, #EEF1F8 100%),
  #FFFFFF;   /* ← the opaque layer that makes the master self-contained */
```

⭐ **The payoff was larger than the fix.** With the page opaque, HyperFrames stopped
capturing alpha entirely — output became `rgb24`, the sequence dropped **1550.6 MB →
1059.6 MB**, render time dropped **9m 40s → 6m 24s**, and rendered frame 1 became
**byte-identical** to the verified snapshot instead of merely close.

### ⛔ The loop froze for 3.00 seconds, and the storyboard had asked for 0.33

Measured on the first render: **180 pixel-identical tail frames**. S5 settled
everything by 26.8s and then sat there until 30.0s. This section had specified
"settle ~20 frames before the end"; the implementation missed its own spec by 9×.

Fixed by keeping the return **in motion** almost to the end — the strip drifts home
from a 150px offset over 3.2s on `power2.out` — rather than by trimming 180 frames
away. Re-measured after the fix:

| | first render | after fix |
|---|---|---|
| last moving frame | 1620 (t=26.98s) | **1764 (t=29.383s)** |
| identical tail frames | **180 (3.00s)** | **36 (0.60s)** |
| identical head frames | — | **1** (frame 2 already differs) |

### The trim

Frames **1765–1800** are byte-identical to frame 1. Shipping all 1800 would hold the
join for 37 frames; shipping 1–1764 would give the loop no breath at all. **Ship
frames 1–1778** — 1778 frames, **29.633s**, with a deliberate **0.25s (15-frame)**
rest at the join.

### ⚠️ This machine renders without a GPU

`browserGpuMode probe → software (WebGL unavailable)`, so the render falls back to
`workerCount: 1` with `forceScreenshot: true`. That is why a render costs ~6–10
minutes here against upOS's 5m 22s, and it is an environment limit, not a
composition problem. Budget for it before iterating on motion.

⚠️ **A rendered frame will not byte-match a snapshot while the render carries alpha** —
different pixel format, different file bytes, identical picture. Compare pixels
(`psnr`) before calling that a failure. Once the page is opaque, both paths emit
`rgb24` and the hashes match exactly.

---

## Delivered — measured 2026-09-14

Render: **1800/1800 frames, 1059.6 MB, 6m 24s**, `rgb24`. Rendered frame 1 is **byte-identical** to
the verified snapshot (`8db89ca8…`), and frame 1 == frame 1800. Encoded **frames 1–1778**.

`renders/out-v2/` — all BT.709, no audio, 1920×1080, 60fps, **29.633s**:

| File | Codec | Size | `<source type>` codecs |
|---|---|---|---|
| `syd-showcase.mp4` | H.264 **High / level 4.2** / yuv420p, crf 18, faststart | **18.71 MB** | `avc1.64002A` |
| `syd-showcase.webm` | VP9 **Profile 1 / yuv444p**, crf 24 | **31.95 MB** | `vp09.01.41.08` |
| `syd-showcase.webp` | frame 1 | 0.07 MB | — |
| `syd-showcase.jpg` | frame 1 | 0.17 MB | — |

⛔ **Level 4.2, not 4.0** — read back from the file, not assumed. 1920×1080@60 is **124,416,000**
luma samples/sec, over VP9 level 4.0's 83,558,400 ceiling and inside 4.1's 160,432,128 → VP9 level
**4.1**. v1 published `vp09.00.40.08`; **both halves of that string change here.**

### GATE 4 — all passed

| check | result |
|---|---|
| SSIM mp4 vs **lossless PNG source** | Y **0.9976** · All 0.9968 ✅ |
| SSIM webm vs **lossless PNG source** | Y **0.9902** · All 0.9935 ✅ |
| Dense-text crop at 1:1, by eye | indistinguishable across source / mp4 / webm ✅ |
| Text-crop PSNR | mp4 38.06 dB · **webm 45.48 dB** — the 4:4:4 gain, +7.4 dB, exactly where predicted ✅ |
| `ffprobe` profile/level vs published strings | match ✅ |
| Two stills, same photograph | PSNR **44.99 dB** ✅ |
| Master survives locally | `renders/seq2/` 1059.6 MB, gitignored ✅ |

⭐ **This SSIM means something v1's did not.** v1 measured against its own 5.3 Mbps lossy master, so
it was structurally blind to the first generation of loss and still reported 0.9967. Here the
reference is the lossless PNG sequence, so the number covers the whole chain.

### ⛔ Not yet uploaded — this overwrites live objects

`https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/` currently serves **v1**:
`syd-showcase.mp4` at 4,034,641 B and `syd-showcase.webm` at 3,638,793 B, both HTTP 200. The new
files take the **same names**, so upload replaces what production serves — from ~4 MB to 18.7 MB and
~3.6 MB to 32.0 MB. Bucket `fesn-assets`; wrangler 4.131.1 authenticated and verified this session.

⛔ v1's local deliverables in `renders/out/` were deliberately **left untouched** — the new set went
to `renders/out-v2/`. v1's `index.html` no longer exists, so those files are the only local copy of
what is currently live.

---

## Handoff

1. **Juan reviews this file.** Nothing renders before that.
2. Resolve Open #1 (copy), #2 (Figma route), #3 (chroma sweep).
3. Export the Figma design per #2. ⛔ `3-LP` only.
4. Build the composition; `npx hyperframes check` → 0 errors, 0 warnings.
5. `npx hyperframes snapshot --at 0,8,14,20,26,29.98` → eyeball six frames **including the seam pair**.
6. `sha256sum` frame 0 vs frame 29.98 → byte-identical or the loop is not a loop.
7. `npx hyperframes preview --background` → Juan reviews motion in Studio.
8. `render --format png-sequence` → trim the identical head/tail run → encode → report **measured** bytes.
9. Upload, then verify **200 with matching bytes AND 206 on Range** for every file.
10. Deploy, then verify on the deployed origin in a fresh context: console clean, `currentSrc`
    populated, page weight without scrolling, reduced-motion fetches nothing, scripting-off fetches
    nothing.
