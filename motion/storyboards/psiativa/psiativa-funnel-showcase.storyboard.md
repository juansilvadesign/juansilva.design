---
title: PsiAtiva Funnel Showcase Storyboard
duration: 58.0
fps: 60
resolution: 1920x1080
music: none
theme: clinical-studio-mockup
slug: psiativa-funnel-showcase
---

# Storyboard — PsiAtiva Funnel · "High-Conversion Acquisition Engine" · 1920×1080 · 58.0s · 60fps (3480f) · **silent, seamless loop, clinical studio mockup**

> **Concept:** Built on Astro 5, TypeScript, and Tailwind CSS, the PsiAtiva Acquisition Funnel transforms passive browsing clinicians into active self-diagnosed inbound prospects. This flagship showcase demonstrates the complete patient acquisition journey in action: from the ethical positioning landing page and guided clinical hemorrhage narrative, through the interactive lost-revenue ROI calculator and multi-step diagnostic assessment quiz, to protected capture and dynamic WhatsApp sales handoff.
> **CTA:** None. This is case-study hero media and portfolio evidence, not an advertisement.
> **Engine:** HyperFrames (HTML / CSS / GSAP → frames).
> **Slot:** `psiativa-funnel.json` → `previewMotion` + case study hero video.
> **Status:** SUBMITTED FOR APPROVAL.

---

## Format Decision

| Parameter | Specification | Rationale |
|---|---|---|
| **Canvas** | **1920×1080**, clinical studio canvas (`#0A1110` dark teal ground, `#0D2E2B` deep teal accents, `#3DC7D0` brand cyan glow, `#10B981` confirmation green) | Authentic PsiAtiva brand universe; professional medical-grade finish |
| **Frame Rate** | **60fps** (3480 frames total) | Silky smooth viewport scrolling, camera panning, slider dragging, and UI transitions |
| **Duration** | **58.0s = 3480 frames** | Fits within the 60s max budget while providing thorough coverage of the complete LP, calculator, quiz, and handoff |
| **Audio** | None (`music: none`) | Zero third-party audio baggage; pure visual engineering proof |
| **Loop** | **Seamless** | Frame 3480 matches Frame 0 pixel-for-pixel and state-for-state |
| **Delivery** | H.264 MP4 (CRF 24) + VP9 WebM (CRF 36) + WebP / JPG stills from same master frame (t=3.0s) | High-efficiency delivery, seekable HTTP Range, lightweight web footprint |

---

## ⛔ Claim Guard — What this video may and may not assert

| May show & assert | May NOT show or imply |
|---|---|
| Juan **designed, architected, and engineered 100% of the funnel** | That this is a **third-party client engagement or paid client result** (it is own-venture evidence) |
| Production static-first Astro 5 marketing site with vanilla islands | Any **unverified conversion rates, booking volumes, or revenue metrics** (strict zero-metric policy) |
| Interactive client-side lost-revenue calculator (/calculadora) | Complex server runtime or heavy framework bloat (0 KB runtime framework overhead) |
| Multi-step clinical diagnostic quiz (/quiz) with practice classification | Fake testimonials or artificial stock ratings |
| Dynamic contextual WhatsApp handoff (/obrigado) | Private patient data or unredacted phone numbers |

---

## Asset Manifest

Every asset below is sourced from clean production Playwright captures and verified brand files:

| File | Resolution / Type | Origin | Scene Usage |
|---|---|---|---|
| `psiativa-lp-full.png` | 1920×8635 (PNG) | Playwright `psiativa.com.br/` | S1, S2 (Hero & Stepped LP Tour) |
| `psiativa-lp-full-s5.png` | 1920×8635 (PNG) | Byte-identical twin | S5 (Seamless Loop Return) |
| `psiativa-calculadora.png` | 1920×5468 (PNG) | Playwright `psiativa.com.br/calculadora/` | S3 (Interactive ROI Calculator) |
| `psiativa-quiz.png` | 1920×4063 (PNG) | Playwright `psiativa.com.br/quiz/` | S4 (Clinical Diagnostic Overview) |
| `psiativa-quiz-step1.png` | 1920×3500 (PNG) | Playwright `psiativa.com.br/quiz/` (Active) | S4 (Interactive Question Step) |
| `psiativa-obrigado.png` | 1920×1592 (PNG) | Playwright `psiativa.com.br/obrigado/` | S5 (WhatsApp Sales Handoff) |
| `psiativa-full-nobg.png` | 1000×240 (PNG) | Motion shared branding | S1 & S5 (Header Branding Dock) |
| `psiativa-profile-nobg.png` | 500×500 (PNG) | Motion shared branding | S1, S3, S4 (Favicon / Avatar) |
| `whatsapp-icon.png` | 1000×1000 (PNG) | Motion shared branding | S5 (WhatsApp Routing Pill) |

---

## Detailed Scene Breakdown

```
0.0s             9.0s                             25.0s               37.0s             48.0s           58.0s
|----------------|--------------------------------|-------------------|-----------------|----------------|
[ S1: HERO LP ]   [ S2: GUIDED LANDING PAGE TOUR ] [ S3: CALCULATOR ]  [ S4: QUIZ FLOW ] [ S5: RESOLUTION]
 Above-The-Fold   Problem · Features · Proof       Lost-Revenue Model  5-Point Radar     Handoff & Loop
```

