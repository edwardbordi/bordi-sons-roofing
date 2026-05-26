import type { RoofConfig } from "./types";

// Brand-neutral defaults (SPEC.md §1, §11): generic copy and labels, no
// manufacturer trademarks. Roofers customize everything from the settings page.
// Coordinates are in the 1284×716 canvas space of the bundled frame artwork.
export const DEFAULT_CONFIG: RoofConfig = {
  content: {
    eyebrow: { text: "HOW WE BUILD A ROOF", show: true },
    heading: { text: "Six layers. Zero shortcuts." },
    subhead: {
      text: "Every roof we install includes the complete system — installed exactly to manufacturer spec. No corner-cutting, no surprises.",
      show: true,
    },
  },

  labels: [
    {
      step: 6,
      title: "RIDGE CAP SHINGLES",
      description:
        "Seals the ridge — the most vulnerable point on any roof. Built to withstand wind and weather.",
      dotX: 680, dotY: 70, textX: 1080, textY: 70, lineEndX: 1070, side: "right", threshold: 0.69,
    },
    {
      step: 5,
      title: "RIDGE VENT",
      description:
        "Continuous attic ventilation regulates temperature and moisture, releasing trapped heat. Extends roof life by years.",
      dotX: 490, dotY: 70, textX: 210, textY: 58, lineEndX: 220, side: "left", threshold: 0.56,
    },
    {
      step: 4,
      title: "ARCHITECTURAL SHINGLES",
      description:
        "Beautiful dimensional shingles — the striking, visible heart of your roofing system. Available in dozens of colors to match any taste or home, and built for decades of dependable protection.",
      dotX: 720, dotY: 137, textX: 1080, textY: 187, lineEndX: 1070, side: "right", threshold: 0.43,
    },
    {
      step: 3,
      title: "STARTER STRIP SHINGLES",
      description:
        "Premium pre-cut strips create the first sealed row at the eaves. Locks every shingle above firmly in place, preventing blow-offs.",
      dotX: 620, dotY: 210, textX: 210, textY: 322, lineEndX: 220, side: "left", threshold: 0.30,
    },
    {
      step: 2,
      title: "LEAK BARRIER",
      description:
        "Self-adhering rubberized membrane along vulnerable eaves and valleys. Stops ice dams and wind-driven rain dead in their tracks.",
      dotX: 720, dotY: 235, textX: 1080, textY: 335, lineEndX: 1070, side: "right", threshold: 0.17,
    },
    {
      step: 1,
      title: "ROOF DECK PROTECTION",
      description:
        "Synthetic underlayment is your roof's foundation. Protects your home from water and weather before shingles are even installed.",
      dotX: 430, dotY: 140, textX: 210, textY: 190, lineEndX: 220, side: "left", threshold: 0.04,
    },
  ],

  animation: {
    runwayVh: 550,
    holdStart: 0.67,
    fadeMs: 600,
    arrowThreshold: 0.88,
    mobileArrowThreshold: 0.82,
    frameCountMode: "smooth",
  },

  theme: {
    colorPrimary: "#dc2626",
    colorAccent: "#1A7F45",
    colorDot: "#dc2626",
    colorLine: "#475569",
    bubbleBg: "#ffffff",
    bubbleBorder: "#f1f5f9",
    bubbleText: "#0f172a",
    headingColor: "#0f172a",
    eyebrowColor: "#dc2626",
    subheadColor: "#475569",
    sectionBg: "#ffffff",
  },

  typography: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    inheritHostFont: false,
    headingScale: 1.0,
  },

  layout: {
    maxWidth: 1024,
    desktopLabels: true,
    mobilePills: true,
  },

  frames: {
    basePath: "/frames/",
    fullCount: 151,
    pattern: "frame_%04d",
  },
};
