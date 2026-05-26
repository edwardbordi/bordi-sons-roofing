# Roof System Widget — WordPress Plugin Spec (FINAL)

> **Status:** Approved spec. All 12 architectural and product decisions locked. Ready for implementation.
> **Goal:** Package the scroll-driven "exploding house / roof anatomy" section as a standalone WordPress plugin that a roofer can install, drop on a page via shortcode or Gutenberg block, and fully configure from an admin settings page — without touching code.
> **Distribution model:** Sold direct via own store ($99/year solo, $249/year pro, $599/year agency). Not distributed via WordPress.org.
> **Architecture:** Two plugins. A free **Bordi Widgets Core** plugin (provides React, admin shell, shared utilities) and the paid **Roof System Widget** plugin (this one). Future widget plugins will reuse the same Core.

---

## 1. Product summary

- A roofer installs **both** the free **Bordi Widgets Core** plugin and the **Roof System Widget** plugin.
- The widget is placed on any page via **shortcode** (`[roof_system]`) and/or **Gutenberg block**.
- All branding and content is editable from a single React admin UI in wp-admin with a **live preview**: copy, label text, label positions, colors, fonts, animation timing, and show/hide toggles.
- The plugin is completely self-contained — no dependency on the Bordi & Sons demo site, theme, or build. The plugin folder lives in this repo in isolation; extraction to its own repo is a folder move with zero refactoring.
- The Bordi & Sons demo site itself is never modified by this work.

### Configurability spectrum (sets v1 expectations)

- **v1 (re-skin only):** Ships with the bundled asphalt-shingle house animation. Roofers customize copy, labels (text + positions), colors, fonts, timing, layout toggles. They cannot replace the actual frame artwork.
- **v2+ (custom frames):** Roofers upload their own start/end images, the plugin generates frames, visual label positioning tool. Out of scope for v1.

### Market positioning

The bundled animation depicts a generic colonial farmhouse with asphalt-shingle layers. The product is positioned as **"for asphalt-shingle roofing contractors"** — the largest segment of US residential roofing. Metal, tile, and slate roofers are future v3+ versions with different bundled animations.

### Plugin naming

- Plugin display name: **Roof System Widget** (generic, no trademark conflicts)
- Plugin slug: `roof-system-widget`
- PHP namespace: `BordiWidgets\RoofSystem`
- Text domain: `roof-system-widget`
- Core plugin display name: **Bordi Widgets Core**
- Core plugin slug: `bordi-widgets-core`

The plugin SHIPS with brand-neutral labels (e.g., "ARCHITECTURAL SHINGLES" — not "GAF Timberline"). Roofers configure brand-specific copy themselves based on their certifications.

---

## 2. Isolation & extraction strategy (non-negotiable)

Two plugins, developed in isolation in this repo, designed to lift cleanly into their own repos.

### Folder layout in this repo

```
/bordi-widgets-core-plugin/      # the free Core plugin
/roof-widget-plugin/             # the paid Roof System Widget
```

Each is fully self-contained:

