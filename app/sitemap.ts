import type { MetadataRoute } from "next";
import { site } from "@/config/site.config";
import { getSlugs } from "@/lib/content";
import { localeUrl } from "@/lib/i18n";

// Content-driven (audit H4): home + blog index + every published post, each
// with hreflang alternates for all locales.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/blog", ...getSlugs("blog").map((s) => `/blog/${s}`)];

  return paths.map((p) => ({
    url: `${site.url}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "/" ? "monthly" : "weekly",
    priority: p === "/" ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(
        site.i18n.locales.map((l) => [site.i18n.bcp47[l], localeUrl(p, l)])
      ),
    },
  }));
}
