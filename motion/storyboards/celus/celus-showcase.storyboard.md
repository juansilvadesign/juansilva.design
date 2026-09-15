---
title: Celus Showcase Storyboard
duration: 55.0
fps: 60
resolution: 1920x1080
music: none
theme: clean-clinical-light
slug: celus-showcase
---

# Storyboard — Celus · "Bedside Decisions, Clinical Rigour" · 1920×1080 · 55.0s · 60fps (3300f) · **silent, seamless loop, high-key clean clinical**

> **Concept:** Point-of-care ultrasound (POCUS) happens directly at the patient's bedside under time pressure. A clinician holding a transducer in one hand needs immediate, unambiguous guidance. This flagship showcase walks through the nineteen-module clinical ultrasound suite Juan Silva designed solo—from the bedside clinician mobile interface (Home, MEDUltra fetal biometry, the 5-step ACR TI-RADS risk scoring engine, LaudUS reporting, ProtocolUS transplant guidelines) to the administrative back-office knowledge governance CMS, concluding with the Next.js marketing surface and multi-device responsive continuity.
> **CTA:** None. This is case-study hero media and portfolio evidence, not an advertisement.
> **Engine:** HyperFrames (HTML / GSAP → frames).
> **Slot:** `celus.json` → `previewMotion` + case study hero video.
> **Status:** PROPOSED FOR APPROVAL.

---

## Format Decision

| Parameter | Specification | Rationale |
|---|---|---|
| **Canvas** | **1920×1080**, high-key clinical light (`#FFFFFF` on `#F8FAF9` with Celus mint `#35B48B` accents) | Authentic clinical healthcare feel; crisp readability |
| **Frame Rate** | **60fps** (3300 frames total) | Silky UI scroll, tactile stepper animations, and device transforms |
| **Duration** | **55.0s = 3300 frames** | Complete narrative arc covering the bedside app, ACR TI-RADS, Admin CMS, and LP |
| **Audio** | None (`music: none`) | Zero third-party audio baggage; pure visual portfolio evidence |
| **Loop** | **Seamless** | Frame 3300 composites identically to Frame 0 |
| **Delivery** | H.264 MP4 (CRF 24) + VP9 WebM (CRF 36) + WebP / JPG stills from same master frame | Cross-browser standards, seekable HTTP Range, lightweight delivery |

---

## ⛔ Claim Guard — What this video may and may not assert

| May show & assert | May NOT show or imply |
|---|---|
| Juan **designed 100% of the UI across all 19 modules** | That Juan **coded or built the clinical application in Bubble** (built by another developer) |
| Juan **designed and coded the marketing landing page in Next.js** | That Juan ran the discovery workshop (Thiago, tech lead, ran it in FigJam) |
| 11 clinician bedside modules + 8 admin CMS governance modules | That Juan invented the entire design system from scratch (productionized agency starter) |
| The tactile 5-step ACR TI-RADS clinical calculation stepper | Any medical backend or EHR/EMR patient records integration (form capture only) |
| Production-grade 2-tier token system with 158 variables | Clinical adoption / conversion metrics (confirmed absence) |
| Real pixels extracted directly from Figma & live Next.js build | Fictional or synthetic reconstructed mockups |

---

## Asset Manifest

Every asset below exists in `assets/` and was verified by direct visual inspection (GATE 1 passed):

