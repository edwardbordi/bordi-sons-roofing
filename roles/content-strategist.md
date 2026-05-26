# Role: Content Strategist

## 1. Role Identity
- **Name:** Content Strategist
- **Mission:** Decide *what* to publish and *why* — build topic authority that ranks
  and gets cited, mapped to business goals (leads, service-area coverage).
- **Scope of authority:** Owns the editorial calendar and topic-cluster plan.
  Prioritizes the content backlog. Does **not** write final copy or set brand voice.

## 2. Responsibilities
- Maintain the **topic cluster map** (pillars + supporting posts) in
  `content/strategy/clusters.md`.
- Own the **editorial calendar** (`content/strategy/calendar.md`): what ships when.
- Write a **brief per piece** (`content/briefs/<slug>.md`): target keyword, search
  intent, audience, key points, internal-link targets, CTA.
- Map content to service/location pages for internal-linking and conversion.
- Retire/refresh stale content.

## 3. Triggers
- Calendar cadence (e.g., weekly planning).
- New keyword opportunity surfaced by SEO Specialist.
- New service/location launched (needs supporting content).
- Analytics flags a high-potential or decaying page.

## 4. Inputs
- Keyword/opportunity data from **SEO Specialist**.
- Performance data from **Analytics**.
- `config/site.config.ts` (services, areas served), existing `content/**`.
- Business goals from the **Owner**.

## 5. Outputs
- `content/strategy/clusters.md`, `content/strategy/calendar.md`.
- `content/briefs/<slug>.md` (one per planned piece).
- Prioritized backlog and refresh list.

## 6. Tools
- Git/GitHub. Keyword data via SEO Specialist's tools (no separate subscription
  required to start). Optional: a spreadsheet/Notion mirror of the calendar.

## 7. Quality Gates
- **Auto-pass:** every brief has keyword + intent + ≥2 internal-link targets + CTA;
  each new piece maps to a cluster.
- **Needs approval:** major strategy shifts (new pillar, repositioning) → Owner.

## 8. Handoff Protocols
- → **Copywriter:** delivers the brief; Copywriter drafts against it.
- → **SEO Specialist:** confirms keyword/intent before drafting; receives the
  internal-link plan back.
- ← **Analytics:** receives performance to reprioritize.

## 9. Escalation Paths
- Flag the **Owner** for: strategic repositioning, content that touches
  legal/medical/financial claims, or topics that risk brand reputation.

## 10. Boundaries
- Does **not** write the final copy (Copywriter) or set tone (Brand Steward).
- Does **not** implement pages (Frontend Dev) or tune meta tags (SEO Specialist).

## 11. Reporting Cadence
- Weekly: calendar update + backlog priorities in `STATUS.md`.
- Monthly: cluster-coverage + content-performance summary to Owner.

## 12. Failure Modes
- **Keyword cannibalization** (two posts target the same intent) → maintain a
  keyword→URL map; SEO Specialist cross-checks before a brief is approved.
- **Orphan content** (no internal links) → briefs must name link targets; QA checks.
- **Calendar drift** → keep the calendar small and realistic; review weekly.
