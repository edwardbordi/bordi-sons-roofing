import type { Metadata } from "next";
import { site, type Locale } from "@/config/site.config";
import { localeUrl, alternates as hreflangAlternates } from "@/lib/i18n";
import type { Author } from "@/lib/content-schema";

/**
 * SEO builders (audit H4) — single place that produces page metadata and
 * schema.org JSON-LD. Sourced entirely from config + content (CLAUDE.md §4).
 * JSON-LD objects are rendered with <JsonLd> (components/JsonLd.tsx).
 */

const defaultLocale = site.i18n.defaultLocale;
const DEFAULT_IMAGE = "/images/hero-scene.jpg";

/** Per-page metadata: canonical + hreflang + OG + Twitter, locale-aware. */
export function buildMetadata(opts: {
  title?: string;
  description?: string;
  /** root-relative path, default-locale form (e.g. "/blog/foo"). */
  path?: string;
  locale?: Locale;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const {
    title,
    description = site.description,
    path = "/",
    locale = defaultLocale,
    image = DEFAULT_IMAGE,
    type = "website",
  } = opts;
  const url = localeUrl(path, locale);
  const ogLocale = site.i18n.bcp47[locale].replace("-", "_");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates(path) },
    openGraph: {
      title: title ?? site.name,
      description,
      url,
      siteName: site.name,
      locale: ogLocale,
      type,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? site.name,
      description,
      images: [image],
    },
  };
}

/** Sitewide LocalBusiness (RoofingContractor) record. */
export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    image: `${site.url}${DEFAULT_IMAGE}`,
    telephone: site.phone.display,
    email: site.email,
    priceRange: "$$",
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: site.areaServed.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    // TODO(reviews): add aggregateRating + review ONLY with real, verified data.
  };
}

export function personLd(author: Author) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    ...(author.title ? { jobTitle: author.title } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.sameAs && author.sameAs.length ? { sameAs: author.sameAs } : {}),
    worksFor: { "@type": "Organization", name: site.name },
  };
}

export function blogPostingLd(opts: {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author: Author | null;
}) {
  const url = localeUrl(opts.path, opts.locale);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: opts.title,
    description: opts.description,
    inLanguage: site.i18n.bcp47[opts.locale],
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    image: `${site.url}${opts.image ?? DEFAULT_IMAGE}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: opts.author
      ? { "@type": "Person", name: opts.author.name }
      : { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, logo: `${site.url}/icon-512.png` },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: localeUrl(it.path, locale),
    })),
  };
}

export function faqPageLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
