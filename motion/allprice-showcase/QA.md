# Motion QA handoff

All four editable films are assembled. This file does not constitute render approval.

## Available local checks

From the showcase project directory:

```bash
npm run lint:all
npm run check:all
```

The runner performs checks serially, never renders, and saves JSON receipts with
source hashes to review/checks/. It needs normal local child-process and loopback
server permissions. The restricted agent runner currently lacks these permissions.

Direct equivalent commands, useful if the check runner cannot start a child:

```bash
npm run check -- --strict --timeout 120000 --snapshots
npm --prefix films/remediation run check -- --strict --timeout 120000 --snapshots
npm --prefix films/responsive run check -- --strict --timeout 120000 --snapshots
npm --prefix films/interactions run check -- --strict --timeout 120000 --snapshots
```

The main entry is index.html. Each films/<name>/ directory has one index.html,
one motion assertion sidecar and links to the shared assets and compositions.
Run `node scripts/assemble-films.mjs` only if assembly needs rebuilding. It keeps
the main entry intact when rebuilding a supporting film alone.

## Evidence already available

Direct static lint passed for all four entries with 0 errors and 0 warnings.
All referenced assets exist; no film uses the same image URL twice.
All 21 standalone scene first/middle/last snapshots exist in review/frames/.

Existing standalone loop evidence at 60fps:

| Pair | SHA-256 result |
| --- | --- |
| remediation-01-intent at 0 / remediation-04-return at 3.9833 | Both b79bdf2d85461b7be52be6bc3bbba37670c84496658e6a43d1082ab70010f337 |
| responsive-01-hero at 0 / responsive-03-plans at 5.9833 | Both ab700613a61225d496e14f1c2ce632d3e691bbb2543f091383e0cb78489ecf79 |
| interactions-01-menu at 0 / interactions-03-return at 3.9833 | Different; needs a fresh check and repair |

Interactions hashes: opening
742b9214f59826eb154f4ccd718d980bfe9543f083985941bf880a448fc2c8b9;
closing c7b19775ae1a899e71aaeba4f493815a08993ad16e5321a7392e07e3a81b092a.
The stored samples differ in 80,560 pixels, bounded by x=622..1815, y=100..1010.
The mobile surface matches. All six shared source rasters are byte-identical.
The desktop appears more softly rasterized in the closing sample; compositing
is a hypothesis to inspect, not an established cause. Re-capture after the CSS
initial-opacity fix before making a speculative motion change.

## Required before the render-approval question

1. Pass full checks for all four entries, with nonzero runtime/layout/motion and
   contrast samples. Never treat a blocked browser with zero samples as a pass.
2. Inspect assembled midpoints and both sides of every cut. Main cut times are
   5, 10, 15, 21, 28, 34, 38, 44, 47 and 53 seconds.
3. Run keyframes JSON and a focused shot of the real feature-rail subject,
   #main-05-features-rail, at 21.7–25.8 seconds. Inspect the shot visually.
4. Compare first and last displayed frames of each ASSEMBLED loop at 60fps:
   remediation/interactions 0 vs 15.983333; responsive 0 vs 17.983333.
   They must be byte-identical. The standalone proof does not replace this.
5. Check random/backward seeks and deterministic replay. The browser capture
   helper uses __HF_EXPORT_RENDER_SEEK_CONFIG fps=60; otherwise Studio defaults
   may quantize seeks to 30fps. Keep verified source UI unchanged.
6. Verify managed Studio availability. Build and test the four-film review
   surface, then ask “Render now, or what changes?” No render before approval.

No upload, website wiring, publishing or deployment is authorized.
