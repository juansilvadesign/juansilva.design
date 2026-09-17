---
format: 1920x1080
duration: 18s
fps: 60
message: "The landing page preserves its content across real desktop and mobile layouts."
arc: "Same identity → cards reflow → plans adapt → return"
audience: "Portfolio visitors evaluating responsive front-end implementation"
mode: collaborative
music: none
loop: true
approval: approved
story_approved: 2026-09-17
layout_approval: approved
layout_approved: 2026-09-17
production_phase: animation-build
style_preset: blue-professional
---

# AllPrice — responsive, not merely scaled

This video tells portfolio visitors that the React landing page adapts its real
layout, not just its scale, to desktop and mobile.

Story approved; static wireframe sketches built, layout approved; animation build in progress. Assets resolve from `allprice-showcase/`. Place in the front-end
architecture section. This is not a WordPress/React speed benchmark and does not
assert performance measurements. Show browser surfaces with minimal framing,
not invented device hardware. White/blue/Lato tokens from `frame.md`.
Look pack: `animating-ui-cards-for-web`; use grouped transforms and distinct
viewport masks. Poster: 2.5s.

## Video direction

Layout approval: the user's “approved, proceed” on 2026-09-17 confirms all 21
wireframes. Dress those layouts; do not redesign them.

- Palette/type: frame.md roles; white canvas, AllPrice blue, captured ink, local
  Lato. Preserve all source UI pixels. No grade, recoloring, stock imagery or
  decorative texture. Keep captions on the level foreground film plane.
- This is a silent guided site tour, so sequential disclosure follows the
  navigation/interaction beat instead of voiceover. Real UI is not rebuilt.
- Long-tail, bounded camera moves settle front-on for reading. No bouncing,
  oscillation, lazy breathing, random particles, numeric result animation,
  decorative glitch or independent floating panels.
- Approved stillness is deliberate: hero copy, audience headings, ERP answer,
  plan names and attribution. Travel reveals new page content between holds.
- Approved explanatory captions are frame-owned live text, not karaoke captions;
  there is no SCRIPT.md and no root narration-caption track.
- Preserve the approved viewport/caption separation. The approved main browser
  reaches y=936 and captions begin at y=960 (the closing caption begins at y=933
  after its page pullback). This accepted layout overrides the generic 83% band.
- One lens, separate position/rotation, scale, viewport mask and scroll wrappers.
  Every continuing source must meet its exact numerical handoff. Full page means
  all sections, all five feature categories, all FAQ rows and the complete footer.
- Authorship and source caveats from SOURCE_AUDIT.md remain binding. Silent;
  no audio sourcing. Animation preview approval is still required before render.

## Frame 1 — One page, two layouts

- scene: Real desktop and mobile hero captures align by their shared headline.
- duration: 6s
- time: 0–6s
- poster: 2.5s
- transition_in: cut
- status: built
- src: compositions/frames/responsive-01-hero.html
- type: hook
- persuasion: Demonstrate the actual output
- beat: confidence
- blueprint: compose
- asset_candidates: assets/live/desktop-hero.png — desktop hero; assets/live/mobile-hero.png — real 390px mobile hero

narrativeRole: Establish one design identity across two implementations of the layout.
keyMessage: This is real responsive UI, not a shrunk desktop screenshot.
Caption: **One page. Two real layouts.**

```text
┌───────────────────────────────────────────┐
│ [desktop hero — wide]       [mobile hero]│
│ [matching copy and CTAs]    [stacked copy]│
│          One page. Two real layouts.      │
└───────────────────────────────────────────┘
```

Camera: opposing shallow angles flatten into a comparison; hold each hero's
headline/CTA band, above illustrative dashboard figures. Mobile comes slightly
forward in Z, without covering the desktop heading. Transition out: matching
vertical travel on both surfaces, captions stay on the film plane.

### Animation build contract — responsive-01-hero

- focal: assets/live/desktop-hero.png
- roles: assets/live/desktop-hero.png = supporting immutable source evidence; assets/live/mobile-hero.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–0.90s): The real desktop/mobile hero bands settle from opposing shallow tilts (split-tilt-cards) into the approved unequal-width split.

Scene 2 (0.90–4.60s): Hold the shared headline and CTA layouts; retain actual breakpoint labels. Only the two real source layouts are shown.

Scene 3 (4.60–6.00s): Release toward the next paired page region while preserving independent viewport masks.

Loop continuity: beginning and final sampled frame of this film must be pixel-identical. Restore through the approved source viewport masks, with every displayed crop, label, caption, cursor, and camera channel returned explicitly. Final frame = duration minus 1/60 second. Do not append time beyond the approved total.


## Frame 2 — Cards reflow

- scene: Three audience cards are horizontal on desktop and stack on mobile.
- duration: 6s
- time: 6–12s
- poster: 3.0s
- transition_in: crossfade 0.3s
- status: built
- src: compositions/frames/responsive-02-cards.html
- type: feature_showcase
- persuasion: Compare the same content at two breakpoints
- beat: clarity
- blueprint: compose
- asset_candidates: assets/live/desktop-strip-01.png — audience row; assets/live/desktop-strip-02.png — row continuation; assets/live/mobile-comofunciona-full.png — all three stacked audience cards

narrativeRole: Make a responsive layout decision legible.
keyMessage: The content remains complete as its arrangement changes.
Caption: **Cards reflow. The content stays complete.**

```text
┌───────────────────────────────────────────┐
│ [card 1][card 2][card 3]     [card 1]      │
│                            [card 2] ↑    │
│                            [card 3]      │
│       Cards reflow. Content stays complete.│
└───────────────────────────────────────────┘
```

