---
format: 1920x1080
duration: 58s
fps: 60
message: "AllPrice brings pricing, sales and profit visibility together; this preserved landing page explains how."
arc: "Promise → audience → connected workflow → plans → answers → design-engineering credit"
audience: "Portfolio visitors evaluating Juan Silva's design-engineering work"
mode: collaborative
music: none
loop: false
approval: approved
story_approved: 2026-09-17
layout_approval: approved
layout_approved: 2026-09-17
production_phase: animation-build
style_preset: blue-professional
---

# AllPrice — the complete landing-page tour

This video tells portfolio visitors that AllPrice brings pricing, sales and profit
visibility together, through a complete tour of the landing page Juan remediated
and implemented.

Status: **story approved; static wireframe sketches built, layout approved; animation build in progress**. All asset paths resolve from
`motion/allprice-showcase/`. Supporting films have separate storyboards beside
this file. Source limitations and attribution: `SOURCE_AUDIT.md`.

The user explicitly requested page order and complete coverage. This overrides
the generic launch-video convention of reordering or omitting sections. The
story's value lands in the first two beats; the rest supplies concrete context.

## Direction and pacing

One coherent browser surface travels from header to footer. It does not restart
as a slide deck at every beat. The edit points below are production boundaries,
with matched camera poses and scroll coordinates, not visible jumps.

- Real Portuguese UI; short English captions outside its reading area.
- AllPrice blue `#234DD7`, white canvas, Lato, quiet ink captions. Frame-scale
  design tokens live in `frame.md`; no recoloring of screenshots.
- Rhythm: **settle → travel → hold → travel → interaction → hold → finish**.
- Perspective accents at the opening, ERP handoff and closing. Dense UI rests
  front-on. No permanent tilt, orbit during reading, decorative glitch, or fake
  app activity. Camera positions are a proposal; exact curves follow layout approval.
- Source-guided packs: `digital-slideshow-animation` for modular Z-separated
  camera work; `animating-ui-cards-for-web` for grouped interaction and loop craft.
  Only their relevant principles apply: no randomized reveals or stop-motion.
- Full page means every vertical section, all five feature categories, and the
  footer. It does not mean clicking every external link or expanding all 12 FAQs.
- Main is a one-shot, with a short white reveal/exit within its 58 seconds.
  Supporting films are true seamless loops. No audio of any kind.
- Proposed poster: **2.6s**, settled on the clean hero headline/CTA crop.
- Hard limit: **58 seconds planned, never over 60 seconds including transitions**.

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

## Frame 1 — Price with clarity

- scene: Hero headline and CTAs settle from a shallow angled introduction.
- duration: 5s
- time: 0–5s
- poster: 2.6s
- transition_in: cut
- status: built
- src: compositions/frames/main-01-clarity.html
- blueprint: compose
- type: hook
- persuasion: Name the seller's desired understanding
- beat: clarity
- asset_candidates: assets/live/desktop-hero.png — real opening viewport

narrativeRole: Give the viewer a reason to care before naming integrations.
keyMessage: Understand pricing and profit in one place.
Caption: **Price with clarity. See where profit goes.**

Look: digital-slideshow-animation, restrained brand treatment.

```text
┌───────────────────────────────────────────┐
│       / real header + hero copy /          │
│      /     Portuguese CTAs     / → flat    │
│ Price with clarity. See where profit goes. │
└───────────────────────────────────────────┘
```

Camera: shallow 6° three-quarter plane → front-on by 1.1s; readable hold to 4.2s.
Rest within source Y 0–520 CSS px, above dashboard figures. Start opening the
viewport at 4.2s. Transition out: the same surface continues, no replacement UI.

### Animation build contract — main-01-clarity

- focal: assets/live/desktop-hero.png
- roles: assets/live/desktop-hero.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–1.10s): The captured hero arrives with a shallow tilt-to-flat camera move (3d-camera-flight), retaining the approved wide hero crop and the caption below it. No illustrative figures enter the reading crop.

Scene 2 (1.10–4.20s): Hold the clean headline and CTAs, front-on. The caption resolves and stays level; this is the deliberate opening read.

