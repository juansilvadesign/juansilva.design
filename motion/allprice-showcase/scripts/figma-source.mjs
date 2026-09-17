import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const options = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=')];
}));
const project = process.cwd();
const fork = options.fork || '/home/jaypy/GitHub-Projects/Notes/ai-synthesizer/knowledge/projects/talk-to-figma-fork';
const require = createRequire(path.join(fork, 'package.json'));
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const client = new Client({ name: 'allprice-source-capture', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: process.execPath, args: [path.join(fork, 'dist/server.js')], cwd: fork, stderr: 'pipe',
});
transport.stderr?.on('data', () => {});
const cache = path.join(project, '.media/figma-cache');
await mkdir(cache, { recursive: true });

async function save(name, value) {
  await writeFile(path.join(cache, `${name}.json`), `${JSON.stringify(value, null, 2)}\n`);
}
async function call(name, args = {}) {
  const result = await client.callTool({ name, arguments: args }, undefined, { timeout: 125000 });
  const text = (result.content || []).filter((item) => item.type === 'text').map((item) => item.text).join('\n');
  if (result.isError || /^Error\b/.test(text)) throw new Error(`${name}: ${text}`);
  try { return JSON.parse(text); } catch { return text; }
}
function slim(node, depth = 2) {
  if (Array.isArray(node)) return node.map((item) => slim(item, depth));
  if (!node || typeof node !== 'object') return node;
  const output = {};
  for (const key of ['id', 'name', 'type', 'width', 'height', 'absoluteBoundingBox', 'layoutMode', 'characters']) {
    if (node[key] !== undefined) output[key] = node[key];
  }
  if (node.children) {
    output.childCount = node.children.length;
    if (depth > 0) output.children = node.children.map((child) => slim(child, depth - 1));
  }
  if (node.node) output.node = slim(node.node, depth);
  return output;
}

let initialPage;
try {
  await client.connect(transport);
  for (let attempt = 0; attempt < 10; attempt++) {
    try { await call('join_channel', { channel: options.channel || '4hj86qf7' }); break; }
    catch (error) {
      if (attempt === 9 || !/Not connected/.test(error.message)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  const runtime = await call('get_runtime_info');
  await save('runtime', runtime);
  if (runtime.compatibility.status !== 'compatible') throw new Error('Figma runtime is not compatible.');
  console.log(`Compatible: ${runtime.server.buildId} / ${runtime.plugin.buildId}`);
  const document = await call('get_document_info', { summary: true, limit: 100, familyLimit: 30 });
  initialPage = document.currentPage.id;
  await save('document', document);
  if (options.mode === 'inventory') {
    for (const page of document.pages.filter((page) => /7-LP|4-Logo|3-web/.test(page.name))) {
      await call('set_current_page', { pageId: page.id });
      const info = await call('get_document_info', { summary: true, limit: 100, familyLimit: 100 });
      await save(`page-${page.id.replace(':', '-')}`, info);
      console.log(JSON.stringify({ page: page.name, id: page.id, children: info.children, pagination: info.pagination }));
    }
  } else if (options.mode === 'nodes') {
    for (const id of options.ids.split(',')) {
      const node = await call('get_node_info', { nodeId: id });
      await save(`node-${id.replaceAll(':', '-')}`, node);
      console.log(JSON.stringify(slim(node, Number(options.depth || 2))));
    }
  } else if (options.mode === 'export') {
    const exports = JSON.parse(await readFile(options.manifest, 'utf8'));
    for (const item of exports) {
      const filePath = path.resolve(project, item.path);
      if (!filePath.startsWith(`${project}${path.sep}`)) throw new Error('Export path must be inside this project.');
      const receipt = await call('export_node_as_image', {
        nodeId: item.id, format: item.format || 'PNG', scale: item.scale || 1, filePath,
      });
      await save(`export-${path.basename(item.path).replaceAll('.', '-')}`, { item, receipt });
      console.log(JSON.stringify({ file: item.path, receipt }));
    }
  } else throw new Error('Use --mode=inventory, nodes, or export.');
} finally {
  if (initialPage) await call('set_current_page', { pageId: initialPage }).catch(() => {});
  await client.close();
}
