# Agency Playbook — Audit & Target Architecture

> **Purpose:** Turn the Bordi & Sons Roofing site into a replicable, agency-grade
> Next.js 16 template for building many client sites at scale — documented,
> secure, fast, SEO/GEO-ready, and operable by humans **or** AI agents.
>
> **Status of this document:** Audit + planning only. **No Bordi code has been
> changed for this exercise.** Nothing here is implemented yet; it's the plan to
> review before targeted refactors begin.
>
> **Stack as audited:** Next.js `16.2.6` (App Router + Turbopack), React `19.2.4`,
> Tailwind CSS v4, TypeScript 5, shadcn/ui (radix-ui), framer-motion 12,
> lucide-react 1.16. Single static page deployed (presumably) via Vercel git
> integration.

Legend: ✅ present & solid · 🟡 partial / fragile · ❌ missing · 🔴 broken

---

# PART 1 — AUDIT OF CURRENT STATE

## 1. Project Structure

| Area | Status | Notes |
|---|---|---|
| App Router layout | ✅ | `app/layout.tsx`, `app/page.tsx`, `app/globals.css` — clean, idiomatic Next 16. |
| Component folder | 🟡 | 14 section components in `components/` + 8 primitives in `components/ui/`. Primitives are reusable; **sections are Bordi-coupled** (copy, colors, towns, phone baked in). |
| Content vs code separation | ❌ | **No separation.** All copy, testimonials, FAQ, service lists, NAP live inside `.tsx` components as JSX literals. |
| Blog support | ❌ | No `app/blog/`, no posts, no content pipeline. |
| Additional pages (services/locations/case studies) | ❌ | Single route (`/`). No pattern for more pages. |
| Magic strings / hardcoded brand | 🔴 | ~25+ hardcoded references: phone `(555) 555-5555` / `tel:+15555555555`, `demo.sitescan.controlsuite.ai`, `bordiandsons.com`, `Haddon Twp`, business name, NJ town list, testimonial names. `SITE_URL` is **duplicated in 3 files** (`layout.tsx`, `robots.ts`, `sitemap.ts`). A client swap today means hand-editing dozens of files. |

**Verdict:** A polished *single-site* structure, not yet a *template*. The reusable
substrate (App Router + ui primitives + utility helpers) is healthy; the gap is
that brand/content is fused into the section components.

## 2. Content Layer

| Area | Status | Notes |
|---|---|---|
| Authoring model | 🔴 Code-only | Pages authored by editing TSX. No Markdown/MDX/JSON content. |
| Blog pipeline | ❌ | None. Recommended Next-16-native pattern below (no CMS subscription needed). |
| Images | 🟡 | `next/image` used for shingle grid + hero (good: WebP/resize/lazy). **But** the roof-animation frames are loaded via raw `new Image()` from `/public/frames` — they bypass the optimizer (acceptable trade-off, documented). Source images were oversized (hero was 8.6 MB, since fixed to 299 KB). No enforced "optimize on import" step. |
| Frontmatter standard | ❌ | None exists. Proposed schema in Part 2. |
| Draft vs published | ❌ | Not handled. |
| Tags / categories / authors | ❌ | Not modeled. |

**Cleanest blog pattern for Next 16 (no paid CMS):** Markdown/MDX files in
`/content/blog/*.mdx` + frontmatter, read at build time with `generateStaticParams`,
parsed with a tiny dependency set (`gray-matter` + `next-mdx-remote/rsc` or the
native `@next/mdx`). Static by default; opt into ISR per-route later. This is the
spine of the "GitHub as CMS" story.

## 3. Performance

