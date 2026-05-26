# Bordi Widgets Core

The free foundation plugin for Bordi widget plugins. Provides:

- **Shared React global** — `react-global.js` exposes `window.BordiWidgetsCore.React`,
  `.ReactDOM` (createRoot), and `.jsxRuntime`, so each widget plugin reuses one
  React instead of bundling its own.
- **Widget registry** — widget plugins call `Registry::instance()->register()` to
  appear under the **Bordi Widgets** admin menu.
- **REST utilities** — `Rest::register()` bakes in an admin-only capability check
  (`manage_options`) on every route.
- **Admin shell** — top-level menu + per-widget sub-pages (React settings app
  mounts here in a later phase).

Self-contained and extractable (own repo) — depends on nothing else in this
monorepo. See `../roof-widget-plugin/SPEC.md` for the full plan.

## Build

```bash
npm install
npm run build:react   # → assets/dist/react-global.js (React + ReactDOM, IIFE)
```

## Status

- **P3 — Core shell:** ✅ PHP (main, registry, REST utilities, admin menu, enqueue)
  + React global build. PHP is `php -l` clean; full WordPress runtime testing
  requires a WP install.
- Admin shell React app + shared controls land with the settings page (P5).