Scene 3 (4.20–5.00s): Pull the camera back (coordinate-target-zoom), then open the viewport matte to the complete browsing window. End front-on at the shared page origin; no scroll yet.
- handoff_out: page: x=0, y=0, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 0; 4.2 → 0; 5 → 0`.
Opening key pose: browser crop 1440×520, positioned at x=96/y=158 by scale=1.2; shallow 6° entry settles by 1.1s. Resolve position/scale during 4.20–4.65, then open the lower viewport matte during 4.65–5.00. All endpoint transforms must match the next frame.


## Frame 2 — One operating view

- scene: The camera reveals the dashboard illustration and scrolls past the blue banner.
- duration: 5s
- time: 5–10s
- poster: 2.0s
- transition_in: cut
- status: built
- src: compositions/frames/main-02-overview.html
- type: product_intro
- persuasion: Feature-to-value translation
- beat: understanding
- blueprint: compose
- asset_candidates: assets/live/desktop-strip-00.png — hero and banner; assets/live/desktop-strip-01.png — banner-to-audience continuation

narrativeRole: Pay off the hook with the platform's core scope.
keyMessage: Pricing, sales and profit visibility belong together.
Caption: **Pricing, sales and profit. In one place.**

```text
┌───────────────────────────────────────────┐
│  [header stays]                           │
│  [dashboard illustration] ↑ [blue banner] │
│  Pricing, sales and profit. In one place.  │
└───────────────────────────────────────────┘
```

Camera: front-on travel over the illustrated dashboard, without a numeric punch-in.
Scroll 0 → 1250. The full hero passes; the banner connects into the next section.
No metric is animated or presented as a measured client result. Transition out:
matched continuous downward travel.

### Animation build contract — main-02-overview

- focal: assets/live/desktop-strip-00.png
- roles: assets/live/desktop-strip-00.png = supporting immutable source evidence; assets/live/desktop-strip-01.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–4.10s): Traverse the full dashboard illustration continuously inside the browser viewport (coordinate-target-zoom nested wrappers, with independent scale and scroll); keep numbers contextual, never a numeric hold. The page reaches the banner.

Scene 2 (4.10–5.00s): Settle on the banner-to-audience handoff; the operating-view caption stays below the page.

- handoff_in: page: x=0, y=0, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed
- handoff_out: page: x=0, y=-1250, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 0; 4.1 → 1250; 5 → 1250`.


## Frame 3 — Meet the sellers

- scene: The audience heading and three distinct audience cards fill the viewport.
- duration: 5s
- time: 10–15s
- poster: 2.0s
- transition_in: cut
- status: built
- src: compositions/frames/main-03-audiences.html
- type: benefit_highlight
- persuasion: Audience recognition
- beat: relevance
- blueprint: compose
- asset_candidates: assets/live/desktop-strip-01.png — audience cards; assets/live/desktop-strip-02.png — section tail

narrativeRole: Make the product's purpose specific to sellers, not generic software.
keyMessage: Different seller profiles share the same pricing problem.
Caption: **Built around the way you sell.**

```text
┌───────────────────────────────────────────┐
│        Para quem é o All Price?           │
│ [marketplaces] [pricing] [CPF / MEI / ME] │
│       Built around the way you sell.      │
└───────────────────────────────────────────┘
```

Camera: settle on the three card headings for 1.8s, then scroll through their
explanations. Scroll 1250 → 2500; no crop may omit the third card. Transition out:
slight lateral camera release while the page continues down.

### Animation build contract — main-03-audiences

- focal: assets/live/desktop-strip-01.png
- roles: assets/live/desktop-strip-01.png = supporting immutable source evidence; assets/live/desktop-strip-02.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–1.30s): Pan the same page toward the three audience cards (viewport-change); maintain the approved full-width triptych.

Scene 2 (1.30–3.25s): Hold the three headings together, front-on. Do not cover the third card.

Scene 3 (3.25–5.00s): Continue through the explanations into the ERP section, with the caption on the fixed film plane.

