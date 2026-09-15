# Storyboard — Silvana Cabral · Practice Site Showcase (Hero tl;dr)
**Canvas:** 1920×1080 · 60fps (3600 frames) · **Duration:** 60.0s · **Engine:** HyperFrames · **Grade:** Warm clinical light

> **Concept:** The complete case study told through motion in 60 seconds: designed and coded solo in one week. A high-craft clinical psychology practice site taken from visual benchmark and warm-sand token architecture to a 12-section Next.js 14 App Router static export, featuring 7 context-specific WhatsApp deep links, browser-first responsiveness, and complete client enablement collateral.
> **Key Rule:** Shows the landing page completely with smooth cinematic scrolls, deliberate pauses on key sections, and realistic micro-interactions (cursor navigation, button hover, accordion expand, card hover).

---

## Technical Specifications

| Parameter | Specification |
|---|---|
| **Canvas** | 1920×1080 (16:9 Full HD) |
| **Frame Rate** | 60 fps |
| **Duration** | 60.0s (3600 frames total) |
| **Color System** | Light theme: Canvas `#FFFFFF`, warm background radial `#FAF8F2` → `#F4EFEA`, primary brand `#14675E` (deep clinical teal), accent `#C76428` (terracotta), support ramp `#FAF8F2` → `#322218` |
| **Typography** | Display: `Cormorant Garamond` (600/700) · Body/UI: `Montserrat` (400/500/600) |
| **Sound / Audio** | Silent / Ambient WebP & WebM video deliverables |
| **Loop Seam** | Seamless return to settled Hero state at 60.0s matching frame 0 |

---

## Scene Breakdown & Timeline Arc (60s)

### Scene 1: Identity, Foundation & Typography (0.0s – 7.5s · f0 – f450)
- **Visual:** Elegant intro on warm cream canvas (`#FAF8F2`).
- **Layers:**
  - Silvana Cabral refined logo lockup (`logo-preview-v2.png`).
  - Typography specimen cards: *Cormorant Garamond* (display serif) & *Montserrat* (body sans).
  - 12-step warm-sand token ramp cards (`#FAF8F2` to `#322218`) sliding into place.
- **Narrative Chip:** `FUNDAÇÃO & DESIGN TOKENS` · *"Tipografia editorial + rampa de 12 tokens autorais"*.
- **Motion:** Logo scales smoothly in with subtle shadow lift. Type specimen cards float in with staggered spring easing. Swatches reveal left-to-right.

### Scene 2: The Landing Page — Hero & Navigation (7.5s – 15.0s · f450 – f900)
- **Visual:** Transition into floating macOS-style browser window (1440×900 scaled at 1280px native content).
- **Surface:** Live site Hero section (`sec-00-section-0.png` / `desktop-1280-full.png`).
- **Interaction:**
  - Cursor enters from top-right, moves to navigation links (*Sentimentos*, *Abordagem*, *Sobre*, *Dúvidas*).
  - Cursor glides to Hero primary CTA (*"Agendar Primeira Consulta"*), button illuminates with hover glow and scale pulse.
- **Narrative Chip:** `ARQUITETURA DA LANDING PAGE` · *"12 seções pensadas para transformar visita em acolhimento"*.

### Scene 3: Complete Page Scroll & Section Pauses (15.0s – 35.0s · f900 – f2100)
- **Requirement:** The entire page is traversed from top to bottom with intentional pacing:
  - **15.0s – 19.0s (Feelings / Sentimentos):** Scroll descends to the 7 emotional arrival cards (🌧️ 😰 💔 😵‍💫 🧸 🧑‍🎓 👵). Cursor hovers over *Ansiedade* and *Luto* cards, highlighting the pill badges.
  - **19.0s – 23.0s (Health Plans & Approach):** Smooth scroll passes accepted insurance plans and pauses at *Abordagem TCC* (Cognitive Behavioral Therapy). Subtle highlight on clinical methodology cards.
  - **23.0s – 27.0s (About Silvana):** Scroll reveals the psychologist profile and clinical credentials.
  - **27.0s – 31.0s (Interactive FAQ):** Scroll settles on *Dúvidas Frequentes*. Cursor clicks on *"Como funciona a primeira sessão?"*, accordion smoothly expands to reveal reassuring answer.
  - **31.0s – 35.0s (Contact, Map & Footer):** Scroll reaches WhatsApp booking card, local map in Rio de Janeiro, and clean footer with legal policies.

