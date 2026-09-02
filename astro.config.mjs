import { defineConfig } from "astro/config";

import react from "@astrojs/react";

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