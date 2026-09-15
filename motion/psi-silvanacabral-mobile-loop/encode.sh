#!/bin/bash
set -euo pipefail

NAME="psi-silvanacabral-mobile-loop"
S="renders/out/${NAME}.master-1080p"
OUT_DIR="renders/out"
SCALE="scale=1920:1080:flags=lanczos"
TAG="-color_primaries bt709 -color_trc bt709 -colorspace bt709"

echo "=== 1. Extracting poster frame at 0.0s / settled hero ==="
ffmpeg -y -ss 00:00:00.000 -i "${S}.mp4" -vframes 1 "${OUT_DIR}/${NAME}.poster-source.png"
ffmpeg -y -i "${OUT_DIR}/${NAME}.poster-source.png" -vf "$SCALE" -c:v libwebp -quality 82 -preset picture "${OUT_DIR}/${NAME}.webp"
ffmpeg -y -i "${OUT_DIR}/${NAME}.poster-source.png" -vf "$SCALE" -q:v 4 "${OUT_DIR}/${NAME}.jpg"

echo "=== 2. Creating lossless reference for SSIM ==="
ffmpeg -y -i "${S}.mp4" -vf "$SCALE" -an -c:v libx264 -qp 0 -preset ultrafast "${OUT_DIR}/${NAME}.lossless.mp4"

echo "=== 3. Encoding H.264 High L4.0 (CRF 24) ==="
ffmpeg -y -i "${S}.mp4" -vf "$SCALE" -an -c:v libx264 -profile:v high -level 4.0 \
  -pix_fmt yuv420p -crf 24 -preset slow $TAG -movflags +faststart "${OUT_DIR}/${NAME}.mp4"

echo "=== 4. Encoding VP9 Profile 0, two-pass (CRF 36) ==="
ffmpeg -y -i "${S}.mp4" -vf "$SCALE" -an -c:v libvpx-vp9 -pix_fmt yuv420p -profile:v 0 \
  -crf 36 -b:v 0 -threads 8 -tile-columns 2 -row-mt 1 -deadline good -cpu-used 4 $TAG -pass 1 -f null /dev/null
ffmpeg -y -i "${S}.mp4" -vf "$SCALE" -an -c:v libvpx-vp9 -pix_fmt yuv420p -profile:v 0 \
  -crf 36 -b:v 0 -threads 8 -tile-columns 2 -row-mt 1 -deadline good -cpu-used 2 $TAG -pass 2 "${OUT_DIR}/${NAME}.webm"

# Clean up ffmpeg pass log files
rm -f ffmpeg2pass-*.log

echo "=== 5. Measuring SSIM against lossless reference ==="
ffmpeg -i "${OUT_DIR}/${NAME}.mp4" -i "${OUT_DIR}/${NAME}.lossless.mp4" -filter_complex "ssim" -f null - 2>&1 | grep -i "SSIM" || true
ffmpeg -i "${OUT_DIR}/${NAME}.webm" -i "${OUT_DIR}/${NAME}.lossless.mp4" -filter_complex "ssim" -f null - 2>&1 | grep -i "SSIM" || true

# Clean up lossless reference
rm -f "${OUT_DIR}/${NAME}.lossless.mp4" "${OUT_DIR}/${NAME}.poster-source.png"

echo "=== 6. Deliverable file sizes ==="
ls -lh "${OUT_DIR}/${NAME}.mp4" "${OUT_DIR}/${NAME}.webm" "${OUT_DIR}/${NAME}.webp" "${OUT_DIR}/${NAME}.jpg"

echo "=== 7. Codec checks ==="
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,profile,level "${OUT_DIR}/${NAME}.mp4"
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,profile,level "${OUT_DIR}/${NAME}.webm"

echo "Encoding complete for ${NAME}!"
