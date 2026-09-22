# AllPrice showcase — current state

Updated 2026-09-22. Phase: approved animation build in progress.

## Approvals

Direction, four storyboards and all 21 static layouts are approved. The user's
“approved, proceed” authorized animation; subsequent “continue” messages resumed
that work and accepted the recommended parallel frame-building approach.
The next gate is motion-preview approval, BEFORE rendering. No upload, site
integration, deployment or external publication is authorized.

## Deliverables

- Main: 11 scenes / 58 seconds, complete landing-page tour.
- Remediation: 4 scenes / 16 seconds, seamless loop.
- Responsive: 3 scenes / 18 seconds, seamless loop.
- Interactions: 3 scenes / 16 seconds, seamless loop.
- All silent, 1920×1080, target 60fps; English captions, unchanged Portuguese UI.

## Build state

Five completed animation files survived the earlier usage-limit interruption:
main-01-clarity, main-02-overview, main-03-audiences, main-05-features,
main-10-faq. The remaining scenes are being built from bounded per-frame packets
under .hyperframes/frame-packets/, one scene per worker. Completion means the
file exists without the SKETCH ONLY marker, not merely an agent notification.

Real source pixels and local Lato fonts are staged. capture/motion-assets.json
records 72 bounded derivatives with source hashes and crop geometry. The complete
feature rail uses two additional verified browser captures. No whole tall page
is mounted into an animation; scale and scroll have separate wrappers.

STORYBOARD.md is canonical for the main film; the adjacent showcase storyboard
is its relative symlink. Three adjacent supporting storyboards remain separate.
The orchestrator marks completed frames animated. No frame comments were present
on resume. index.html is still the initialization placeholder until assembly.

## Verification and review

Earlier first-pass lint found no errors and missing timed-layer IDs; those IDs
are being repaired. Main-01's browser probe confirmed decoded assets, 1920×1080
root, one 5-second timeline and no page errors. Full assembled checks, visual
snapshots, cut continuity and byte-identical loop joins remain pending.

The managed preview at port 3148 stopped during the interruption; it is being
restarted. Do not offer the placeholder timeline as a completed showcase.

After assembly and clean checks, share the four playable motion previews and ask
for approval before rendering. Main Studio: http://localhost:3148/#project/allprice-showcase
The old review/sketch-board.html is a layout gallery, not a finished-film preview.

## Tooling and source guardrails

HyperFrames remains pinned to 0.8.43. An attempted 0.8.46 upgrade was reverted
because validation failed on the unfinished initialization timeline. Recheck
compatibility after full assembly before adopting a newer version.

Source Figma was read/exported through channel 4hj86qf7. Do not mutate it.
Use complete matched original/optimized hero composites; avoid resting on dummy
dashboard figures or repeated testimonials. No invented billing toggle, backend
flow, commercial metric or broad app-design credit. Credit Juan for landing-page
remediation and React implementation; original landing-page design was Thiago's.

No MP4 master or delivery encode exists yet. No assets were uploaded and no
portfolio records, live components, commits or deployments were changed.
