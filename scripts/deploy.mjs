#!/usr/bin/env node
// Publish dist/ to the Apache docroot over FTP, mirroring exactly, and prove it landed.
//
// Replaces the manual cPanel File Manager dance (zip contents -> upload -> extract
// -> overwrite all). Three things that dance got wrong are structural here:
//
//   1. `.htaccess` is the only file serving the CSP, the security headers and
//      ErrorDocument 404. Archive tools drop dotfiles by default; the upload set
//      here is built by walking dist/ ourselves, so dotfiles are never special.
//   2. "Deployed" was a claim, twice (false 2026-08-13, true 2026-08-14). This
//      script does not report success until the *public* URL says so.
//   3. Stale files from earlier builds lingered. The delete pass mirrors exactly.
//
// ⛔ TRANSPORT IS FTP, NOT SSH (Juan, 2026-08-14: "SSH does not work, always use
//    FTP"). The cPanel account `<cpanel-account>` sits near its LVE process cap — 88/100
//    when this was written — and the cap refuses processes ACCOUNT-WIDE, which
//    would take juansilva.design, psiativa and newcar down together. SSH/rsync
//    connects fine; working is not the same as allowed. Do not "fix" this back.
//    One FTP control connection is held for the whole run, deliberately: it costs
//    the account ~1 process instead of one per file.
//
// Modes:
//   node scripts/deploy.mjs --check     build + assert + list the remote + diff, no writes
//   node scripts/deploy.mjs             build + assert + upload + delete + verify by public URL
//   node scripts/deploy.mjs --status    verify the live site only; no build, no connection
//
// Flags: --verbose (log the FTP protocol)  --force (ignore the process-quota gate)

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

// --- config -----------------------------------------------------------------
// Lives in .env.deploy (gitignored). The repo is public; nothing here is inlined.

function loadDeployEnv() {
  const file = join(ROOT, ".env.deploy");
  const env = { ...process.env };
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

const env = loadDeployEnv();
// The sibling psiativa deploy provisions this as CPANEL_FTP_PASSWORD; accept both.
const FTP_PASS = env.CPANEL_FTP_PASSWORD || env.CPANEL_FTP_PASS || "";

const required = ["CPANEL_FTP_HOST", "CPANEL_FTP_PORT", "CPANEL_FTP_USER", "CPANEL_DOCROOT"];
const missing = required.filter((k) => !env[k]);
if (!FTP_PASS) missing.push("CPANEL_FTP_PASSWORD");

const SITE = env.SITE_ORIGIN || "https://juanpablosilva.com.br";
const WWW = env.SITE_WWW_ORIGIN || "https://www.juanpablosilva.com.br";
const FORM_ENDPOINT = env.FORM_ENDPOINT || "https://form.juanpablosilva.com.br/api/send";
const APEX_HOST = new URL(SITE).hostname;

// Directories on the host that are NOT ours and must survive an exact mirror.
// .well-known/acme-challenge is the AutoSSL renewal path — deleting it can break
// certificate renewal. cgi-bin is a cPanel fixture. Both verified present
// 2026-08-14 and empty of repo files. Never listed into, never deleted.
const PRESERVE = ["/.well-known/", "/cgi-bin/"];
const isPreserved = (rel) => PRESERVE.some((p) => `/${rel}/`.startsWith(p));

const VERBOSE = process.argv.includes("--verbose");
const FORCE = process.argv.includes("--force");

// --- tiny output helpers ----------------------------------------------------

let failures = 0;
const pass = (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
const fail = (msg) => {
  failures++;
  console.log(`  \x1b[31m✗\x1b[0m ${msg}`);
};
const head = (msg) => console.log(`\n\x1b[1m${msg}\x1b[0m`);
const info = (msg) => console.log(`  ${msg}`);
const warn = (msg) => console.log(`  \x1b[33m!\x1b[0m ${msg}`);

function check(condition, okMsg, failMsg) {
  condition ? pass(okMsg) : fail(failMsg ?? okMsg);
  return condition;
}

function sh(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: "utf8", stdio: "pipe", ...opts });
}

