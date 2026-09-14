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

## 4. The `-mockup` web-delivery set (2026-09-13)

A second, separate asset from the 30s loop above: a 41.7s device-mockup showcase that opens on a
**closed** laptop, lifts the lid, tours the LP and all eight modules, and fades back down. It feeds
the homepage card's hover preview, the `/projects` tile's hover preview, and the case-study hero.

The 4K render out of HyperFrames is the **master** and stays local, gitignored, under
`renders/out/upos-lp-app-showcase-mockup.master-2160p.{mp4,jpg}` — 3840×2160, 78.5 MB. It is never
served: a 78 MB hover is not a hover.

```
D=motion/upos-lp-app-showcase/renders/out
S=$D/upos-lp-app-showcase-mockup.master-2160p

# 1080p H.264 High L4.0 — 14.5 MB
ffmpeg -i $S.mp4 -vf scale=1920:1080:flags=lanczos -an \
  -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -crf 24 -preset slow \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart \
  $D/upos-lp-app-showcase-mockup.mp4

# 1080p VP9 Profile 0, 2-pass — 9.6 MB   (⛔ Profile 0, NOT the loop's Profile 1)
ffmpeg -i $S.mp4 -vf scale=1920:1080:flags=lanczos -an -c:v libvpx-vp9 -pix_fmt yuv420p \
  -profile:v 0 -crf 36 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -pass 1 -f null /dev/null
#   …then the identical line with -pass 2 and the output path.

# Both stills from the SAME master jpg, so the <picture> pair cannot be two pictures
ffmpeg -i $S.jpg -vf scale=1920:1080:flags=lanczos -c:v libwebp -quality 82 -preset picture \
  $D/upos-lp-app-showcase-mockup.webp
ffmpeg -i $S.jpg -vf scale=1920:1080:flags=lanczos -q:v 4 $D/upos-lp-app-showcase-mockup.jpg
```

⭐ **CRF chosen on measurement, not taste.** SSIM against a lossless 1080p downscale of the master:
mp4 crf21 0.99113 @ 21.9 MB vs **crf24 0.98824 @ 14.5 MB**; webm crf32 0.97436 @ 13.1 MB vs
**crf36 0.97340 @ 9.6 MB**. A 1:1 crop of the densest text (the permissions matrix at t=26s) is
indistinguishable across all four, so the cheaper pair wins.

⛔ **Profile 0, deliberately.** The 30s loop is VP9 Profile 1 (4:4:4) because full-frame UI glyphs
fringed at 4:2:0. This is a photographic device mockup, the 4K→1080p downscale averages that away,
and Profile 1 is the exact thing that lets Safari claim support by MIME and then paint a blank box.
The `<source type>` strings live in `PREVIEW_MOTION_TYPES` (`src/lib/projects.ts`) and describe THIS
recipe — `vp09.00.40.08` and `avc1.640028`. Re-encode at other settings and those must change with it.

⛔ **The poster is not frame 0, on purpose.** Frame 0 is an unlit, closed laptop; the poster is the
settled open one. That is why the record carries `previewMotion.hoverStart: 2.4` — measured at 0.25s
steps, the lid is up and sharp by 2.25s. The hero ignores it and plays the lift from zero, which is
the intended opening there.

### Upload

⛔ The `.mp4` and `.jpg` **overwrite** the 4K objects already on R2. The masters survive only in
`renders/out/*.master-2160p.*`, which is gitignored — do not clear that folder before this lands.

⛔ Upload **before** deploying. Until the objects exist, `.webp` and `.webm` 404 and the page falls
back to the `.jpg` and the **78 MB** 4K `.mp4` still sitting at that path.

```
npx wrangler r2 bucket list                      # the bucket behind cdn.juanpablosilva.com.br
B=<bucket>; P=juansilva.design/cases/upos; D=motion/upos-lp-app-showcase/renders/out
for f in webm:video/webm mp4:video/mp4 webp:image/webp jpg:image/jpeg; do
  npx wrangler r2 object put "$B/$P/upos-lp-app-showcase-mockup.${f%%:*}" \
    --file "$D/upos-lp-app-showcase-mockup.${f%%:*}" --content-type "${f##*:}" --remote
done

# Then confirm all four, and that mp4 is the 14.5 MB one rather than the old 78.5 MB object:
for f in webm mp4 webp jpg; do
  curl -sI "https://cdn.juanpablosilva.com.br/$P/upos-lp-app-showcase-mockup.$f" \
    | grep -iE "^HTTP|content-length|content-type"
done
```

⭐ Seeking needs HTTP Range. R2 answers `206`; `python3 -m http.server` answers `200` and the seek is
then **silently clamped to 0** with `seeked` still firing. Both hover surfaces therefore gate their
crossfade on `currentTime >= hoverStart` rather than trusting the seek — so a server without Range
costs a short wait, never a card that opens on a closed laptop. Test on `npx astro preview`, not on
`http.server`.
