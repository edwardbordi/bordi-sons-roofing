/**
 * SITE CONFIG — the single source of truth for all business/brand *information*.
 *
 * Rule (see CLAUDE.md): NEVER hardcode business info (name, phone, email,
 * address, URLs, social links, service area) in components or content. Read it
 * from here. To onboard a new client, this file + `brand.config.ts` are the two
 * files you edit (plus content + assets).
 *
 * NOTE: values here are placeholders for the Bordi demo. Phone/email/domain are
 * not real and must be replaced before any production launch.
 */

export const site = {
  /** Public-facing brand/business name. */
  name: "Bordi & Sons Roofing",
  /** Legal entity name (used in copyright / legal contexts). */
  legalName: "Bordi & Sons Roofing LLC",
  shortName: "Bordi & Sons",

  /** Canonical production origin. Deduped from layout/robots/sitemap. */
  url: "https://www.bordiandsons.com",

  description:
    "Family-owned, GAF Master Elite roofing in Haddon Township, NJ. Roof replacement, repair, and gutters — honest pricing, premium materials, and a lifetime material warranty. Get a free, no-pressure estimate.",

  /** Primary lead-gen destination (instant estimate tool). */
  estimateUrl: "https://demo.sitescan.controlsuite.ai/",

  phone: {
    /** Human-readable. */
    display: "(555) 555-5555",
    /** tel: href form (E.164-ish). */
    href: "tel:+15555555555",
  },
  email: "hello@bordiandsons.com",

  address: {
    locality: "Haddon Township",
    region: "NJ",
    country: "US",
  },

  /** Towns served — powers footer/areaServed + LocalBusiness schema. */
  areaServed: [
    "Haddon Township",
    "Cherry Hill",
    "Collingswood",
    "Voorhees",
    "Moorestown",
    "Marlton",
    "Haddonfield",
    "Audubon",
  ],

  /** Opening hours for LocalBusiness schema. */
  hours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],

  certifications: ["GAF Master Elite"],

  social: {
    facebook: "#",
    instagram: "#",
  },

  /**
   * Internationalization. English is the default; Spanish is supported via
   * `.es.mdx` content + `/es/` routing (see CLAUDE.md localization protocol).
   */
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"] as const,
    /** schema.org / <html lang> mapping. */
    localeNames: { en: "English", es: "Español" },
    bcp47: { en: "en-US", es: "es-US" },
    /**
     * When a localized page is missing, fall back to the default locale and
     * show a small notice. Can be overridden per-page in frontmatter.
     */
    fallbackToDefault: true,
  },
} as const;

export type Locale = (typeof site.i18n.locales)[number];

export type SiteConfig = typeof site;