function curl(url, args = []) {
  try {
    return sh("curl", ["-sS", "--max-time", "30", ...args, url]);
  } catch (err) {
    return `CURL_FAILED: ${err.message}`;
  }
}

const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    n += entry.isDirectory() ? countFiles(join(dir, entry.name)) : 1;
  }
  return n;
}

// --- stage 1: assert the artifact before it goes anywhere -------------------
// Every check here maps to a defect this project actually shipped or nearly did.
// Transport-independent: unchanged by the move off rsync.

function assertDist() {
  head("Asserting dist/ before upload");

  if (!existsSync(DIST)) {
    fail("dist/ does not exist — run the build first");
    return;
  }

  // The dotfile the zip method kept nearly losing. It is the ONLY source of the
  // CSP, the security headers, and ErrorDocument 404 in production.
  const distHt = join(DIST, ".htaccess");
  const srcHt = join(ROOT, "public", ".htaccess");
  if (check(existsSync(distHt), ".htaccess present in dist/", ".htaccess MISSING from dist/ — production loses CSP + security headers + 404")) {
    check(
      sha256(distHt) === sha256(srcHt),
      ".htaccess byte-identical to public/.htaccess",
      ".htaccess DIFFERS from public/.htaccess"
    );
    const ht = readFileSync(distHt, "utf8");
    // Old CSP + new form action = every submit silently blocked. They ship together.
    check(
      ht.includes("form-action 'self' https://form.juanpablosilva.com.br"),
      "CSP form-action allows the contact Worker",
      "CSP form-action does NOT allow the Worker — every submit would be blocked in-browser"
    );
    check(ht.includes("ErrorDocument 404 /404.html"), "ErrorDocument 404 wired to the Astro 404 page");
    check(!/^\s*<\/IfModule>\s*$/m.test(ht.split("<IfModule")[0] ?? ""), "no orphan </IfModule> before the first block");
  }

  // The contact form, on both locales. A rebuild without the gitignored .env
  // silently produces a page with a DISABLED submit button.
  for (const page of ["contact/index.html", "pt/contact/index.html"]) {
    const path = join(DIST, page);
    if (!existsSync(path)) {
      fail(`${page} missing from dist/`);
      continue;
    }
    const html = readFileSync(path, "utf8");
    check(html.includes(`action="${FORM_ENDPOINT}"`), `${page} posts to the Worker endpoint`);
    const sitekey = html.match(/data-sitekey="([^"]+)"/)?.[1];
    check(Boolean(sitekey), `${page} carries a Turnstile sitekey`, `${page} has NO sitekey — .env missing, submit button ships disabled`);
    check(html.includes('data-action="turnstile-spin-v1"'), `${page} declares the expected Turnstile action`);
    const submit = html.match(/<button[^>]*type="submit"[^>]*>/)?.[0] ?? "";
    check(submit && !submit.includes("disabled"), `${page} submit button is enabled`, `${page} submit button is DISABLED`);
  }

  check(existsSync(join(DIST, "og-image.jpg")), "og-image.jpg present (every social share depends on it)");

  const pages = countFiles(DIST);
  info(`dist/ contains ${pages} files`);
  check(pages > 50, `file count looks like a full build (${pages})`, `file count suspiciously low (${pages}) — partial build?`);
}

// --- stage 2a: the account's process quota ----------------------------------
// The reason this script is on FTP at all. Exceeding the LVE cap refuses
// processes ACCOUNT-WIDE — juansilva.design, psiativa and newcar share
// `<cpanel-account>`. Read-only; skipped silently when no API token is configured.

