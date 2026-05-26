// Full configuration contract for the Roof System widget. Mirrors the schema in
// SPEC.md §7. P1 consumes content/labels/animation/layout/frames; theme +
// typography are part of the locked schema and get wired to CSS variables in P2.

export type LabelConfig = {
  step: number; // installation sequence shown in the numbered circle (1 = first)
  title: string;
  description: string;
  dotX: number; // dot position on the 1284×716 canvas
  dotY: number;
  textX: number; // near edge of the label, in canvas units
  textY: number;
  lineEndX: number; // where the connector line ends near the label
  side: "left" | "right";
  threshold: number; // scroll progress (0–1) at which the label fades in
};

export type FrameCountMode = "smooth" | "balanced" | "lite";

export type RoofConfig = {
  content: {
    eyebrow: { text: string; show: boolean };
    heading: { text: string };
    subhead: { text: string; show: boolean };
  };
  labels: LabelConfig[];
  animation: {
    runwayVh: number; // total scroll length of the section
    holdStart: number; // fraction of scroll after which the final frame holds
    fadeMs: number; // label/connector fade duration
    arrowThreshold: number; // desktop connector reveal point (0–1)
    mobileArrowThreshold: number; // mobile connector reveal point (0–1)
    frameCountMode: FrameCountMode; // smooth=151, balanced=100, lite=75 (sampled)
  };
  theme: {
    colorPrimary: string;
    colorAccent: string;
    colorDot: string;
    colorLine: string;
    bubbleBg: string;
    bubbleBorder: string;
    bubbleText: string;
    headingColor: string;
    eyebrowColor: string;
    subheadColor: string;
    sectionBg: string;
  };
  typography: {
    fontFamily: string; // "inherit" or a CSS font stack
    inheritHostFont: boolean;
    headingScale: number;
  };
  layout: {
    maxWidth: number; // canvas container max width in px
    desktopLabels: boolean;
    mobilePills: boolean;
  };
  frames: {
    basePath: string; // dir holding full/ (and later half/) frame folders
    fullCount: number; // number of source frames available
    pattern: string; // e.g. "frame_%04d"
  };
};

// Frame counts per smoothness preset (sampled evenly across the full sequence).
export const FRAME_COUNT_PRESETS: Record<FrameCountMode, number> = {
  smooth: 151,
  balanced: 100,
  lite: 75,
};
