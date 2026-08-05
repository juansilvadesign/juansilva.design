import { en, type TranslationKeys } from "./en";
import { pt } from "./pt";

export const defaultLocale = "en" as const;
export const locales = ["en", "pt"] as const;

export type Locale = (typeof locales)[number];

export const localeInfo = {
  en: {
    htmlLang: "en",
    hreflang: "en",
    openGraphLocale: "en_US",
    pathPrefix: "",
  },
  pt: {
    htmlLang: "pt-BR",
    hreflang: "pt-BR",
    openGraphLocale: "pt_BR",
    pathPrefix: "/pt",
  },
} as const satisfies Record<
  Locale,
  { htmlLang: string; hreflang: string; openGraphLocale: string; pathPrefix: string }
>;

export const hreflangPair = locales.map((locale) => ({
  locale,
  hreflang: localeInfo[locale].hreflang,
  pathPrefix: localeInfo[locale].pathPrefix,
}));

const translations = {
  en,
  pt,
} satisfies Record<Locale, TranslationKeys>;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function t(lang: Locale = defaultLocale): TranslationKeys {
  return translations[lang];
}

export function localizedPath(pathname: string, lang: Locale): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (lang === defaultLocale) {
    return normalizedPath;
  }

  return normalizedPath === "/"
    ? `${localeInfo[lang].pathPrefix}/`
    : `${localeInfo[lang].pathPrefix}${normalizedPath}`;
}

export function localeStaticPaths({ includeDefault = true }: { includeDefault?: boolean } = {}) {
  return locales
    .filter((lang) => includeDefault || lang !== defaultLocale)
    .map((lang) => ({
      params: { lang: lang === defaultLocale ? undefined : lang },
      props: { lang },
    }));
}

export function pageTitle(title: string, lang: Locale): string {
  return `${title} | ${t(lang).meta.siteName}`;
}

export { en, pt };
export type { TranslationKeys };
