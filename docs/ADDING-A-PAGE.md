# Adding a Page

Two kinds of pages: **bespoke** routes (composed from section components) and
**MDX-driven** pages (service/location content). See also AGENT-SOP.md SOP-2.

## Bespoke route

1. Branch: `git checkout -b page/<name>`.
2. Create `app/<path>/page.tsx`. Compose existing `components/` blocks; pass content
   from `config/` + a typed content module (like `content/home.ts`) — **no hardcoded
   brand/business values** (CLAUDE.md §4).
3. Add metadata with `buildMetadata()` from `lib/seo.ts`:
   ```ts
   import { buildMetadata } from "@/lib/seo";
   export const metadata = buildMetadata({
     title: "Roof Repair",
     description: "…",
     path: "/services/roof-repair",
   });
   ```
4. Emit page-appropriate JSON-LD via `components/JsonLd.tsx` (e.g. a `Service` +
   `BreadcrumbList`). Add a `serviceLd` builder to `lib/seo.ts` if needed.
5. Add the page to the nav/footer (currently the links live in `components/Navbar.tsx`
   / `components/Footer.tsx`; a `config/nav.config.ts` is a planned consolidation).
6. The page is picked up by `sitemap.ts` only if you add its path there — extend the
   `paths` list (or generalize the sitemap to glob page content).
7. Verify: `npm run typecheck && npm run build && npm run drift`; confirm the URL in
   `/sitemap.xml` and `/llms.txt`. PR → preview → review → merge.

## MDX-driven page (service/location)

1. Add `content/<type>/<slug>.mdx` with valid frontmatter (extend the schema in
   `lib/content-schema.ts` for service/location fields like `serviceType`,
   `areaServed`, `faqs`).
2. Add a dynamic route `app/<type>/[slug]/page.tsx` mirroring the blog route pattern
   (`generateStaticParams` from `getSlugs`, `generateMetadata` via `buildMetadata`,
   render with `next-mdx-remote/rsc`).
3. For Spanish, add `<slug>.es.mdx` and an `/es/<type>/...` route (or generalize).
4. Verify as above.

## Localization

Default locale at the root, others under `/es/...`. Use `lib/i18n.ts` helpers for
URLs + hreflang. A missing localized page falls back to default with a notice.
