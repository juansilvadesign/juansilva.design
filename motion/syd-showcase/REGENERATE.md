# Regenerating SYD Showcase Inputs & Delivery Set

`assets/` and render outputs are **gitignored**. This document is the reproducible specification to rebuild the entire delivery set from scratch.

---

## 1. Sourcing the Landing-Page Frames

Captured directly from the live production routes of SYD (hosted on Juan's cPanel and archived on the Wayback Machine):

```
playwright → https://sydapp.com.br/ (Paciente)
playwright → https://sydapp.com.br/profissional (Profissional)
playwright → https://sydapp.com.br/rh (RH Corporativo)
viewports:
  - Desktop: 1440 × 900 · deviceScaleFactor 2 · colorScheme light
  - Laptop:  1280 × 800 · deviceScaleFactor 2 · colorScheme light
  - Mobile:  375 × 812  · deviceScaleFactor 2 · colorScheme light
```

### Verified Assets
Every surface the camera settles on was visually inspected:
- `paciente-hero-1440.png`: Clean, patient urgency headline, booking CTA, authentic vector illustration.
- `paciente-laptop-1280.png`: Fluid reflow at 1280px.
- `paciente-mobile-375.png`: Mobile hamburger, stacked action buttons, thumb-friendly ergonomics.
- `profissional-hero-1440.png`: Supply-side therapist recruitment & autonomy portal.
- `profissional-laptop-1280.png`: Laptop reflow for therapist portal.
- `profissional-mobile-375.png`: Mobile view for therapist onboarding.
- `rh-hero-1440.png`: B2B corporate HR employee health benefits portal.
- `rh-laptop-1280.png`: Laptop view for HR portal.
- `rh-mobile-375.png`: Mobile view for HR portal.
- `logo-full.svg`: Extracted brand vector with warm amber sun mark.

---

## 2. Verify Before Rendering

```bash
# Must pass with 0 errors and 0 warnings
npx hyperframes check

# Snapshot verification across timeline keyframes
npx hyperframes snapshot --at 0,3.0,6.0,8.5,12.5,17.5,21.5,24.98 --no-end

# Loop seam byte-identity test:
sha256sum snapshots/frame-00-at-0s.png snapshots/frame-01-at-24.98s.png
# Output must be identical hashes (proven: 362954c59e356d980c41ee58408ce6b419a2c9c0d3ff0ea55465dc48cb752582)
```

---

## 3. Master Render

```bash
npx hyperframes render -o renders/out/syd-showcase.master-1080p.mp4
ffmpeg -ss 00:00:00.000 -i renders/out/syd-showcase.master-1080p.mp4 -vframes 1 renders/out/syd-showcase.master-1080p.jpg
```

---

## 4. Delivery Set Encoding (Stage 4)

Produces four optimized delivery files from the 1080p master:

```bash
D=renders/out
S=$D/syd-showcase.master-1080p

# 1. H.264 High L4.0 (Primary universal MP4 fallback)
ffmpeg -y -i $S.mp4 -vf scale=1920:1080:flags=lanczos -an \
  -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -crf 24 -preset slow \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart \
  $D/syd-showcase.mp4

# 2. VP9 Profile 0, two-pass (Primary WebM delivery)
ffmpeg -y -i $S.mp4 -vf scale=1920:1080:flags=lanczos -an \
  -c:v libvpx-vp9 -pix_fmt yuv420p -profile:v 0 -crf 36 -b:v 0 -row-mt 1 \
  -deadline good -cpu-used 2 -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -pass 1 -f null /dev/null

ffmpeg -y -i $S.mp4 -vf scale=1920:1080:flags=lanczos -an \
  -c:v libvpx-vp9 -pix_fmt yuv420p -profile:v 0 -crf 36 -b:v 0 -row-mt 1 \
  -deadline good -cpu-used 2 -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -pass 2 $D/syd-showcase.webm

# 3. WebP Still (Poster frame & reduced-motion fallback)
ffmpeg -y -i $S.jpg -vf scale=1920:1080:flags=lanczos \
  -c:v libwebp -quality 82 -preset picture \
  $D/syd-showcase.webp

# 4. JPG Still (Universal poster fallback)
ffmpeg -y -i $S.jpg -vf scale=1920:1080:flags=lanczos -q:v 4 \
  $D/syd-showcase.jpg
```

---

## 5. Upload to Cloudflare R2 (Stage 5)

Target CDN path: `https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/`

```bash
B=<bucket-name>
P="juansilva.design/cases/syd"
D="renders/out"

for f in webm:video/webm mp4:video/mp4 webp:image/webp jpg:image/jpeg; do
  ext="${f%%:*}"
  mime="${f##*:}"
  npx wrangler r2 object put "$B/$P/syd-showcase.$ext" --file "$D/syd-showcase.$ext" --content-type "$mime"
done
```

Verify range requests:
```bash
CDN="https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd"
curl -sI "$CDN/syd-showcase.mp4" | grep -iE "^HTTP|content-length|content-type"
curl -sI -r 0-100 "$CDN/syd-showcase.mp4" | grep -iE "^HTTP|content-range"
```

---

## 6. Portfolio Integration (Stage 6)

In `_config/portfolio/records/syd.json`:
1. Add `previewMotion`:
```json
"previewMotion": {
  "webm": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.webm",
  "mp4": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.mp4",
  "poster": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.webp",
  "width": 1920,
  "height": 1080,
  "hoverStart": 0.0
}
```
2. Replace placeholder blocks with the verified video block.
3. Re-run `node _config/portfolio/export.mjs`.
