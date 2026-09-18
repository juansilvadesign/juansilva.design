# Storyboard — Pro Personal · Three-Role Platform Showcase (Hero tl;dr)
**Canvas:** 1920×1080 · 60fps (3600 frames) · **Duration:** 60.0s · **Engine:** HyperFrames · **Grade:** Premium Dark/Purple Clinical Tech

> **Concept:** The complete Pro Personal case study told through motion in 60 seconds: translating a 500+ page sports science specification from a Universidade de São Paulo (USP) researcher into a 700-frame, 3-role platform (Personal, Aluno, Admin). Engineered with a bespoke 448-component design system built 100% from scratch with zero vendor kits, 12 semantically named color styles, advanced strength periodization (GVT, Rest-Pause, Drop Sets, RIR), clinical PAR-Q screening, dynamic adaptive fatigue warnings (`DiaCansado/AVISO`), and 119 unrolled full-height handoff screens in `Telas do Protótipo`.
> **Key Rule:** Shows the complete application and user journey with continuous motion, realistic scrolls, intentional pauses on key clinical/periodization mechanics, and live micro-interactions (cursor navigation, button clicks, tab switches, timer animations, modal overlays).

---

## Technical Specifications

| Parameter | Specification |
|---|---|
| **Canvas** | 1920×1080 (16:9 Full HD) |
| **Frame Rate** | 60 fps |
| **Duration** | 60.0s (3600 frames total) |
| **Color System** | Primary Brand: `Purple 1 Primary` `#663399` · `Purple 2 Primary` `#A26FD8` · `Purple 4 Primary` `#110035` · Background `#FAFAFA` / Deep Dark Canvas `#0F0C1B` · Contrast `Black Primary` `#231F20` · Stroke `#EBEBEB` · Elevation `Shadow Cards` |
| **Typography** | Display/Headers: `Inter` / `Montserrat` (600/700) · Body/UI: `Roboto` / `Inter` (400/500/600) · Monospace: `JetBrains Mono` |
| **Sound / Audio** | Silent / Ambient WebP & WebM video deliverables |
| **Loop Seam** | Seamless return to settled Hero Dashboard state at 60.0s matching frame 0 |

---

## Video Architecture & Case Study Media Set

To completely populate the case study page and deliver the tl;dr product showcase:

1. **Main Showcase Video (`pro-personal-showcase`)** — 60.0s, 1080p60:
   - Full product tour across the 3 user roles, clinical screening, workout periodization, adaptive fatigue, design system, and developer handoff.
   - Used for `previewMotion` (project card hover on homepage, project header hero, and social unfurl).

2. **Body Loop 1: Domain Modeling & Adaptive Fatigue (`pro-personal-periodization-loop`)** — 14.0s, 1080p60:
   - Placed in section: *Domain modeling: periodization, clinical screening, and adaptive fatigue*.
   - Focus: The 11 periodization protocols (GVT, Rest-Pause, Drop Set, RIR) + the dynamic `DiaCansado/AVISO` fatigue intercept warning state + workout timer.

3. **Body Loop 2: Zero Vendor Primitives & Design System (`pro-personal-design-system-loop`)** — 12.0s, 1080p60:
   - Placed in section: *Zero vendor primitives: a 448-component system built from scratch*.
   - Focus: 12-token semantic color ramp, `Shadow Cards` elevation, 60 variant sets, and Portuguese domain components (`Timer Circle`, `input_uploadvídeo`, `OpçõesSelect`, `Checkbox`, `vermais`).

4. **Body Loop 3: Developer Empathy & Telas do Protótipo (`pro-personal-dev-handoff-loop`)** — 14.0s, 1080p60:
   - Placed in section: *Developer empathy in practice: the 119-screen Telas do Protótipo*.
   - Focus: Massive horizontal camera pan across the 119 unrolled full-height handoff screens, prototype component layer (`NavBarProtótipo`), and in-canvas sticky notes.

---

## Main Showcase Scene Breakdown & Timeline Arc (60s)

### Scene 1: Brand Foundation & Design System from Zero (0.0s – 8.0s · f0 – f480)
- **Visual:** Cinematic entrance on dark atmospheric purple radial canvas (`#110035` → `#080412`).
- **Layers:**
  - Pro Personal brand mark & identity lockup (`logo-styleguide.png`).
  - 12 semantically named color swatch pills (`Purple 1-4`, `Black Primary`, `Grey Primary`, `Background #FAFAFA`, `stroke #EBEBEB`).
  - Floating bespoke domain components: `Timer Circle` + `Timer Numbers`, `OpçõesSelect`, `input_uploadvídeo`, `buttonSave`.
  - Stat counters floating into frame: `448 COMPONENTES AUTORAIS` · `ZERO KITS PRONTOS` · `ESPECIFICAÇÃO DE 500+ PÁGINAS (USP)`.
