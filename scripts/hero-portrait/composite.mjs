#!/usr/bin/env node
// Raw RGBA frames in (stdin) -> raw RGB24 frames out (stdout).
// Composites a background-removed cut-out over a CSS `linear-gradient(to bottom left, from, to)`
// card, undoing the light studio backdrop the matte left in semi-transparent pixels.
//
// usage: node composite.mjs W H r0 g0 b0 r1 g1 b1
//   r0 g0 b0 = gradient colour at the top-right corner, r1 g1 b1 = at the bottom-left corner.
//
// Per pixel:
//   αest = coverage implied by projecting the colour onto the backdrop→hair line
//   w    = hair-zone key: only rows above HAIR_ROWS, only neutral light colours (skin is warm,
//          so the forehead is never keyed); the matte over-states coverage on backdrop seen
//          through curls, so there α is capped at αest
//   F    = colour with the backdrop contribution removed (decontamination)
//   out  = choke(α)·F + (1 − choke(α))·gradient(x, y)
import { stdin, stdout, argv, exit } from "node:process";

const [W, H] = argv.slice(2, 4).map(Number);
const [r0, g0, b0, r1, g1, b1] = argv.slice(4, 10).map(Number);
if (!W || !H || [r0, g0, b0, r1, g1, b1].some((v) => Number.isNaN(v))) {
  console.error("usage: composite.mjs W H r0 g0 b0 r1 g1 b1");
  exit(2);
}

const BG = [206, 209, 219]; // studio backdrop, sampled from edited/white-to-black-smile_1.mp4
const HAIR = [60, 45, 40]; // dark brown, for the coverage estimate
const HAIR_ROWS = 436; // crop-space rows above the glasses
const CHOKE = 0.1;

const dBH = [BG[0] - HAIR[0], BG[1] - HAIR[1], BG[2] - HAIR[2]];
const dBH2 = dBH[0] * dBH[0] + dBH[1] * dBH[1] + dBH[2] * dBH[2];
const clip01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const clip255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

// Gradient per pixel: t = 0.5 + (y/H − x/W)/2 is CSS's "to bottom left" magic-corner ramp,
// which is also what Figma's normalised (1,0)→(0,1) handles produce on a non-square node.
const grad = new Float32Array(W * H * 3);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const t = 0.5 + ((y + 0.5) / H - (x + 0.5) / W) / 2;
    const i = (y * W + x) * 3;
    grad[i] = r0 + (r1 - r0) * t;
    grad[i + 1] = g0 + (g1 - g0) * t;
    grad[i + 2] = b0 + (b1 - b0) * t;
  }
}

const IN = W * H * 4;
const frame = Buffer.allocUnsafe(IN);
let filled = 0;
let frames = 0;

function compositeFrame(src) {
  const out = Buffer.allocUnsafe(W * H * 3);
  for (let p = 0, y = 0; y < H; y++) {
    const hairRow = y < HAIR_ROWS;
    for (let x = 0; x < W; x++, p++) {
      const i = p * 4;
      const o = p * 3;
      const R = src[i], G = src[i + 1], B = src[i + 2];
      const A = src[i + 3] / 255;
      if (A === 0) {
        out[o] = grad[o] + 0.5; out[o + 1] = grad[o + 1] + 0.5; out[o + 2] = grad[o + 2] + 0.5;
        continue;
      }
      let ak = A;
      if (hairRow) {
        const w = clip01((25 - Math.abs(R - B)) / 10) * clip01((25 - Math.abs(R - G)) / 10) * clip01((R - 130) / 20);
        if (w > 0) {
          const est = clip01(((BG[0] - R) * dBH[0] + (BG[1] - G) * dBH[1] + (BG[2] - B) * dBH[2]) / dBH2);
          ak = A * (1 - w) + Math.min(A, est) * w;
        }
      }
      const ac = clip01((ak - CHOKE) / (1 - CHOKE));
      const inv = 1 / Math.max(ak, 0.02);
      const keep = 1 - ak;
      out[o] = ac * clip255((R - keep * BG[0]) * inv) + (1 - ac) * grad[o] + 0.5;
      out[o + 1] = ac * clip255((G - keep * BG[1]) * inv) + (1 - ac) * grad[o + 1] + 0.5;
      out[o + 2] = ac * clip255((B - keep * BG[2]) * inv) + (1 - ac) * grad[o + 2] + 0.5;
    }
  }
  return out;
}


stdin.on("data", (chunk) => {
  let off = 0;
  while (off < chunk.length) {
    const n = Math.min(IN - filled, chunk.length - off);
    chunk.copy(frame, filled, off, off + n);
    filled += n;
    off += n;
    if (filled === IN) {
      const out = compositeFrame(frame);
      filled = 0;
      frames++;
      if (!stdout.write(out)) {
        stdin.pause();
        stdout.once("drain", () => stdin.resume());
      }
    }
  }
});
stdin.on("end", () => {
  if (filled !== 0) console.error(`composite.mjs: dropped a partial frame (${filled} of ${IN} bytes)`);
  console.error(`composite.mjs: ${frames} frames`);
  stdout.end();
});
