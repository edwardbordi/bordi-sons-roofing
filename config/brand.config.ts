/**
 * BRAND CONFIG — the single source of truth for visual identity.
 *
 * Rule (see CLAUDE.md): NEVER use literal Tailwind color classes (bg-red-600,
 * text-green-700, …) in components. Use the semantic tokens (bg-primary-600,
 * text-accent-700, …) defined from these values.
 *
 * Where these values live for Tailwind: the same hexes are mirrored into the
 * `@theme` block in `app/globals.css` (CSS can't import from TS). Keep the two
 * in sync — the CI drift check (H7) verifies they match. This file is the
 * canonical, human-facing source; `globals.css` is the machine mirror.
 *
 * To retheme a client: change the values here AND in `globals.css @theme`.
 */

export const brand = {
  colors: {
    /**
     * PRIMARY — brand red. Ramp mirrors the exact values previously used as
     * literal `red-*` classes, so the visual output is unchanged. To retheme,
     * replace these with the client's brand ramp.
     */
    primary: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626", // base
      700: "#b91c1c", // hover/active
      DEFAULT: "#dc2626",
    },
    /**
     * ACCENT — currently maps to the green used on trust icons / success states
     * (Tailwind green-700, #15803d), preserved exactly. NOTE FOR OWNER: the
     * brand's logo green is #1A7F45, which differs slightly. Decide whether to
     * unify accent to #1A7F45 — left as-is for now to avoid any visual change.
     */
    accent: {
      700: "#15803d",
      DEFAULT: "#15803d",
    },
    /** Neutral ramp: Tailwind `slate` (the only neutral the template uses). */
    neutral: "slate",
  },

  fonts: {
    sans: "Geist",
    heading: "Geist",
  },

  logo: {
    src: "/images/bordi-logo.png",
    alt: "Bordi & Sons Roofing",
    /** Header render size (square). */
    width: 104,
    height: 104,
  },

  /** Base radius (mirrors --radius in globals.css). */
  radius: "0.625rem",
} as const;

export type BrandConfig = typeof brand;