async function processQuotaPreflight() {
  head("cPanel process quota");

  if (!env.CPANEL_API_TOKEN) {
    info("no CPANEL_API_TOKEN set — skipping (set it to gate deploys on the account's process count)");
    return true;
  }

  // The API user is the cPanel ACCOUNT, which is not the FTP login once that
  // login is a per-directory FTP account (deploy@example.com owns no API token).
  const apiUser = env.CPANEL_API_USER || env.CPANEL_FTP_USER;

  let usages;
  try {
    const res = await fetch(`https://${env.CPANEL_FTP_HOST}:2083/execute/ResourceUsage/get_usages`, {
      headers: { Authorization: `cpanel ${apiUser}:${env.CPANEL_API_TOKEN}` },
      signal: AbortSignal.timeout(20000),
    });
    usages = (await res.json())?.data;
  } catch (err) {
    // A courtesy check, not a correctness gate: never block a deploy because the
    // panel was unreachable.
    warn(`could not read resource usage (${err.message}) — continuing`);
    return true;
  }

  if (!Array.isArray(usages)) {
    warn("resource usage came back in an unexpected shape — continuing");
    return true;
  }

  const row = (id) => usages.find((u) => u.id === id);
  const nproc = row("lvenproc");
  const ep = row("lveep");
  if (ep) info(`entry processes: ${ep.usage}/${ep.maximum}`);
  if (!nproc?.maximum) {
    warn("no lvenproc row — continuing");
    return true;
  }

  const used = Number(nproc.usage);
  const max = Number(nproc.maximum);
  const pct = Math.round((used / max) * 100);
  const free = max - used;

  // One held control connection plus one data connection at a time — this deploy
  // needs ~2 slots, not one per file. Hard-stop only when even that is tight.
  if (free <= 3) {
    fail(`number of processes ${used}/${max} (${pct}%) — only ${free} slot(s) free; refusing to add an FTP session`);
    info("Clear processes first (cPanel → Resource Usage), or re-run with --force if you accept the risk.");
    return FORCE;
  }
  if (pct >= 85) {
    warn(`number of processes ${used}/${max} (${pct}%) — tight, but ${free} slots free is enough for one FTP session`);
  } else {
    pass(`number of processes ${used}/${max} (${pct}%)`);
  }
  return true;
}

// --- stage 2b: index both sides ---------------------------------------------

function walkLocal(dir, prefix = "") {
  const files = [];
  const dirs = [];
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      dirs.push(rel);
      const sub = walkLocal(join(dir, entry.name), rel);
      files.push(...sub.files);
      dirs.push(...sub.dirs);
    } else if (entry.isFile()) {
      files.push({ rel, size: statSync(join(dir, entry.name)).size });
    }
  }
  return { files, dirs };
}

async function walkRemote(client, base, rel = "", acc = { files: [], dirs: [], preserved: [], skipped: [] }) {
  const list = await client.list(rel ? remotePath(base, rel) : base);
  for (const item of list) {
    if (item.name === "." || item.name === "..") continue;
    const r = rel ? `${rel}/${item.name}` : item.name;
    if (isPreserved(r)) {
      acc.preserved.push(r);
      continue;
    }
    if (item.isDirectory) {
      acc.dirs.push(r);
      await walkRemote(client, base, r, acc);
    } else if (item.isFile) {
      acc.files.push({ rel: r, size: item.size });
    } else {
      // Symlinks and specials: never followed, never deleted, always reported.
      acc.skipped.push(r);
    }
  }
  return acc;
}

// --- stage 2c: connect ------------------------------------------------------

