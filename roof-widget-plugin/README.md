# Roof System Widget

Standalone, scroll-driven "roof anatomy" widget — the front-end of a white-label
WordPress plugin (see [SPEC.md](./SPEC.md) for the full product/architecture plan).

This folder is **fully self-contained** and designed to be lifted out into its own
repo with zero refactoring (it has no imports to/from the surrounding demo site).

## Status

- **P0 — Scaffold:** ✅ toolchain + bundled frame assets
- **P1 — Widget core:** ✅ config-driven `RoofWidget` running in a standalone demo
- **P2 — Isolation + theming:** ✅
  - `<roof-system-widget>` Web Component with **Shadow DOM** (Tailwind injected into
    the shadow root — zero leakage to/from the host theme)
  - **CSS custom-property** theming contract (`var(--rsw-*)`) + "inherit host font"
  - **Frame payload strategy**: WebP + JPG fallback, full (1284×716) / half
    (642×358) adaptive serving by viewport, Smooth/Balanced/Lite sampling presets,
    progressive `IntersectionObserver` loading, static placeholder, reduced-motion fallback
- **P3 — Core plugin shell:** ✅ (see `../bordi-widgets-core-plugin/`)
- **P4 — Widget plugin shell:** ✅
  - PHP: main file (Core dependency guard), settings/options, REST routes (via
    Core, admin-only), `[roof_system]` shortcode with per-instance overrides,
    conditional enqueue, license stub
  - Plugin bundle build (`npm run build:plugin`) → `assets/dist/widget.js` (28 KB,
    React externalized to the Core global; Tailwind CSS inlined for the Shadow DOM)
  - PHP is `php -l` clean; the two-bundle runtime verified in a simulated WP page
- **P5 — Settings page:** ✅ (core)
  - React admin app (`src/admin/`) registered into Core's "Bordi Widgets" menu,
    built React-externalized (`npm run build:admin` → `assets/dist/admin.js`, 12 KB)
  - Tabs: Content · Labels · Animation · Colors · Typography · Layout, with
    load/save via the REST route (`wp.apiFetch`)
  - Deferred to a later increment: visual canvas label-positioner (drag) and the
    live-preview iframe (currently Labels uses numeric position inputs)
- Remaining phases (Gutenberg block, polish, license server) — SPEC.md §13.

## Build the bundles

```bash
npm run build:plugin   # → assets/dist/widget.js (front-end widget, React external)
npm run build:admin    # → assets/dist/admin.js  (wp-admin settings app)
```

## Local WordPress dev

Both plugin folders are symlinked into a LocalWP site
(`bordi-widgets-dev`) at `wp-content/plugins/{bordi-widgets-core,roof-system-widget}`,
so the repo stays the source of truth. PHP edits are live; rebuild the JS bundles
after JS changes.

## Build frame assets

The repo stores only the source frames (`assets/frames/full/*.jpg`). Generate the
WebP + half-res variants the widget serves with:

```bash
npm run frames   # → full/*.webp, half/*.jpg, half/*.webp
```

## Develop

```bash
npm install
npm run dev        # standalone demo at http://localhost:5173 (two instances)
npm run typecheck  # tsc --noEmit
npm run build:demo # type-check + production demo build
```

The demo (`index.html` + `src/main.tsx`) mounts two independent widget instances
with different configs to exercise multi-instance support and config-driven
rendering.

## Layout

- `src/widget/` — the widget itself
  - `RoofWidget.tsx` — config-driven port of the site's scroll animation
  - `types.ts` — the full `RoofConfig` contract (SPEC §7)
  - `defaults.ts` — brand-neutral default config
  - `frame-loader.ts` — progressive, IntersectionObserver-triggered frame loading
- `src/styles/widget.css` — Tailwind entry (injected into Shadow DOM in a later phase)
- `assets/frames/full/` — bundled frame sequence (own copy, 151 frames)

Nothing here depends on Next.js or the demo site; React is bundled for the demo
and will be externalized (loaded from Bordi Widgets Core) in the plugin build.
