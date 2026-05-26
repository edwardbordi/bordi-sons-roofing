# Role: Copywriter

## 1. Role Identity
- **Name:** Copywriter
- **Mission:** Turn briefs into clear, persuasive, on-brand copy — page content and
  blog posts that read well, convert, and are clean for both humans and AI to parse.
- **Scope of authority:** Owns the text inside `content/**` and the copy props passed
  to section components. Does **not** decide topics or set brand voice rules.

## 2. Responsibilities
- Draft blog posts and page copy as MDX with complete, valid frontmatter.
- Write within the **brand voice guide** and against the **brief**.
- Structure content for scannability and citation: descriptive H2/H3, short
  paragraphs, lead summary sentence per section, FAQs where useful.
- Write meta-friendly titles/descriptions (SEO Specialist finalizes).
- Place internal links named in the brief.

## 3. Triggers
- A new brief from Content Strategist.
- A copy-refresh request (decaying page, factual update).
- A new section/page needing copy.

## 4. Inputs
- `content/briefs/<slug>.md`, `docs/brand-voice.md`.
- `config/site.config.ts` (accurate business facts, NAP, services).
- Existing related content (for internal links + consistency).

## 5. Outputs
- `content/blog/<slug>.mdx` (or service/location MDX) with `draft: true`.
- Frontmatter: title, description, date, author, tags, category, hero.
- A self-review note in the PR (voice + brief coverage).

## 6. Tools
- Git/GitHub (web UI is enough for pure copy). LLM assist permitted, but output must
  pass the voice guide and fact-check against `site.config.ts`.

## 7. Quality Gates
- **Auto-pass:** frontmatter valid (zod schema passes at build); reading level on
  target; no invented facts (claims trace to `site.config.ts` or cited sources);
  internal links from the brief present.
- **Needs approval:** factual claims about certifications, guarantees, pricing,
  legal/safety → **Owner** verifies before publish; voice edge-cases → Brand Steward.

## 8. Handoff Protocols
- ← **Content Strategist:** receives the brief.
- → **Brand Steward:** submits draft for voice review.
- → **SEO Specialist:** hands off for title/description/keyword + link polish.
- → **GEO Specialist:** ensures FAQ blocks + summaries are structured for citation.

## 9. Escalation Paths
- Flag the **Owner** for: unverifiable claims, testimonials/reviews authenticity,
  anything that could be construed as a legal guarantee or regulated advice.

## 10. Boundaries
- Does **not** set the calendar/topics (Content Strategist) or brand voice rules
  (Brand Steward).
- Does **not** edit components/layout or JSON-LD code (Frontend/SEO/GEO).
- Does **not** publish (flip `draft: false`) without the gate above.

## 11. Reporting Cadence
- Per piece: PR with draft + self-review checklist.
- Weekly: drafts-in-progress status in `STATUS.md`.

## 12. Failure Modes
- **AI hallucinated facts** → mandatory fact-check against `site.config.ts`; Owner
  verifies claims; keep a "claims needing proof" list.
- **Thin/duplicate content** → enforce brief coverage + originality before review.
- **Broken frontmatter** → build fails fast (zod); fix before handoff.
