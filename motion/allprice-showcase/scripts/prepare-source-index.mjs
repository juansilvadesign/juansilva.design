import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

await mkdir('capture/extracted', { recursive: true });
for (const filename of ['tokens.json', 'visible-text.txt']) {
  await writeFile(`capture/extracted/${filename}`, await readFile(`capture/site/extracted/${filename}`));
}
const hierarchy = {};
for (const [key, file] of [['original', 'node-1485-308.json'], ['optimized', 'node-1830-1120.json']]) {
  const parent = JSON.parse(await readFile(`.media/figma-cache/${file}`, 'utf8'));
  const frame = parent.children[0];
  hierarchy[key] = {
    id: frame.id, name: frame.name, directChildCount: frame.children.length,
    children: frame.children.map(node => ({ id: node.id, name: node.name, type: node.type })),
  };
}
await writeFile('capture/figma-hierarchy.json', JSON.stringify(hierarchy, null, 2) + '\n');
const notes = {
  'original-hero.png': 'ARCHIVE ONLY: isolated node omits sibling dashboard layers; invalid before/after plate.',
  'original-desktop-full.png': 'Original composite. Comparison rests only in top 0–410px; other regions contain illustrative data.',
  'optimized-desktop-full.png': 'Optimized composite. Same top 0–410px comparison crop; render only bounded crops, never the full bitmap repeatedly.',
  'desktop-faq-closed.png': 'SUPERSEDED for readable holds: heading clipped. Use faq-framed-closed.',
  'desktop-faq-erp-open.png': 'SUPERSEDED for readable holds: heading clipped. Use faq-framed-open.',
  'desktop-faq-pricing-open.png': 'Archive alternate answer. Use only after framing review; not selected in current plan.',
  'desktop-faq-framed-closed.png': 'Preferred FAQ closed state; heading and first five questions visible.',
  'desktop-faq-framed-open.png': 'Same camera as closed; genuine expansion of question 2, no ERP required.',
  'desktop-features-left.png': 'Genuine left carousel state; source section y=3927, scrollLeft=0.',
  'desktop-features-right.png': 'Genuine right carousel state; scrollLeft=446, reveals Saúde e evolução.',
  'mobile-menu-open.png': 'Genuine mobile account/support menu; no external link was followed.',
  'mobile-features-left.png': 'Mobile pricing feature, scrollLeft=0, page y=5876.',
  'mobile-features-right.png': 'Mobile business-health feature, scrollLeft=1256, same page position.',
};
const records = [];
for (const group of ['figma', 'live']) {
  for (const file of (await readdir(`assets/${group}`)).sort()) {
    const filePath = `assets/${group}/${file}`;
    const buffer = await readFile(filePath);
    records.push({ path: filePath, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex'), note: notes[file] || file.replace(/\.png$/, '').replaceAll('-', ' ') });
  }
}
await writeFile('capture/source-files.json', JSON.stringify(records, null, 2) + '\n');
const lines = [
  '# AllPrice source inventory', '',
  'Canonical storyboard inventory, supplementary to the untouched automated catalog at',
  '`capture/site/extracted/asset-descriptions.md`. Paths below are relative to the',
  'allprice-showcase project root, including when read through the adjacent storyboard.',
  'Screens are real Figma rasters or browser captures, never recreated UI.', '',
  ...records.map(record => `- ${record.path} — ${record.note}`), '',
  '- capture/figma-hierarchy.json — measured node names/types and direct-child counts; editorial structural diagrams may quote this data, not impersonate Figma UI.',
  '- capture/live-metadata.json — decoded source images, full-page geometry, strip offsets and first interaction states.',
  '- capture/interaction-metadata.json — paired horizontal-scroll and FAQ states.', '',
  'See SOURCE_AUDIT.md for allowed resting regions and source limitations.',
];
await writeFile('capture/extracted/asset-descriptions.md', lines.join('\n') + '\n');
console.log(`Indexed ${records.length} source images; original ${hierarchy.original.directChildCount} direct children, optimized ${hierarchy.optimized.directChildCount}.`);
