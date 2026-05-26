import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { site, type Locale } from "@/config/site.config";
import {
  blogFrontmatter,
  authorSchema,
  type BlogFrontmatter,
  type Author,
} from "./content-schema";

/**
 * Content layer (audit H1). The "CMS" is the /content directory: MDX files with
 * validated frontmatter, read at build time. Localization uses a filename
 * suffix: `<slug>.mdx` is the default locale (English); `<slug>.es.mdx` is
 * Spanish. Missing localized files fall back to the default (configurable).
 *
 * This module is server-only (uses node:fs); import it from Server Components
 * and route files, never from a "use client" component.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const defaultLocale = site.i18n.defaultLocale;

export type ContentEntry = {
  slug: string;
  /** Locale actually served (may differ from requested if we fell back). */
  locale: Locale;
  /** True when the requested locale was missing and we served the default. */
  isFallback: boolean;
  frontmatter: BlogFrontmatter;
  body: string;
};

function fileFor(type: string, slug: string, locale: Locale): string {
  const suffix = locale === defaultLocale ? "" : `.${locale}`;
  return path.join(CONTENT_DIR, type, `${slug}${suffix}.mdx`);
}

/** Base slugs for a content type (localized variants like `*.es.mdx` excluded). */
export function getSlugs(type: string): string[] {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .filter((f) => !/\.[a-z]{2}\.mdx$/.test(f)) // drop `foo.es.mdx`
    .map((f) => f.replace(/\.mdx$/, ""));
}

/**
 * Read one entry in a locale, with fallback to the default locale when missing
 * (unless the page opts out via `fallbackToDefault: false`). Throws on invalid
 * frontmatter so the build fails loudly.
 */
export function getEntry(
  type: string,
  slug: string,
  locale: Locale = defaultLocale
): ContentEntry | null {
  let file = fileFor(type, slug, locale);
  let isFallback = false;

  if (!fs.existsSync(file)) {
    const fallbackFile = fileFor(type, slug, defaultLocale);
    if (
      locale !== defaultLocale &&
      site.i18n.fallbackToDefault &&
      fs.existsSync(fallbackFile)
    ) {
      file = fallbackFile;
      isFallback = true;
    } else {
      return null;
    }
  }

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const parsed = blogFrontmatter.safeParse(data);
  if (!parsed.success) {
    const rel = path.relative(process.cwd(), file);
    throw new Error(
      `Invalid frontmatter in ${rel}:\n${JSON.stringify(parsed.error.format(), null, 2)}`
    );
  }
  if (isFallback && parsed.data.fallbackToDefault === false) return null;

  return {
    slug,
    locale: isFallback ? defaultLocale : locale,
    isFallback,
    frontmatter: parsed.data,
    body: content,
  };
}

/** All entries for a type+locale, newest first. Drafts excluded in production. */
export function getAllEntries(
  type: string,
  locale: Locale = defaultLocale,
  opts: { includeDrafts?: boolean } = {}
): ContentEntry[] {
  const includeDrafts = opts.includeDrafts ?? process.env.NODE_ENV !== "production";
  return getSlugs(type)
    .map((slug) => getEntry(type, slug, locale))
    .filter((e): e is ContentEntry => e !== null)
    .filter((e) => includeDrafts || !e.frontmatter.draft)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

export const POSTS_PER_PAGE = 9;

/** Total number of listing pages for a count of posts (min 1). */
export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
}

/** Slice the entries for a 1-based listing page. */
export function pageSlice<T>(items: T[], page: number): T[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return items.slice(start, start + POSTS_PER_PAGE);
}

/** Load + validate an author record. */
export function getAuthor(id: string): Author | null {
  const file = path.join(CONTENT_DIR, "authors", `${id}.json`);
  if (!fs.existsSync(file)) return null;
  const parsed = authorSchema.safeParse(JSON.parse(fs.readFileSync(file, "utf8")));
  if (!parsed.success) {
    throw new Error(`Invalid author ${id}.json:\n${parsed.error.message}`);
  }
  return parsed.data;
}
