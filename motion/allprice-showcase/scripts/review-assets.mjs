import { createRequire } from 'node:module';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire('/home/jaypy/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/package.json');
const sharp = require('sharp');
await mkdir('review', { recursive: true });
const groups = {
  'figma-sections': (await readdir('assets/figma')).filter((file) => !file.includes('-full')).map((file) => `assets/figma/${file}`),
  'live-strips': (await readdir('assets/live')).filter((file) => file.includes('strip')).map((file) => `assets/live/${file}`),
  'live-states': (await readdir('assets/live')).filter((file) => !file.includes('strip') && !file.startsWith('mobile')).map((file) => `assets/live/${file}`),
  'mobile': (await readdir('assets/live')).filter((file) => file.startsWith('mobile')).map((file) => `assets/live/${file}`),
};
const dimensions = [];
for (const [group, files] of Object.entries(groups)) {
  for (let offset = 0; offset < files.length; offset += 4) {
    const chunk = files.slice(offset, offset + 4);
    const cellWidth = 600, cellHeight = 760;
    const composites = [];
    for (let index = 0; index < chunk.length; index++) {
      const file = chunk[index];
      const metadata = await sharp(file).metadata();
      dimensions.push({ path: file, width: metadata.width, height: metadata.height });
      const thumb = await sharp(file).resize({ width: 584, height: 710, fit: 'contain', background: '#e8ebf0' }).png().toBuffer();
      const label = Buffer.from(`<svg width="600" height="40"><rect width="600" height="40" fill="#101a34"/><text x="16" y="27" fill="white" font-size="20" font-family="sans-serif">${path.basename(file)}</text></svg>`);
      const left = (index % 2) * cellWidth, top = Math.floor(index / 2) * cellHeight;
      composites.push({ input: label, left, top }, { input: thumb, left: left + 8, top: top + 42 });
    }
    const file = `review/${group}-${Math.floor(offset / 4) + 1}.jpg`;
    await sharp({ create: { width: cellWidth * 2, height: cellHeight * Math.ceil(chunk.length / 2), channels: 3, background: '#e8ebf0' } }).composite(composites).jpeg({ quality: 90 }).toFile(file);
    console.log(file);
  }
}
await writeFile('review/asset-dimensions.json', `${JSON.stringify(dimensions, null, 2)}\n`);
// Review-only matched crops from the complete frames. The isolated original
// hero node omits sibling dashboard layers and is not valid comparison media.
for (const variant of ['original', 'optimized']) {
  await sharp(`assets/figma/${variant}-desktop-full.png`)
    .extract({ left: 0, top: 0, width: 1280, height: 1650 })
    .resize({ width: 960 })
    .jpeg({ quality: 92 })
    .toFile(`review/${variant}-hero-composite.jpg`);
}