- handoff_in: page: x=0, y=-1250, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed
- handoff_out: page: x=0, y=-2500, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 1250; 1.3 → 1745; 3.25 → 1745; 5 → 2500`.


## Frame 4 — With an ERP, or without

- scene: The ERP explanation and its Bling, Tiny and independent-operation artwork pass together.
- duration: 6s
- time: 15–21s
- poster: 2.0s
- transition_in: cut
- status: built
- src: compositions/frames/main-04-erp.html
- type: feature_showcase
- persuasion: Remove a setup objection
- beat: confidence
- blueprint: compose
- asset_candidates: assets/live/desktop-strip-01.png — ERP section entry; assets/live/desktop-strip-02.png — full ERP explanation; assets/live/desktop-strip-03.png — section tail

narrativeRole: Explain how the product fits an existing operation.
keyMessage: Connect an existing ERP, or operate without one.
Caption: **Connect your ERP. Or work without one.**

```text
┌───────────────────────────────────────────┐
│ [Bling / Tiny artwork] [real explanation]│
│                     ↓                    │
│ Connect your ERP. Or work without one.    │
└───────────────────────────────────────────┘
```

Camera: brief 4° side offset on entry, then front-on; two readable micro-pauses
on the heading and independent-operation explanation. Scroll 2500 → 3770.
Logos remain part of the actual captured page, not a fabricated endorsement wall.
Transition out: continuous scroll into the feature heading.

### Animation build contract — main-04-erp

- focal: assets/live/desktop-strip-01.png
- roles: assets/live/desktop-strip-01.png = supporting immutable source evidence; assets/live/desktop-strip-02.png = supporting immutable source evidence; assets/live/desktop-strip-03.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–1.00s): A shallow side reframe (3d-camera-flight) accompanies the next scroll; flatten before the heading read.

Scene 2 (1.00–2.40s): Hold the ERP heading and source artwork, preserving the approved artwork/text balance.

Scene 3 (2.40–4.70s): Travel to the independent-operation explanation, then pause; no invented integration flow.

Scene 4 (4.70–6.00s): Continue into the feature heading, finishing at the shared front-on handoff.

- handoff_in: page: x=0, y=-2500, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed
- handoff_out: page: x=0, y=-3770, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 2500; 1 → 2640; 2.4 → 2640; 3.6 → 3060; 4.7 → 3060; 6 → 3770`.
Measured refinement: the first ERP hold is 2640, keeping its heading below the
86px sticky header; camera handoffs and shot duration remain unchanged.


## Frame 5 — Explore the whole toolkit

- scene: The feature rail is browsed horizontally to reveal the fifth category.
- duration: 7s
- time: 21–28s
- poster: 4.0s
- transition_in: cut
- status: built
- src: compositions/frames/main-05-features.html
- type: feature_showcase
- persuasion: Show the breadth through an actual interaction
- beat: control
- blueprint: compose
- asset_candidates: assets/live/desktop-strip-02.png — feature entry; assets/live/desktop-strip-03.png — full feature section; assets/live/desktop-features-left.png — scroller start; assets/live/desktop-features-right.png — scroller end

narrativeRole: Connect pricing, alerts, sales, registration and business health.
keyMessage: The toolkit extends beyond setting a selling price.
Caption: **From pricing to a clearer view of the business.**

```text
┌───────────────────────────────────────────┐
│ [Pricing][Alerts][Sales][Registration] ⇠  │
│                         [Business health]│
│         cursor drag → content response   │
└───────────────────────────────────────────┘
```

Camera: front-on at the interaction. Reach the rail, pause 1s, drag through the
measured 0 → 446 horizontal range, hold the last card heading 1s, then return the
rail before resuming vertical travel. Scroll 3770 → 4790. Show the lower card
edges/CTAs during the vertical exit; no dissolving between unrelated rail states.
Transition out: continuous travel into the pricing-workflow section.

### Animation build contract — main-05-features

- focal: assets/live/desktop-strip-02.png
- roles: assets/live/desktop-strip-02.png = supporting immutable source evidence; assets/live/desktop-strip-03.png = supporting immutable source evidence; assets/live/desktop-features-left.png = supporting immutable source evidence; assets/live/desktop-features-right.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–1.45s): Arrive at the real feature rail and pause before input.

Scene 2 (1.45–3.05s): The editorial cursor drags the captured rail horizontally (cursor-drag) across its measured range. All motion is within the source rail matte.

Scene 3 (3.05–4.15s): Hold the fifth category, with the other visible categories retained.

Scene 4 (4.15–4.80s): Return the rail to its baseline, following the same geometry.

Scene 5 (4.80–7.00s): Resume vertical page travel through card bottoms and CTAs into the pricing-workflow heading.

