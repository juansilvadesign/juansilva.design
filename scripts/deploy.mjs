#!/usr/bin/env node
// Publish dist/ to the Apache docroot over rsync-with-delete, and prove it landed.
//
// Replaces the manual cPanel File Manager dance (zip contents -> upload -> extract
// -> overwrite all). Three things that dance got wrong are structural here:
//
//   1. `.htaccess` is the only file serving the CSP, the security headers and
//      ErrorDocument 404. Archive tools drop dotfiles by default; `rsync dist/`
//      with a trailing slash carries them unconditionally.
//   2. "Deployed" was a claim, twice (false 2026-08-13, true 2026-08-14). This
//      script does not report success until the *public* URL says so.
//   3. Stale files from earlier builds lingered. --delete mirrors exactly.
//
// Modes:
//   node scripts/deploy.mjs --check     build + assert + rsync --dry-run, no writes
//   node scripts/deploy.mjs             build + assert + rsync + verify by public URL
//   node scripts/deploy.mjs --status    verify the live site only; no build, no upload

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
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

const required = ["CPANEL_SSH_HOST", "CPANEL_SSH_PORT", "CPANEL_SSH_USER", "CPANEL_SSH_KEY", "CPANEL_DOCROOT"];
const missing = required.filter((k) => !env[k]);

const SITE = env.SITE_ORIGIN || "https://juanpablosilva.com.br";
const WWW = env.SITE_WWW_ORIGIN || "https://www.juanpablosilva.com.br";
const FORM_ENDPOINT = env.FORM_ENDPOINT || "https://form.juanpablosilva.com.br/api/send";

// Directories on the host that are NOT ours and must survive an exact mirror.
// .well-known/acme-challenge is the AutoSSL renewal path — deleting it can break
// certificate renewal. cgi-bin is a cPanel fixture. Both verified present
// 2026-08-14 and empty of repo files.
const PRESERVE = ["/.well-known/", "/cgi-bin/"];

// --- tiny output helpers ----------------------------------------------------

let failures = 0;
const pass = (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
const fail = (msg) => {
  failures++;
  console.log(`  \x1b[31m✗\x1b[0m ${msg}`);
};
const head = (msg) => console.log(`\n\x1b[1m${msg}\x1b[0m`);
const info = (msg) => console.log(`  ${msg}`);

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

// --- stage 2: ship it -------------------------------------------------------

function rsyncArgs({ dryRun }) {
  const ssh = `ssh -i ${env.CPANEL_SSH_KEY} -p ${env.CPANEL_SSH_PORT} -o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15`;
  return [
    "-rltvz",
    "--delete",
    // Compare by content hash, not mtime+size. Every `astro build` rewrites all
    // mtimes, so the default comparison reports all 102 files as changed on every
    // run and the dry-run preview becomes useless for spotting a REAL change.
    "--checksum",
    // Force sane docroot permissions regardless of local umask. Deliberately not
    // -a: preserving owner/group fails as a non-root user on shared hosting.
    "--chmod=D755,F644",
    ...PRESERVE.flatMap((p) => ["--exclude", p]),
    ...(dryRun ? ["--dry-run"] : []),
    "-e",
    ssh,
    `${DIST}/`, // trailing slash = contents, not the dist/ level itself
    `${env.CPANEL_SSH_USER}@${env.CPANEL_SSH_HOST}:${env.CPANEL_DOCROOT}/`,
  ];
}

function runRsync({ dryRun }) {
  head(dryRun ? "rsync --dry-run (no writes)" : "Uploading to docroot");
  info(`preserving on host: ${PRESERVE.join(" ")}`);

  let out;
  try {
    out = sh("rsync", rsyncArgs({ dryRun }));
  } catch (err) {
    fail("rsync failed — see below. The docroot may be PARTIALLY updated.");
    console.error(`\n${err.stderr || err.message}`);
    console.error(
      "\nrsync is not transactional. Re-run `npm run deploy` once the cause is fixed;\n" +
        "it is idempotent and will converge the docroot to dist/.\n"
    );
    process.exit(1);
  }

  const deletions = out.split("\n").filter((l) => l.startsWith("deleting "));
  const changes = out
    .split("\n")
    .filter((l) => l && !l.startsWith("deleting ") && !l.startsWith("sending ") && !l.startsWith("sent ") && !l.startsWith("total ") && !/^\s*$/.test(l) && l !== "./");

  if (deletions.length) {
    console.log(`\n  \x1b[33m${deletions.length} file(s)/dir(s) would be DELETED from the docroot:\x1b[0m`);
    for (const d of deletions) console.log(`    ${d}`);
  } else {
    pass("nothing to delete — docroot has no stale files");
  }

  // Directory entries are listed even when only traversed; only file transfers
  // count as a real change.
  const files = changes.filter((l) => !l.endsWith("/"));

  if (files.length) {
    console.log(`\n  ${files.length} file(s) to upload:`);
    for (const c of files.slice(0, 40)) console.log(`    ${c}`);
    if (files.length > 40) console.log(`    … and ${files.length - 40} more`);
  } else {
    pass("nothing to upload — docroot content already matches dist/");
  }
  return { deletions, files };
}

// --- stage 3: prove it by public URL ---------------------------------------
// "Deployed" is a claim. This is the test. Last-Modified is the cheapest
// decisive probe; body assertions are what actually matter.

function lastModified(url) {
  const headers = curl(url, ["-I"]);
  return headers.split("\n").find((l) => /^last-modified:/i.test(l))?.split(": ")[1]?.trim() ?? null;
}

function verifyPublic(previous, expectMove = true) {
  head("Verifying by public URL");

  for (const origin of [SITE, WWW]) {
    const lm = lastModified(`${origin}/`);
    if (!previous || !previous[origin]) {
      info(`${origin} Last-Modified: ${lm}`);
    } else if (expectMove) {
      check(
        lm && lm !== previous[origin],
        `${origin} Last-Modified moved (${previous[origin]} → ${lm})`,
        `${origin} Last-Modified did NOT move (still ${lm}) — the upload did not land`
      );
    } else {
      // Nothing was transferred, so the timestamp SHOULD hold. A move here would
      // mean something republished the docroot behind our back.
      check(
        lm === previous[origin],
        `${origin} unchanged, as expected — already published (${lm})`,
        `${origin} Last-Modified moved to ${lm} despite an empty transfer — something else wrote to the docroot`
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
  const missing = curl(`${SITE}/definitely-not-a-real-page-${Date.now()}/`, ["-o", "/dev/null", "-w", "%{http_code}"]);
  check(missing.trim() === "404", `missing page returns HTTP 404 (got ${missing.trim()})`);

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

  if (mode === "check") {
    runRsync({ dryRun: true });
    head("Live site as it stands right now");
    verifyPublic(null);
    console.log(`\n\x1b[1mDry run complete — nothing was written.\x1b[0m\n`);
    process.exit(failures ? 1 : 0);
  }

  const before = { [SITE]: lastModified(`${SITE}/`), [WWW]: lastModified(`${WWW}/`) };
  const { files } = runRsync({ dryRun: false });
  verifyPublic(before, files.length > 0);
}

console.log("");
if (failures) {
  console.error(`\x1b[31m${failures} check(s) FAILED.\x1b[0m\n`);
  process.exit(1);
}
console.log(`\x1b[32mAll checks passed.\x1b[0m\n`);
