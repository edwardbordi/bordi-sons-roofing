import { registerRoofWidget } from "./widget/element";

// P2 demo. Registers the <roof-system-widget> custom element and builds the page
// with plain inline-styled spacers (NO global Tailwind) — so if the widgets
// render styled correctly, their CSS is coming entirely from their own Shadow
// DOM. The themed instance proves CSS-variable theming via data-config.
registerRoofWidget();

const root = document.getElementById("root")!;

function spacer(text: string): HTMLElement {
  const s = document.createElement("section");
  s.style.cssText =
    "min-height:80vh;display:flex;align-items:center;justify-content:center;" +
    "background:#f5f5f4;padding:0 1.5rem;text-align:center;" +
    "font-family:system-ui,sans-serif;color:#64748b;";
  const p = document.createElement("p");
  p.style.cssText = "max-width:36rem;font-size:1.125rem;line-height:1.6;";
  p.textContent = text;
  s.appendChild(p);
  return s;
}

function widget(config?: unknown): HTMLElement {
  const el = document.createElement("roof-system-widget");
  if (config) el.setAttribute("data-config", JSON.stringify(config));
  return el;
}

root.append(
  spacer("↓ Plain page content (inline-styled, no Tailwind). Scroll into the first widget — frames lazy-load as you approach."),
  // Default (brand-neutral) instance.
  widget(),
  spacer("Content between two independent widget instances."),
  // Recolored + re-copied instance — proves CSS-variable theming, Shadow DOM
  // isolation, and that two instances coexist with independent config/scroll.
  widget({
    content: {
      eyebrow: { text: "THEMED VIA DATA-CONFIG", show: true },
      heading: { text: "Same widget, recolored." },
      subhead: {
        text: "This instance overrides its colors, copy, runway length and frame preset through one data-config attribute — no code changes.",
        show: true,
      },
    },
    theme: {
      colorPrimary: "#0ea5e9",
      colorDot: "#0ea5e9",
      colorLine: "#0284c7",
      eyebrowColor: "#0ea5e9",
      sectionBg: "#0f172a",
      headingColor: "#f8fafc",
      subheadColor: "#94a3b8",
      bubbleBg: "#1e293b",
      bubbleBorder: "rgba(148,163,184,.25)",
      bubbleText: "#f8fafc",
    },
    animation: { frameCountMode: "lite", runwayVh: 400 },
  }),
  spacer("↑ Two instances above — each styled entirely from its own Shadow DOM, on a host page with no Tailwind."),
);
