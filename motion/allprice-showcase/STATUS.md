# AllPrice showcase — current state

## Checkpoint: layout approval

Updated 2026-09-17. User: “Storyboard approved”, followed by “continue” while the
wireframe pass was underway. All four stories are approved. All 21 frames are
now built as static wireframes. No layout approval, animation or render yet.

- Main: 11 scenes / 58 seconds.
- Remediation: 4 scenes / 16 seconds, seamless-loop target.
- Responsive: 3 scenes / 18 seconds, seamless-loop target.
- Interactions: 3 scenes / 16 seconds, seamless-loop target.
- All: silent, 1920×1080, 60fps target; English captions, Portuguese source UI.
- Source inventory: 41 inspected Figma/browser images plus raw catalog assets.
- Story verification from the previous pass: 54 valid asset references,
  94 unique planned motion-layer names.

## Review surface

All 21 wireframes:
http://localhost:3148/api/projects/allprice-showcase/preview/review/sketch-board.html

Main film's native Studio board:
http://localhost:3148/?view=storyboard#project/allprice-showcase

Managed preview remains serving. The main board parses 11 built frames, every
composition exists, and there are zero parser warnings. The gallery presents all
four films using native Studio posters, without modifying the 58-second main
timeline or duplicating the supporting story plans. All 21 posters loaded.

`STORYBOARD.md` is the canonical main plan. The adjacent
`../allprice-showcase.storyboard.md` is a relative symlink to it. Supporting plans
are the three adjacent named storyboards. Every frame status is `built`, meaning
wireframe, not `animated`. Composition filenames match the approved plans.

## Awaiting the user

Does the framing and text placement look right, or which scenes should change
before source pixels, finished styling and animation are added?

On reply, inspect `.hyperframes/frame-comments.json` first. It was absent at the
start and during this pass. Revise only named frames when feedback is specific.
Do not infer layout approval from the earlier “continue” sent before this review
was presented. Keep separate questions before final rendering and publication.

## Resume instructions

Use `knowledge/skills/case-study-showcase-pipeline/SKILL.md`, then the current
HyperFrames/product-launch workflow and its review loop. No subagents were used
for this sketch pass, as required. After layout approval, the product workflow's
build-stage delegation may apply; read its dispatch instructions before use.

Read BRIEF.md, SOURCE_AUDIT.md, ASSET_MANIFEST.md, frame.md and approved plans.
Retain the approved composition, hierarchy and copy while replacing wireframe
stand-ins with real captured pixels. Do not turn these wireframes into invented
UI. Keep the continuous main-browser surface and separate scale/scroll wrappers.

The sketch-pass exception forbids CLI check/snapshot/render, so none was run.
Browser-only review confirmed all 21 composition roots at 1920×1080 and zero
animation children. Two card-title text boxes needed more height and were fixed.
Full runtime/layout/motion/contrast checks are still required after animation.
`index.html` remains the unassembled init placeholder; never offer its timeline
view as a completed showcase. Gallery and storyboard views are the review links.

Source guardrails remain unchanged: Figma read/export only via local fork
`--channel=4hj86qf7`; use complete original composite for matched crops; preserve
source defects without highlighting dummy figures or repeated testimonials; no
fake billing toggle, commercial metrics, backend flow or broad design credit.

Toolchain is pinned to HyperFrames 0.8.43. Four deliverables are silent. Record the
approved blue-professional style preference when entering the next production
phase; its captured ink correction is documented in frame.md.

Final assembly, animation, full production checks, master render, encode quality
comparisons, posters, CDN upload and site wiring have not run. No uploads,
commits, deployments or edits to existing portfolio components were made.