- handoff_in: page: x=0, y=-3770, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed
- handoff_out: page: x=0, y=-4790, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 3770; 0.45 → 3927; 4.8 → 3927; 7 → 4790`.
Rail timing: x=0 through 1.45; x=-446 at 3.05; hold through 4.15; x=0 at 4.80. Overlay only the rail's captured region; vertical page travel resumes after the restore.


## Frame 6 — Understand the price

- scene: The pricing-workflow headline leads into its original interface illustration.
- duration: 6s
- time: 28–34s
- poster: 1.2s
- transition_in: cut
- status: built
- src: compositions/frames/main-06-price.html
- type: feature_showcase
- persuasion: Explain the mechanism in the seller's language
- beat: clarity
- blueprint: compose
- asset_candidates: assets/live/desktop-strip-03.png — clean section heading; assets/live/desktop-strip-04.png — pricing-workflow illustration and continuation

narrativeRole: Translate the feature list into the central pricing job.
keyMessage: Consider costs and margins when setting a price.
Caption: **See costs and margins before setting a price.**

```text
┌───────────────────────────────────────────┐
│    Precifique seus anúncios...            │
│        ↓ real interface illustration     │
│  See costs and margins before pricing.    │
└───────────────────────────────────────────┘
```

Camera: clean heading holds 1.5s; widen and traverse the complete illustration.
Scroll 4790 → 6060. The table is illustrative source artwork with dummy/repeated
rows: never stop on a store identifier, magnify those rows, type into the image,
or imply a live price calculation. Transition out: let the next real section enter.

### Animation build contract — main-06-price

- focal: assets/live/desktop-strip-03.png
- roles: assets/live/desktop-strip-03.png = supporting immutable source evidence; assets/live/desktop-strip-04.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–0.50s): Settle the clean pricing-workflow headline front-on.

Scene 2 (0.50–2.00s): Hold the headline and source CTA. The caption explains the job, not any illustrative result.

Scene 3 (2.00–6.00s): Traverse the whole pricing illustration (viewport-change) without stopping on dummy rows; continue toward the alert section.

- handoff_in: page: x=0, y=-4790, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed
- handoff_out: page: x=0, y=-6060, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 4790; 0.5 → 4840; 2 → 4840; 6 → 6060`.


## Frame 7 — Keep an eye on changes

- scene: The alert section connects the product story to WhatsApp notifications.
- duration: 4s
- time: 34–38s
- poster: 1.8s
- transition_in: cut
- status: built
- src: compositions/frames/main-07-alerts.html
- type: benefit_highlight
- persuasion: Translate monitoring into awareness
- beat: reassurance
- blueprint: compose
- asset_candidates: assets/live/desktop-strip-04.png — alerts and plan heading

narrativeRole: Show what helps a seller keep track after pricing.
keyMessage: The landing page promises alerts through WhatsApp.
Caption: **Keep track with WhatsApp alerts.**

```text
┌───────────────────────────────────────────┐
│ [real alert labels] [source phone image] │
│       Keep track with WhatsApp alerts.    │
└───────────────────────────────────────────┘
```

Camera: a gentle lateral reframe settles on the actual alert labels for 1.8s.
Scroll 6060 → 6590. Do not animate a new message, send anything, or show a
fabricated notification. Transition out: down into the plans.

### Animation build contract — main-07-alerts

- focal: assets/live/desktop-strip-04.png
- roles: assets/live/desktop-strip-04.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–0.65s): A slight lateral camera emphasis finds the real alert labels, then settles.

Scene 2 (0.65–2.70s): Hold the source labels and WhatsApp artwork together. Do not synthesize a notification.

Scene 3 (2.70–4.00s): Resume the downward page journey into the plan introduction.

