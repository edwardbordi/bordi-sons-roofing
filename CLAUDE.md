@AGENTS.md

# CLAUDE.md — Operating Contract

> **Single source of truth for how this codebase works.** Every agent and human
> reads this BEFORE making any change. This is a **living document**: when you
> establish a new convention, update this file in the same PR. If a change can't
> be made without violating a rule here, see §8 (Escalation) — you open a PR that
> updates this file FIRST, get Owner approval, then make the change. No silent
> rule-breaking.

This repo is both a **shipping demo** (Bordi & Sons Roofing) and the **agency
template** it's being generalized into. Don't break the demo's visual/functional
state while refactoring.

---

## 1. Mission + stack

Build agency-grade, replicable client marketing sites: fast, secure, SEO/GEO-ready,
editable by non-developers, operable by humans or AI agents.

- **Next.js 16** (App Router + Turbopack), **React 19**, **Tailwind CSS v4**,
  **TypeScript 5**, shadcn/ui (radix-ui), framer-motion, lucide-react.
- **⚠️ Next 16 has breaking changes vs training data.** Read
  `node_modules/next/dist/docs/` before writing Next code (see `@AGENTS.md`).
- Deploys on Vercel (push → preview/prod). Verify with `npm run build` and
  `npx tsc --noEmit`.

## 2. The 3-section architecture

Everything lives in one of three places. Know which before you touch anything.

| Section | What | Who edits |
|---|---|---|
| **`config/`** | Business + brand values. `site.config.ts` (name, URL, NAP, phone, email, areaServed, hours, social, i18n) and `brand.config.ts` (colors, fonts, logo, radius). | Brand Steward / Owner |
| **`content/`** | The CMS. MDX posts/pages + `authors/*.json`. Validated frontmatter. | Copywriter / non-devs |
| **`components/`** | Brand-agnostic, prop-driven UI. `ui/` = primitives, `sections/` = blocks, `content/` = MDX components. Reads from config + content — never hardcodes. | Frontend Dev |

Supporting: `lib/` (loaders, seo/i18n helpers, utils), `app/` (routes, metadata,
sitemap/robots/manifest/llms.txt), `roles/` (the operating system), `docs/` (guides).

## 3. File location rules

| You want to add… | Put it here |
|---|---|
| A new **page/route** | `app/.../page.tsx` (marketing) — see `ADDING-A-PAGE.md` |
| A new **blog post** | `content/blog/<slug>.mdx` (+ optional `<slug>.es.mdx`) — see `ADDING-A-BLOG-POST.md` |
| A new **section component** | `components/sections/<Name>.tsx` (prop-driven) |
| A reusable **primitive** | `components/ui/<name>.tsx` (no brand colors) |
| An **MDX component** (callout, embed, CTA) | `components/content/<Name>.tsx` |
| **Brand colors / fonts / logo** | `config/brand.config.ts` (+ mirror in `app/globals.css @theme`) |
| **Business info** (phone, email, address, URLs, hours) | `config/site.config.ts` |
| A **translation** | sibling `<slug>.es.mdx` in the same content folder |
| An **author** | `content/authors/<id>.json` |

## 4. The "never hardcode" rules

These are enforced by CI drift checks (audit H7). Violations fail the PR.

1. **No literal Tailwind brand-color classes.** Never `bg-red-600`, `text-green-700`,
   etc. Use semantic tokens: `bg-primary-600`, `bg-primary-700` (hover),
   `text-accent-700`, `ring-primary-400`, … Defined in `config/brand.config.ts`
   and mirrored in `globals.css @theme`. (`slate-*` is the allowed neutral ramp;
   shadcn primitive tokens like `bg-accent`/`bg-primary` in `ui/` are separate and
   allowed.) For inline colors (SVG fills, etc.), import from `brand.config`.
2. **No hardcoded business info.** Phone, email, address, URLs, hours, social,
   business name → read from `config/site.config.ts`. Never inline a literal.
3. **No copy inside components.** Page/section copy and post bodies live in
   `content/` (or are passed as props sourced from config/content), not as JSX
   string literals in components. (Legacy Bordi section copy is mid-migration —
   new work follows this rule; see audit H3.)

## 5. Localization protocol

- **Default locale is English**, served at the root (`/...`). Other locales are
  path-prefixed (`/es/...`). Supported locales live in `site.config.ts → i18n`.
- **Create a `.es.mdx`** sibling next to any `.mdx` to provide a Spanish version.
  Same frontmatter keys; translate values + body.
- **Required in each language version:** all frontmatter keys present and valid
  (zod-checked); body translated.
- **Fallback:** if a `.es.mdx` is missing, the route serves the English version
  with a small "shown in English" notice. Global toggle:
  `site.config.ts → i18n.fallbackToDefault`; per-page override: `fallbackToDefault:
  false` in frontmatter (404s instead of falling back).
- **Spanish stubs today** hold English placeholder text + a `TODO(i18n)` note —
  architecture is live, real translations land later. Don't remove the TODO until
  the prose is actually translated.
- Metadata, sitemap, and `llms.txt` must be locale-aware; set `inLanguage`/
  `hreflang` via `lib/i18n.ts` helpers.

## 6. Git workflow

- **Branches + PRs only. NEVER push directly to `main`.**
- One branch per unit of work; descriptive name (`feat/…`, `fix/…`, `docs/…`).
- Stacked work: base the PR on its dependency branch (e.g. content layer →
  config foundation), not `main`.
- PR description documents **what + why**, and flags any architectural decision
  for Owner review. Don't silently guess on ambiguous choices.
- Every PR gets a Vercel preview. Merge to `main` = deploy to production.

## 7. CI gates that must pass before merge

(See audit H7 — being added.) A PR may not merge unless:
- `tsc --noEmit` clean · `eslint` clean · `next build` clean.
- Lighthouse budget met (performance/SEO/best-practices/a11y thresholds).
- **Drift checks pass:** no literal brand-color classes outside config/globals;
  no literal business info outside `site.config.ts`; every MDX frontmatter passes
  its zod schema; every published page is in the sitemap; EN/ES parity warning.
- Required human review present (branch protection).

## 8. Escalation rule (read this twice)

If a change **cannot** be made without violating a rule in this file:

1. **Do NOT break the rule silently.**
2. Open a PR that **updates CLAUDE.md** with the proposed new/changed convention
   and its rationale.
3. Get **Owner approval** on that doc change.
4. **Then** make the underlying code change (in the same or a follow-up PR).

Also escalate to the Owner for: security incidents/exposed secrets, brand
direction changes, anything with budget/cost, fabricated review/rating data, or
removing/redirecting pages that may have organic traffic. Role-specific
escalation paths are in `/roles/*.md`.

## 9. Working with the role system

`/roles/*.md` defines specialized operating roles (Brand Steward, SEO, GEO,
Frontend, Security, QA/DevOps, …). When doing scoped work, follow the matching
role spec as behavioral guidance (security work → `security-engineer.md`, SEO
work → `seo-specialist.md`, etc.). `/roles/README.md` has the cross-role
workflows (e.g. "publish a blog post").

---

### Quick verify commands
```bash
npx tsc --noEmit          # types
npm run build             # production build (stop any dev server first)
npm run lint              # eslint
```
Note: don't `rm -rf .next` while a dev server is running against it (it 500s the
running server). Stop dev first, or build in CI.
