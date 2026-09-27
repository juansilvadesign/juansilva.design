# AllPrice showcase — current state

Updated 2026-09-22. Phase: animation assembled; browser QA blocked by environment.

## Approvals

Direction, four storyboards, all 21 static layouts and the animation build are
approved. The latest “continue” resumes implementation and quality checks.
The next user gate is approval of the FINISHED MOTION PREVIEWS, before rendering.
No video render, upload, site integration, deployment or publication is authorized.

## Deliverables on disk

| Film | Entry | Length | Scenes |
| --- | --- | --- | --- |
| Complete landing-page tour | index.html | 58s | 11 |
| Design-file remediation | films/remediation/index.html | 16s loop | 4 |
| Responsive implementation | films/responsive/index.html | 18s loop | 3 |
| Navigation and FAQ | films/interactions/index.html | 16s loop | 3 |

All 21 scene files are animated, with no SKETCH ONLY markers. All four boards
mark their frames animated. Entries have full-duration clocks, local GSAP and
1920×1080 canvases. The target remains 60fps, silent, with English captions and
unchanged Portuguese UI. Each supporting film is its own project directory;
relative assets/compositions symlinks share the parent source files.

STORYBOARD.md is canonical for the main film; the adjacent showcase storyboard
is its relative symlink. Three adjacent supporting storyboards remain separate.
Real source pixels and local Lato fonts are staged. capture/motion-assets.json
records 72 bounded derivatives with source hashes and crop geometry. No complete
tall-page bitmap is mounted; camera scale and page scroll use separate wrappers.

## Verified

- Direct CLI lint for all four entries: 0 errors, 0 warnings, 0 info findings.
  Reports and source hashes: review/checks/*.lint.json.
- Every mounted source asset exists; no repeated image URL within any film.
- Durations and mounted scene counts match the table above.
- Existing 60fps standalone samples cover the opening, middle and last frame
  of all 21 scenes. Both contact sheets were inspected; individual PNGs remain
  in review/frames/. The latest contact sheet/receipt covers only a subset.
- The final remediation hierarchy sample visibly contains all 12 source nodes.
- Existing standalone remediation and responsive loop endpoint PNGs are
  byte-identical. This is NOT yet proof of their assembled loop seams.
- The earlier main-film browser pass had no runtime errors and passed 6/6
  contrast checks. Its layout warnings were reviewed; narrow annotations now
  document the deliberately clipped scrolling tracks and feature rail.

## Remaining defects / gates

1. Fresh browser checks for all four assembled films, including the new motion
   assertions. No clean post-fix full check is claimed.
2. Assembled midpoint/cut samples and keyframes JSON plus a focused motion shot.
3. Exact first/last-frame loop tests at 60fps for all three assembled loops.
   The previous standalone interactions endpoints differ in desktop text
   rasterization and caption pixels; source images are byte-identical. Reproduce
   and inspect computed compositing states before changing motion.
4. A verified four-film review surface, then ask the user whether to render or revise.

See QA.md for check commands and endpoint evidence. No MP4 exists.

## Current tool blocker

The latest restricted full check passed lint, then failed with
“listen EPERM: operation not permitted 127.0.0.1” before any browser samples.
The privileged Chrome request was not executed: automatic approval review hit
a usage limit. Do not bypass this approval gate or infer permission to render.
A check-runner attempt also hit a restricted child-process EPERM; the direct
CLI lint commands worked and supersede that attempt's static results.

The managed Studio was previously started at port 3148. Its current availability
has not been reverified under this restriction. Do not hand its timeline or the
old sketch gallery to the user as a verified finished-video preview.

## Tooling and source guardrails

HyperFrames stays pinned to 0.8.43. The latest-version probe and upgrade were
attempted; the upgraded validation timed out and the pin was reverted. A longer
timeout also helped the old CLI, so incompatibility with the new version has
NOT been established. Keep the pin stable until successful fresh verification.

Figma was read/exported through channel 4hj86qf7; do not mutate it. Use complete,
matched original/optimized hero composites. Do not rest on dummy dashboard
figures or repeated testimonials. No invented billing toggle, backend flow,
commercial metric or broad app-design credit. Credit Juan for landing-page
remediation and React implementation; original landing-page design was Thiago's.

No source assets were deleted, uploaded or published. No portfolio records,
live components, commits or deployments were changed by this continuation.