async function connect() {
  // Imported lazily so `--status` keeps working on a checkout with no node_modules.
  const { Client } = await import("basic-ftp");
  const client = new Client(30000);
  client.ftp.verbose = VERBOSE;

  const base = {
    host: env.CPANEL_FTP_HOST,
    port: Number(env.CPANEL_FTP_PORT),
    user: env.CPANEL_FTP_USER,
    password: FTP_PASS,
  };

  if (env.CPANEL_FTP_TLS === "false") {
    // Explicit opt-out only. Plain FTP puts this password on the wire in the clear.
    warn("CPANEL_FTP_TLS=false — connecting WITHOUT TLS; the password crosses the network in cleartext");
    await client.access({ ...base, secure: false });
    return { client, tls: "none" };
  }

  try {
    await client.access({ ...base, secure: true });
    return { client, tls: "verified" };
  } catch (err) {
    const msg = err.message.split("\n")[0];

    // This host is a liar about TLS, verified 2026-08-14: the banner says [TLS],
    // FEAT advertises AUTH TLS / PBSZ / PROT, and every AUTH scheme still answers
    // "500 This security scheme is not implemented" — as the first command on a
    // clean connection. Implicit FTPS on :990 is refused outright. Fail closed
    // rather than silently downgrading: this is the MAIN cPanel password, and it
    // opens every site on the account.
    if (/not implemented|not understood|unrecognized command/i.test(msg)) {
      client.close();
      throw new Error(
        `this FTP server refuses TLS (${msg}).\n` +
          `    Refusing to send the password in cleartext by default.\n` +
          `    Either have the host enable FTPS, or set CPANEL_FTP_TLS=false to accept\n` +
          `    a plaintext login — which puts the cPanel password on the wire every run.`
      );
    }

    if (!/certificate|self.signed|altname|hostname|CERT_/i.test(msg)) throw err;
    // Shared-host FTPS often presents the server hostname's cert rather than the
    // account's. Still encrypted, just unauthenticated — say so out loud.
    warn(`FTPS certificate not verifiable (${err.message.split("\n")[0]}) — retrying encrypted-but-unverified`);
    client.close();
    const { Client: C2 } = await import("basic-ftp");
    const retry = new C2(30000);
    retry.ftp.verbose = VERBOSE;
    await retry.access({ ...base, secure: true, secureOptions: { rejectUnauthorized: false } });
    return { client: retry, tls: "unverified" };
  }
}

// Where a path lands depends on which login is used. A MAIN cPanel account is
// chrooted to /home/<user>, so the docroot is addressed with that prefix stripped.
// A per-directory FTP account is chrooted to the docroot ITSELF, so its docroot is
// simply "/". Try the configured form first, then the stripped one; report which.
const remotePath = (docroot, rel) => (docroot === "/" ? `/${rel}` : `${docroot}/${rel}`);

async function enterDocroot(client) {
  const configured = env.CPANEL_DOCROOT.replace(/\/+$/, "") || "/";
  const home = `/home/${env.CPANEL_FTP_USER}`;
  const candidates = [configured];
  if (configured.startsWith(`${home}/`)) candidates.push(configured.slice(home.length));

  const tried = [];
  for (const candidate of candidates) {
    try {
      await client.cd(candidate);
      return candidate;
    } catch (err) {
      tried.push(`${candidate} → ${err.message.split("\n")[0]}`);
    }
  }
  throw new Error(`could not enter the docroot. Tried:\n    ${tried.join("\n    ")}`);
}

// A wrong CPANEL_DOCROOT could mirror-with-delete over a sibling site — psiativa
// and newcar live under the same account — or, worst case, over the account home
// itself, which would delete every site at once. Refuse to write anywhere that
// does not look like this site's docroot.
const CPANEL_HOME_MARKERS = ["domains", "public_html", "mail", "etc", "ssl", "logs", "tmp", ".cpanel", ".trash"];