| Area | Status | Notes |
|---|---|---|
| Build output | ✅ | All routes `○ (Static)` prerendered. Home + `_not-found` + generated `robots.txt`/`sitemap.xml`/`manifest.webmanifest`/`icon`/`apple-icon`. Compiles ~2.7 s. |
| `next/image` | ✅ | Used where it matters; AVIF/WebP via the optimizer; `priority` only on the hero LCP image. |
| Hero LCP image | ✅ (fixed) | Was 8.6 MB (5504×3072) → **299 KB** (2400×1340). |
| Animation frames | 🟡 | 151 frames **11 MB JPG → 7.1 MB WebP**, and preload is now **deferred behind an IntersectionObserver** (was firing on mount). Still heavy on slow connections — no adaptive frame-count or half-res tier on the *site* (the sibling WP plugin already solved this with presets + half-frames; that technique should be ported). |
| Fonts | ✅ | Geist via `next/font/google` (self-hosted, `display: swap` default, auto-preload). Unused `Geist_Mono` was removed. |
| JS bundle | 🟡 | `framer-motion` (~mid-size) pulled in by `FadeIn`, used on nearly every section. 11 client components. No `@next/bundle-analyzer` wired up. Candidate win: replace `FadeIn`'s framer usage with a CSS/IntersectionObserver reveal to drop framer from the critical path. |
| Code splitting | ✅ | Route-level splitting is automatic; client components are leaf-level. |
| Static generation | ✅ | Everything static; nothing unnecessarily dynamic. |
| Core Web Vitals (risks) | 🟡 | LCP: good after hero fix. CLS: low risk (fixed-dimension images, but verify the hero text block + sticky nav). INP: the scroll-scrubbed canvas animation is the main interaction-cost risk on low-end devices; it's `requestAnimationFrame`-coalesced (good) but worth a field check. No real-user monitoring yet. |

**Note:** No Lighthouse run was performed in this audit (no production URL / headless
run requested). Recommendation: add a Lighthouse CI budget (free, GitHub Action) as
part of the template — see Part 4.

## 4. SEO

| Area | Status | Notes |
|---|---|---|
| Meta (title/desc/OG/Twitter) | ✅ (site-level) | Set in `app/layout.tsx` with `metadataBase`, canonical, OG + Twitter. **No per-page pattern** (only one page exists). Template needs a per-route `generateMetadata` convention. |
| Structured data | 🟡 | `RoofingContractor` (LocalBusiness) in layout; `FAQPage` in the FAQ component. **Missing:** `Service`, `Article`/`BlogPosting`, `Person` (author), `BreadcrumbList`. `aggregateRating` is placeholder/demo data (flagged not-for-production). |
| Sitemap | ✅ | `app/sitemap.ts` (currently 1 URL). Must become content-driven when pages/posts exist. |
| robots.txt | ✅ | `app/robots.ts` — allow all + sitemap + host. |
| Canonical | ✅ | `alternates.canonical` set. |
| Internal linking | 🟡 | Anchor nav + mega-menu links to sections; no cross-page/topic-cluster linking (no other pages yet). |
| Mobile-first responsive | ✅ | Tailwind responsive throughout; mobile pills, stacked layouts, bottom-bar CTA. (Note: top nav is desktop-only — no mobile hamburger; acceptable but worth noting for the template.) |

## 5. LLM-Ready / GEO (Generative Engine Optimization)

| Area | Status | Notes |
|---|---|---|
| `llms.txt` | ❌ | Not present. This is the headline GEO gap. Template should generate it (static route, like `robots.ts`). |
| Semantic HTML | ✅ | `<section>`, single `<h1>`, `<h2>`/`<h3>`, `<details>/<summary>` FAQ, `<figure>/<blockquote>` testimonials, `<nav>`. Clean for parsing. |
| FAQ schema for AI quoting | ✅ | `FAQPage` JSON-LD present — directly quotable. |
| Author / expertise signals | ❌ | No `Person`/author bios, no E-E-A-T signals. Needed once a blog exists. |
| Topic clustering | ❌ | Single page; no pillar/cluster structure. |
| Citable sections | 🟡 | Headings are clean but sections lack stable anchor IDs everywhere and per-section summaries that AIs prefer to quote. |

## 6. Security

