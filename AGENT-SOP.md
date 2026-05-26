# AGENT-SOP.md — Procedural Runbook

> Step-by-step procedures for common operations. Read `CLAUDE.md` first (the
> rules); this is the *how*. Every procedure ends with verification. Always work
> on a branch + PR (never `main`).
>
> Status note: items marked **(pending Hn)** depend on infrastructure still being
> built per `AGENCY-PLAYBOOK-AUDIT.md` Part 4. The procedure is the target
> workflow; the note says what isn't wired yet.

---

## SOP-1 · Adding a new blog post

1. `git checkout -b post/<slug>` off `main`.
2. Create `content/blog/<slug>.mdx`. Use this frontmatter (validated by
   `lib/content-schema.ts` — build fails if invalid):
   ```yaml
   ---
   title: "…"                 # required
   description: "…"           # required, ≤200 chars (used for meta + GEO)
   date: "YYYY-MM-DD"         # required
   author: "ed-bordi"         # required → content/authors/<id>.json
   category: "…"              # optional (topic cluster)
   tags: ["…"]                # optional
   draft: true                # start as draft
   hero: "/images/…"          # optional
   ---
   ```
3. Write the body in Markdown. Use descriptive `##`/`###` headings and a lead
   sentence per section (SEO/GEO). Add ≥2 internal links.
4. Images: put them in `public/blog/<slug>/` and reference `/blog/<slug>/img.jpg`.
5. (Optional) Spanish: add `content/blog/<slug>.es.mdx` — see SOP-7.
6. Verify: `npx tsc --noEmit` and `npm run build` (build validates frontmatter).
7. Open a PR. Check the Vercel preview at `/blog/<slug>` **(pending H2 route)**.
8. Publish: set `draft: false`, get review, merge → live. Confirm it appears in
   `/sitemap.xml` and `/llms.txt` **(pending H4/H5)**.

## SOP-2 · Adding a new page

1. `git checkout -b page/<name>`.
2. Decide type:
   - **MDX-driven** (service/location): add `content/<type>/<slug>.mdx`; the
     dynamic route renders it **(pending H1+ route)**.
   - **Bespoke**: add `app/<path>/page.tsx`, compose `components/sections/*`.
3. Add `generateMetadata()` (title/description/canonical/OG) via `lib/seo.ts`
   **(pending H4)**; emit page-appropriate JSON-LD (Service/Breadcrumb).
4. Add the page to `config/nav.config.ts` (nav/footer) **(pending)**.
5. No hardcoded brand/business values — read from `config/` (CLAUDE.md §4).
6. Verify: `tsc` + `build`; confirm the URL is in `/sitemap.xml` + `/llms.txt`.
7. PR → preview → review → merge.

## SOP-3 · Onboarding a new client (rebrand)

1. `git checkout -b client/<name>` (or fork the template repo).
2. **`config/site.config.ts`** — replace every value: name, legalName, url, NAP,
   phone, email, areaServed, hours, social, estimateUrl, certifications, i18n.
3. **`config/brand.config.ts`** — set colors, fonts, logo, radius (see SOP-4).
4. **Assets** — replace `public/images/logo*`, hero, OG image, favicon/icons
   (`app/icon.png`, `app/apple-icon.png`, `public/icon-*.png`).
5. **Content** — replace `content/**` with the client's pages/posts; update
   `content/authors/*`.
6. **Security** — Security Engineer sets the CSP allowlist for the client's
   third parties in `next.config.ts`.
7. **Deploy** — DevOps creates the Vercel project, sets env vars, attaches the
   domain; Analytics wires tracking.
8. Verify: `build` clean, all drift checks pass, render spot-check, Lighthouse.
9. PR → review → merge → go-live checklist (see `DEPLOYMENT.md`, pending H6).

## SOP-4 · Changing brand colors

1. `git checkout -b brand/colors`.
2. Edit the ramp in **`config/brand.config.ts`** (`colors.primary.*`, `accent.*`).
3. **Mirror the same hexes** into `app/globals.css` `@theme`
   (`--color-primary-*`, `--color-accent-700`). CSS can't import TS — the CI
   drift check verifies the two match.
4. Do **not** touch component class names — they use semantic tokens
   (`bg-primary-600`), so they re-skin automatically.
5. Verify: `npm run build`, then confirm the new hexes appear in the compiled
   CSS:
   ```bash
   grep -o '#<newhex>' .next/static/chunks/*.css | head
   ```
   Visual-check the preview. PR → review → merge.

## SOP-5 · Adding a new language

1. `git checkout -b i18n/<locale>`.
2. **`config/site.config.ts → i18n`**: add the locale to `locales`, plus
   `localeNames` and `bcp47` entries.
3. Add localized content files using the suffix convention: `<slug>.<locale>.mdx`
   (e.g. `<slug>.fr.mdx`). Missing files fall back to default (CLAUDE.md §5).
4. Confirm `lib/i18n.ts` helpers (`localizePath`, `alternates`) and routing
   handle the new prefix **(pending route wiring)**.
5. Ensure metadata/sitemap/llms.txt emit the new `hreflang`/`inLanguage`.
6. Verify: `tsc` + `build`; check `/<locale>/…` renders. PR → review → merge.

## SOP-6 · Shipping a feature / section change

1. `git checkout -b feat/<name>`.
2. Implement in `components/` (prop-driven; CLAUDE.md §4). Read the relevant
   `node_modules/next/dist/docs/` if using Next APIs.
3. If it touches **images/JS/animation** → Performance Engineer checks budgets.
   If it touches **forms/headers/third-party scripts** → Security Engineer review.
4. Verify locally: `npx tsc --noEmit`, `npm run build`. Don't `rm -rf .next`
   against a running dev server.
5. PR with what/why + any flagged decisions. CI gates + preview must pass.
6. Owner approval for high-risk changes → merge → Monitoring watches the deploy.

## SOP-7 · Publishing a translation

1. `git checkout -b i18n/<slug>-<locale>`.
2. Copy `content/<type>/<slug>.mdx` → `<slug>.<locale>.mdx`.
3. Translate the **body** and the human-readable frontmatter values
   (title, description); keep all keys and structural values (date, author,
   slugs, links).
4. Remove the `TODO(i18n)` placeholder note once the prose is genuinely
   translated (Brand Steward/Copywriter reviews voice in-language).
5. Verify: `build` (frontmatter still valid), preview `/<locale>/<type>/<slug>`,
   confirm the "shown in English" fallback notice is **gone** for this page.
6. PR → review → merge.

---

### Universal verification checklist (every PR)
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` clean (frontmatter validates here)
- [ ] `npm run lint` clean
- [ ] No literal brand-color classes / no hardcoded business info (drift checks)
- [ ] Vercel preview renders the change
- [ ] Architectural decisions flagged in the PR description for the Owner
