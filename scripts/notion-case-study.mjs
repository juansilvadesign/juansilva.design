#!/usr/bin/env node
/**
 * Pull a public Notion page into the store's `caseStudy.blocks` shape.
 *
 * Notion's public pages are client-rendered, so fetching the HTML yields an
 * empty shell. The `loadPageChunk` endpoint that the page's own JS calls is
 * readable without auth for a publicly shared page, and returns the block tree
 * as data — that is what this reads.
 *
 * Images are the reason this writes files rather than just JSON: Notion serves
 * them from signed S3 URLs that expire, so hotlinking produces a case study
 * that quietly goes blank. Every image is downloaded and rewritten to a local
 * path under `public/assets/cases/<slug>/`.
 *
 * Output is STAGED, never written into the store. Store prose is
 * attribution-checked by a human; this only removes the transcription work.
 *
 *   node scripts/notion-case-study.mjs --page <id> --slug <slug> --lang en
 *
 * Then review the staged JSON and paste the `blocks` array into
 * `_config/portfolio/records/<slug>.json` under `publish.caseStudy.<lang>`.
 */

import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { argv } from "node:process";
import path from "node:path";

const API = "https://jaypy.notion.site/api/v3/loadPageChunk";

/** `2704af1e1a3981bfa0cee7a4034e94dd` and the dashed form are both accepted. */
function normalizeId(raw) {
  const hex = raw.replace(/-/g, "").trim();
  if (!/^[0-9a-f]{32}$/i.test(hex)) throw new Error(`Not a Notion page id: ${raw}`);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** A record can be nested one level deeper depending on the endpoint version. */
const unwrap = (entry) => {
  const v = entry?.value ?? {};
  return v.value ?? v;
};

async function loadChunks(pageId) {
  const blocks = new Map();
  let cursor = { stack: [] };
  let chunk = 0;

  // The endpoint returns a cursor while more of the tree remains. Without
  // following it, a long page silently truncates mid-way.
  while (chunk < 20) {
    const res = await fetch(API, {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" },
      body: JSON.stringify({ pageId, limit: 100, cursor, chunkNumber: chunk, verticalColumns: false }),
    });
    if (!res.ok) throw new Error(`loadPageChunk ${res.status} — is the page shared publicly?`);
    const data = await res.json();
    for (const [id, entry] of Object.entries(data.recordMap?.block ?? {})) {
      blocks.set(id, unwrap(entry));
    }
    if (!data.cursor?.stack?.length) break;
    cursor = data.cursor;
    chunk += 1;
  }
  return blocks;
}

/** Notion rich text is an array of [text, ...decorations]; we keep the text. */
const plain = (prop) => (prop ?? []).map((run) => run?.[0] ?? "").join("").trim();

/**
 * Notion pages carry navigation furniture — bare "⬆" back-to-top links are the
 * common one. Anything with no letter or digit is chrome, not content.
 */
const hasWords = (text) => /\p{L}|\p{N}/u.test(text);

/**
 * Public asset URL for an image block.
 *
 * The raw S3 `source` is signed and expires; routing it through the site's
 * `/image/` endpoint is what the published page itself does.
 */
function imageUrl(block) {
  const src = block.format?.display_source ?? block.properties?.source?.[0]?.[0];
  if (!src) return null;
  if (src.startsWith("/")) return `https://jaypy.notion.site${src}`;
  if (!src.includes("amazonaws.com") && !src.includes("secure.notion-static")) return src;
  return `https://jaypy.notion.site/image/${encodeURIComponent(src)}?table=block&id=${block.id}&cache=v2`;
}

const HEADINGS = new Set(["header", "sub_header", "sub_sub_header"]);

/**
 * A Notion column row whose every column is "big value + caption" is a stat
 * board, not a run of headings. Flattening it produced eight stray H2s reading
 * `2 MILLION` and `-3% Recycled`, which is neither the source's meaning nor
 * usable heading structure.
 */
function asStatRow(blocks, columnListId) {
  const columns = (blocks.get(columnListId)?.content ?? []).map((id) => blocks.get(id));
  if (columns.length < 2) return null;

  const items = [];
  for (const col of columns) {
    const children = (col?.content ?? []).map((id) => blocks.get(id)).filter(Boolean);
    const head = children.find((c) => HEADINGS.has(c.type));
    if (!head) return null;
    const value = plain(head.properties?.title);
    if (!value) return null;
    const label = children
      .filter((c) => c.type === "text")
      .map((c) => plain(c.properties?.title))
      .find(Boolean);
    // Notion authors put the emoji on its own line above the number.
    const lines = value.split("\n").map((l) => l.trim()).filter(Boolean);
    items.push({ value: lines[lines.length - 1], label: label ?? "", ...(lines.length > 1 ? { icon: lines[0] } : {}) });
  }
  // Only a row where at least one column explains itself is a real stat board.
  return items.some((i) => i.label) ? { type: "statRow", items } : null;
}

function walk(blocks, rootId, images) {
  const out = [];
  const root = blocks.get(rootId);
  if (!root) return out;

  const visit = (id) => {
    const b = blocks.get(id);
    if (!b) return;
    const type = b.type;
    const text = plain(b.properties?.title);

    if (type === "column_list") {
      const stats = asStatRow(blocks, id);
      if (stats) {
        out.push(stats);
        return;
      }
    }

    if (HEADINGS.has(type)) {
      if (text) out.push({ type: "heading", level: type === "header" ? 2 : 3, text });
    } else if (type === "text") {
      if (text && hasWords(text)) out.push({ type: "prose", body: text });
    } else if (type === "quote") {
      if (text) out.push({ type: "quote", text });
    } else if (type === "callout") {
      if (text) out.push({ type: "callout", body: text });
    } else if (type === "bulleted_list" || type === "numbered_list") {
      const last = out[out.length - 1];
      const ordered = type === "numbered_list";
      if (last && last.type === "list" && last.ordered === ordered) last.items.push(text);
      else if (text) out.push({ type: "list", ordered, items: [text] });
    } else if (type === "image") {
      const url = imageUrl(b);
      if (url) {
        const caption = plain(b.properties?.caption);
        const entry = { type: "image", remote: url, alt: caption || "", caption: caption || undefined };
        images.push(entry);
        out.push(entry);
      }
    }

    for (const child of b.content ?? []) visit(child);
  };

  for (const child of root.content ?? []) visit(child);
  return out;
}

/**
 * Images are named by content hash, not by position.
 *
 * The EN and PT pages of the same case study carry overlapping but not
 * identical image sets (20 vs 22, in different orders), so positional names
 * would collide on different pictures and store the shared ones twice.
 */
async function download(images, slug, outDir) {
  const dir = path.join(outDir, "public", "assets", "cases", slug);
  await mkdir(dir, { recursive: true });
  for (const img of images) {
    let name = "?";
    try {
      const res = await fetch(img.remote, { headers: { "user-agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = Buffer.from(await res.arrayBuffer());
      // Notion serves multi-MB PNGs; the rest of this site's assets are WebP.
      const out = await sharp(raw)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      const meta = await sharp(out).metadata();
      name = `${createHash("sha256").update(out).digest("hex").slice(0, 12)}.webp`;
      await writeFile(path.join(dir, name), out);
      img.src = `/assets/cases/${slug}/${name}`;
      img.width = meta.width;
      img.height = meta.height;
      console.log(
        `  ✔ ${name}  ${meta.width}×${meta.height}  ` +
          `${(raw.length / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB`,
      );
    } catch (err) {
      // A failed download must be visible, not silently produce a broken src.
      img.src = null;
      img.error = String(err.message ?? err);
      console.warn(`  ✖ ${name}  ${img.error}`);
    }
    delete img.remote;
  }
  return dir;
}

function arg(flag, fallback) {
  const i = argv.indexOf(flag);
  return i === -1 ? fallback : argv[i + 1];
}

const pageRaw = arg("--page");
const slug = arg("--slug");
const lang = arg("--lang", "en");
const outDir = arg("--out", process.cwd());

if (!pageRaw || !slug) {
  console.error("usage: node scripts/notion-case-study.mjs --page <id> --slug <slug> [--lang en]");
  process.exit(1);
}

const pageId = normalizeId(pageRaw);
console.log(`→ ${slug} (${lang})  page ${pageId}`);

const blocks = await loadChunks(pageId);
console.log(`  ${blocks.size} blocks`);

const images = [];
const parsed = walk(blocks, pageId, images);
console.log(`  ${parsed.length} content blocks, ${images.length} image(s)`);

if (images.length) {
  console.log("  downloading images…");
  await download(images, slug, outDir);
}

const staged = path.join(outDir, "scripts", `.staged-${slug}.${lang}.json`);
const title = plain(blocks.get(pageId)?.properties?.title);
await writeFile(staged, JSON.stringify({ slug, lang, title, blocks: parsed }, null, 2) + "\n");
console.log(`\n  staged → ${staged}`);
console.log("  Review it, then paste `blocks` into the store record. Nothing was written to the store.");