| Area | Status | Notes |
|---|---|---|
| HTTPS | ✅ (platform) | Enforced by Vercel in production. |
| Security headers (CSP/HSTS/X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy) | 🔴 | **`next.config.ts` is empty.** Zero custom headers. No CSP, no HSTS, no clickjacking protection. **Highest-priority security item.** |
| Env var handling | ✅ (by absence) | No env usage yet; `.env*` is gitignored. No `.env.example`. |
| Secrets in repo / history | ✅ | History scan found no API keys/secrets/private keys. Clean. |
| Form spam protection | 🔴 (latent) | `CallbackForm` is **front-end only** (no submit target). When wired, it needs a honeypot + Cloudflare Turnstile (free) + server-side validation + rate limiting. |
| `npm audit` | 🟡 | 2 **moderate** advisories — both transitive: PostCSS `<8.5.10` XSS-in-stringify, pulled in by Next's bundled toolchain. "Fix" only via a breaking Next downgrade, so **not actionable**; the affected code path (CSS stringify) isn't user-facing at runtime. Track upstream; do **not** run `audit fix --force`. |
| Dependency freshness | ✅ | Next/React/Tailwind all current. |

## 7. Build / Deploy Pipeline

| Area | Status | Notes |
|---|---|---|
| Vercel config | 🟡 | No `vercel.json` (auto-detection works, but headers/redirects belong here or in `next.config`). |
| Env management | ❌ | No `.env.example`, no documented split of client-specific values. |
| Preview deployments | 🟡 (assumed) | Vercel gives per-PR previews automatically **if** git integration is set up — not codified or documented in-repo. |
| Production workflow | 🟡 | Push-to-`main` → deploy (current habit). No documented gate. |
| Rollback | ❌ | Not documented (Vercel instant rollback exists; needs a one-pager). |
| GitHub Actions | ❌ | No `.github/`. No CI (lint/typecheck/build/Lighthouse) on PRs. |

## 8. Content Editing Workflow (critical for the vision)

| Area | Status | Notes |
|---|---|---|
| Non-dev blog post via GitHub web UI | ❌ | Impossible today (posts are code). With the proposed `/content/*.mdx` layer it becomes: "Add file → paste Markdown → commit on a branch → PR." |
| Drag-and-drop image | 🟡 | GitHub web UI supports image upload into a folder; needs a documented `/public/blog/<slug>/` convention + an optimize-on-CI step. |
| "Edit this" workflow | ❌ | Not documented. |
| Rebuild time after content change | ✅ | Build is ~seconds; Vercel rebuild on commit is the unit of "publish." ISR can make it instant later. |

## 9. Scaling

| Scale | Behavior | Action |
|---|---|---|
| 50 posts | ✅ Fine fully static | None. |
| 500 posts | 🟡 Build time grows linearly | Introduce **ISR** (`revalidate`) or on-demand revalidation; paginate the blog index. |
| 5,000 posts | 🔴 SSG build becomes slow | ISR + partial prerendering; move full-text **search** off-build (client-side index like Pagefind — free, static — or external). |
| Search | ❌ | None. Recommend **Pagefind** (free, static, zero-infra) for the template. |
| Pagination | ❌ | None. Define `/blog/page/[n]` convention up front. |

## 10. Multi-Editor / Team

| Area | Status | Notes |
|---|---|---|
| Branch protection | ❌ | Not configured (solo push-to-main). |
| PR template | ❌ | None. |
| Review process | ❌ | Informal. |
| Client GitHub access | ❌ | Undocumented. Recommend: client = **Write** on a content repo or **Triage**, edits via branch+PR; never force-push to `main`. |
| Agency access | ❌ | Undocumented. Recommend: **Write** with required PR review; reserve **Admin** for the owner. |

## 11. Maintainability

