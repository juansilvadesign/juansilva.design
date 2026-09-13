# Regenerating this project's inputs

`assets/` and every render output are **gitignored**. Nothing here is lost by that — but
nothing here is recoverable by `git checkout` either, so this file is the second copy.

## 1. The landing-page strip — `assets/lp-full@2x.png` (and its `-s5` twin)

Captured from Juan's own surviving copy of the page, **not** the product's current address.

```
playwright → http://upos.juanpablosilva.com.br/
viewport 1920x1080 · deviceScaleFactor 2 · colorScheme light
```

⛔ **The per-image decode wait is mandatory, not optional.** The hero and feature images are
hosted on `i.ibb.co` and are slow. A capture that only waits a fixed few seconds catches the
page **before** they decode, which collapses the layout: the document comes back ~2708px
instead of **7871px** and every section offset is wrong. Wait for all 16 images to report
`naturalWidth > 0` (60s budget each), then assert `scrollHeight === 7871` before trusting it.

Two copies of the same file are required: `lp-full@2x.png` and `lp-full@2x-s5.png`. They are
byte-identical on purpose — two `<img>` elements sharing one `src` trip HyperFrames'
`duplicate_media_discovery_risk`, and the producer can collapse them into a blank render.

## 2. The app screens — Figma `upOS - Antônio`, page `↳ 💻 • Desktop` (`17005:453`)

⚠️ These are the **repaired** screens (2026-09-11). Re-exporting is safe; the repairs live in
the Figma file itself, not in these PNGs.

| File | Node | Scale | Note |
|---|---|---|---|
| `1-1.1-agenda@3x.png` | `19096:4453` | 3 | |
| `1-0.1-painel@3x.png` | `19341:21350` | 3 | |
| `2-3-kanban@1.5x.png` | `19162:30610` | 1.5 | native 2560 wide |
| `7-3.1-perfis@3x.png` | `19142:36607` | 3 | |
| `7-3.3-matrix@2x.png` | `19146:22113` | **2** | ⛔ 3× projects to 31 MP, over the 16 MP export ceiling |
| `1-2-dashboard@2.5x.png` | `19402:35840` | **2.5** | ⛔ 3× projects to 16.8 MP, over the ceiling |
| `6-2.1-statband@3x.png` | `19638:30562` | 3 | then `crop=3840:1040:0:0` |

⛔ **The statband crop is load-bearing.** The full `6-2.1` frame renders the same fake CPF
(`123.456.789-10`) on all eight rows, `R$ 20.000` on all eight, and a context menu left open
over rows 2–4. Cropping to the top 1040px keeps the navbar, the three clean summary cards and
the column headers, and stops **before the first data row**. Never widen this crop.

⛔ **Do not export whole screens as SVG.** Measured: the kanban timed out past 120s and wedged
the plugin; a single card came back at 66 KB with **zero `<text>` elements** — Figma outlines
every glyph, so 96% of the file is path data and nothing text-shaped is animatable. The raster
is both lighter and more capable here.

## 3. Verify before rendering

```
npx hyperframes check      # must be 0 errors, 0 warnings
npx hyperframes snapshot --at 0,8,10.5,14.5,16.5,19,23,29.98
sha256sum snapshots/frame-00-at-0s.png snapshots/frame-*-at-29.98s.png
```

⭐ The seam test is not "they look similar": frame 0 and frame 29.98 must be **byte-identical**.
They were, at `4f8573ffc03622cf…`, on 2026-09-12.
