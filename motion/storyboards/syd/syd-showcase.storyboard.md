---
title: SYD (SaveYourDay) Showcase Storyboard
duration: 25.0
fps: 60
resolution: 1920x1080
music: none
theme: light
slug: syd-showcase
---

# Storyboard — SYD · "Three Audiences, Nine States" · 1920×1080 · 25.0s · 60fps (1500f) · **silent, seamless loop, light**

> **Concept:** An on-demand therapy platform serves three fundamentally different audiences—the urgent patient, the autonomous therapist, and the corporate HR buyer. One page cannot answer all three. This showcase moves through the three dedicated landing pages Juan designed and coded, demonstrating the responsive continuity across 1440, 1280, and 375 breakpoints, and resolves into the complete 9-state responsive matrix before settling back into its opening frame.
> **CTA:** None. This is case-study hero media and portfolio evidence, not an advertisement.
> **Engine:** HyperFrames (HTML / GSAP → frames).
> **Slot:** `syd.json` → `previewMotion` + hero block replacement for `/assets/images/placeholders/desktop-fullhd-dark-placeholder.svg`.
> **Status:** APPROVED SPECIFICATION.

---

## Format Decision

| Parameter | Specification | Rationale |
|---|---|---|
| **Canvas** | **1920×1080**, light (`#FFFFFF` on `#F8F9FD`) | Matches authentic live product; crisp contrast on white |
| **Frame Rate** | **60fps** | Butter-smooth typography and viewport morph transitions |
| **Duration** | **25.0s = 1500 frames** | Precise 5-beat rhythm (5.0s per beat) |
| **Audio** | None (`music: none`) | Zero first-party runtime JS on portfolio case page |
| **Loop** | **Seamless** | Frame 1500 composites identically to Frame 0 |
| **Delivery** | H.264 MP4 + VP9 WebM + WebP / JPG stills from same master frame | Cross-browser compatibility + low weight |

---

## ⛔ Claim Guard — What this video may and may not assert