| Area | Status | Notes |
|---|---|---|
| Dependency upgrades | 🟡 | Manual. Recommend Renovate/Dependabot (free) with grouped, scheduled PRs. |
| Framework upgrades | 🟡 | `AGENTS.md` already mandates reading `node_modules/next/dist/docs/` before coding (smart guardrail given Next 16's breaking changes). Keep that. |
| Testing | ❌ | None. Recommend a **thin** layer: typecheck + build in CI (catches most), Playwright smoke test for the home page + form, Lighthouse budget. No heavy unit-test mandate. |
| Monitoring | ❌ | None. Recommend Vercel's built-in + optional Sentry (free tier) for error tracking. |
| Analytics | ❌ | None. Recommend **Vercel Web Analytics** or **Plausible** (privacy-friendly, no cookie banner). Avoid GA4 unless a client requires it. |

## 12. Replicability

| Area | Status | Notes |
|---|---|---|
| Fork & rebrand path | 🔴 | No clean path. Brand values are scattered; two disconnected color systems exist (see below). |
| Where brand lives | 🔴 | **Split-brain:** shadcn design tokens (oklch) sit in `globals.css :root` but the marketing sections **don't use them** — brand red (`#dc2626`/`bg-red-600`) and green (`#1A7F45`) are inline Tailwind utility classes. So there's a token layer nobody reads and hardcoded colors everywhere that matters. |
| Extract a starter | 🟡 | Feasible after the refactors in Part 4. The bones are good. |
| Init script / CLI | ❌ | None. Worth a small `degit` + interactive `init` script later (LOW priority). |

---

# PART 2 — TARGET ARCHITECTURE

## 2.1 Folder Structure

```
repo-root/
├─ app/
│  ├─ (marketing)/              # route group: home, services, about, contact
│  │  ├─ page.tsx
│  │  ├─ services/[slug]/page.tsx
│  │  └─ locations/[slug]/page.tsx
│  ├─ blog/
│  │  ├─ page.tsx               # index (paginated)
│  │  ├─ page/[n]/page.tsx      # pagination
│  │  └─ [slug]/page.tsx        # post (generateStaticParams from /content)
│  ├─ layout.tsx                # reads site.config for metadata baseline
│  ├─ sitemap.ts                # content-driven (globs /content)
│  ├─ robots.ts
│  ├─ llms.txt/route.ts         # GEO file (generated from config + content)
│  ├─ manifest.ts
│  └─ globals.css               # tokens ONLY map to brand.config
├─ content/                     # ← the CMS. Plain files, GitHub-editable.
│  ├─ blog/<slug>.mdx
│  ├─ services/<slug>.mdx
│  ├─ locations/<slug>.mdx
│  └─ authors/<id>.json
├─ config/
│  ├─ site.config.ts            # ← ONE FILE: business info, URL, NAP, socials
│  ├─ brand.config.ts           # ← colors, fonts, logo paths, radius
│  └─ nav.config.ts             # nav + footer link structure
├─ components/
│  ├─ ui/                       # unbranded primitives (shadcn) — keep as-is
│  ├─ sections/                 # composable, prop-driven section blocks
│  └─ content/                  # MDX components (callouts, CTA, image)
├─ lib/                         # utils, content loaders, schema builders
│  ├─ content.ts                # read/parse MDX + frontmatter
│  ├─ seo.ts                    # buildMetadata(), JSON-LD builders
│  └─ utils.ts
├─ public/                      # static assets, /blog/<slug>/ for post images
├─ roles/                       # the role-based operating system (Part 6)
└─ docs/                        # the doc set (Part 3)
```

**Rationale:** `content/` and `config/` are the only places editors and rebranders
touch. Everything brand- or business-specific is pulled *out* of components and
*into* config/content. Components become brand-agnostic and prop-driven →
genuinely reusable across clients.

## 2.2 Content Layer Design

- **Format:** MDX (Markdown + the occasional component) in `/content/<type>/<slug>.mdx`.
- **Loader:** `lib/content.ts` globs the directory, parses with `gray-matter`,
  renders with `next-mdx-remote/rsc` (RSC-native, no client cost) **or** `@next/mdx`.
- **Frontmatter schemas** (validated with `zod` at build — fail the build on bad data):

```yaml
# Blog post
title: string                # required
description: string          # required (<=160 chars, used for meta + GEO)
date: YYYY-MM-DD             # required
updated: YYYY-MM-DD          # optional
author: string               # required, → /content/authors/<id>.json
tags: [string]               # optional
category: string             # optional (topic cluster)
draft: boolean               # default false; drafts excluded from prod build
hero: string                 # optional image path
canonical: string            # optional override
```

```yaml
# Service / Location page
title, description, date      # as above
serviceType: string           # → Service schema
areaServed: [string]          # → LocalBusiness areaServed
faqs: [{q, a}]                # → FAQPage schema, auto-rendered
```

- **Draft/published:** `draft: true` → filtered out of `generateStaticParams` and
  sitemap in production; visible in preview deployments.
- **Tags/categories/authors:** tags + category are frontmatter; authors are JSON
  records (name, bio, avatar, sameAs) → power `Person`/`author` schema + bylines.

## 2.3 Theme / Branding System (one config controls everything)

Collapse the split-brain color system into **one source of truth**:

```ts
// config/brand.config.ts
export const brand = {
  colors: {
    primary:   "#dc2626",   // brand red
    accent:    "#1A7F45",   // brand green
    neutral:   "slate",     // tailwind ramp
  },
  fonts: { sans: "Geist", heading: "Geist" },
  logo:  { src: "/images/logo.png", width: 104, height: 104 },
  radius: "0.625rem",
};
```

- `globals.css` `@theme` maps Tailwind tokens **to these values** (CSS vars), and
  components use **semantic classes** (`bg-primary`, `text-accent`) instead of
  literal `bg-red-600`. Swapping a client = edit one file.
- `config/site.config.ts` holds business info: legal name, phone, email, address,
  geo, hours, social URLs, `SITE_URL` (dedupe the 3 copies), estimate/CTA URLs.
- All section components read copy/links from `content/` + `config/`, never literals.

## 2.4 Component Library Organization

- `components/ui/` — unbranded primitives (button, card, accordion…). **No brand
  colors hardcoded.** Reusable verbatim across clients.
- `components/sections/` — Hero, Testimonials, FAQ, CTA, etc., refactored to accept
  data via props (from content/config). One section = one composable block.
- `components/content/` — components usable inside MDX (CTA button, callout, figure).

## 2.5 SEO / Structured-Data Baseline (every page gets)

1. `generateMetadata()` → title (templated), description, canonical, OG, Twitter.
2. JSON-LD via `lib/seo.ts` builders:
   - Sitewide: `Organization` + `LocalBusiness`/`RoofingContractor` (from config).
   - Page-type: `Service` (service pages), `BlogPosting`+`Person` (posts),
     `FAQPage` (any page with FAQs), `BreadcrumbList` (nested pages).
3. Content-driven `sitemap.ts` + `llms.txt`.
4. Stable section anchor IDs + a one-line `description` per major section (GEO).

## 2.6 `llms.txt` Template

```
# {Business Name}
> {One-line description}. {City, State}. {Primary services}.

## Pages
- [Home]({url}/): {summary}
- [Services]({url}/services): {summary}
- [Blog]({url}/blog): {summary}

## Key facts
- Service area: {towns}
- Phone: {phone}   Email: {email}
- Hours: {hours}
- Certifications: {e.g. GAF Master Elite}

## Content
- [{post title}]({url}/blog/{slug}): {description}   # generated from frontmatter
```

Served from `app/llms.txt/route.ts`, generated from `site.config` + content glob.

## 2.7 Security Headers (in `next.config.ts`)

Baseline `headers()` for all routes:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` (or CSP `frame-ancestors`)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy:` start in **Report-Only**, allow self + Vercel +
  analytics + the estimate iframe origin, then enforce. (CSP needs care because of
  Next inline styles/scripts — use nonces or the documented Next CSP pattern.)

## 2.8 Build / Deploy Patterns

- Vercel git integration: PR → preview, `main` → production.
- `next.config.ts` owns headers/redirects; `vercel.json` only if needed.
- GitHub Action on PR: `typecheck → lint → build → Lighthouse budget` (all free).
- `.env.example` documents every variable; real values live in Vercel project env.
- Rollback = Vercel "Promote previous deployment" (documented in DEPLOYMENT.md).

## 2.9 Documentation Structure

`docs/` holds the long-form guides (Part 3); top-level `README.md` + `CLAUDE.md`
are the entry points; `roles/` holds the operating system (Part 6).

---

# PART 3 — DOCUMENTATION FILES TO CREATE

| File | Contents (1-paragraph) |
|---|---|
| **README.md** | Project overview, stack, 30-minute orientation, quickstart (`npm i`, `dev`, `build`), where things live (config/content/components), and links to every other doc. The "understand it in 30 minutes" front door. |
| **CLAUDE.md** | Instructions for Claude Code / AI agents working in this repo: the read-`node_modules/next/dist/docs/` rule (from `AGENTS.md`), house conventions, "never hardcode brand values — use config," how to add content vs code, verification commands (typecheck/build), and a pointer to `/roles/` for role-scoped work. |
| **ARCHITECTURE.md** | The "why": folder structure rationale, content-layer flow (MDX → loader → static page), the brand/config single-source-of-truth model, rendering strategy (static + ISR), and the SEO/JSON-LD builder design. |
| **CONTENT-EDITING-GUIDE.md** | For non-developers. Step-by-step with screenshots: edit/add a blog post through GitHub's web UI, upload an image, set frontmatter, mark draft vs publish, open a PR, preview, and merge to publish. The heart of "GitHub as CMS." |
| **DEPLOYMENT.md** | Vercel setup, env vars, preview vs production, the promote/rollback procedure, custom domains, and what the CI gates check before a deploy. |
| **SECURITY.md** | Threat model for a marketing site, the security headers + CSP policy and how to extend it, form spam protection (honeypot + Turnstile), secret handling (`.env.example` → Vercel), the npm-audit policy, and the incident/escalation path. |
| **SCALING.md** | Decision guide: static vs ISR thresholds, when/how to turn on `revalidate`, blog pagination, adding Pagefind search, image volume management, and build-time budgets. |
| **BRANDING-CONFIG.md** | The rebrand checklist: every value in `site.config.ts` + `brand.config.ts`, how colors/fonts/logo propagate, asset specs (logo sizes, OG image, favicon), and a "swap a client in under an hour" walkthrough. |
| **ADDING-A-PAGE.md** | How to add a new route or MDX-driven page (service/location), wire metadata + JSON-LD, add it to nav config, and confirm it lands in the sitemap + llms.txt. |
| **ADDING-A-BLOG-POST.md** | The fast path: copy the post template, fill frontmatter, write Markdown, drop images in `/public/blog/<slug>/`, set `draft`, PR, preview, publish — plus the SEO/GEO checklist each post must pass. |

---

# PART 4 — PRIORITIZED FIX / REFACTOR PLAN

Effort: **S** ≈ <½ day · **M** ≈ ½–2 days · **L** ≈ 3+ days.

### 🔴 CRITICAL — fix before this is a template

| # | Item | Effort | Depends on |
|---|---|---|---|
| C1 | **Add security headers** in `next.config.ts` (HSTS, nosniff, frame, referrer, permissions; CSP in Report-Only first). | S | — |
| C2 | **Extract brand/business values** into `config/site.config.ts` + `brand.config.ts`; dedupe the 3 `SITE_URL` copies; replace hardcoded NAP/URLs. | M | — |
| C3 | **Unify the color system**: map `globals.css` tokens to `brand.config`, swap literal `bg-red-600`/`#1A7F45` for semantic classes. | M | C2 |
| C4 | **Form safety**: document/implement that any live form needs honeypot + Turnstile + server validation before wiring a backend. | S | — |

### 🟠 HIGH — needed for replicability

| # | Item | Effort | Depends on |
|---|---|---|---|
| H1 | **Content layer**: `/content` MDX + `lib/content.ts` loader + zod frontmatter schemas + draft handling. | L | C2 |
| H2 | **Blog routes**: index, pagination, `[slug]`, `generateStaticParams`, RSS optional. | M | H1 |
| H3 | **Prop-drive the section components** (decouple from Bordi copy) → `components/sections/`. | L | C2, C3 |
| H4 | **SEO builders** `lib/seo.ts` (`buildMetadata`, JSON-LD for Service/BlogPosting/Person/Breadcrumb) + content-driven `sitemap.ts`. | M | H1 |
| H5 | **`llms.txt` route** generated from config + content. | S | H1 |
| H6 | **The doc set** (Part 3) + `.env.example`. | M | C2, H1 |
| H7 | **CI**: GitHub Action (typecheck/lint/build/Lighthouse budget) + branch protection + PR template. | M | — |

### 🟡 MEDIUM — nice to have

| # | Item | Effort | Depends on |
|---|---|---|---|
| M1 | **Analytics** (Vercel Web Analytics or Plausible) wired via config flag. | S | C2 |
| M2 | **Error monitoring** (Sentry free tier) + uptime check. | S | — |
| M3 | **Pagefind search** for the blog (static, free). | M | H2 |
| M4 | **Playwright smoke test** (home renders, nav works, form validates). | M | H7 |
| M5 | **Port the WP plugin's adaptive frame strategy** (presets + half-res) to the site animation for slow connections. | M | — |
| M6 | **`FadeIn` without framer-motion** (CSS + IO) to trim the bundle. | S | — |

### 🟢 LOW — future

| # | Item | Effort | Depends on |
|---|---|---|---|
| L1 | **`create-agency-site` CLI / `degit` starter** with interactive rebrand prompts. | L | C2, C3, H1 |
| L2 | **On-demand ISR** + webhook revalidation (only at scale). | M | H1 |
| L3 | **Visual regression** (Playwright screenshots) in CI. | M | M4 |
| L4 | **Dependabot/Renovate** grouped upgrade PRs. | S | H7 |

**Critical path:** C2 → C3 → H3 (decoupling) runs parallel to H1 → H2 → H4/H5
(content + SEO). C1/C4/H7 are independent and can start immediately.

---

# PART 5 — INSIGHTS FOR VIDEO CONTENT

"Building modern websites without WordPress" / "GitHub as your CMS." Each beat is
chosen to be **demonstrable on screen** and to contrast with WordPress / AI builders
(Lovable, Base44, Bolt).

1. **"Your CMS is a folder."** Show `/content/blog/*.mdx`. Adding a post = adding a
   file. No database, no admin login, no plugin to update at 2am. *(Contrast: WP
   needs MySQL + wp-admin + plugin sprawl.)*

2. **"Publishing is a Git commit — with a free preview and instant rollback."** Edit
   a Markdown file in GitHub's web UI on your phone → PR → Vercel posts a preview
   URL → merge → live. Screw up? One click reverts the deploy. *(Contrast: WP has no
   real preview-per-change or atomic rollback.)*

3. **"Rebrand a whole site by editing one file."** Open `brand.config.ts`, change
   the hex codes and logo path, save — the entire site reskins live. *(Contrast: AI
   builders regenerate/hallucinate; WP theme options are a maze.)*

4. **"Zero attack surface."** Show the empty server: static files on a CDN, no PHP,
   no login page, no database to breach. Then show the security-headers diff.
   *(Contrast: WP is the most-attacked software on the web.)*

5. **"30× lighter in one command."** Live demo: an 8.6 MB hero → 299 KB; the roof
   frames JPG→WebP and deferred so they don't load until you scroll. Show the
   Network tab before/after. *(Contrast: WP page builders ship bloat by default.)*

6. **"The site an AI can read."** Open `llms.txt` and the JSON-LD; show ChatGPT/
   Perplexity citing the site's FAQ verbatim. GEO as a first-class feature.
   *(Contrast: builder output is a div soup AIs struggle to parse.)*

7. **"It costs ~$0/month to run."** Static hosting on a free tier, no CMS license,
   no plugin subscriptions, privacy-friendly analytics with no cookie banner.
   *(Contrast: WP hosting + premium plugins + page builder license.)*

8. **"You own it, forever, in plain text."** Everything is Markdown + TypeScript in
   *your* Git repo. No lock-in, full history, diff every change. *(Contrast: export
   from an AI builder and you get a tangle you can't maintain.)*

9. **"An AI agent can run the whole site."** Reveal `/roles/` — show a role spec
   handed to an agent as a system prompt, publishing a post end-to-end. This is the
   "agent-managed website" payoff and a genuinely novel beat.

10. **"Same speed at 5 posts or 5,000."** Static generation + ISR; show the build
    output all-green `(Static)`. *(Contrast: WP slows as the database grows.)*

---

*End of audit. See `/roles/` for the role-based operating system (Part 6).*