- **Narrative Chip:** `DESIGN SYSTEM AUTORAL` · *"448 componentes criados do zero, sem kits de terceiros"*.
- **Motion:** Logo scales smoothly in with glowing ambient back-light. Color swatches cascade left-to-right with spring easing. Component chips settle into an isometric stack that snaps together into the mobile application shell.

### Scene 2: The Trainer (Personal) Command Center (8.0s – 18.0s · f480 – f1080)
- **Visual:** Smooth transition into a floating iPhone 15 Pro mockup frame (Dark titanium, 393×852 logical viewport rendered at 2×).
- **Surface:** Personal Dashboard (`personal-home-dashboard.png`), `Alunos Ativos` (`personal-alunos-ativos.png`), and `Agenda`.
- **Interaction & Navigation:**
  - Cursor enters from top-right, glides to `Alunos Ativos` (showing student roster, active plans, pending assessments).
  - Cursor taps student card ("Lucas Mendes — Hipertrofia"), card elevates with `Shadow Cards` effect.
  - Screen transitions into student profile (`personal-pagina-aluno.png`).
  - Cursor navigates to `Montagem de Treinos`: selects periodization methodology tab (`Sistemas Avançados`).
- **Narrative Chip:** `FLUXO DO PERSONAL` · *"Gestão clínica, montagem de periodização e acompanhamento em tempo real"*.

### Scene 3: Sports Science: Advanced Periodization & Clinical PAR-Q (18.0s – 28.0s · f1080 – f1680)
- **Visual:** Dual-device focus / split-screen showcase of technical sports science rigor:
  - Left panel: Medical PAR-Q screening (`parq-trainer-evaluation.png`) with trainer review states (`visualiza-sim` / `visualiza-não`).
  - Right panel: Advanced periodization engine showing 11 specific strength methodologies:
    * Tags: `GVT` (German Volume Training 10×10), `DS` (Drop Set), `RP` (Rest-Pause), `RIR` (Reps in Reserve), `CS` (Cluster Sets), `3/7`.
- **Interaction:**
  - Cursor toggles between periodization protocols; workout document tables update dynamically (`treinoDocumento-DS.png` / `treinoDocumento-GVT.png`).
  - Cursor validates medical screening checkpoint, triggering a confirmation toast.
- **Narrative Chip:** `FISIOLOGIA DO EXERCÍCIO` · *"Modelagem digital de 11 metodologias avançadas de treinamento de força"*.

### Scene 4: The Student (Aluno) Journey & Workout Execution (28.0s – 38.0s · f1680 – f2280)
- **Visual:** Perspective tilt focusing on the Aluno workflow inside the mobile device.
- **Surface:** Student Home, Daily Session Checklist, Workout Execution View (`aluno-treino-execucao.png`).
- **Interaction & Animation:**
  - Aluno opens today's session: "Treino A — Peito, Tríceps & Ombro".
  - Interactive `Timer Circle` animates with a rhythmic countdown sweep (rest period between sets).
  - Aluno checks off finished set; progress bar fills smoothly with purple gradient (`#4472C4` → `#663399`).
  - Quick glance at comparative physique evaluation (`aluno-comparacao-fotos.png`) with side-by-side photo comparison slider and video execution upload slot (`input_uploadvídeo`).
- **Narrative Chip:** `EXPERIÊNCIA DO ALUNO` · *"Execução de treino, cronômetro de descanso e avaliação física comparativa"*.

### Scene 5: Adaptive Fatigue Warning — DiaCansado / AVISO (38.0s – 46.0s · f2280 – f2760)
- **Visual:** Cinematic intercept moment — highlighting the single most intelligent UX innovation in the product.
- **Surface:** Aluno filling out the 12-step Pre-Workout Questionnaire (`questionario-pre-treino.png`).
- **Event:**
  - High fatigue and poor sleep scores are submitted.
  - The UI triggers the dynamic 11-frame warning architecture: `DiaCansado/AVISO` (`aluno-diacansado-aviso.png`).
  - Modal smoothly blurs background and presents adaptive recovery protocol: automatic load reduction and active regeneration advice, protecting the athlete from neuromuscular overtraining.
- **Narrative Chip:** `FADIGA ADAPTATIVA` · *"Arquitetura de 11 telas que intercepta o atleta quando o cansaço atinge o pico"*.

### Scene 6: Developer Empathy & Telas do Protótipo (46.0s – 54.0s · f2760 – f3240)
- **Visual:** Dramatic camera pull-back from mobile frame into an expansive canvas view.
- **Surface:** The 119 unrolled full-height handoff screens in `Telas do Protótipo` (`telas-do-prototipo-pan.png`).
- **Details:**
  - Camera glides horizontally across rows of full-height unrolled screens created specifically to resolve a developer handoff blocker.
  - Zoom spotlight on the dedicated prototype component layer (`NavBarProtótipo`, `MenuNavBarProtótipo`) and yellow in-canvas sticky notes (`Sticky Notes`) containing developer specifications.
- **Narrative Chip:** `EMPATIA COM O DEV` · *"119 telas desdobradas manualmente em altura total para destravar a engenharia"*.