| May show & assert | May NOT show or imply |
|---|---|
| Juan **designed and coded the three landing pages** | That Juan **designed or coded the 118-screen app** (Thiago's design, Spaceapps) |
| 3 distinct audience pages: **Paciente · Profissional · RH** | That this is one generic landing page with 3 tabs |
| 3 responsive breakpoints: **1440 · 1280 · 375** | Any app store submission claim (those belong to the agency) |
| Built twice: **Vite + React Router, then Next.js App Router** | That the earlier repo was Next.js (it was Vite) |
| Design-to-code continuity by the same person | Any conversion / performance metrics (confirmed absence) |
| Real live pages from `sydapp.com.br` | Reconstructed or simulated synthetic UI |

---

## Asset Manifest

Every asset below exists in `assets/` and was verified by direct visual inspection (GATE 1 passed):

| File | Resolution | Origin | Scene Usage |
|---|---|---|---|
| `paciente-hero-1440.png` | 2880×1800 (@2x) | Live capture `https://sydapp.com.br/` (1440 viewport) | S1 (Open) & S5 (Trio/Loop join) |
| `paciente-laptop-1280.png` | 2560×1600 (@2x) | Live capture `https://sydapp.com.br/` (1280 viewport) | S2 (Responsive) & S5 (Trio) |
| `paciente-mobile-375.png` | 750×1624 (@2x) | Live capture `https://sydapp.com.br/` (375 viewport) | S2 (Responsive) & S5 (Trio) |
| `profissional-hero-1440.png` | 2880×1800 (@2x) | Live capture `https://sydapp.com.br/profissional` (1440) | S3 (Profissional) |
| `profissional-laptop-1280.png` | 2560×1600 (@2x) | Live capture `https://sydapp.com.br/profissional` (1280) | S3 (Profissional) |
| `profissional-mobile-375.png` | 750×1624 (@2x) | Live capture `https://sydapp.com.br/profissional` (375) | S3 (Profissional) |
| `rh-hero-1440.png` | 2880×1800 (@2x) | Live capture `https://sydapp.com.br/rh` (1440) | S4 (RH Corporativo) |
| `rh-laptop-1280.png` | 2560×1600 (@2x) | Live capture `https://sydapp.com.br/rh` (1280) | S4 (RH Corporativo) |
| `rh-mobile-375.png` | 750×1624 (@2x) | Live capture `https://sydapp.com.br/rh` (375) | S4 (RH Corporativo) |
| `paciente-hero-1440-end.png`| 2880×1800 (@2x) | Byte-duplicate of `paciente-hero-1440.png` | S5 (Zero-duplicate loop join) |
| `logo-full.svg` | Vector SVG | Extracted brand mark with warm sun icon | Branding overlays & titles |
| `hero-illustration.svg` | Vector SVG | Spaceapps / SYD original therapy vector art | Atmospheric depth |

---

## Detailed Scene Breakdown

```
0.0s                  5.0s                 10.0s                 15.0s                 20.0s                 25.0s
|---------------------|---------------------|---------------------|---------------------|---------------------|
[ S1: PACIENTE 1440 ] [ S2: RESPONSIVE ]    [ S3: PROFISSIONAL ]  [ S4: CORPORATE RH ]  [ S5: 9-STATE MATRIX ]
 Hero: Urgency & Care  1440 → 1280 → 375     Supply & Autonomy     B2B Health Benefit    Trio + Seamless Loop
```

### Scene 1: The Patient Experience — Urgency with Dignity (0.0s – 5.0s | f0 – f300)
- **Visual**: Opens centered on the 1440px desktop browser mockup showing the patient landing page.
- **Key Elements**:
  - Warm amber SYD sun logo and clean navigation header.
  - Headline: *"Atendimento psicológico quando você mais precisa."*
  - Reassuring subheadline and prominent video call option.
  - Action pills: *"Baixe na Play Store"*, *"Baixe na App Store"*, *"Agendar consulta"*.
- **Motion**:
  - `0.0s – 0.5s`: Frame starts settled (poster frame compatible).
  - `0.8s – 2.0s`: Subtle camera punch in (scale 1.00 → 1.04) centered on headline and booking CTA.
  - `2.2s – 4.5s`: Gentle downward scroll reveal showing the pay-per-minute value banner (`R$ 1,99 / minuto`).
  - `4.5s – 5.0s`: Smooth camera zoom-out preparing for the responsive breakpoint transition.

### Scene 2: Responsive Continuity — 1440 → 1280 → 375 (5.0s – 10.0s | f300 – f600)
- **Visual**: The viewport frame physically adapts to show how the design scales across screen widths without breaking or compromising intent.
- **Key Elements**:
  - 1440px Desktop frame contracts to 1280px Laptop canvas.
  - 1280px Laptop canvas transitions into an iPhone-style 375px mobile chassis.
  - Navigation drawer replaces full menu bar; CTAs stack gracefully; hero illustration anchors the base.
- **Motion**:
  - `5.0s – 6.8s`: Smooth width transition from 1440px to 1280px (`paciente-laptop-1280.png`).
  - `6.8s – 7.2s`: Micro-hold highlighting the tablet/laptop reflow.
  - `7.2s – 9.2s`: Width contracts to 375px (`paciente-mobile-375.png`); mobile browser chrome glides into position.
  - `9.2s – 10.0s`: Camera sweeps right toward the practitioner portal.

### Scene 3: Audience Two — Profissional / Practitioner Autonomy (10.0s – 15.0s | f600 – f900)
- **Visual**: The practitioner recruitment landing page (`/profissional`).
- **Key Elements**:
  - Headline: *"A plataforma feita por psicólogos para psicólogos."*
  - Subhead: *"Atenda com liberdade, ganhe por minuto e ajude quem mais precisa."*
  - Primary CTA: *"Cadastre-se"* and practitioner workflow cards.
- **Motion**:
  - `10.0s – 11.5s`: Smooth cross-fade and camera pan into the desktop view of the practitioner surface.
  - `11.5s – 13.5s`: Camera pushes into the value proposition badge highlighting scheduling freedom and transparent minute earnings.
  - `13.5s – 15.0s`: Camera pulls back slightly and pans horizontally into Scene 4.

### Scene 4: Audience Three — Corporate RH / Employee Health (15.0s – 20.0s | f900 – f1200)
- **Visual**: The B2B corporate HR buyer landing page (`/rh`).
- **Key Elements**:
  - Headline: *"Apoio psicológico imediato para colaboradores, sem burocracia."*
  - Subhead: *"Ofereça acesso a psicólogos 24h por dia, pague por minuto de uso e acompanhe tudo com métricas claras e relatórios."*
  - CTA: *"Fale com nosso time"* / *"Agendar apresentação"*.
- **Motion**:
  - `15.0s – 16.5s`: Desktop view of the RH page settles cleanly into center frame.
  - `16.5s – 18.8s`: Subtle vertical pan demonstrating corporate metric highlights (usage tracking, burnout prevention, real-time reports).
  - `18.8s – 20.0s`: Transition effect drawing all three audience threads together.

### Scene 5: The Complete 9-State Matrix & Loop Join (20.0s – 25.0s | f1200 – f1500)
- **Visual**: The camera zooms out to an architectural multi-device stage:
  - Left: Mobile (375px) displaying the mobile reflow.
  - Center: Desktop (1440px) displaying the primary patient hero.
  - Right: Laptop (1280px) displaying the practitioner / RH view.
- **Overlay Stats Pill**:
  - `3 audience landing pages` · `3 breakpoints each` · `9 designed page states` · `Vite → Next.js`
- **Motion**:
  - `20.0s – 22.5s`: Devices glide into balanced three-point isometric/orthographic display; stats counter reveals.
  - `22.5s – 24.5s`: Camera centers firmly back onto the middle 1440px desktop window.
  - `24.5s – 25.0s`: Multi-device flanking fades; the stage resolves with mathematical precision back into the exact pixel composition of Frame 0 (`paciente-hero-1440.png`), guaranteeing a byte-level seamless loop.
