# Integrating the SYD Showcase Video into the Case Study

## Deliverable Assets

Located in `projects/juansilva-design/motion/syd-showcase/renders/out/`:

| File | Size | Codec / Format | Role |
|---|---|---|---|
| `syd-showcase.mp4` | 3.9 MB | H.264 High L4.0 / yuv420p crf24 BT.709 faststart | Universal video fallback |
| `syd-showcase.webm`| 3.5 MB | VP9 Profile 0 / yuv420p crf36 BT.709 2-pass | Primary modern browser video |
| `syd-showcase.webp`| 71 KB  | WebP (quality 82, preset picture) | Poster & reduced-motion still |
| `syd-showcase.jpg` | 101 KB | JPEG (q:v 4) | Poster fallback |
| `syd-showcase.master-1080p.mp4` | 15.8 MB | Master render (gitignored) | Archive master |

- Duration: 25.0s @ 30fps = 750 frames.
- Loop seam: Frame 0 and Frame 24.98s verified byte-identical (`362954c59e356d980c41ee58408ce6b419a2c9c0d3ff0ea55465dc48cb752582`).
- SSIM: 0.9953 against master render.
- PSNR between stills: 46.50 dB.

---

## 1. Store Record Update (`_config/portfolio/records/syd.json`)

### `publish` Block:
```json
"publish": {
  "featured": true,
  "preview": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.jpg",
  "previewMotion": {
    "webm": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.webm",
    "mp4": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.mp4",
    "poster": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.webp",
    "width": 1920,
    "height": 1080,
    "hoverStart": 0.0
  },
  ...
```

### `caseStudy.en.blocks[0]`:
```json
{
  "type": "video",
  "webm": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.webm",
  "mp4": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.mp4",
  "poster": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.webp",
  "width": 1920,
  "height": 1080,
  "alt": "SYD landing page layer across three audiences (Patient, Practitioner, Corporate HR) and three responsive breakpoints (1440, 1280, 375).",
  "caption": "Twenty-five seconds, silent and looping — the three audience landing pages and responsive continuity across nine designed states."
}
```

### `caseStudy.pt.blocks[0]`:
```json
{
  "type": "video",
  "webm": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.webm",
  "mp4": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.mp4",
  "poster": "https://cdn.juanpablosilva.com.br/juansilva.design/cases/syd/syd-showcase.webp",
  "width": 1920,
  "height": 1080,
  "alt": "Camada de landing pages do SYD em três públicos (Paciente, Profissional, RH) e três breakpoints responsivos (1440, 1280, 375).",
  "caption": "Vinte e cinco segundos, silencioso e em loop contínuo — as três landing pages por público e a continuidade responsiva nos nove estados desenvolvidos."
}
```

---

## 2. CDN Upload Command

```bash
B=<cloudflare-r2-bucket>
P="juansilva.design/cases/syd"
D="projects/juansilva-design/motion/syd-showcase/renders/out"

for f in webm:video/webm mp4:video/mp4 webp:image/webp jpg:image/jpeg; do
  ext="${f%%:*}"
  mime="${f##*:}"
  npx wrangler r2 object put "$B/$P/syd-showcase.$ext" --file "$D/syd-showcase.$ext" --content-type "$mime"
done
```