- handoff_in: page: x=0, y=-6060, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed
- handoff_out: page: x=0, y=-6590, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 6060; 0.65 → 6120; 2.7 → 6120; 4 → 6590`.


## Frame 8 — Choose the plan

- scene: The two fixed pricing cards remain side by side as their full length is revealed.
- duration: 6s
- time: 38–44s
- poster: 2.5s
- transition_in: cut
- status: built
- src: compositions/frames/main-08-plans.html
- type: feature_showcase
- persuasion: Clarify the choice
- beat: ease
- blueprint: compose
- asset_candidates: assets/live/desktop-strip-04.png — plan heading; assets/live/desktop-strip-05.png — plan cards; assets/live/desktop-pricing.png — close reference for card tops

narrativeRole: Complete the landing page's decision path.
keyMessage: The page offers monthly and annual access.
Caption: **Monthly or annual. The same feature set.**

```text
┌───────────────────────────────────────────┐
│         [Mensal]   [Anual]                │
│         [  features + CTAs  ] ↓           │
│   Monthly or annual. The same feature set.│
└───────────────────────────────────────────┘
```

Camera: aligned front-on, pause on the two plan names, then scroll their complete
feature lists and CTAs. Scroll 6590 → 8080. Prices remain archival UI, not a current
offer endorsement. No billing toggle exists; no toggle is animated.
Transition out: the bottom of the cards hands off to the next section.

### Animation build contract — main-08-plans

- focal: assets/live/desktop-strip-04.png
- roles: assets/live/desktop-strip-04.png = supporting immutable source evidence; assets/live/desktop-strip-05.png = supporting immutable source evidence; assets/live/desktop-pricing.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–1.55s): Move from the plan introduction toward the two plan names; keep both fixed cards in view.

Scene 2 (1.55–3.20s): Pause at Mensal and Anual, front-on. The prices remain archival source copy.

Scene 3 (3.20–6.00s): Travel through the complete feature lists and both CTAs, then hand off to the next section.

- handoff_in: page: x=0, y=-6590, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed
- handoff_out: page: x=0, y=-8080, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 6590; 1.55 → 7010; 3.2 → 7010; 6 → 8080`.


## Frame 9 — Preserve the full page

- scene: The testimonial section passes in context without a quotation hold.
- duration: 3s
- time: 44–47s
- poster: 1.5s
- transition_in: cut
- status: built
- src: compositions/frames/main-09-page-continuity.html
- blueprint: compose
- type: feature_showcase
- persuasion: Document the complete delivered surface
- beat: continuity
- asset_candidates: assets/live/desktop-strip-05.png — section entry; assets/live/desktop-strip-06.png — testimonial section and FAQ entry

narrativeRole: Honor complete-page coverage without implying unverified proof.
keyMessage: This is a preserved landing-page build.
Caption: **Preserved landing-page build** (small context label; no sales claim).

```text
┌───────────────────────────────────────────┐
│ [source testimonial section] ↑           │
│              [FAQ heading arrives]        │
│           no quote or metric spotlight    │
└───────────────────────────────────────────┘
```

Camera: wider traversal, no pause or punch-in. Scroll 8080 → 9181; this exposes
the section's entire vertical span. Repeated testimony stays unaltered and is
not used as verified customer evidence. Transition out: settle into the FAQ.

### Animation build contract — main-09-page-continuity

- focal: assets/live/desktop-strip-05.png
- roles: assets/live/desktop-strip-05.png = supporting immutable source evidence; assets/live/desktop-strip-06.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–3.00s): Traverse the source testimonial section in context without any quote spotlight or customer-result claim. The small context label remains below the page; the FAQ enters by the end.

