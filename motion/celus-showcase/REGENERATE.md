# Regenerating the Celus Motion Showcase Suite

This suite contains three production video assets for the Celus case study:
1. `celus-showcase` (55.0s, 1650f) — Main Flagship Showcase: 19-module suite walkthrough from hero to bedside app, CalculUS ACR TI-RADS risk calculator, fetal biometry reference charts, standardized reports, and admin CMS back-office.
2. `celus-calculus-loop` (15.0s, 450f) — Focused Body Loop 1: ACR TI-RADS 5-step dynamic scoring stepper and biopsy recommendation.
3. `celus-admin-cms-loop` (12.0s, 360f) — Focused Body Loop 2: Clinical knowledge governance without code deployments (rich editor, templates, telemetry).

All three videos are **seamless loops** (first and last frames are byte-identical by `sha256sum`).

---

## 1. Source Assets & Provenance

- **Figma File:** `4SkSQ1MjD2IpfAxXjmHzmd` ("Celus")
- **Channel:** `5b329g11` (talk-to-figma WebSocket relay)
- **Live Mirror:** `https://celus.juanpablosilva.com.br/`

### Sourced Nodes:
| Screen | Node ID | Surface / Role |
|---|---|---|
| Landing Page Hero | `1:2` (and live page capture) | Web marketing hero & badges |
| App Navigation Bar | `1:270` | Bedside bottom navigation |
| Home Dashboard | `1:271` | Emergency bedside shortcuts |
| CalculUS - Step 1 (Composição) | `1:479` | Cystic / spongiform / mixed / solid |
| CalculUS - Step 2 (Ecogenicidade) | `1:493` | Anechoic / hyperechoic / isoechoic / hypoechoic |
| CalculUS - Step 3 (Forma) | `1:507` | Wider-than-tall vs taller-than-wide |
| CalculUS - Step 4 (Margem) | `1:521` | Smooth / ill-defined / lobulated / extrathyroidal |
| CalculUS - Step 5 (Focos Ecogênicos) | `1:535` | None / comet-tail / macrocalcifications / punctate |
| CalculUS - Result (TR4 Moderada Suspeita) | `1:550` | 4–6 pts, FNA biopsy ≥ 1.5 cm recommendation |
| MEDUltra - Fetal Biometry Table (CCN) | `1:636` | 1st trimester Crown-Rump Length percentiles |
| LaudUS - Report Template (Endometriose) | `1:698` | Standardized reporting & pictorial guide |
| Admin Dashboard (Visão Geral) | `1:733` | 8-module back-office & calculator analytics |
| Admin CMS - ProtocolUS Rich Editor | `1:853` | Guideline drafting, peer-review & publishing |
| Admin CMS - LaudUS Templates | `1:888` | Standardized report management |
| Admin CMS - ResumUS Digest | `1:923` | Literature summaries & clinical evidence |

---

## 2. Integrity & Seam Verification

Before rendering masters, ensure zero layout errors, zero contrast failures, and byte-identical loop seams:

```bash
# 1. celus-showcase
cd motion/celus-showcase
npx hyperframes check
npx hyperframes snapshot --at 0,54.98
sha256sum snapshots/frame-00-at-0s.png snapshots/frame-*-at-54.98s.png
# Passed: e24e697afd4786f9558bac9be489d3c2a11465354199ffcbc8134e46671a9f1a

# 2. celus-calculus-loop
cd ../celus-calculus-loop
npx hyperframes check
npx hyperframes snapshot --at 0,14.98
sha256sum snapshots/frame-00-at-0s.png snapshots/frame-*-at-14.98s.png
# Passed: 23f7b6b234a174a716a8d94fb31c74fcf854c147dc7a5eb062714fc14159f46d

# 3. celus-admin-cms-loop
cd ../celus-admin-cms-loop
npx hyperframes check
npx hyperframes snapshot --at 0,11.98
sha256sum snapshots/frame-00-at-0s.png snapshots/frame-*-at-11.98s.png
# Passed: 8d880cbd3e435533f7281ca01b8dfd6f729ff0255cb8c2cb139d88324eb7c56c
```

---

## 3. Render Masters & Encode Delivery Sets

Each project includes an automated `encode.sh` script producing:
- 1080p H.264 High L4.0 (CRF 24, `-preset slow`, `+faststart`)
- 1080p VP9 Profile 0 (Two-Pass, CRF 36, `cpu-used 2`)
- WebP still poster (`-quality 82`, `-preset picture`)
- JPG still poster (`-q:v 4`)

### SSIM Quality Verification Scores (Lossless Reference Gate ≥ 0.98):
| Asset | H.264 SSIM | VP9 SSIM | Target Gate | Delivery Size |
|---|---|---|---|---|
| `celus-showcase` | **0.997013** | **0.992827** | ≥ 0.98 (PASS) | MP4: 4.8 MB · WebM: 3.8 MB |
| `celus-calculus-loop` | **0.997650** | **0.994580** | ≥ 0.98 (PASS) | MP4: 787 KB · WebM: 681 KB |
| `celus-admin-cms-loop` | **0.996661** | **0.985468** | ≥ 0.98 (PASS) | MP4: 1.5 MB · WebM: 1.2 MB |

---

## 4. Cloudflare R2 Upload

Upload all 12 assets to `juan-assets` under key prefix `juansilva.design/cases/celus/`:

```bash
BUCKET="juan-assets"
PREFIX="juansilva.design/cases/celus"

for project in celus-showcase celus-calculus-loop celus-admin-cms-loop; do
  D="motion/$project/renders/out"
  for f in mp4:video/mp4 webm:video/webm webp:image/webp jpg:image/jpeg; do
    ext="${f%%:*}"
    mime="${f##*:}"
    npx wrangler r2 object put "$BUCKET/$PREFIX/$project.$ext" \
      --file "$D/$project.$ext" --content-type "$mime" --remote
  done
done
```

---

## 5. Served CDN Endpoints

All assets are globally served via Cloudflare CDN with full HTTP 206 Byte-Range support:
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-showcase.mp4`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-showcase.webm`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-showcase.webp`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-showcase.jpg`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-calculus-loop.mp4`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-calculus-loop.webm`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-calculus-loop.webp`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-calculus-loop.jpg`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-admin-cms-loop.mp4`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-admin-cms-loop.webm`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-admin-cms-loop.webp`
- `https://cdn.juanpablosilva.com.br/juansilva.design/cases/celus/celus-admin-cms-loop.jpg`
