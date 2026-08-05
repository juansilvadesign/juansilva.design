import { defineConfig } from "astro/config";

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
});