function assertDocrootIdentity(resolved, remoteRootNames) {
  head("Docroot identity");
  info(`resolved to ${resolved}`);

  // The catastrophic case, checked first and unconditionally: dist/ contains none
  // of these, so a mirror rooted on a cPanel home would DELETE all of them.
  const markers = CPANEL_HOME_MARKERS.filter((m) => remoteRootNames.includes(m));
  check(
    markers.length < 3,
    "does not look like a cPanel account home",
    `looks like a cPanel ACCOUNT HOME (found ${markers.join(", ")}) — refusing to mirror; this would delete every site on the account`
  );

  // A per-directory FTP login is chrooted to the docroot, so its path is "/" and
  // cannot name the host. There the scope IS the credential, so the path check is
  // waived — but only when that is declared, never inferred.
  const scoped = env.CPANEL_FTP_SCOPED === "true";
  if (scoped) {
    pass("CPANEL_FTP_SCOPED=true — login is chrooted to the docroot, path check waived");
  } else {
    check(
      resolved.includes(APEX_HOST),
      `path names ${APEX_HOST}`,
      `path does NOT contain ${APEX_HOST} — refusing to mirror into an unidentified directory (set CPANEL_FTP_SCOPED=true if this login is chrooted to the docroot)`
    );
  }
  const empty = remoteRootNames.length === 0;
  check(
    empty || remoteRootNames.includes("index.html"),
    empty ? "docroot is empty — first publish" : "docroot already holds an index.html (this is a published site)",
    "docroot has files but NO index.html — this does not look like our site; refusing to mirror"
  );
  // If the listing hides dotfiles we would silently under-delete. That direction is
  // safe (nothing extra is removed), but the operator should know the diff is partial.
  if (!empty && !remoteRootNames.some((n) => n.startsWith("."))) {
    warn("remote listing returned no dotfiles at all — the server may be hiding them; the delete pass may be incomplete");
  }
}

// --- stage 2d: mirror -------------------------------------------------------

function diff(local, remote) {
  const remoteByRel = new Map(remote.files.map((f) => [f.rel, f]));
  const localRels = new Set(local.files.map((f) => f.rel));
  const localDirs = new Set(local.dirs);

  // FTP has no content-hash command, and `astro build` rewrites every mtime, so
  // neither timestamp nor size can prove a file is current. Size is used to
  // REPORT what changed; every file is uploaded regardless, which is the only
  // thing that actually guarantees the docroot converges on dist/.
  const changed = local.files.filter((f) => remoteByRel.get(f.rel)?.size !== f.size);
  const extraneousFiles = remote.files.filter((f) => !localRels.has(f.rel));
  const extraneousDirs = remote.dirs
    .filter((d) => !localDirs.has(d))
    .sort((a, b) => b.split("/").length - a.split("/").length); // deepest first

  return { changed, extraneousFiles, extraneousDirs };
}

function reportPlan(local, remote, d) {
  info(`local dist/: ${local.files.length} files in ${local.dirs.length + 1} dirs`);
  info(`remote docroot: ${remote.files.length} files in ${remote.dirs.length + 1} dirs`);
  if (remote.preserved.length) info(`preserved (never listed into, never deleted): ${remote.preserved.join(" ")}`);
  if (remote.skipped.length) warn(`skipped non-regular entries: ${remote.skipped.join(" ")}`);

  if (d.changed.length) {
    console.log(`\n  ${d.changed.length} file(s) differ in size from the docroot:`);
    for (const f of d.changed.slice(0, 40)) console.log(`    ${f.rel}`);
    if (d.changed.length > 40) console.log(`    … and ${d.changed.length - 40} more`);
  } else {
    pass("no size differences — docroot content already matches dist/");
  }
  info(`all ${local.files.length} files are uploaded regardless (FTP cannot prove a same-size file is current)`);

  if (d.extraneousFiles.length || d.extraneousDirs.length) {
    console.log(
      `\n  \x1b[33m${d.extraneousFiles.length} file(s) and ${d.extraneousDirs.length} dir(s) are on the host but not in dist/ — they will be DELETED:\x1b[0m`
    );
    for (const f of d.extraneousFiles) console.log(`    ${f.rel}`);
    for (const dir of d.extraneousDirs) console.log(`    ${dir}/`);
  } else {
    pass("nothing to delete — docroot has no stale files");
  }
}

