import { site, type Locale } from "@/config/site.config";

/**
 * Locale helpers (audit H1). English is the default and lives at the root
 * (`/...`); other locales are prefixed (`/es/...`). See CLAUDE.md localization
 * protocol.
 */

export const defaultLocale = site.i18n.defaultLocale;
export const locales = site.i18n.locales;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** BCP-47 tag for <html lang> / schema.org inLanguage. */
export function htmlLang(locale: Locale): string {
  return site.i18n.bcp47[locale];
}

/** Prefix a root-relative path with the locale (no prefix for the default). */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}

/** Absolute URL for a path in a locale (for canonical / OG / sitemap). */
export function localeUrl(path: string, locale: Locale): string {
  return `${site.url}${localizePath(path, locale)}`;
}

/** hreflang alternates map for a given path, across all locales. */
export function alternates(path: string): Record<string, string> {
  return Object.fromEntries(
    locales.map((l) => [site.i18n.bcp47[l], localeUrl(path, l)])
  );
}
