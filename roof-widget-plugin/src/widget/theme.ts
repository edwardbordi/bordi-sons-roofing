import type { CSSProperties } from "react";

import type { RoofConfig } from "./types";

// The CSS custom-property contract (SPEC.md §8). These variables are set once on
// the widget root; every color/font inside the widget reads var(--rsw-*). The
// settings page (later phase) just changes these values — no markup changes.
export function rootStyle(config: RoofConfig): CSSProperties {
  const t = config.theme;
  const vars: Record<string, string> = {
    "--rsw-color-primary": t.colorPrimary,
    "--rsw-color-accent": t.colorAccent,
    "--rsw-color-dot": t.colorDot,
    "--rsw-color-line": t.colorLine,
    "--rsw-bubble-bg": t.bubbleBg,
    "--rsw-bubble-border": t.bubbleBorder,
    "--rsw-bubble-text": t.bubbleText,
    "--rsw-heading-color": t.headingColor,
    "--rsw-eyebrow-color": t.eyebrowColor,
    "--rsw-subhead-color": t.subheadColor,
    "--rsw-section-bg": t.sectionBg,
    "--rsw-font-family": config.typography.fontFamily,
  };
  return {
    ...vars,
    backgroundColor: "var(--rsw-section-bg)",
    fontFamily: "var(--rsw-font-family)",
  } as unknown as CSSProperties;
}