- handoff_in: page: x=0, y=-8080, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed
- handoff_out: page: x=0, y=-9181, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 8080; 3 → 9181`.


## Frame 10 — Answer the key objection

- scene: A cursor opens the genuine FAQ answer about operating without an ERP.
- duration: 6s
- time: 47–53s
- poster: 2.7s
- transition_in: cut
- status: built
- src: compositions/frames/main-10-faq.html
- type: benefit_highlight
- persuasion: Answer a concrete adoption question
- beat: confidence
- blueprint: compose
- asset_candidates: assets/live/desktop-faq-framed-closed.png — closed state with complete heading; assets/live/desktop-faq-framed-open.png — genuine ERP answer; assets/live/desktop-strip-06.png — FAQ upper section; assets/live/desktop-strip-07.png — remaining FAQ rows

narrativeRole: Reinforce the product explanation with a real user interaction.
keyMessage: An ERP is not required.
Caption: **No ERP? You can still get started.**

```text
┌───────────────────────────────────────────┐
│   Perguntas frequentes                    │
│   2. Preciso ter um ERP para usar?  click │
│   [real answer expands]                   │
│   No ERP? You can still get started.      │
└───────────────────────────────────────────┘
```

Camera: front-on, Y=9181. Cursor approaches, clicks question 2, answer expands,
and holds for roughly 2s. Close it before resuming scroll so page geometry returns
to its measured baseline. Continue to Y=10180, passing all remaining FAQ rows.
Transition out: maintain the same scroll trajectory toward the footer.

### Animation build contract — main-10-faq

- focal: assets/live/desktop-faq-framed-closed.png
- roles: assets/live/desktop-faq-framed-closed.png = supporting immutable source evidence; assets/live/desktop-faq-framed-open.png = supporting immutable source evidence; assets/live/desktop-strip-06.png = supporting immutable source evidence; assets/live/desktop-strip-07.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–0.90s): The page is front-on at the measured FAQ origin. The cursor approaches the genuine second question (cursor-click-ripple).

Scene 2 (0.90–1.40s): Open the captured answer using anchored-layout-expand: the answer reveal and all following rows share the measured vertical movement.

Scene 3 (1.40–3.50s): Hold the answer at reading scale. No camera drift while reading.

Scene 4 (3.50–4.00s): Click to close and restore the baseline geometry.

Scene 5 (4.00–6.00s): Continue down through all remaining FAQ rows, keeping the same browsing surface.

- handoff_in: page: x=0, y=-9181, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed
- handoff_out: page: x=0, y=-10180, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 9181; 4 → 9181; 6 → 10180`.
FAQ expansion: 81 CSS px, following rows move by the same amount; close before local t=4.00. Cursor targets must come from the captured Q2 hit region.


## Frame 11 — The finished landing page

- scene: The complete footer lands, then the camera eases back for the contribution credit.
- duration: 5s
- time: 53–58s
- poster: 2.5s
- transition_in: cut
- status: built
- src: compositions/frames/main-11-finish.html
- type: branding
- persuasion: Attribute the visible work precisely
- beat: resolution
- blueprint: compose
- asset_candidates: assets/live/desktop-strip-07.png — complete footer; assets/figma/brand-symbol.png — original brand mark if needed for closing label

narrativeRole: Close on the actual deliverable and the correct authorial scope.
keyMessage: Juan's work is the landing-page remediation and React build.
Caption: **Landing-page remediation + React build**
Credit: **Juan Silva · Spaceapps**

```text
┌───────────────────────────────────────────┐
│          [complete real footer]          │
│           ↘ shallow camera pullback      │
│ Landing-page remediation + React build   │
│            Juan Silva · Spaceapps         │
└───────────────────────────────────────────┘
```

Camera: finish Y=10379 by 54s, exposing the bottom copyright line. Hold the footer
front-on for 2s, then gently pull back and tilt at most 5°. Credit remains level.
Exit: 0.25s into the white canvas, contained within 58s. Do not navigate to signup,
social media, support, legal pages or a different origin.

### Animation build contract — main-11-finish

- focal: assets/live/desktop-strip-07.png
- roles: assets/live/desktop-strip-07.png = supporting immutable source evidence; assets/figma/brand-symbol.png = supporting immutable source evidence
- sfx: none

Compose: preserve the approved key-pose framing and caption placement. Use the
source pixels as the UI; layered crops may isolate only the measured interaction.

Scene 1 (0.00–1.00s): Continue to the absolute page bottom and fit the complete footer into the approved closing area.

Scene 2 (1.00–3.00s): Hold the complete footer front-on, including its copyright line. Show the precise remediation/React contribution and credit.

Scene 3 (3.00–4.75s): A restrained pullback and shallow tilt (3d-camera-flight) releases the page while the credit stays level.

Scene 4 (4.75–5.00s): Exit into the white canvas; the whole finish remains inside the 58-second limit.

- handoff_in: page: x=0, y=-10180, scale=1, opacity=1, direction=down, speed=0 CSS px/s; browser: x=240, y=36, width=1440, height=900, scale=1, rotationX=0, rotationY=0, z=0, opacity=1; featuresScrollLeft=0; FAQ=closed

Scroll timing contract (local seconds → absolute document CSS Y):
`0 → 10180; 1 → 10379; 5 → 10379`.
Closing viewport scales from 1 to 0.973333 during 0–1s to fit the whole footer above the approved caption; hold to 3s, then pull back gently. Only this main-film frame may fade the whole film to white.


## Named-layer manifest

