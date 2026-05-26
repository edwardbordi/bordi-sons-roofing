# Scaling

The template is fully static by default, which is the right call for a long time.
This is the decision guide for when content grows.

## Static vs ISR

| Posts | Behavior | Action |
|---|---|---|
| ~50 | Full SSG, fast builds | None. |
| ~500 | Build time grows linearly | Add **ISR** (`export const revalidate = 3600`) on blog routes, or on-demand revalidation; keep pagination tight. |
| 5,000+ | SSG build becomes slow | ISR + Partial Prerendering; generate only recent posts at build, the rest on-demand. Move search off-build (below). |

ISR is a per-route opt-in — add `revalidate` to the blog route segment when builds
start to feel slow. Don't add it preemptively.

## Pagination

Already implemented: `/blog` is page 1, `/blog/page/[n]` for the rest, page size in
`lib/content.ts` (`POSTS_PER_PAGE`, default 9). `generateStaticParams` enumerates
pages from the post count. Same for `/es/blog`.

## Search

Not built yet. When the blog warrants it, add **Pagefind** — a static, zero-infra,
free full-text search that indexes the built output (`pagefind --site .next/...` or
the export dir) at build time and runs entirely client-side. Avoids paid search
services. Add a search box component that loads the Pagefind bundle.

## Images

`next/image` optimizes delivery automatically. As image volume grows, keep source
files reasonably sized (the hero was downscaled 8.6 MB → 299 KB) and store post
images under `public/blog/<slug>/`. Watch the Vercel image-optimization usage.

## Build budgets

CI runs `next build` on every PR; Lighthouse budgets (`lighthouserc.json`) guard
performance/SEO. If builds slow down, that's the signal to introduce ISR before
reaching for heavier infrastructure. Bias toward simplicity.