### Scene 1: Above-The-Fold Hero & Value Proposition (0.0s – 9.0s | f0 – f540)
- **Visual**: Opens on the clinical studio stage. Browser window chassis centered with dark frosted chrome and live URL `psiativa.com.br/`.
- **Top HUD Header**: `PSIATIVA ACQUISITION FUNNEL` · `PRODUCTION INSTANCE` · `LIGHTHOUSE 100`.
- **HUD Metric Pill**: `Astro 5 SSG` · `0 KB Runtime Framework` · `Static-First Architecture`.
- **Motion**:
  - `0.0s – 3.0s`: Settled opening frame displaying hero headline: *"Patient acquisition process for psychology clinics. Your practice, structured."* (Poster frame candidate at t=3.0s).
  - `3.0s – 6.0s`: Gentle camera push-in (scale 1.00 → 1.05) highlighting the value proposition and ethical positioning tag.
  - `6.0s – 9.0s`: Simulated cursor moves smoothly to `"BOOK A DIAGNOSTIC"` CTA button with a luminous hover effect.

### Scene 2: Guided Landing Page Tour with Pauses (9.0s – 25.0s | f540 – f1500)
- **Visual**: The camera begins a stepped scroll down the 8635px landing page, slowing down and pausing at key conversion anchors.
- **Top HUD Header**: `LANDING PAGE ARCHITECTURE` · `SECTION TOUR` · `CONVERSION MECHANICS`.
- **Motion**:
  - `9.0s – 13.0s`: Stepped scroll to `#sobre` (*"You don't lose patients for lack of skill. You lose them on the way from contact to session."*). Camera pans slightly left to emphasize the clinical hemorrhage argument.
  - `13.0s – 17.5s`: Scroll to `#funcionalidades` (*"Three problems. One process: Predictable schedule, Fewer no-shows, Structured acquisition"*). Feature cards highlight sequentially with a subtle teal perimeter glow.
  - `17.5s – 21.5s`: Scroll through `#funcionalidades-detail` (*"The GAP in 5 steps: Diagnostic, Activation, Acquisition, Routine, Optimization"*).
  - `21.5s – 25.0s`: Scroll to `#resultados` (*"-52% no-shows, +3x WhatsApp scheduled, 14 days to first results"*). Metric counters emphasize performance evidence.

### Scene 3: Interactive Lost-Revenue ROI Calculator (25.0s – 37.0s | f1500 – f2220)
- **Visual**: Browser window smoothly morphs content and changes URL to `psiativa.com.br/calculadora/`.
- **Top HUD Header**: `INTERACTIVE ISLAND` · `MODULE 01: ROI CALCULATOR` · `VANILLA JS`.
- **HUD Metric Pill**: `Cohort Model` · `Client-Side Math` · `Zero Latency`.
- **Motion**:
  - `25.0s – 28.0s`: Camera zooms into the interactive calculator panel: *"What does an empty schedule cost your practice? Find out with your own numbers."*
  - `28.0s – 33.0s`: Simulated cursor adjusts inputs:
    - Session price: `R$ 250`
    - Inquiries: `5 / month`
    - Active sessions: `4 / month`
    - Financial curves dynamically diverge on the cohort projection chart.
  - `33.0s – 37.0s`: Result callout illuminates with a vivid highlight: *"THE DIFFERENCE OVER THE 6-MONTH CYCLE: R$ 63.000 is what gets left on the table"*. Cursor clicks *"See the full math"*.

### Scene 4: Interactive Clinical Diagnostic Quiz (37.0s – 48.0s | f2220 – f2880)
- **Visual**: Browser navigates to `psiativa.com.br/quiz/`.
- **Top HUD Header**: `QUALIFICATION FUNNEL` · `MODULE 02: CLINICAL QUIZ` · `5-POINT RADAR`.
- **HUD Metric Pill**: `Evaluation: 5 Bottlenecks` · `Solo vs Clinic Calibration`.
- **Motion**:
  - `37.0s – 40.0s`: Quiz introduction card (*"Where is your schedule leaking? Find out in 2 minutes."*). Cursor clicks `"Start"`.
  - `40.0s – 44.0s`: Screen updates seamlessly to `psiativa-quiz-step1.png` displaying Question 1 of 7 (*"How does care work in your space today?"*).
  - `44.0s – 48.0s`: Cursor selects *"I have a team and/or front desk with me"*. Radio option pulses green; progress bar advances to Step 2. Quick overlay shows the 5 diagnostic evaluation pillars (Positioning, Google Business, Mobile friction, Response speed, Scheduling mechanics).

### Scene 5: WhatsApp Handoff & Seamless Loop Resolution (48.0s – 58.0s | f2880 – f3480)
- **Visual**: Camera transitions to `psiativa.com.br/obrigado/` with a WhatsApp handoff card sliding into view.
- **Top HUD Header**: `DYNAMIC HANDOFF` · `MODULE 03: WHATSAPP ROUTING` · `CONTEXT PRE-FILLED`.
- **HUD Metric Pill**: `Pre-populated Brief` · `Direct Clinician Connection`.
- **Motion**:
  - `48.0s – 52.0s`: WhatsApp dialogue card pops up with pre-filled clinical diagnostic brief ready to send:
    *"Olá! Fiz o diagnóstico no site da PsiAtiva e vi que temos vazamentos na confirmação de consultas. Gostaria de entender o processo."*
  - `52.0s – 55.0s`: Camera pulls back into a grand architectural perspective. Floating technical badge array illuminates:
    - `Astro 5 SSG Core`
    - `100/100 Lighthouse Performance & SEO`
    - `hCaptcha Anti-Spam Validation`
    - `LocalBusiness Schema.org JSON-LD`
  - `55.0s – 58.0s`: Browser resets seamlessly back to `psiativa-lp-full-s5.png` at top coordinates (y: 0). HUD text and badges return to exact Frame 0 values.
  - `58.0s`: Frame 3480 matches Frame 0 pixel-for-pixel and state-for-state. Seamless loop join complete.