The shared asset registry and import filenames are in `ASSET_MANIFEST.md`.
These are the unique motion-layer names for this film. Every text stays live.

| Layer | Type | Role and design note |
| --- | --- | --- |
| MAIN_bg | shape | Fixed white ground; scene continuity. |
| MAIN_camera | 3D rig | Own the perspective/reframe; Z separation from caption plane, never rotate reading captions. |
| MAIN_scaler | group | Own camera scale only; centered anchor. |
| MAIN_viewport_matte | mask | Clip page pixels to the browser surface, independently of scale. |
| MAIN_page_track | group | Own vertical scroll only; measured strip positions, no scale on this element. |
| MAIN_sticky_header | raster crop | Top 86 CSS px from UI01; pinned above the scrolling document. |
| MAIN_page_tiles | raster group | UI02–UI09; crop overlapping rows once, never stack a duplicated band. |
| MAIN_features_matte | mask | Bound the horizontal content replacement to its measured rail. |
| MAIN_features_track | raster-state group | UI10/UI11; reveal all five categories, preserve authentic geometry. |
| MAIN_faq_matte | mask | Bound the answer/state change to the FAQ region. |
| MAIN_faq_states | raster-state group | UI12/UI13; preserve text and +/close states exactly. |
| MAIN_cursor | editorial vector | Neutral cursor on its own plane; appears only at actual interactions. |
| MAIN_click_ring | shape | Subordinate click feedback; centered at the real hit target. |
| MAIN_progress | shape | Thin page-progress cue; deterministic travel, not a completion metric. |
| MAIN_S01_title / MAIN_S01_matte_title | live text / mask | Hero caption; separate reveal matte, long readable hold. |
| MAIN_S02_title / MAIN_S02_matte_title | live text / mask | Scope caption; independent from travelling UI. |
| MAIN_S03_title / MAIN_S03_matte_title | live text / mask | Audience caption; does not cover card headings. |
| MAIN_S04_title / MAIN_S04_matte_title | live text / mask | ERP caption; clean hold while camera settles. |
| MAIN_S05_title / MAIN_S05_matte_title | live text / mask | Feature caption; fixed while the rail moves. |
| MAIN_S06_title / MAIN_S06_matte_title | live text / mask | Pricing caption; do not attach to illustrative numbers. |
| MAIN_S07_title / MAIN_S07_matte_title | live text / mask | Alert caption; no fake notification layer. |
| MAIN_S08_title / MAIN_S08_matte_title | live text / mask | Plan caption; outside source cards. |
| MAIN_S09_title / MAIN_S09_matte_title | live text / mask | Archival context, no testimonial claim. |
| MAIN_S10_title / MAIN_S10_matte_title | live text / mask | Answer translation; independent of the accordion's height. |
| MAIN_S11_title / MAIN_S11_matte_title | live text / mask | Precise final contribution label. |
| MAIN_S11_credit | live text | Author/team scope; stays level through closing camera move. |
| MAIN_exit_matte | shape | Final white cover; no extra tail beyond 58s. |

If split into per-frame sub-compositions, namespace rig instances by scene and
carry exact boundary poses; shared names above describe one continuous film rig.
The production worker contract must preserve that continuity, not reset at each cut.

## Coverage and quality gates

Scroll waypoints: **0 → 1250 → 2500 → 3770 → 4790 → 6060 → 6590 →
8080 → 9181 → 10180 → 10379**. With the 900px logical viewport, all document
rows through 11279 are covered without gaps. Camera crops may widen during travel,
but must never skip a section or leave an unsafe illustrative detail at rest.

Before final rendering: every scene/transition sampled; every visible UI state
compared to the captured source; captions readable at 1080p; all lower section
edges and footer visible; no source-data metrics asserted as outcomes.

Render only after preview approval. Delivery: silent H.264 + VP9 at 1920×1080,
measured duration ≤60s, paired JPEG/WebP poster from the same settled frame.
Quality is measured against a lossless 1080p reference (target SSIM ≥0.98 plus
manual dense-text inspection), not inferred from bitrate. Publish nothing yet.

## Approval checkpoint

Approve or revise this story, including the source-content framing exceptions?
Then: **wireframe sketches first (recommended)**, or skip sketches and proceed to
the fully styled animation build? Either route still has a preview/render approval.