| File | Resolution | Origin | Scene Usage |
|---|---|---|---|
| `clinician-home.png` | 720×2380 (@2x) | Figma `19011:74` (home-aprovacao) | S1 (Open: Bedside Home) & S6 (Loop join) |
| `clinician-home-end.png` | 720×2380 (@2x) | Byte-duplicate of `clinician-home.png` | S6 (Zero-duplicate loop join) |
| `medultra-list.png` | 900×2000 (@2.5x) | Figma `19120:12315` (lista 3.1.1) | S2 (MEDUltra Fetal Biometry) |
| `calculus-step1.png` | 900×2000 (@2.5x) | Figma `19130:18798` (CalculUS-step1) | S3 (CalculUS ACR TI-RADS Stepper) |
| `calculus-step2.png` | 900×2000 (@2.5x) | Figma `19141:10470` (CalculUS-step2) | S3 (CalculUS ACR TI-RADS Stepper) |
| `calculus-step3.png` | 900×2000 (@2.5x) | Figma `19141:10704` (CalculUS-step3) | S3 (CalculUS ACR TI-RADS Stepper) |
| `calculus-step4.png` | 900×2000 (@2.5x) | Figma `19141:11021` (CalculUS-step4) | S3 (CalculUS ACR TI-RADS Stepper) |
| `calculus-step5.png` | 900×2000 (@2.5x) | Figma `19142:10813` (CalculUS-step5) | S3 (CalculUS ACR TI-RADS Stepper) |
| `calculus-result.png` | 900×2750 (@2.5x) | Figma `19144:10950` (CalculUS-step5-2) | S3 (CalculUS ACR TI-RADS Result) |
| `laudus-list.png` | 900×2000 (@2.5x) | Figma `19109:43745` (lista 5.1.1) | S4 (LaudUS Reporting Templates) |
| `protocolus-list.png` | 900×2000 (@2.5x) | Figma `19109:43735` (lista 7.1.1) | S4 (ProtocolUS Guidelines) |
| `protocolus-detail.png` | 720×6016 (@2x) | Figma `19200:35440` (artigo 7.4.1) | S4 (Renal Transplant Protocol) |
| `admin-dashboard.png` | 1920×1838 (@1.5x) | Figma `19106:23307` (dash) | S5 (Admin Back-Office Dashboard) |
| `admin-laudus-cms.png` | 1920×1142 (@1.5x) | Figma `19109:28732` (LaudUS 3.1) | S5 (LaudUS Knowledge CMS) |
| `admin-protocolus-cms.png` | 1920×1142 (@1.5x) | Figma `19109:33468` (ProtocolUS 5.1) | S5 (ProtocolUS Knowledge CMS) |
| `admin-analytics.png` | 1920×1391 (@1.5x) | Figma `19109:44901` (Analytics 7.1) | S5 (Admin Invocation Metrics) |
| `landing-desktop-1440.png` | 1440×900 | Playwright capture `celus.juanpablosilva.com.br` | S6 (Coded Landing Page & Trio) |
| `landing-mobile-375.png` | 375×812 | Playwright capture `celus.juanpablosilva.com.br` | S6 (Mobile Landing Page & Trio) |
| `celus-logo.png` | 309×96 (@3x) | Figma `20040:576` (logo) | Header branding & overlays |

---

## Detailed Scene Breakdown

```
0.0s             8.0s              18.0s             30.0s              38.0s             48.0s           55.0s
|----------------|------------------|-----------------|------------------|-----------------|----------------|
[ S1: BEDSIDE ]   [ S2: MEDULTRA ]   [ S3: TI-RADS ]   [ S4: PROTOCOLS ]  [ S5: ADMIN CMS ] [ S6: ORCHESTRA ]
 Home & Urgency   Biometry Tables    5-Step Stepper    LaudUS & Protocol   Knowledge Admin   Multi-Surface & Loop
```

### Scene 1: Point-of-Care Bedside Urgency — Home Dashboard (0.0s – 8.0s | f0 – f480)
- **Visual**: Opens centered on a high-fidelity iPhone chassis displaying `clinician-home.png`.
- **Top Badge Dock**: `CELUS CLINICAL SUITE` · `BEDSIDE POCUS` · `MODULE 02: HOME`.
- **Callout Pill**: *"Apoio à decisão clínica imediata: calculadoras frequentes e atalhos diagnósticos."*
- **Motion**:
  - `0.0s – 1.0s`: Settled opening frame (poster frame at t=0.5s).
  - `1.0s – 4.5s`: Gentle camera punch-in (scale 1.00 → 1.06) focusing on the quick-access calculator tiles and recent activity.
  - `4.5s – 7.5s`: Fluid vertical scroll through the clinician home feed.
  - `7.5s – 8.0s`: Camera glides upward and prepares cross-fade into MEDUltra.

### Scene 2: Structured Clinical Knowledge — MEDUltra Biometry Database (8.0s – 18.0s | f480 – f1080)
- **Visual**: Smooth cross-dissolve to `medultra-list.png` inside the phone chassis.
- **Top Badge Dock**: `CLINICAL REFERENCE` · `FETAL BIOMETRY` · `MODULE 03: MEDULTRA`.
- **Callout Pill**: *"Tabelas estruturadas e percentis biométricos: Comprimento Cabeça-Nádega (CCN)."*
- **Motion**:
  - `8.0s – 11.5s`: Subtle camera tracking across the specialty filter tags (`Fetal`, `Pediatria`, `Adulto`).
  - `11.5s – 15.0s`: Push into the biometry card stack (`Saco Gestacional`, `Vesícula Vitelínica`, `CCN 1º Trimestre`).
  - `15.0s – 18.0s`: Camera pulls back slightly, aligning the device for the calculation engine.

