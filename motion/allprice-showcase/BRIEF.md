---
workflow: product-launch-video
flow: automation
storyboard: yes
message: "AllPrice brings pricing, sales, and profit visibility into one place; this case study shows the landing page that explains it."
destination: website
aspect: 1920x1080
language: en
length: 58s
angle: guided-site-tour
narration: no
---

## Intent

Create a portfolio showcase for AllPrice: one main film, no longer than 60 seconds,
that explains the product through the complete landing page, plus focused body
loops where motion adds useful evidence to the case study. The user approved the
recommended guided tour, English captions, and silent autoplay on 2026-09-16.

## Assets

- Figma: AllPrice-Spaceapps, via the local talk-to-figma-fork MCP on channel `4hj86qf7`.
- React build: https://allprice-lp.juanpablosilva.com.br/
- Historical WordPress build: https://allprice.juanpablosilva.com.br/
- Case-study record: `../../../../_config/portfolio/records/allprice.json` (resolve from the portfolio workspace when integrating).

## Customizations

- Show every section of the landing page from header to footer.
- Use scrolls, readable pauses, authentic cursor interactions, close-ups, and
  restrained camera rotation/perspective. Settle front-on for dense UI.
- Keep original Portuguese UI intact; use concise English explanatory captions.
- Silent: no narration, music, or sound effects. No `SCRIPT.md`; use `music: none`
  in the storyboard.
- Deliver at 1920×1080. Target 60 fps for smooth scrolling, subject to render checks.
- Capture real UI at 2× where useful; freeze all media locally with provenance.

## Notes

- The user requires a question before each main step. Initial direction, source
  inspection and all four storyboards are approved. Layout, animation preview,
  final rendering and publication remain checkpoints. Do not interpret approval
  of one as all stages.
- Intended workflow is agent-driven execution with collaborative review gates.
- Credit Juan for landing-page remediation and the responsive React build. App
  design, Bubble backend, and integrations belong to the wider product team.
- Read the current live UI instead of assuming the case-study prose is exact:
  pricing is two fixed cards, not a toggle. Testimonials include repeated copy.
- Preserve source defects in archival captures; flag them when proposing shots.
  Do not invent customer testimony, metrics, UI states, or product behavior.
- Project-local delivery is approved. Ask at the publication checkpoint before
  uploading or changing the live case-study page.

## Deliverable set — approved 2026-09-17

The user's “Continue” accepts the proposed four-video set, not the forthcoming
storyboards or rendering:

1. Main showcase — 58 seconds, complete landing-page tour.
2. Design remediation — 16-second loop, original Figma vs. optimized structure.
3. Responsive layout — 18-second loop, real desktop and mobile surfaces.
4. Navigation and FAQ — 16-second loop, captured menu and accordion states.

All four are silent, 1920×1080, with English captions and unchanged Portuguese UI.
## Story approval and sketch pass — 2026-09-17

The user's “Storyboard approved” approved the four story plans. The recommended
wireframe pass followed immediately; the later “continue” kept that pass moving.
It was not interpreted as approval of unseen layouts or final rendering.

All 21 static sketches are in `compositions/frames/`. The user's subsequent
“approved, proceed” approved their layouts and authorized the animation build.
The later “continue” follows the proposed parallel frame-building approach.
The next approval checkpoint is the finished motion preview, before rendering.
Review all four films at `review/sketch-board.html` through the running Studio
server; the main film's 11 frames also appear on Studio's storyboard board.
No finished video has been rendered, uploaded or connected to the live case page.
