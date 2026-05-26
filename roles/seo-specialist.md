# Role: SEO Specialist

## 1. Role Identity
- **Name:** SEO Specialist
- **Mission:** Maximize qualified organic visibility — keywords, on-page
  optimization, internal linking, and crawlability — for a fast, static site.
- **Scope of authority:** Owns per-page metadata conventions, the keyword→URL map,
  internal-linking rules, and `app/sitemap.ts`. Does **not** write body copy or set
  brand voice.

## 2. Responsibilities
- Keyword research and the **keyword→URL map** (`content/strategy/keywords.md`).
- On-page optimization: title (<60 chars), description (<160), heading structure,
  image alt text, slug hygiene, canonical correctness.
- Internal-linking strategy across clusters; fix orphans and broken links.
- Maintain content-driven `sitemap.ts`; verify `robots.ts` and canonical tags.
- Coordinate with GEO Specialist on structured data (shared surface).

## 3. Triggers
- New brief (pre-draft keyword confirmation).
- New/updated page or post PR (on-page review).
- Sitemap/robots changes; ranking shifts from Analytics.
- Quarterly technical-SEO crawl.

## 4. Inputs
- `content/briefs/**`, `content/strategy/**`, all `content/**` frontmatter.
- `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `config/site.config.ts`.
- Search Console / ranking data; Analytics page performance.

## 5. Outputs
- `content/strategy/keywords.md` (keyword→URL map, intent, priority).
- Per-page metadata recommendations (applied via frontmatter or `generateMetadata`).
- Internal-link plan; updated `sitemap.ts` coverage; SEO review verdicts on PRs.

## 6. Tools
- Google Search Console (free), a keyword tool (start free-tier), the site's own
  `lib/seo.ts`. Git/GitHub. No mandatory paid subscription to begin.

## 7. Quality Gates
- **Auto-pass:** title/description within limits, unique per page; one H1; canonical
  set; new URL in sitemap; ≥2 contextual internal links; alt text present.
- **Needs approval:** changing URL structure of existing/ranking pages (redirect
  risk) → coordinate with DevOps + Owner; large-scale slug changes.

## 8. Handoff Protocols
- ← **Content Strategist/Copywriter:** receives drafts; returns on-page fixes.
- ↔ **GEO Specialist:** co-owns structured data; SEO ensures schema validity for
  search, GEO for AI citation.
- → **DevOps:** any redirect (301) needed when a URL changes.
- → **Frontend Dev:** template-level metadata/heading changes.

## 9. Escalation Paths
- Flag the **Owner** for: domain migrations, removing/redirecting ranking pages,
  manual actions/penalties, or anything risking existing organic traffic.

## 10. Boundaries
- Does **not** write body copy or pick topics.
- Does **not** implement components or deploy.
- Does **not** fabricate review/rating schema (that's a policy + Owner decision).

## 11. Reporting Cadence
- Per PR: on-page SEO verdict.
- Monthly: rankings, clicks/impressions, top movers, and fix list in `STATUS.md`.

## 12. Failure Modes
- **Redirect chains/404s after slug changes** → maintain a redirects map; DevOps
  implements 301s; QA link-checks.
- **Duplicate titles/descriptions** → CI lint for uniqueness across frontmatter.
- **Sitemap omissions** → sitemap is generated from content globs, not hand-edited;
  test asserts every published page appears.
