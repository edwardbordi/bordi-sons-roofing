import { z } from "zod";

/**
 * Frontmatter schemas (audit H1). Every MDX file's frontmatter is validated
 * against one of these at build time — invalid frontmatter FAILS the build
 * (a quality gate; see /roles/seo-specialist.md + CLAUDE.md).
 */

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD");

/** Blog post frontmatter. */
export const blogFrontmatter = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(200),
  date: isoDate,
  updated: isoDate.optional(),
  /** Author id → content/authors/<id>.json */
  author: z.string().min(1),
  tags: z.array(z.string()).optional(),
  /** Topic-cluster bucket. */
  category: z.string().optional(),
  /** Drafts are excluded from production builds + sitemap. */
  draft: z.boolean().default(false),
  /** Hero image path under /public. */
  hero: z.string().optional(),
  /** Canonical override (rarely needed). */
  canonical: z.string().url().optional(),
  /**
   * Per-page i18n fallback override. If a localized file is missing and this is
   * false, the page 404s in that locale instead of falling back to default.
   */
  fallbackToDefault: z.boolean().optional(),
});
export type BlogFrontmatter = z.infer<typeof blogFrontmatter>;

/** Author record (content/authors/<id>.json) — powers bylines + Person schema. */
export const authorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  title: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  /** Profile URLs for schema.org sameAs / E-E-A-T signals. */
  sameAs: z.array(z.string().url()).optional(),
});
export type Author = z.infer<typeof authorSchema>;
