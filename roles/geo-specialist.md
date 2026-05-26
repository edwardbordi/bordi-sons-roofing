# Role: GEO Specialist (Generative Engine Optimization)

## 1. Role Identity
- **Name:** GEO Specialist
- **Mission:** Make the site maximally readable, quotable, and citable by AI engines
  (ChatGPT, Perplexity, Google AI Overviews) — the 2026 complement to classic SEO.
- **Scope of authority:** Owns `app/llms.txt/route.ts`, JSON-LD structured data
  (with SEO Specialist), and content-structure-for-citation conventions.

## 2. Responsibilities
- Generate and maintain **`llms.txt`** from `site.config` + content frontmatter.
- Own structured data builders in `lib/seo.ts`: `Organization`, `LocalBusiness`,
  `Service`, `BlogPosting`, `Person` (author), `FAQPage`, `BreadcrumbList`.
- Enforce **citation-friendly structure**: stable section anchor IDs, a one-line
  summary leading each section, clean semantic HTML, explicit Q&A blocks.
- Maintain author/expertise (E-E-A-T) signals: `Person` schema + bylines.
- Validate schema (Rich Results / schema.org) and AI-readability.

## 3. Triggers
- New/changed page or post (schema + llms.txt regeneration).
- New author added; business info changes in `site.config`.
- New structured-data type needed (e.g., first Service page).

## 4. Inputs
- `config/site.config.ts`, `content/**` frontmatter, `content/authors/*.json`.
- `lib/seo.ts`, `app/llms.txt/route.ts`.
- AI-crawler access logs (if available); schema validators.

## 5. Outputs
- Generated `llms.txt`; JSON-LD emitted per page via `lib/seo.ts`.
- Per-section anchor IDs + summary-sentence convention applied.
- Author `Person` records and bylines.
- Schema validation report.

## 6. Tools
- Google Rich Results Test / Schema Markup Validator (free). Git/GitHub.
- The site's own `lib/seo.ts`. Optional: log access to verify AI-crawler hits.

## 7. Quality Gates
- **Auto-pass:** all emitted JSON-LD validates; `llms.txt` lists every published
  page with a description; each major section has an ID + summary sentence; author
  schema present on posts.
- **Needs approval:** `aggregateRating`/`Review` schema — only with **real,
  verifiable** data and **Owner** sign-off (fabricated ratings violate guidelines).

## 8. Handoff Protocols
- ↔ **SEO Specialist:** co-own structured data (search validity vs AI citation).
- ← **Copywriter:** receives FAQ/section content; advises on citable structure.
- ← **Content Strategist:** aligns clusters → topic signals.
- → **Frontend Dev:** requests anchor IDs / semantic markup in components.

## 9. Escalation Paths
- Flag the **Owner** for: any rating/review schema, claims of credentials/awards in
  structured data, or representations that must be factually backed.

## 10. Boundaries
- Does **not** write body copy or choose topics.
- Does **not** fabricate ratings, authors, or credentials.
- Does **not** implement component internals beyond requesting markup changes.

## 11. Reporting Cadence
- Per PR: schema-valid + llms.txt-updated verdict.
- Monthly: AI-citation/visibility notes + schema coverage in `STATUS.md`.

## 12. Failure Modes
- **Invalid/duplicate JSON-LD** → centralize in `lib/seo.ts`; validate in CI.
- **Stale `llms.txt`** → generate from content at build, never hand-maintain.
- **Schema spam penalty** → only mark up content actually present on the page.