### Scene 4: The Conversion Mechanism as Code (35.0s – 43.0s · f2100 – f2580)
- **Visual:** Camera pushes in on the WhatsApp conversion engine.
- **Split UI:** Side-by-side comparison showing:
  - Deployed button in browser.
  - Actual WhatsApp chat preview with pre-filled message.
  - Floating code card highlighting `constants/links.ts`:
    * *"7 deep links exclusivos, 14 instâncias renderizadas"*.
  - Quick spotlight on the custom 404 page (`page-404.png`):
    * Quote card: *"não estou conseguindo acessar o site, pode me ajudar?"*.
- **Narrative Chip:** `CONVERSÃO EM CÓDIGO` · *"Nenhum usuário precisa inventar a primeira mensagem"*.

### Scene 5: Browser-First Responsiveness (43.0s – 50.5s · f2580 – f3030)
- **Visual:** Multi-device cascade.
- **Surfaces:**
  - Desktop 1280 window alongside Mobile 375 viewport (`mobile-375-full.png` inside an iPhone frame).
  - Mobile frame scrolls synchronously, showing 177 responsive Tailwind utility breakpoints handling the navigation drawer, cards stacked vertically, and full-bleed CTA touch targets.
- **Narrative Chip:** `RESPONSIVIDADE NO NAVEGADOR` · *"Sem prancheta mobile: 177 utilitários responsivos direto em código"*.

### Scene 6: Client Enablement Collateral (50.5s – 55.5s · f3030 – f3330)
- **Visual:** 3D perspective spread of extra deliverables produced:
  - 3 Instagram Highlight Covers (`instagram-highlights.png`).
  - Business Card print layout (`business-card.png`).
  - 4-page Thunderbird email setup guide with Galaxy S22 Ultra mockups (`tutorial-thunderbird.png`).
- **Narrative Chip:** `ENTREGA COMPLETA` · *"Além do site: papelaria, social e tutorial passo a passo para a cliente"*.

### Scene 7: Seam & Return to Hero Loop (55.5s – 60.0s · f3330 – f3600)
- **Visual:** Collateral smoothly disperses. The main browser window floats back to center position.
- **Camera:** Eases smoothly back to the exact frame-0 hero position (`sec-00-section-0.png` at 1280px, centered).
- **Frame 3600:** Identical to Frame 0 for flawless infinite looping.

---

## Asset Manifest (All Verified on Disk)

1. `assets/live/desktop-1280-full.png` (2560×13630 px)
2. `assets/live/sec-00-section-0.png` (Hero & Nav)
3. `assets/live/sec-01-section-1.png` (Feelings cards)
4. `assets/live/sec-02-section-2.png` (Plans)
5. `assets/live/sec-03-approach.png` (Approach)
6. `assets/live/sec-04-about.png` (About)
7. `assets/live/sec-05-faq.png` (FAQ accordion)
8. `assets/live/sec-06-contact.png` (Contact & WhatsApp CTA)
9. `assets/live/sec-07-section-7.png` (Map)
10. `assets/live/sec-08-section-8.png` (Footer)
11. `assets/live/mobile-375-full.png` (750×16186 px)
12. `assets/live/page-404.png` (404 page with WhatsApp message)
13. `assets/figma/styleguide-colors.png` (Color ramp)
14. `assets/figma/styleguide-typography.png` (Typography specimens)
15. `assets/figma/logo-preview-v2.png` (Brand logo lockup)
16. `assets/figma/business-card.png` (Business card collateral)
17. `assets/figma/instagram-highlights.png` (Instagram highlights)
18. `assets/figma/tutorial-thunderbird.png` (Thunderbird guide)
19. `assets/figma/ready-to-dev-handoff.png` (Handoff board)

---

## Delivery Set Plan (Stage 4)

1. `psi-silvanacabral-showcase.mp4` (H.264 High L4.0, 1920×1080, CRF 24, faststart)
2. `psi-silvanacabral-showcase.webm` (VP9 Profile 0, two-pass, 1920×1080, CRF 34)
3. `psi-silvanacabral-showcase.webp` (Poster still at settled Hero frame, quality 82)
4. `psi-silvanacabral-showcase.jpg` (Poster still matching WebP)
5. Accompanying Body Loops:
   - Loop 1: `psi-silvanacabral-tokens-loop.webm` & `.mp4` (~12s, Style Guide & Token Ramp)
   - Loop 2: `psi-silvanacabral-mobile-loop.webm` & `.mp4` (~12s, Mobile Responsiveness)