### Scene 3: Translating ACR TI-RADS into an Interactive Workflow (18.0s – 30.0s | f1080 – f1800)
- **Visual**: The centerpiece technical demonstration—the 5-step CalculUS thyroid risk calculation engine.
- **Top Badge Dock**: `CALCULUS ENGINE` · `ACR TI-RADS` · `MODULE 04: STEPPER`.
- **Callout Pill**: *"Estratificação em 5 passos: pontuação dinâmica em tempo real sem tabelas estáticas."*
- **Motion (Rapid Tactile Cascade)**:
  - `18.0s – 20.2s`: Step 1 (`calculus-step1.png`) — Composition selection (`Sólida ou quase sólida +2 pts`).
  - `20.2s – 22.4s`: Step 2 (`calculus-step2.png`) — Echogenicity selection (`Hipoecóica +2 pts`).
  - `22.4s – 24.6s`: Step 3 (`calculus-step3.png`) — Shape selection (`Mais largo que alto 0 pts`).
  - `24.6s – 26.8s`: Step 4 (`calculus-step4.png`) — Margin selection (`Irregular / Lobulada +2 pts`).
  - `26.8s – 28.5s`: Step 5 (`calculus-step5.png`) — Echogenic Foci selection (`Focos puntiformes +3 pts`).
  - `28.5s – 30.0s`: Step 5-2 (`calculus-result.png`) — Dynamic score totals: **TR5 (Alta suspeita)**, taxa de risco 35%, critério de biópsia por PAAF indicado (> 1.0 cm).

### Scene 4: Clinical Standardization — LaudUS Reports & ProtocolUS Guidelines (30.0s – 38.0s | f1800 – f2280)
- **Visual**: Transitions into `laudus-list.png` and `protocolus-detail.png`.
- **Top Badge Dock**: `PROCEDURAL GUIDELINES` · `LAUDUS & PROTOCOLUS` · `MODULES 05 & 07`.
- **Callout Pill**: *"Protocolos clínicos padronizados: avaliação ultrassonográfica de transplante renal."*
- **Motion**:
  - `30.0s – 33.5s`: Cross-fade to LaudUS standardized ultrasound reporting cards.
  - `33.5s – 37.0s`: Fluid transition to ProtocolUS post-operative renal transplant ultrasound imaging protocol with smooth vertical reading scroll.
  - `37.0s – 38.0s`: Camera retreats as phone rotates slightly to introduce the desktop admin surface.

### Scene 5: The Administrative Back Office — Governing Knowledge Without Code Deploys (38.0s – 48.0s | f2280 – f2880)
- **Visual**: Morph from mobile phone chassis to MacBook Pro desktop chassis displaying `admin-dashboard.png`.
- **Top Badge Dock**: `ADMIN BACK OFFICE` · `KNOWLEDGE CMS` · `8 MODULES`.
- **Callout Pill**: *"Governança clínica: editores médicos atualizam protocolos e laudos sem chamados de código."*
- **Motion**:
  - `38.0s – 42.0s`: Desktop browser chassis glides into center frame; camera glides across the key metric indicators (`62.070 usuários`, `348 assinantes`, `2M acessos MEDUltra`, `R$ 485k volume`).
  - `42.0s – 45.5s`: Seamless transition to `admin-protocolus-cms.png` showing the rich-text protocol drafting and tag publishing tool.
  - `45.5s – 48.0s`: Quick slide into `admin-analytics.png` showing calculator invocation frequency.

### Scene 6: The Complete Multi-Surface Orchestra & Seamless Loop Join (48.0s – 55.0s | f2880 – f3300)
- **Visual**: Camera zooms out into a balanced multi-device stage:
  - Left: Mobile phone chassis displaying the Bedside Clinical App (`clinician-home-end.png`).
  - Center: MacBook Pro chassis displaying the Next.js Marketing Landing Page (`landing-desktop-1440.png`).
  - Right: Floating card stack highlighting the 158 design tokens and 2-tier architecture.
- **Overlay Stat Matrix**:
  - `19 Módulos Clínicos` · `11 No App Móvel` · `8 No Back-Office` · `158 Tokens de Design` · `Landing Page Next.js`
- **Motion**:
  - `48.0s – 51.5s`: Multi-device ensemble settles with floating micro-animations; stat matrix appears.
  - `51.5s – 53.5s`: Flanking elements smoothly fade; camera pushes in toward the center-left mobile clinician chassis.
  - `53.5s – 55.0s`: The camera centers squarely onto the mobile iPhone displaying `clinician-home-end.png` with mathematical precision, returning to the exact position, scale, and opacity of Frame 0, creating a flawless 100% byte-level seamless loop.

---

## Gate 2 Checklist

- [x] Every named asset exists on disk in `motion/celus-showcase/assets/`.
- [x] File resolutions verified and safe for 1080p canvas.
- [x] Head and tail frames match for seamless loop.
- [x] Claim guard strictly enforced (design vs build vs discovery).
