import { readFile, access } from 'node:fs/promises';

const plans = [
  ['../allprice-showcase.storyboard.md', 58],
  ['../allprice-remediation.storyboard.md', 16],
  ['../allprice-responsive.storyboard.md', 18],
  ['../allprice-interactions.storyboard.md', 16],
];
const inventory = await readFile('capture/extracted/asset-descriptions.md', 'utf8');
const allLayers = new Set();
const report = [];
for (const [file, expected] of plans) {
  const markdown = await readFile(file, 'utf8');
  const frames = markdown.split(/^## Frame \d+ — /m).slice(1);
  const duration = frames.reduce((sum, frame) => sum + Number(frame.match(/^- duration: ([\d.]+)s$/m)?.[1] || 0), 0);
  if (duration !== expected) throw new Error(`${file}: expected ${expected}s; got ${duration}s`);
  if (!markdown.includes('music: none')) throw new Error(`${file}: missing silent marker`);
  let references = 0;
  for (const frame of frames) {
    if (!/^- status: outline$/m.test(frame)) throw new Error(`${file}: non-outline state at plan stage`);
    const candidates = frame.match(/^- asset_candidates: (.+)$/m)?.[1];
    if (!candidates) throw new Error(`${file}: a frame has no asset candidates`);
    for (const entry of candidates.split(';')) {
      const asset = entry.trim().split(' — ')[0];
      await access(asset);
      if (!inventory.includes(asset)) throw new Error(`${file}: unindexed asset ${asset}`);
      references++;
    }
  }
  const manifest = markdown.split('## Named-layer manifest')[1];
  for (const row of manifest.split('\n').filter(line => /^\| (MAIN|REM|RESP|INT)_/.test(line))) {
    for (const layer of row.split('|')[1].trim().split(' / ')) {
      if (allLayers.has(layer)) throw new Error(`Duplicate layer name: ${layer}`);
      allLayers.add(layer);
    }
  }
  report.push({ file, frames: frames.length, seconds: duration, assetReferences: references });
}
console.log(JSON.stringify({ ok: true, plans: report, uniqueMotionLayers: allLayers.size, note: 'Plan validation only. No render/check/encode result is claimed.' }, null, 2));
