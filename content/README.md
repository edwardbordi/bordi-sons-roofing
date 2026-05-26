# /content — the file-based CMS

Editable content lives here as MDX (Markdown + optional components) with
validated frontmatter. No database, no CMS login — adding content is adding a
file and opening a PR. See `ADDING-A-BLOG-POST.md` and `CLAUDE.md`.

## Structure

```
content/
├─ blog/<slug>.mdx          # English (default locale)
├─ blog/<slug>.es.mdx       # Spanish variant (optional)
└─ authors/<id>.json        # author records (bylines + Person schema)
```

## Localization

- `<slug>.mdx` = default locale (English), served at `/blog/<slug>`.
- `<slug>.es.mdx` = Spanish, served at `/es/blog/<slug>`.
- If the `.es.mdx` is missing, the route falls back to English (configurable
  globally via `site.i18n.fallbackToDefault`, or per-page via
  `fallbackToDefault: false` in frontmatter).
- Spanish stubs currently hold English placeholder text + a `TODO(i18n)` note —
  the routing/architecture is live; real translations come later.

## Frontmatter

Validated by `lib/content-schema.ts` (zod) at build time — invalid frontmatter
**fails the build**. Required: `title`, `description` (≤200 chars), `date`
(YYYY-MM-DD), `author`. Optional: `updated`, `tags`, `category`, `draft`
(default false), `hero`, `canonical`, `fallbackToDefault`.

Drafts (`draft: true`) are excluded from production builds + sitemap, but appear
in preview deployments.

## Reading content

Use `lib/content.ts` (`getSlugs`, `getEntry`, `getAllEntries`, `getAuthor`) from
Server Components / route files only — it uses `node:fs` and must not be
imported into a `"use client"` component.