### Scene 7: Career Origin Quote & Infinite Loop Seam (54.0s – 60.0s · f3240 – f3600)
- **Visual:** Canvas dims slightly, bringing forward a typography quote card:
  - *"Passei dois anos desenhando produtos que nunca foram ao ar porque os builds no-code não conseguiam executá-los. Essa frustração foi a razão pela qual aprendi a programar: hoje entrego designs que eu mesmo consigo implementar."*
- **Camera:** Quote card dissolves with smooth blur. The mobile device smoothly centers back into the exact settled frame-0 Hero Dashboard position.
- **Frame 3600:** Identical to Frame 0 for a seamless, infinite loop.

---

## Asset Manifest (From Figma Channel opp67s47)

### Style Guide & Identity
1. `assets/figma/logo-styleguide.png` — Pro Personal Logo from `Style Guide` (`9:69`)
2. `assets/figma/styleguide-cores-primarias.png` — 12 Primary Color styles from `9:73`
3. `assets/figma/styleguide-cores-secundarias.png` — Secondary Colors & Gradients from `9:143`
4. `assets/figma/styleguide-espacamentos.png` — Grid & Spacing specifications from `9:98`
5. `assets/figma/styleguide-tipografia.png` — Typography specs from `9:134`
6. `assets/figma/styleguide-componentes.png` — Component board from `1725:11381` / `12:132`
7. `assets/figma/component-timer-circle.png` — Workout Timer Circle from `894:8530`
8. `assets/figma/component-timer-numbers.png` — Timer Numbers from `894:8535`
9. `assets/figma/component-upload-video.png` — Video Upload component from `5985:27925`

### Personal (Trainer) Workflow
10. `assets/figma/personal-home-dashboard.png` — Trainer Home from `App` / `Protótipo` (`5:2` / `6809:29421`)
11. `assets/figma/personal-alunos-ativos.png` — Active Students List from `193:481` / `1734:9792`
12. `assets/figma/personal-pagina-aluno.png` — Student Profile Detail from `207:1325` / `207:2968`
13. `assets/figma/personal-montagem-treinos.png` — Program builder & exercise library from `6923:51579`

### Domain Science: Periodization & Screening
14. `assets/figma/periodizacao-sistemas-avancados.png` — Advanced Periodization parent section from `6816:7138`
15. `assets/figma/periodizacao-gvt.png` — German Volume Training frame from `6813:12101`
16. `assets/figma/periodizacao-dropset.png` — Drop Set frame from `6813:11354`
17. `assets/figma/periodizacao-restpause.png` — Rest-Pause frame from `6813:13137`
18. `assets/figma/periodizacao-documento-treino.png` — Workout sheet from `7047:13678` / `7572:26364`
19. `assets/figma/parq-trainer-evaluation.png` — Medical PAR-Q screening review from `239:1709`
20. `assets/figma/questionario-pre-treino.png` — 12-Step pre-workout questionnaire from `7739:23364`

### Aluno (Student) Experience & Fatigue Warning
21. `assets/figma/aluno-home-treinos.png` — Student workout dashboard from `6850:36593` / `6844:36974`
22. `assets/figma/aluno-treino-execucao.png` — Live workout execution view from `7739:23613`
23. `assets/figma/aluno-diacansado-aviso.png` — 11-Frame Adaptive Fatigue Warning modal from `323:4493` / `7467:18947`
24. `assets/figma/aluno-comparacao-fotos.png` — Side-by-side physique evaluation from `6820:39368`
25. `assets/figma/aluno-minha-evolucao.png` — Progress graphs & metrics from `6916:43678`

### Developer Empathy: Telas do Protótipo & Handoff
26. `assets/figma/telas-do-prototipo-overview.png` — Wide capture of the 119 unrolled screens from `8265:21142`
27. `assets/figma/dev-sticky-notes.png` — Developer implementation notes from `6968:14707` / `7055:14649`
28. `assets/figma/component-navbar-prototipo.png` — Dedicated prototype component layer from `6961:46557`

---

## Delivery Set Plan (Stage 4)

1. `pro-personal-showcase.mp4` (H.264 High L4.0, 1920×1080, CRF 24, faststart, ~60s)
2. `pro-personal-showcase.webm` (VP9 Profile 0, two-pass, 1920×1080, CRF 34, ~60s)
3. `pro-personal-showcase.webp` (Poster still at settled Hero frame, quality 82)
4. `pro-personal-showcase.jpg` (Poster still matching WebP)
5. Accompanying Body Loops:
   - Loop 1: `pro-personal-periodization-loop.mp4` & `.webm` (~14s, Periodization & DiaCansado)
   - Loop 2: `pro-personal-design-system-loop.mp4` & `.webm` (~12s, 448 Components & Style Guide)
   - Loop 3: `pro-personal-dev-handoff-loop.mp4` & `.webm` (~14s, 119 Unrolled Telas do Protótipo)
