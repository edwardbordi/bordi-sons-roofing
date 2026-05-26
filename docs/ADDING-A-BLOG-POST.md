# Adding a Blog Post (developer)

The fast path. For the non-developer / GitHub-web-UI version, see
[CONTENT-EDITING-GUIDE.md](CONTENT-EDITING-GUIDE.md). Mirrors AGENT-SOP.md SOP-1.

## Steps

1. `git checkout -b post/<slug>`.
2. Create `content/blog/<slug>.mdx`:
   ```mdx
   ---
   title: "…"                 # required
   description: "…"           # required, ≤160 chars (meta + GEO)
   date: "YYYY-MM-DD"         # required
   author: "ed-bordi"         # required → content/authors/<id>.json
   category: "…"              # topic cluster (optional)
   tags: ["…"]                # optional
   draft: true                # start as draft
   hero: "/images/…"          # optional
   ---

   Lead paragraph...

   ## Descriptive H2
   ...
   ```
3. Body: descriptive `##`/`###`, a lead sentence per section, ≥2 internal links.
   Images go in `public/blog/<slug>/`.
4. (Optional) translation: `content/blog/<slug>.es.mdx` (see SOP-7). Otherwise the
   `/es/` route falls back to English with a notice.
5. Verify: `npm run typecheck && npm run build` (the build validates frontmatter via
   zod and fails on errors) and `npm run drift`.
6. PR → check the Vercel preview at `/blog/<slug>`.
7. Publish: set `draft: false`, get review + green CI, merge.

## What the platform does for you

- **Static page** generated for `/blog/<slug>` (+ `/es/blog/<slug>`).
- **Metadata**: title/description/canonical/OG + hreflang via `buildMetadata`.
- **JSON-LD**: `BlogPosting` + `Person` (from the author record) + `BreadcrumbList`.
- **Sitemap + llms.txt**: the post is added automatically (content-driven).
- **Blog index + pagination**: the post appears on `/blog`, newest first.

## Per-post checklist (SEO/GEO)

- [ ] `title` < 60 chars, unique; `description` ≤ 160, unique.
- [ ] One `# `/H1 equivalent is the post title (rendered by the layout) — body uses `##`.
- [ ] Real `author` that exists in `content/authors/`.
- [ ] ≥2 internal links to related posts/pages.
- [ ] `category` set (topic cluster).
- [ ] Claims are accurate (no invented facts/credentials).
