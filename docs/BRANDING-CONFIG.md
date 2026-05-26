# Branding & Config (rebrand checklist)

Swapping the template to a new client should take well under an hour, touching only
config + assets + content. Owned by the Brand Steward role.

## 1. Business info — `config/site.config.ts`

Replace every value:
- `name`, `legalName`, `shortName`
- `url` (production origin — the only place it's defined; robots/sitemap/llms read it)
- `description` (used for meta + GEO)
- `estimateUrl` (primary CTA destination)
- `phone.display` + `phone.href`, `email`
- `address` (locality/region/country), `areaServed[]`, `hours[]`
- `social` (facebook/instagram/…), `certifications[]`
- `i18n` (default locale + supported locales) — usually leave as-is

## 2. Visual identity — `config/brand.config.ts`

- `colors.primary.*` — the brand ramp (50–700). `DEFAULT` is the main brand color.
- `colors.accent.*` — secondary/brand-green equivalent.
- `fonts`, `logo` (`src`, `alt`, `width`, `height`), `radius`.

**Then mirror the hexes** into `app/globals.css @theme`
(`--color-primary-*`, `--color-accent-700`). CSS can't import TS; the CI drift
check verifies they match. Components use semantic classes (`bg-primary-600`,
`text-accent-700`), so they re-skin automatically — **don't edit component class
names**.

## 3. Assets (`public/` + `app/`)

| Asset | Where | Spec |
|---|---|---|
| Logo | `public/images/<logo>.png` (path in `brand.config`) | transparent PNG, square-ish |
| Hero / OG image | `public/images/hero-scene.jpg` | ~2400px wide, < ~400 KB; 1.91:1 reads best for OG |
| Favicon | `app/icon.png` | 512×512 (Next auto-generates the favicon link) |
| Apple touch | `app/apple-icon.png` | 180×180, solid background |
| Manifest icons | `public/icon-192.png`, `public/icon-512.png` | referenced by `app/manifest.ts` |

Regenerate icons from the logo with `sharp` (see git history for the script).

## 4. Content

Replace `content/blog/*`, `content/authors/*`, and the home-section copy in
`content/home.ts` with the client's. Keep the structure/types.

## 5. Verify

```bash
npm run drift        # no leftover hardcoded values / colors
npm run build        # frontmatter + everything compiles
grep -o '#<newhex>' .next/static/chunks/*.css | head   # brand hex emitted
```
Spot-check the preview, then ship. The drift check is your safety net: if any old
brand color or business literal remains in components, it fails.