async function uploadAll(client, docroot, local) {
  const byDir = new Map();
  for (const f of local.files) {
    const dir = f.rel.includes("/") ? f.rel.slice(0, f.rel.lastIndexOf("/")) : "";
    if (!byDir.has(dir)) byDir.set(dir, []);
    byDir.get(dir).push(f);
  }

  let done = 0;
  for (const [dir, files] of [...byDir].sort(([a], [b]) => a.localeCompare(b))) {
    await client.cd(docroot);
    if (dir) await client.ensureDir(dir); // creates every missing segment, then enters
    for (const f of files) {
      await client.uploadFrom(join(DIST, f.rel), basename(f.rel));
      done++;
      if (process.stdout.isTTY) process.stdout.write(`\r  uploading… ${done}/${local.files.length}`);
    }
  }
  if (process.stdout.isTTY) process.stdout.write("\r\x1b[K");
  pass(`uploaded ${done}/${local.files.length} files`);
  return done;
}

async function deleteExtraneous(client, docroot, d) {
  let removed = 0;
  for (const f of d.extraneousFiles) {
    await client.remove(remotePath(docroot, f.rel));
    console.log(`    deleted ${f.rel}`);
    removed++;
  }
  for (const dir of d.extraneousDirs) {
    try {
      // Deliberately removeEmptyDir, never removeDir: the recursive variant would
      // happily take a preserved subtree with it.
      await client.removeEmptyDir(remotePath(docroot, dir));
      console.log(`    deleted ${dir}/`);
      removed++;
    } catch (err) {
      warn(`kept ${dir}/ — not empty (${err.message.split("\n")[0]})`);
    }
  }
  if (!removed) pass("nothing to delete");
  return removed;
}

// --- stage 3: prove it by public URL ---------------------------------------
// "Deployed" is a claim. This is the test. Last-Modified is the cheapest
// decisive probe; body assertions are what actually matter.

function lastModified(url) {
  const headers = curl(url, ["-I"]);
  return headers.split("\n").find((l) => /^last-modified:/i.test(l))?.split(": ")[1]?.trim() ?? null;
}

function verifyPublic(previous) {
  head("Verifying by public URL");

  for (const origin of [SITE, WWW]) {
    const lm = lastModified(`${origin}/`);
    if (!previous || !previous[origin]) {
      info(`${origin} Last-Modified: ${lm}`);
    } else {
      // Every file is re-uploaded on every deploy, so index.html's mtime always
      // moves. A timestamp that stands still means the upload did not land —
      // the 2026-08-13 failure, which a green build had reported as success.
      check(
        lm && lm !== previous[origin],
        `${origin} Last-Modified moved (${previous[origin]} → ${lm})`,
        `${origin} Last-Modified did NOT move (still ${lm}) — the upload did not land`
      );
    }
  }

  // The CSP is served by .htaccess alone; if the dotfile did not land, this dies.
  const headers = curl(`${SITE}/contact/`, ["-I"]);
  check(
    /content-security-policy:.*form-action 'self' https:\/\/form\.juanpablosilva\.com\.br/i.test(headers),
    "CSP served with the Worker allowed in form-action"
  );
  check(/x-frame-options:\s*DENY/i.test(headers), "security headers served (.htaccess landed)");

  for (const path of ["/contact/", "/pt/contact/"]) {
    const html = curl(`${SITE}${path}`);
    check(html.includes(`action="${FORM_ENDPOINT}"`), `${path} posts to the Worker endpoint`);
    check(/data-sitekey="[^"]+"/.test(html), `${path} carries a Turnstile sitekey`);
    const submit = html.match(/<button[^>]*type="submit"[^>]*>/)?.[0] ?? "";
    check(submit && !submit.includes("disabled"), `${path} submit button is enabled`);
  }

  const og = curl(`${SITE}/og-image.jpg`, ["-o", "/dev/null", "-w", "%{http_code} %{size_download}"]);
  check(og.startsWith("200"), `og-image.jpg → ${og}`);

  // Read the status AND the body: the pre-A7 config served a 404 body under 200.
  const missingPage = curl(`${SITE}/definitely-not-a-real-page-${Date.now()}/`, ["-o", "/dev/null", "-w", "%{http_code}"]);
  check(missingPage.trim() === "404", `missing page returns HTTP 404 (got ${missingPage.trim()})`);

  check(!curl(`${SITE}/`).includes("is-a.dev"), "no dead is-a.dev references in the served body");
}

