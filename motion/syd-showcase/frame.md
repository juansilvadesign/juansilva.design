# Frame: SYD (SaveYourDay) — Product Launch Showcase

## Purpose

One cohesive, silent product launch video / case-study hero showcase for **SYD (SaveYourDay)**:
serving as the opening visual asset for the `syd` project in Juan Silva's portfolio (`previewMotion` hover + case hero) and replacing the placeholder blocks.

The video proves the core architectural claim of the case study:
1. **Three audiences, three distinct arguments** — Patient, Practitioner, and Corporate HR do not share a single question, and cannot be collapsed into three tabs. Each has a dedicated, purposeful landing page.
2. **True responsive continuity** — Wireframed, designed, and coded across 3 breakpoints (1440 desktop, 1280 laptop, 375 mobile) by the same person, preserving responsive intent from layout to shipped markup.
3. **Shipped across two production stacks** — Built first in Vite + React Router, then migrated to Next.js App Router.

⛔ **Claim Guard**:
- Juan designed and coded the **landing pages only** — NOT the 118-screen application behind it (which was designed by Spaceapps tech lead Thiago).
- The video celebrates the **landing-page layer**: its responsiveness, clarity of message, typography, and stakeholder-specific persuasion.

## Format

- **Canvas**: 1920 × 1080 (16:9), 60fps
- **Duration**: 25.0 seconds (1500 frames)
- **Theme**: Pure crisp light (`#FFFFFF` on `#F8F9FD` ground) — matches the authentic live product aesthetics.
- **Audio**: Silent (`music: none`), zero first-party runtime JS required on consumer case page.
- **Loop**: Seamless loop — the final scene resolves back into the opening desktop hero frame, enabling continuous, jump-free looping.

## Brand Tokens & Palette

| Token | Hex Value | Role | Contrast / Usage |
|---|---|---|---|
| `--color-canvas` | `#FFFFFF` | Core view background | Clean, clinical, welcoming |
| `--color-ground` | `#F8F9FD` | Full-bleed stage ground | Subtle cool lavender tint |
| `--color-primary` | `#6460BE` | Brand Signature Purple | Primary buttons, active tabs, highlights |
| `--color-primary-dark`| `#4F46E5` | Deep purple / indigo | Hover states, focal accents |
| `--color-accent-sun` | `#F59E0B` | SYD Logo Sun Amber | Emotional warmth, hope, vitality |
| `--color-ink` | `#020817` | Primary typography | 14.8:1 contrast on white canvas |
| `--color-ink-muted` | `#64748B` | Secondary body, metadata | 4.8:1 contrast on white |
| `--color-card-border` | `#E2E8F0` | Structural dividers | Subtle 1px crisp separation |
| `--color-badge-bg` | `rgba(100, 96, 190, 0.08)` | Chip & pill backgrounds | Soft brand glow |

## Typography

- **Headings & Body**: `Lato`, with `Inter`, system-ui fallback.
- **Font Weights**:
  - `400` Regular: body prose and descriptions
  - `600` Semi-Bold: navigation, subheadings, labels
  - `700` Bold: primary headlines, punchy stats
  - `900` Black: impactful numbers and brand marks

## Motion Doctrine

1. **Camera with Intent**: Never slide screens without motivation. Moves reflect user perspective shifts—switching audience lens or adjusting device scale.
2. **Separated Transforms**: Outer container handles viewport scaling (`transform-origin: center`); inner tracks handle panning and scroll reveals.
3. **Graceful Stagger**: UI elements stagger into frame at 60–100ms intervals with smooth bezier easing (`power3.out` / `power2.inOut`).
4. **Device Framing**: Real device bezels (1440px Pro display, 1280px laptop canvas, 375px mobile frame) give spatial reality to responsive breakpoints.
