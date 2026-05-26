import { site, type Locale } from "@/config/site.config";
import { getAllEntries } from "@/lib/content";
import { localeUrl } from "@/lib/i18n";

/**
 * Build the llms.txt body (audit H5 / GEO) — a clean, AI-readable summary of
 * the site, generated from config + content. Served at /llms.txt (default) and
 * /es/llms.txt. See /roles/geo-specialist.md.
 */
export function buildLlmsTxt(locale: Locale = site.i18n.defaultLocale): string {
  const hours = site.hours
    .map((h) => `${h.days[0]}–${h.days[h.days.length - 1]} ${h.opens}–${h.closes}`)
    .join("; ");

  const posts = getAllEntries("blog", locale)
    .map((e) => `- [${e.frontmatter.title}](${localeUrl(`/blog/${e.slug}`, locale)}): ${e.frontmatter.description}`)
    .join("\n");

  const otherLocales = site.i18n.locales
    .filter((l) => l !== locale)
    .map((l) => `- ${site.i18n.localeNames[l]}: ${localeUrl("/", l)}`)
    .join("\n");

  return `# ${site.name}
> ${site.description}

## About
- Service area: ${site.areaServed.join(", ")}
- Phone: ${site.phone.display}
- Email: ${site.email}
- Location: ${site.address.locality}, ${site.address.region}
- Hours: ${hours}
- Certifications: ${site.certifications.join(", ")}

## Key pages
- [Home](${localeUrl("/", locale)}): Overview of services and how we work.
- [Blog](${localeUrl("/blog", locale)}): Roofing guides and homeowner advice.
- [Get a free estimate](${site.estimateUrl}): Instant online roof estimate.

## Articles
${posts || "- (none yet)"}

## Other languages
${otherLocales || "- (none)"}
`;
}
