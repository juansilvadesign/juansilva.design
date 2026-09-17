# AllPrice — wireframe review

All four stories were approved on 2026-09-17. All 21 scenes now have static
1920×1080 wireframe compositions: approved copy and key labels, plain blocks for
real UI/media, one empty paused timeline per frame. These are not animated or
fully styled previews.

## Open the review

- [All four films — 21 sketches](http://localhost:3148/api/projects/allprice-showcase/preview/review/sketch-board.html)
- [Main film in Studio — 11 frame cards](http://localhost:3148/?view=storyboard#project/allprice-showcase)

The gallery uses Studio's native frame posters. Click a tile to open its full
1920×1080 poster. The four films remain separate, with their approved durations;
this gallery is not a combined video timeline. Studio comments are available for
the main board. For supporting films, name the scene ID in chat.

| Film | Length | Frames | Storyboard |
| --- | --- | --- | --- |
| Complete landing-page tour | 58s | 11 | [Main](STORYBOARD.md) |
| Design-file remediation | 16s loop | 4 | [Remediation](../allprice-remediation.storyboard.md) |
| Responsive implementation | 18s loop | 3 | [Responsive](../allprice-responsive.storyboard.md) |
| Navigation and FAQ | 16s loop | 3 | [Interactions](../allprice-interactions.storyboard.md) |

## Decision requested

Does the framing and text placement look right, or which scenes should change
before the real assets and animation are added?

Please review caption placement, UI reading scale, equal-scale before/after
crops and desktop/mobile proportions. A sketch shows each scene's key pose;
scrolling, perspective, interaction timing and loop returns come in the next pass.
Prices, screenshots and detailed UI are deliberately represented by plain blocks,
not redesigned. The approved real assets replace those blocks after layout review.

After saving Studio comments, reply in chat so they can be read. Approval here
does not approve final rendering, uploads, website changes or deployment.

The pipeline's sketch-pass exception was followed: no CLI snapshot, check or
render. Browser review confirmed that all 21 Studio posters load; dimensions,
empty timelines and text fit were inspected through the browser. Full production
checks remain mandatory after animation. Do not use the init `index.html`
placeholder as a video preview; final assembly has not started.

Source details: [audit](SOURCE_AUDIT.md), [asset manifest](ASSET_MANIFEST.md).
