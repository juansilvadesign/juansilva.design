#!/bin/bash
# Renders the hero portrait's delivery set from the four transparent masters.
#
#   scripts/hero-portrait/render.sh <masters-dir> <out-dir>
#
# <masters-dir> holds white-to-black-{smile,neutral}_1.alpha.webm and
# black-to-white-{smile,neutral}_1.alpha.webm — 1080×1920 VP9 with alpha, 24 fps. They are archived
# at https://cdn.juanpablosilva.com.br/juansilva.design/hero/masters/ (the local copies were deleted
# on 2026-09-19 once that archive was verified byte for byte).
#
# Writes, for upload to R2 under juansilva.design/hero/ (names are the contract `src/data/hero.ts`
# reads):
#   to-{dark,light}-{smile,neutral}.{mp4,webm}  840×958, the card gradient baked in
#   portrait-{dark,light}[-420].webp            the stills: each smile take's LAST frame
#   avatar-{dark,light}.webp                    384×384 face crops of those stills, for /card
#   report.json                                 sizes, SSIM against a lossless reference, ffprobe
#
# ⛔ The gradient stops below ARE `--color-portrait-*` in design-system/tokens.css. Change one and
# re-render, or a clip will start on a card that no longer matches the page around it.
# ⛔ Gate before uploading: SSIM ≥ 0.98 for every file, and the ffprobe profile/level still matching
# `webmType` in src/data/hero.ts (VP9 Profile 0 at 840×958@24 → level 3.1 → vp09.00.31.08).
set -euo pipefail

MASTERS=${1:?usage: render.sh <masters-dir> <out-dir>}
OUT=${2:?usage: render.sh <masters-dir> <out-dir>}
HERE=$(cd "$(dirname "$0")" && pwd)
COMP=$HERE/composite.mjs
CRF_H264=${CRF_H264:-24}
CRF_VP9=${CRF_VP9:-36}
mkdir -p "$OUT"

# Card gradients as effective sRGB stops, top-right colour then bottom-left colour. Dark is Figma
# 23015:145 composited exactly (#0c0e12 under 40% #85888e → #61656c); tokens.css rounds it to hex.
DARK="60.4 62.8 67.6 46 48.8 54"
LIGHT="217 224 232 170 182 197"
# The 420:479 card, cut from the full source width, 24px below the source top.
CROP="crop=1080:1232:0:24"
TAG="-color_primaries bt709 -color_trc bt709 -colorspace bt709"

declare -A MASTER=(
  [to-dark-smile]=white-to-black-smile_1
  [to-dark-neutral]=white-to-black-neutral_1
  [to-light-smile]=black-to-white-smile_1
  [to-light-neutral]=black-to-white-neutral_1
)

# RGBA frames of the card crop → composite.mjs → RGB24. `libvpx-vp9` as the DECODER is load-bearing:
# ffmpeg's native vp9 decoder drops the alpha plane without a word.
composite() { # master-file gradient... (extra ffmpeg input options via $SEEK)
  local src=$1; shift
  ffmpeg -nostdin -v error ${SEEK:-} -c:v libvpx-vp9 -i "$src" -vf "$CROP,format=rgba" -f rawvideo - \
    | node "$COMP" 1080 1232 "$@"
}
raw_in="-f rawvideo -pix_fmt rgb24 -s 1080x1232 -framerate 24 -i -"
ssim() { ffmpeg -nostdin -v info -i "$1" -i "$2" -lavfi "[0:v][1:v]ssim" -f null - 2>&1 | /usr/bin/grep -o 'All:[0-9.]*' | tail -1 | cut -d: -f2; }
probe() { ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,profile,level,width,height,pix_fmt,color_space:format=duration -of json "$1"; }

echo '{"crf_h264":'"$CRF_H264"',"crf_vp9":'"$CRF_VP9"',"clips":{' > "$OUT/report.json.tmp"
first=1
for name in to-dark-smile to-dark-neutral to-light-smile to-light-neutral; do
  case $name in to-dark-*) G=$DARK ;; *) G=$LIGHT ;; esac
  echo "=== $name"
  # Lossless reference at delivery size, BT.709 4:2:0 — both encodes are gated against it.
  composite "$MASTERS/${MASTER[$name]}.alpha.webm" $G \
    | ffmpeg -nostdin -v error -y $raw_in \
        -vf "scale=840:958:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p" -an \
        -c:v libx264 -qp 0 -preset veryfast $TAG "$OUT/$name.ref.mkv"
  ffmpeg -nostdin -v error -y -i "$OUT/$name.ref.mkv" -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf "$CRF_H264" -preset slow $TAG -movflags +faststart "$OUT/$name.mp4"
  for pass in 1 2; do
    dest=/dev/null; fmt="-f null"; [ $pass -eq 2 ] && dest="$OUT/$name.webm" && fmt=""
    ffmpeg -nostdin -v error -y -i "$OUT/$name.ref.mkv" -an -c:v libvpx-vp9 -pix_fmt yuv420p -profile:v 0 \
      -crf "$CRF_VP9" -b:v 0 -row-mt 1 -deadline good -cpu-used 2 $TAG \
      -pass $pass -passlogfile "$OUT/$name.vp9" $fmt "$dest"
  done
  [ $first -eq 1 ] || echo ',' >> "$OUT/report.json.tmp"; first=0
  printf '"%s":{"mp4_bytes":%s,"webm_bytes":%s,"ssim_mp4":%s,"ssim_webm":%s,"mp4":%s,"webm":%s}' "$name" \
    "$(stat -c %s "$OUT/$name.mp4")" "$(stat -c %s "$OUT/$name.webm")" \
    "$(ssim "$OUT/$name.mp4" "$OUT/$name.ref.mkv")" "$(ssim "$OUT/$name.webm" "$OUT/$name.ref.mkv")" \
    "$(probe "$OUT/$name.mp4")" "$(probe "$OUT/$name.webm")" >> "$OUT/report.json.tmp"
done
echo '}}' >> "$OUT/report.json.tmp"
mv "$OUT/report.json.tmp" "$OUT/report.json"

# Stills straight from RGBA (no 4:2:0 round trip before WebP), then the /card crops of them.
for theme in dark light; do
  case $theme in dark) master=white-to-black-smile_1; G=$DARK ;; *) master=black-to-white-smile_1; G=$LIGHT ;; esac
  SEEK="-sseof -0.5" composite "$MASTERS/$master.alpha.webm" $G \
    | ffmpeg -nostdin -v error -y $raw_in -vf "scale=840:958:flags=lanczos" -update 1 "$OUT/still-$theme.png"
  ffmpeg -nostdin -v error -y -i "$OUT/still-$theme.png" -c:v libwebp -quality 82 -preset picture "$OUT/portrait-$theme.webp"
  ffmpeg -nostdin -v error -y -i "$OUT/still-$theme.png" -vf scale=420:479:flags=lanczos \
    -c:v libwebp -quality 82 -preset picture "$OUT/portrait-$theme-420.webp"
  ffmpeg -nostdin -v error -y -i "$OUT/still-$theme.png" -vf "crop=720:720:60:40,scale=384:384:flags=lanczos" \
    -c:v libwebp -quality 82 -preset picture "$OUT/avatar-$theme.webp"
done
echo "done — $OUT/report.json"