// --- main -------------------------------------------------------------------

const mode = process.argv.includes("--status") ? "status" : process.argv.includes("--check") ? "check" : "deploy";

if (mode !== "status" && missing.length) {
  console.error(`\nMissing deploy config: ${missing.join(", ")}`);
  console.error("Copy .env.deploy.example to .env.deploy and fill it in (gitignored).\n");
  process.exit(1);
}

if (mode === "status") {
  head("Drift check — live site only");
  verifyPublic(null);
} else {
  head("Building");
  execFileSync("npx", ["astro", "build"], { cwd: ROOT, stdio: "inherit" });

  assertDist();
  if (failures) {
    console.error(`\n\x1b[31mAborted: ${failures} assertion(s) failed. Nothing was uploaded.\x1b[0m\n`);
    process.exit(1);
  }

  if (!(await processQuotaPreflight())) {
    console.error(`\n\x1b[31mAborted on the process-quota gate. Nothing was uploaded.\x1b[0m\n`);
    process.exit(1);
  }

  const local = walkLocal(DIST);
  let client = null;
  // Which side of the first written byte a failure lands on. Reporting "the
  // docroot may be PARTIALLY updated" for a refused login is a lie that costs an
  // operator a panicked manual check.
  let wrote = false;

  try {
    head(mode === "check" ? "Connecting (read-only)" : "Connecting");
    const conn = await connect();
    client = conn.client;
    info(`FTP ${env.CPANEL_FTP_USER}@${env.CPANEL_FTP_HOST}:${env.CPANEL_FTP_PORT} — TLS ${conn.tls}`);

    const docroot = await enterDocroot(client);
    const rootNames = (await client.list(docroot)).map((f) => f.name);
    assertDocrootIdentity(docroot, rootNames);
    if (failures) {
      console.error(`\n\x1b[31mAborted: the docroot failed identity checks. Nothing was written.\x1b[0m\n`);
      process.exit(1);
    }

    head(mode === "check" ? "Mirror plan (no writes)" : "Mirror plan");
    const remote = await walkRemote(client, docroot);
    const plan = diff(local, remote);
    reportPlan(local, remote, plan);

    if (mode === "check") {
      head("Live site as it stands right now");
      verifyPublic(null);
      console.log(`\n\x1b[1mDry run complete — nothing was written.\x1b[0m\n`);
      process.exit(failures ? 1 : 0);
    }

    const before = { [SITE]: lastModified(`${SITE}/`), [WWW]: lastModified(`${WWW}/`) };

    // Upload BEFORE deleting: at no point is the live site missing a file that is
    // about to be replaced. FTP is not transactional either way.
    head("Uploading to docroot");
    wrote = true;
    await uploadAll(client, docroot, local);

    head("Deleting what is not in dist/");
    info(`preserved on host: ${PRESERVE.join(" ")}`);
    await deleteExtraneous(client, docroot, plan);

    client.close();
    client = null;

    verifyPublic(before);
  } catch (err) {
    if (wrote) {
      fail("FTP transfer failed — the docroot may be PARTIALLY updated.");
      console.error(`\n${err.stack || err.message}`);
      console.error(
        "\nThis is not transactional. Re-run `npm run deploy` once the cause is fixed;\n" +
          "it is idempotent and will converge the docroot on dist/.\n"
      );
    } else {
      fail("FTP session failed before any byte was written — the docroot is untouched.");
      console.error(`\n${VERBOSE ? err.stack || err.message : err.message}\n`);
    }
    process.exit(1);
  } finally {
    // A dangling FTP session is a leaked process on an account already near its
    // cap. Closing is not optional, on any path out of here.
    if (client) client.close();
  }
}

console.log("");
if (failures) {
  console.error(`\x1b[31m${failures} check(s) FAILED.\x1b[0m\n`);
  process.exit(1);
}
console.log(`\x1b[32mAll checks passed.\x1b[0m\n`);
