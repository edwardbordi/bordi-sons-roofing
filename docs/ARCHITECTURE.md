# Architecture

How the template is built and why. Pairs with [CLAUDE.md](../CLAUDE.md) (the rules).

## The 3-section model

The core idea: **brand/business values and content are pulled out of components**,
so components are reusable across clients and a rebrand touches only config + content.

- **`config/`** — `site.config.ts` (business info, NAP, URLs, hours, social, i18n)
  and `brand.config.ts` (color ramp, fonts, logo, radius). Single source of truth.
- **`content/`** — the file-based CMS. `blog/*.mdx` (+ `.es.mdx`), `authors/*.json`,
  and `home.ts` (typed home-section copy). Frontmatter validated by zod.
- **`components/`** — `ui/` (unbranded primitives), `sections/`-style blocks
  (prop-driven), `blog/`, `content/` (MDX element map). No hardcoded brand/business
  values, no literal brand-color classes.

## Rendering strategy

- Everything is **statically generated** (`○ Static` / `● SSG`). The home page and
  blog routes prerender at build; `generateStaticParams` enumerates posts.
- Introduce **ISR** (`revalidate`) only when build times grow — see
  [SCALING.md](SCALING.md).

## Content flow

```
content/blog/<slug>.mdx ──▶ lib/content.ts (gray-matter + zod, locale-aware)
                              │
        app/blog/[slug] ◀─────┘  getEntry()/getAllEntries()/getSlugs()
        app/blog, /blog/page/[n], /es/blog/*   (generateStaticParams)
                              │
        components/blog/Article.tsx ──▶ next-mdx-remote/rsc + mdx-components
```

- `lib/content.ts` reads/parses/validates; **invalid frontmatter fails the build**.
- Localization is a filename suffix: `<slug>.mdx` (default) / `<slug>.es.mdx`.
  Missing locale → fallback to default + a notice (configurable).

## Theming

Brand colors live as `--color-primary-*` / `--color-accent-*` in
`app/globals.css @theme`, **mirroring `config/brand.config.ts`**. Components use
semantic classes (`bg-primary-600`, `text-accent-700`). CSS can't import TS, so the
two are kept in sync by convention + the CI drift check. Inline colors (SVG fills)
import from `brand.config`.

## SEO / structured data

`lib/seo.ts` centralizes it: `buildMetadata()` (canonical + hreflang + OG/Twitter,
locale-aware) and JSON-LD builders (`localBusinessLd`, `personLd`, `blogPostingLd`,
`breadcrumbLd`, `faqPageLd`), rendered via `components/JsonLd.tsx`. `sitemap.ts` and
`llms.txt` are generated from content. Every page should ship metadata + the
appropriate JSON-LD.

## Security

Headers (HSTS, nosniff, frame, referrer, permissions) are enforced in
`next.config.ts`; CSP ships Report-Only until tuned. See [SECURITY.md](SECURITY.md).

## Quality gates

`tsc`, `eslint`, `next build`, and `scripts/drift-check.mjs` run in CI
(`.github/workflows/ci.yml`); a Lighthouse job is informational. The drift check
enforces the "never hardcode" rules. See [DEPLOYMENT.md](DEPLOYMENT.md).

## Internationalization

English at the root (`/...`), other locales prefixed (`/es/...`). Default + ES
blog route trees share logic via the `blog/` components; `lib/i18n.ts` produces
locale URLs + hreflang alternates. Config in `site.config.ts → i18n`.