- Each has its own `package.json`, build config, `node_modules`
- Each has its own Tailwind config (scoped/prefixed for the widget plugin)
- The widget plugin ships its OWN duplicated copy of the frame images
- **Zero imports in either direction** between the plugins and the Bordi & Sons site
- The widget plugin DOES depend on the Core plugin at runtime (loads React from Core's globals), but the source code lives in separate isolated folders

**Extraction:**
- Move `/bordi-widgets-core-plugin/` to its own new repo — done
- Move `/roof-widget-plugin/` to its own new repo — done
- Each folder becomes the new repo root, no refactoring needed

---

## 3. Proposed folder structure

### Bordi Widgets Core plugin

```
bordi-widgets-core-plugin/
├─ README.md
├─ LICENSE                            # GPL v2 or later (code)
├─ package.json                       # own deps: react, react-dom, vite
├─ vite.config.ts
├─ tailwind.config.js                 # scoped/prefixed for admin UI
│
├─ bordi-widgets-core.php             # main plugin file (header, bootstrap)
├─ includes/
│  ├─ class-rest-utilities.php        # shared REST registration patterns + capability checks
│  ├─ class-admin-menu.php            # top-level "Bordi Widgets" wp-admin menu
│  ├─ class-asset-enqueue.php         # shared script/style enqueue patterns
│  └─ class-widget-registry.php       # registry where widget plugins register themselves
│
├─ src/
│  ├─ react-global.ts                 # exposes React + ReactDOM to window for widget plugins
│  ├─ admin-shell/
│  │  ├─ Shell.tsx                    # admin app shell — navigation, save bar, notifications
│  │  ├─ LivePreviewFrame.tsx         # iframe preview pattern reused by all widgets
│  │  └─ shared-controls/             # color picker, font selector, slider, toggle, etc.
│  └─ styles/
│     └─ admin.css                    # admin Tailwind entry
│
└─ assets/
   └─ dist/                           # build output
      ├─ react-global.js              # React + ReactDOM bundled
      ├─ admin-shell.js
      └─ admin-shell.css
```

### Roof System Widget plugin

```
roof-widget-plugin/
├─ SPEC.md                            # this document
├─ README.md
├─ LICENSE                            # GPL v2 or later (code)
├─ ASSETS-LICENSE                     # proprietary license (bundled artwork)
├─ package.json                       # own deps: vite, tailwind (NOT react — uses Core's)
├─ vite.config.ts                     # external: react, react-dom
├─ tailwind.config.js                 # scoped for widget rendering
│
├─ roof-system-widget.php             # main plugin file
├─ includes/
│  ├─ class-settings.php              # option storage, defaults, validation
│  ├─ class-rest.php                  # REST routes (registered via Core utilities)
│  ├─ class-shortcode.php             # [roof_system] — mount markup + config
│  ├─ class-block.php                 # Gutenberg block registration
│  ├─ class-enqueue.php               # conditional widget script/style enqueue
│  └─ class-license.php               # license key validation
├─ block/
│  └─ block.json
│
├─ src/
│  ├─ widget/
│  │  ├─ RoofWidget.tsx               # config-driven port of ScrollAnimation
│  │  ├─ defaults.ts                  # default config (copy, labels, colors, timing)
│  │  ├─ types.ts                     # Config type
│  │  ├─ element.ts                   # <roof-system-widget> custom element (Shadow DOM)
│  │  └─ frame-loader.ts              # progressive loading, IntersectionObserver, mode handling
│  ├─ admin/
│  │  ├─ RoofAdminPanel.tsx           # widget's admin tab (registers into Core shell)
│  │  ├─ LabelEditor.tsx              # custom canvas-based label positioner
│  │  └─ Preview.tsx                  # live preview component used by Core's LivePreviewFrame
│  └─ styles/
│     └─ widget.css                   # widget Tailwind entry
│
├─ assets/
│  ├─ frames/
│  │  ├─ full/                        # 1284×716 frames, WebP + JPG fallback
│  │  │  ├─ frame_0001.webp
│  │  │  ├─ frame_0001.jpg
│  │  │  └─ ...
│  │  └─ half/                        # 640×360 frames for mobile
│  │     ├─ frame_0001.webp
│  │     ├─ frame_0001.jpg
│  │     └─ ...
│  └─ dist/                           # build output (widget.js, widget.css, admin-tab.js)
│
└─ languages/                         # .pot file (English-only at launch; i18n-ready)
```

**Distribution artifacts:**
- `bordi-widgets-core-plugin/dist/bordi-widgets-core-vX.X.X.zip`
- `roof-widget-plugin/dist/roof-system-widget-vX.X.X.zip`

Both shipped as separate zip files. Roofer installs Core first, then the widget plugin.

---

## 4. Architecture overview

### Three layers, two plugins

```
┌── BORDI WIDGETS CORE (free, foundational) ───────────────────
│   • React + ReactDOM (loaded as window globals for widgets)
│   • Admin shell (top-level menu, navigation, save bar)
│   • Shared admin controls (color picker, font selector, etc.)
│   • Live preview iframe pattern
│   • REST utilities (registration helpers, capability checks)
│   • Widget registry (each widget plugin registers itself here)
└──────────────────────────────────────────────────────────────
                              ▲
                              │  Widget plugins depend on Core
                              │
┌── ROOF SYSTEM WIDGET (paid) ─────────────────────────────────
│   • PHP layer: options, REST routes, shortcode, block, enqueue
│   • Front-end: <roof-system-widget> Web Component + Shadow DOM
│       (React widget mounted inside the shadow root)
│   • Admin tab: registers into Core's shell — brings its own
│       panel + LabelEditor + Preview component
│   • License validator: calls license server, gates updates
└──────────────────────────────────────────────────────────────
```

### Data flow

```
Admin Settings (React)  ──save──▶  WP REST (Core + capability check)  ──▶  wp_options
                                                                            │
Page render (shortcode/block) ──── reads options ───────────────────────────┘
        │
        └─▶ <roof-system-widget data-config='{…}'> ──▶ Shadow DOM ──▶ React widget renders
```

Global defaults live in `wp_options`. The shortcode and block may pass per-instance overrides as attributes so two placements can differ.

### REST endpoint security

Every REST route registered by this plugin uses Core's `class-rest-utilities.php` helpers, which enforce:
- Nonce verification (`wp_verify_nonce`)
- Capability check (`current_user_can('manage_options')`)
- Both required, no bypass

No subscriber-role user, no contributor, no author, no editor can modify widget settings. Administrators only.

---

## 5. Tech stack & build

### Widget (front-end, on roofer's public pages)

- **React + TypeScript**, ported from `ScrollAnimation.tsx`
- Reads React from Core's global (`window.BordiWidgetsCore.React`) — does NOT bundle its own React
- Built with **Vite** as a self-mounting bundle that registers the `<roof-system-widget>` custom element
- **Tailwind CSS** compiled to a single stylesheet, injected into the Shadow DOM
- Multi-instance from day one — no `window`-level singletons, all state per-component

### Admin UI

- Built with WordPress's bundled React (`wp.element`) — runs only in wp-admin where this is reliably available
- Registers itself into Core's admin shell via the widget registry
- Provides its own admin tab (Content, Labels, Animation, Colors, Typography, Layout sub-tabs)
- Provides a Preview component that Core's LivePreviewFrame renders

### Build pipeline

A single `npm run build:plugin` command in each plugin folder that:

**For Core:**
1. Compiles `react-global.js` (React + ReactDOM as window globals)
2. Compiles admin shell bundle → `dist/admin-shell.js` + `admin-shell.css`
3. Packages PHP + `includes/` + `assets/dist/` into `bordi-widgets-core-vX.X.X.zip`
4. Excludes `src/`, `node_modules/`, dev configs

**For the widget:**
1. Compiles widget bundle → `assets/dist/widget.js` + `widget.css`
2. Compiles admin tab bundle → `assets/dist/admin-tab.js`
3. Image processing pipeline:
   - Sources: original full-resolution JPG frames
   - Outputs: `assets/frames/full/*.webp` + `*.jpg` (1284×716)
   - Outputs: `assets/frames/half/*.webp` + `*.jpg` (640×360)
4. Packages PHP + `includes/` + `block/` + `assets/dist/` + `assets/frames/` into `roof-system-widget-vX.X.X.zip`
5. Excludes `src/`, `node_modules/`, `SPEC.md`, dev configs

### React loading order

When a roofer's page renders:
1. WordPress enqueues `bordi-widgets-core/dist/react-global.js` (runs first, exposes `window.BordiWidgetsCore.React`)
2. WordPress enqueues `roof-system-widget/dist/widget.js` (runs second, reads React from the global)
3. Widget self-mounts into any `<roof-system-widget>` elements on the page

Future widget plugins follow the same pattern — they all share Core's React.

---

## 6. The widget (front-end behavior)

Functionally identical to the current Bordi & Sons site section, but 100% config-driven:

- **Eyebrow / H2 / paragraph** (text + show/hide toggles)
- `<canvas>` scrubbed through the frame sequence by scroll position over a sticky "runway"
- **Desktop bubble labels** (numbered circle + title + description) and **mobile pill labels** (compact, no description)
- Dotted connector lines with red dots (stub + diagonal geometry from the live site)
- Per-label fade-in thresholds during scroll, "hold" on the fully-exploded final frame, mobile vs desktop reveal timing
- Progressive/lazy frame loading via IntersectionObserver (see Section 11)
- Multi-instance support — page can have multiple `<roof-system-widget>` elements, each with its own scroll math and config
- Respects `prefers-reduced-motion` (renders static final frame instead of scroll animation)

### Style isolation: Shadow DOM

- Widget mounts inside a Shadow DOM
- Tailwind's reset (`* { box-sizing: border-box }`) and utilities cannot leak into the host theme
- Host theme styles cannot break the widget
- All theme values flow through CSS custom properties set on the host element

### "Inherit host font" option

To address the one downside of Shadow DOM (cuts off `font-family` inheritance), the widget exposes an "inherit host font" toggle in settings.

- When OFF (default): widget uses its bundled font stack
- When ON: widget reads the host page's computed `font-family` at mount time and applies it inside the shadow root via a CSS variable

Best of both worlds — roofers who want brand-consistent typography get it; roofers who want full isolation get it.

---

## 7. Configuration schema (what the settings page controls)

```jsonc
{
  "content": {
    "eyebrow":   { "text": "HOW WE BUILD A ROOF", "show": true },
    "heading":   { "text": "Six layers. Zero shortcuts." },
    "subhead":   { "text": "Every roof includes the complete system …", "show": true }
  },

  "labels": [
    {
      "step": 1,
      "title": "ROOF DECK PROTECTION",
      "description": "Synthetic underlayment …",
      "dotX": 430, "dotY": 140,
      "side": "left",
      "threshold": 0.04
    }
    // …six labels total in v1
  ],

  "animation": {
    "runwayVh": 550,
    "holdStart": 0.67,
    "fadeMs": 600,
    "arrowThreshold": 0.88,
    "mobileArrowThreshold": 0.82,
    "frameCountMode": "smooth"   // "smooth" (151), "balanced" (100), "lite" (75)
  },

  "theme": {
    "colorPrimary": "#dc2626",
    "colorAccent":  "#1A7F45",
    "colorDot":     "#dc2626",
    "colorLine":    "#475569",
    "bubbleBg": "#ffffff",
    "bubbleBorder": "rgba(15,23,42,.08)",
    "bubbleText": "#0f172a",
    "headingColor": "#0f172a",
    "eyebrowColor": "#dc2626",
    "subheadColor": "#475569",
    "sectionBg": "#ffffff"
  },

  "typography": {
    "fontFamily": "inherit",        // "inherit" reads host page font; or specific stack
    "inheritHostFont": false,       // toggle the inherit behavior
    "headingScale": 1.0
  },

  "layout": {
    "maxWidth": 1024,
    "desktopLabels": true,
    "mobilePills": true
  },

  "frames": {
    "basePath": "<plugins_url>/assets/frames/",
    "fullCount": 151,
    "halfCount": 151,
    "pattern": "frame_%04d"
  }
}
```

All settings page tabs map directly to these schema sections: **Content · Labels · Animation · Colors · Typography · Layout**.

---

## 8. Style isolation — Shadow DOM

- Widget mounts inside a Shadow DOM. Tailwind's reset and utilities stay scoped inside the shadow root.
- Theme values flow through CSS custom properties (`--rsw-color-primary`, `--rsw-bubble-bg`, etc.) set on the host element.
- The `inherit host font` toggle is the one bridge between shadow and host — when enabled, the widget reads `getComputedStyle(host).fontFamily` and sets `--rsw-font-family` inside the shadow root.

---

## 9. Settings page — React admin with live preview

### Architecture

The Bordi Widgets Core plugin provides the admin shell:
- Top-level wp-admin menu: **Bordi Widgets**
- Sub-pages per installed widget plugin (Roof System, future widgets register their own sub-pages)
- Shared chrome: save bar, dirty-state indicator, notifications

The Roof System Widget registers its admin panel into the Core shell. The panel has:
- **Tabs:** Content · Labels · Animation · Colors · Typography · Layout
- **Live preview pane** rendering the actual widget with the in-progress config
- **Save** button (calls REST → `wp_options`)
- **Reset to defaults** button (per section and global)

### Live preview implementation

- Core provides a `<LivePreviewFrame>` component (an iframe with the widget mounted inside)
- The widget plugin's Preview component handles per-config re-renders inside the iframe
- Iframe is used to fully isolate the preview from the wp-admin styles
- Updates are debounced (~150ms) for smooth tweaking without thrashing

### REST persistence

- Save endpoint: `POST /wp-json/bordi-widgets/v1/roof-system/settings`
- Load endpoint: `GET /wp-json/bordi-widgets/v1/roof-system/settings`
- Both registered via Core's `class-rest-utilities` helper
- Both protected by nonce + `current_user_can('manage_options')` capability check
- Single `wp_options` record per widget plugin (e.g., `bordi_widgets_roof_system_config`)

### Custom controls (built into Core)

Reusable across all future widget plugins:
- Color picker (with WP's native color picker as fallback)
- Font selector
- Number slider with unit
- Toggle switch
- Threshold slider (0–1)
- **Canvas label positioner** (drag dots on a canvas to set dotX/dotY)
- Text input + textarea
- Show/hide toggle for content blocks

---

## 10. Placement — shortcode + block

### Shortcode

```
[roof_system]
```

With optional per-instance overrides:

```
[roof_system heading="Built in Five Generations" hold="0.7" max_width="1200"]
```

The shortcode renders the `<roof-system-widget data-config='{...}'>` mount markup. Enqueues the widget assets only on pages that use the shortcode.

### Gutenberg block

- Block name: `bordi-widgets/roof-system`
- Block category: "Bordi Widgets"
- Server-rendered with the same `<roof-system-widget>` markup
- Editor preview uses a static placeholder (first frame) for performance; full widget renders on the front-end
- Block sidebar exposes common per-instance overrides (heading, hold position, max width)

### Per-instance overrides

Both placement methods accept per-instance overrides that merge over the global config. So two placements on one page can have different copy or behavior.

---

## 11. Assets & performance — frame payload strategy

The most performance-critical part of the plugin. Implemented in five layers.

### Layer 1: Format — WebP + JPG fallback

- Frames shipped in both WebP and JPG formats
- Browser receives WebP via `<picture>` element with JPG fallback
- WebP payload is ~30–40% smaller than JPG for equivalent quality
- 95%+ browser support globally

### Layer 2: Adaptive serving by viewport

- **Full-size frames:** 1284×716 (desktop)
- **Half-size frames:** 640×360 (mobile)
- Served via `<picture>` element with media query selection:
  ```html
  <picture>
    <source media="(max-width: 767px)" srcset="…/half/frame_0001.webp" type="image/webp">
    <source media="(max-width: 767px)" srcset="…/half/frame_0001.jpg" type="image/jpeg">
    <source srcset="…/full/frame_0001.webp" type="image/webp">
    <img src="…/full/frame_0001.jpg">
  </picture>
  ```
- Mobile users get ~half the payload at the right resolution for their viewport

### Layer 3: Progressive loading via IntersectionObserver

- Widget does NOT preload frames on initial page load
- IntersectionObserver watches the widget element with a `rootMargin: 150vh` (preload starts when widget is 1.5 viewport heights below the user)
- Frames stream in while user is reading above the widget
- By the time scroll reaches the widget, frames are loaded (or close to it)

### Layer 4: Static placeholder

- `frame_0001` renders immediately as a regular `<img>` inside the canvas wrapper while preload runs
- User always sees the assembled house, never a blank canvas
- Subtle loading indicator overlays the placeholder until preload completes
- Loading indicator disappears the moment scroll input enters the widget OR when preload finishes, whichever comes first

### Layer 5: Tunable frame count (admin setting)

| Mode | Frame count | Approximate payload (mobile WebP) | Use case |
|---|---|---|---|
| **Smooth** (default) | 151 | ~3.8MB | Premium sites, fast hosting, modern visitors |
| **Balanced** | 100 | ~2.5MB | General use |
| **Lite** | 75 | ~1.9MB | Slow hosts, mobile-heavy traffic, perf-conscious roofers |

Each preset just stops loading frames after N. Same animation, slightly less smooth at Balanced/Lite, significantly less payload.

### Payload reference (document in buyer README)

| Scenario | Frame count | Resolution | Format | Total payload |
|---|---|---|---|---|
| Mobile, Lite | 75 | half | WebP | ~1.9MB |
| Mobile, Balanced | 100 | half | WebP | ~2.5MB |
| Mobile, Smooth | 151 | half | WebP | ~3.8MB |
| Desktop, Balanced | 100 | full | WebP | ~5MB |
| Desktop, Smooth | 151 | full | WebP | ~7.5MB |

Buyers know what they're shipping. Sets honest expectations and reduces "the plugin slowed my site" support tickets.

---

## 12. Decisions locked (was: Open decisions)

All architectural and product decisions have been resolved:

| # | Decision | Choice |
|---|---|---|
| 1 | Style isolation | Shadow DOM + "inherit host font" toggle |
| 2 | React strategy | Reuse Core's React (widget); use `wp.element` (admin) |
| 3 | Multi-plugin architecture | Shared "Bordi Widgets Core" plugin |
| 4 | v1 scope | Re-skin only (no custom frame uploads) |
| 5 | Multi-instance | Designed in from day one |
| 6 | Settings UI | React admin with live preview, in Core plugin |
| 7 | Placement | Both shortcode + Gutenberg block |
| 8 | Frame payload | WebP + JPG fallback, adaptive serving, progressive loading, static placeholder, Smooth/Balanced/Lite presets |
| 9 | Distribution | Own store only for v1 |
| 10 | Pricing | Annual subscription: Solo $99/yr · Pro $249/yr · Agency $599/yr |
| 11 | Bundled artwork | Dual license: GPL code + proprietary artwork. Brand-neutral defaults. Generic plugin name. |
| 12 | Security & build | REST capability check (`manage_options`) + `npm run build:plugin` |

---

## 13. Phased build plan

Each phase is independently testable. The widget is usable from P1.

### P0 — Scaffold both plugins
- Create `/bordi-widgets-core-plugin/` and `/roof-widget-plugin/` folders
- Set up each with own `package.json`, Vite, Tailwind, TypeScript
- Copy frame images into `/roof-widget-plugin/assets/frames/full/` (originals)
- Standalone demo HTML pages for each (no WP yet)

### P1 — Widget core
- Port `ScrollAnimation.tsx` from the Bordi site → config-driven `RoofWidget.tsx`
- Runs in the widget plugin's demo HTML page (no WordPress yet)
- Multi-instance tested with two side-by-side
- IntersectionObserver-based frame loading working

### P2 — Isolation + theming
- Wrap RoofWidget in `<roof-system-widget>` Web Component with Shadow DOM
- Wire CSS custom property contract
- Implement "inherit host font" toggle
- Frame payload strategy: WebP/JPG, full/half resolution, Smooth/Balanced/Lite, static placeholder

### P3 — Core plugin shell
- PHP header and bootstrap for Bordi Widgets Core
- React global loader (exposes `window.BordiWidgetsCore.React`)
- Top-level wp-admin menu + admin shell scaffolding
- Widget registry pattern (where widget plugins register themselves)
- REST utilities (registration helpers, capability check enforcer)

### P4 — Widget plugin shell
- PHP header and bootstrap for Roof System Widget
- Options storage + defaults
- REST routes (via Core utilities)
- Shortcode registration
- Conditional enqueue (only on pages with the widget)
- License validation client

### P5 — Settings page
- Widget admin tab registers into Core shell
- React admin UI: Content · Labels · Animation · Colors · Typography · Layout tabs
- Custom label positioner (canvas-based drag interaction)
- Live preview iframe
- REST save/load wired up

### P6 — Gutenberg block
- Register `bordi-widgets/roof-system` block
- Block sidebar with common per-instance overrides
- Static placeholder in editor preview

### P7 — Polish
- i18n setup (English-only at launch, but `.pot` file ready)
- Accessibility audit (prefers-reduced-motion, screen reader testing, keyboard nav)
- Performance pass (Lighthouse, Core Web Vitals)
- Buyer-facing README + setup video links
- Build script automated for distribution zip

### P8 — License server + storefront
- License key validation endpoint (separate from plugin code)
- Customer store (Stripe Subscriptions or Paddle for billing)
- Three tiers: Solo / Pro / Agency
- Launch discount: first 100 customers at $49/year locked-in

---

## 14. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Host theme CSS collisions | Shadow DOM isolation |
| Sticky-scroll breaks in page builders (Elementor/Divi `overflow` containers) | Test matrix; document supported placements; guard rails in runway math |
| Frame payload weight on mobile | WebP + JPG fallback, adaptive (full/half) serving, progressive load, tunable presets |
| WordPress's bundled React version changes | We don't use it for the widget (own React via Core); admin uses `wp.element` which is more stable |
| Multiple instances on one page | Per-instance config + scroll math from day one (no `window`-level singletons) |
| Accessibility (scroll-jacking, motion) | `prefers-reduced-motion` fallback (static final frame); proper alt/aria text |
| Unauthorized settings modification | REST endpoints enforce both nonce verification AND `current_user_can('manage_options')` |
| License key piracy | License validation on activation + periodic re-check against your license server |
| Trademark conflict from default copy | Brand-neutral default labels and copy; generic plugin name; roofers configure brand-specific text themselves |
| Core plugin not installed when widget activates | Activation guard: detect Core presence on activation; show admin notice and refuse to activate if missing |

---

## 15. Distribution & licensing

### Distribution channel

- **Sold direct from own store. Not distributed via WordPress.org.**
- Distribution: customer pays via Stripe Subscriptions or Paddle → receives license key + download link
- Updates served via own update server (plugin checks for updates against your endpoint)
- License key gates updates and support; the installed plugin keeps working if subscription lapses but stops receiving updates

### Pricing tiers (annual subscription)

| Tier | Sites | Price/year | Target buyer |
|---|---|---|---|
| Solo | 1 | $99 | Individual roofing contractor |
| Pro | 5 | $249 | Multi-location roofer or small agency |
| Agency | Unlimited | $599 | Web dev/agency serving many roofer clients |

**Launch promotion:** first 100 customers receive $49/year locked-in pricing (grandfathered for life as long as they renew continuously).

**Future pricing path** (as ecosystem grows):
- v2 (when shingle picker widget ships): bump new customers to $149/$349/$799
- v3 (5+ widgets in ecosystem): $199/$499/$999
- Existing customers retain their original pricing as long as they continuously renew

### License model

**Plugin code:** GPL v2 or later
- Allows WordPress hooks/filters interop
- Customers can modify code on their own sites
- Standard WP plugin convention

**Bundled artwork (the 151 frames + brand assets):** Proprietary, restricted to plugin use
- Customer may use frames AS PART of the plugin on their licensed sites
- Customer may NOT extract frames and use them in unrelated projects
- Customer may NOT redistribute or resell the frames
- License terminates if subscription lapses (for assets only; code remains GPL)

Two LICENSE files in the plugin repo:
- `LICENSE` — GPL v2+ for code
- `ASSETS-LICENSE` — proprietary terms for bundled artwork

### Trademark and branding guidance

- Plugin name: **Roof System Widget** (generic, no trademark conflict)
- Plugin slug: `roof-system-widget`
- Bundled default copy is brand-neutral — labels say "ARCHITECTURAL SHINGLES," NOT "GAF Timberline" or any other manufacturer trademark
- Roofers configure brand-specific copy themselves based on their certifications and partnerships
- Marketing copy on your storefront can mention compatibility ("pairs well with GAF Master Elite certification") — but the bundled artwork and default labels remain neutral

### License key validation flow

1. Customer purchases on your store → receives license key
2. Installs plugin, enters key in admin
3. Plugin posts key to your license server → server validates + records site URL
4. Periodic re-check (every 7 days) to confirm subscription is still active
5. If subscription lapses: plugin keeps working but stops receiving updates and shows admin notice

---

## 16. Internationalization (i18n)

**v1 launch: English only.** All bundled text and admin UI strings are in English.

Plugin is i18n-ready, however:
- All translatable strings wrapped in `__()`, `_e()`, etc.
- `.pot` file generated and included in `languages/`
- Text domain: `roof-system-widget`
- Admin app uses `wp_set_script_translations` for translatable JS strings

Future localization will be community-driven or contracted as the market expands beyond English-speaking regions.

---

## 17. Accessibility

- `prefers-reduced-motion`: when set, widget renders as a static final-frame image with all labels visible immediately — no scroll-driven animation
- Proper semantic markup for the eyebrow/heading/paragraph content
- Each label has an accessible alt-text equivalent (screen readers announce "Step 1 of 6: ROOF DECK PROTECTION. Synthetic underlayment forms the foundation…")
- Keyboard accessibility: not interactive in v1 (it's a scroll-driven info widget), but ensures no keyboard traps and no focus theft
- Color contrast: default theme passes WCAG AA; admin warns if customized colors fail contrast checks

---

## 18. What this document is / isn't

- **Is:** The locked, approved blueprint for v1 of the Roof System Widget plugin and its companion Bordi Widgets Core plugin. Ready for implementation.
- **Isn't:** Implementation. No plugin code exists yet. The Bordi & Sons demo site is unchanged and uninvolved.

### Document lifecycle

- This `SPEC.md` lives in the `/roof-widget-plugin/` folder
- It travels with the plugin during extraction to a separate repo
- Updated only by formal decision (not casually edited)
- Future version (v2+) gets its own spec; this one is the v1 contract

---

*End of spec. Ready to build against.*