Camera: desktop holds while the mobile viewport scrolls through all three real
cards, with short pauses on the first and last headings. A restrained shift
toward mobile increases its reading scale. Do not fabricate a live resize morph
between screenshots. Transition out: aligned viewport handoff into plan cards.

### Animation build contract — responsive-02-cards

- focal: assets/live/desktop-strip-01.png
- roles: assets/live/desktop-strip-01.png = supporting immutable source evidence; assets/live/desktop-strip-02.png = supporting immutable source evidence; assets/live/mobile-comofunciona-full.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–1.10s): Show the desktop audience row and the top of the true mobile stack.

Scene 2 (1.10–2.10s): Pause on the first mobile card heading, with the desktop triptych retained.

Scene 3 (2.10–4.70s): Scroll the mobile source through the second and third cards (viewport-change); desktop stays still.

Scene 4 (4.70–6.00s): Hold the final mobile heading briefly, then prepare the plans handoff.

Loop continuity: beginning and final sampled frame of this film must be pixel-identical. Restore through the approved source viewport masks, with every displayed crop, label, caption, cursor, and camera channel returned explicitly. Final frame = duration minus 1/60 second. Do not append time beyond the approved total.


## Frame 3 — Plans adapt

- scene: Monthly/annual plans remain paired on desktop and scroll vertically on mobile.
- duration: 6s
- time: 12–18s
- poster: 2.2s
- transition_in: crossfade 0.3s
- status: built
- src: compositions/frames/responsive-03-plans.html
- type: benefit_highlight
- persuasion: Show adaptation in a decision-critical section
- beat: ease
- blueprint: compose
- asset_candidates: assets/live/desktop-strip-04.png — pricing entry; assets/live/desktop-strip-05.png — desktop plan cards; assets/live/desktop-pricing.png — card-top detail; assets/live/mobile-pricing-full.png — full monthly and annual stack; assets/live/desktop-hero.png — loop return; assets/live/mobile-hero.png — loop return

narrativeRole: Show that the choice remains usable on a narrow viewport.
keyMessage: The same plan content is readable in its appropriate layout.
Caption: **Same plans. Adapted layout.**

```text
┌───────────────────────────────────────────┐
│      [Mensal][Anual]          [Mensal]    │
│                                  ↓       │
│                              [Anual]     │
│         Same plans. Adapted layout.       │
└───────────────────────────────────────────┘
```

Camera: front-on plan-name holds; mobile scroll reveals the annual card without
shrinking both cards to illegibility. Final second returns the two surfaces and
caption to Frame 1's exact opening pose through their own viewport mattes.
All transitions live inside 18s. Prices are preserved archival copy, not a current
offer. No fake toggle, conversion number, or device-performance claim.

### Animation build contract — responsive-03-plans

- focal: assets/live/desktop-strip-04.png
- roles: assets/live/desktop-strip-04.png = supporting immutable source evidence; assets/live/desktop-strip-05.png = supporting immutable source evidence; assets/live/desktop-pricing.png = supporting immutable source evidence; assets/live/mobile-pricing-full.png = supporting immutable source evidence; assets/live/desktop-hero.png = supporting immutable source evidence; assets/live/mobile-hero.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–1.00s): The real two-plan desktop layout and first mobile plan settle front-on.

Scene 2 (1.00–2.20s): Hold the monthly plan and preserve the desktop pair.

Scene 3 (2.20–4.75s): Scroll the mobile source to reveal the annual card, at reading scale.

Scene 4 (4.75–6.00s): Restore the exact hero pair, poses, labels and opening caption through the viewport mattes for a seamless endpoint.

Loop continuity: beginning and final sampled frame of this film must be pixel-identical. Restore through the approved source viewport masks, with every displayed crop, label, caption, cursor, and camera channel returned explicitly. Final frame = duration minus 1/60 second. Do not append time beyond the approved total.


## Named-layer manifest

| Layer | Type | Role and design note |
| --- | --- | --- |
| RESP_bg | shape | Constant ground, identical at loop endpoints. |
| RESP_camera | rig | Separate camera/perspective from the scroll tracks. |
| RESP_desktop_scaler / RESP_mobile_scaler | groups | Independent scale, centered anchors for paired camera moves. |
| RESP_desktop_matte / RESP_mobile_matte | masks | Measured aspect viewports; no stretching of UI pixels. |
| RESP_desktop_track | raster group | UI01/UI03/UI04/UI06/UI07/UI14, selected by beat; moves vertically only. |
| RESP_mobile_track | raster group | UI15/UI16/UI19, genuine mobile captures; moves vertically only. |
| RESP_desktop_header / RESP_mobile_header | raster crops | Reuse the captured header bands, pinned outside tracks. |
| RESP_desktop_label / RESP_mobile_label | live text | “Desktop · 1440px” / “Mobile · 390px”; capture widths, not device specs. |
| RESP_S01_title / RESP_S01_matte_title | live text / mask | Identity and exact loop return. |
| RESP_S02_title / RESP_S02_matte_title | live text / mask | Explain reflow without hiding either layout. |
| RESP_S03_title / RESP_S03_matte_title | live text / mask | Plan choice, then restore opening title. |

Use the shared `ASSET_MANIFEST.md` imports. Match source aspect ratios; no
screen-image interpolation or reconstructed site. Review the wireframes before animation.
Delivery gate: inspect 1080p reading scale and each mobile scroll, then verify the
loop's first/last snapshot byte-for-byte and remove redundant join frames.
