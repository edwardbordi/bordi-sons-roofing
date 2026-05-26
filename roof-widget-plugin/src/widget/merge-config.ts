import { DEFAULT_CONFIG } from "./defaults";
import type { RoofConfig } from "./types";

// Deep-merge a (possibly partial) config over the brand-neutral defaults.
// Shared by the Web Component (data-config) and the admin app (REST payload),
// so neither needs the full config to be present.

type AnyObj = Record<string, unknown>;
const isObj = (v: unknown): v is AnyObj =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function section<K extends keyof RoofConfig>(key: K, partial: AnyObj): RoofConfig[K] {
  const base = DEFAULT_CONFIG[key] as AnyObj;
  const over = isObj(partial[key]) ? (partial[key] as AnyObj) : {};
  return { ...base, ...over } as RoofConfig[K];
}

export function mergeConfig(input: unknown): RoofConfig {
  if (!isObj(input)) return DEFAULT_CONFIG;
  const content = isObj(input.content) ? input.content : {};
  return {
    content: {
      eyebrow: { ...DEFAULT_CONFIG.content.eyebrow, ...(isObj(content.eyebrow) ? content.eyebrow : {}) },
      heading: { ...DEFAULT_CONFIG.content.heading, ...(isObj(content.heading) ? content.heading : {}) },
      subhead: { ...DEFAULT_CONFIG.content.subhead, ...(isObj(content.subhead) ? content.subhead : {}) },
    },
    labels:
      Array.isArray(input.labels) && input.labels.length
        ? (input.labels as RoofConfig["labels"])
        : DEFAULT_CONFIG.labels,
    animation: section("animation", input),
    theme: section("theme", input),
    typography: section("typography", input),
    layout: section("layout", input),
    frames: section("frames", input),
  };
}
