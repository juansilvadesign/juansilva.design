import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

const ROOT = dirname(fileURLToPath(import.meta.url));
const deployEnvPath = resolve(ROOT, ".env.deploy");
if (existsSync(deployEnvPath)) {
  for (const line of readFileSync(deployEnvPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    const val = rawVal.trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

if (!process.env.PUBLIC_GOOGLE_ANALYTICS_ID && process.env.GOOGLE_ANALYTICS_ID) {
  process.env.PUBLIC_GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;
}
if (!process.env.PUBLIC_GTM_ID && process.env.GTM_ID) {
  process.env.PUBLIC_GTM_ID = process.env.GTM_ID;
}
if (!process.env.PUBLIC_GOOGLE_TAG_ID && process.env.GOOGLE_TAG_ID) {
  process.env.PUBLIC_GOOGLE_TAG_ID = process.env.GOOGLE_TAG_ID;
}
if (!process.env.PUBLIC_CLARITY_ID && process.env.CLARITY_ID) {
  process.env.PUBLIC_CLARITY_ID = process.env.CLARITY_ID;
}

export default defineConfig({
  site: "https://juanpablosilva.com.br",
  output: "static",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "pt"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  server: {
    host: true,
    port: 4321,
  },

  integrations: [react()],
});