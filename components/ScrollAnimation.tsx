"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const FRAME_COUNT = 151;
// Internal canvas resolution — matches the extracted source frames (1284x716).
const CANVAS_WIDTH = 1284;
const CANVAS_HEIGHT = 716;

const framePath = (frame: number) =>
  `/frames/frame_${String(frame).padStart(4, "0")}.jpg`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type LabelConfig = {
  name: string;
  description: string;
  dotX: number; // target position (where the component sits)
  dotY: number;
  textX: number; // text position (offset to the side)
  textY: number;
  lineEndX: number; // where the connector line ends, near the text
  side: "left" | "right";
  threshold: number; // scroll progress at which the label fades in
};

// Coordinates in SVG units (viewBox 0 0 1284 716). dotY values tuned so each
// dot lands on its floating layer in frame_0151.jpg (the spec's first-pass
// y=150..360 sat ~80-150px too low, on the tan deck/facade — see commit msg).
// textY mirrors dotY so each connector line is horizontal.
const labels: LabelConfig[] = [
  {
    name: "RIDGE CAP SHINGLES",
    description:
      "Seals the ridge — the most vulnerable point on any roof. Built to withstand wind and weather.",
    dotX: 760, dotY: 70, textX: 1080, textY: 70, lineEndX: 1070, side: "right", threshold: 0.2,
  },
  {
    name: "COBRA RIDGE VENT",
    description:
      "Continuous attic ventilation regulates temperature and moisture. Extends roof life by years.",
    dotX: 620, dotY: 100, textX: 210, textY: 100, lineEndX: 220, side: "left", threshold: 0.32,
  },
  {
    name: "ARCHITECTURAL SHINGLES",
    description:
      "Dimensional charcoal shingles. The visible heart of your roofing system, built for decades of protection.",
    dotX: 720, dotY: 132, textX: 1080, textY: 132, lineEndX: 1070, side: "right", threshold: 0.5,
  },
  {
    name: "STARTER STRIP SHINGLES",
    description:
      "Premium pre-cut strips create the first sealed row at the eaves. Locks every shingle above firmly in place.",
    dotX: 620, dotY: 158, textX: 210, textY: 158, lineEndX: 220, side: "left", threshold: 0.62,
  },
  {
    name: "LEAK BARRIER",
    description:
      "Rubberized membrane along eaves and valleys. Stops ice dams and wind-driven rain in their tracks.",
    dotX: 720, dotY: 285, textX: 1080, textY: 285, lineEndX: 1070, side: "right", threshold: 0.75,
  },
  {
    name: "ROOF DECK PROTECTION",
    description:
      "Synthetic underlayment is your roof's foundation. Protects your home from water before shingles are even installed.",
    dotX: 620, dotY: 210, textX: 210, textY: 210, lineEndX: 220, side: "left", threshold: 0.88,
  },
];

export function ScrollAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Decoded frames live in a ref so updating them never triggers a re-render.
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const prevFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  // Label subgroups, updated imperatively to avoid re-renders on scroll.
  const textRefs = useRef<(SVGGElement | null)[]>([]);
  const arrowRefs = useRef<(SVGGElement | null)[]>([]);

  const [loaded, setLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Preload + decode every frame in parallel on mount.
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);

    const loadFrame = async (i: number) => {
      const img = new Image();
      img.src = framePath(i + 1);
      try {
        await img.decode();
      } catch {
        // decode() can reject if interrupted; fall back to the load event
        // unless the image already finished.
        if (!img.complete) {
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }
      }
      images[i] = img;
      if (!cancelled) setLoadedCount((c) => c + 1);
    };

    Promise.all(
      Array.from({ length: FRAME_COUNT }, (_, i) => loadFrame(i))
    ).then(() => {
      if (cancelled) return;
      imagesRef.current = images;
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Once frames are ready, wire scroll → requestAnimationFrame → draw.
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      prevFrameRef.current = index;
    };

    const render = () => {
      rafRef.current = null;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      const frameIndex = Math.min(
        Math.floor(progress * FRAME_COUNT),
        FRAME_COUNT - 1
      );
      if (frameIndex !== prevFrameRef.current) drawFrame(frameIndex);

      // Text labels: fade in progressively at each label's own threshold,
      // over the next 5% of scroll.
      labels.forEach((label, i) => {
        const textOpacity = Math.max(
          0,
          Math.min(1, (progress - label.threshold) / 0.05)
        );
        const g = textRefs.current[i];
        if (g) g.style.opacity = textOpacity.toString();
      });

      // Arrows (dot + line): hold until the components have nearly reached
      // their final positions, then snap all 6 in together over a 3% range.
      const arrowsThreshold = 0.95;
      const arrowOpacity = Math.max(
        0,
        Math.min(1, (progress - arrowsThreshold) / 0.03)
      );
      arrowRefs.current.forEach((arrowEl) => {
        if (arrowEl) arrowEl.style.opacity = arrowOpacity.toString();
      });
    };

    const onScroll = () => {
      // Coalesce bursts of scroll events into a single draw per frame.
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(render);
    };

    // Paint the starting frame, then sync to the current scroll position.
    drawFrame(0);
    render();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [loaded]);

  return (
    <section id="process" ref={sectionRef} className="relative h-[400vh] bg-white">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-4">
        {/* Static intro — scrolls in and out with the section naturally */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold tracking-widest text-red-600">
            THE BORDI SYSTEM
          </p>
          <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-5xl">
            See What&apos;s Inside Your Roof
          </h2>
          <p className="mb-12 text-base text-slate-600">
            Scroll to explore the six layers of a premium GAF roofing system.
          </p>
        </div>

        <div className="relative w-full max-w-5xl">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            aria-label="Animated illustration showing the six layers of a Bordi & Sons premium GAF roofing system: roof deck protection, leak barrier, starter strip shingles, architectural shingles, ridge vent, and ridge cap shingles."
            className="h-auto w-full max-w-full bg-white will-change-transform"
          />

          {/* Scroll-driven labels overlay — shares the canvas's box + viewBox
              so SVG units map 1:1 onto canvas pixels at any width. */}
          <svg
            viewBox="0 0 1284 716"
            preserveAspectRatio="xMidYMid meet"
            overflow="visible"
            className="pointer-events-none absolute inset-0 mx-auto h-auto w-full max-w-5xl"
            aria-hidden="true"
          >
            {labels.map((label, i) => (
              <g key={label.name}>
                {/* Arrow (line + dot) — all six snap in together near the end. */}
                <g
                  ref={(el) => {
                    arrowRefs.current[i] = el;
                  }}
                  opacity={0}
                  style={{ transition: "opacity 300ms ease-out" }}
                >
                  {/* Line first, dot second — so the dot sits in front. */}
                  <line
                    x1={label.dotX}
                    y1={label.dotY}
                    x2={label.lineEndX}
                    y2={label.dotY}
                    stroke="#475569"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <circle cx={label.dotX} cy={label.dotY} r={4} fill="#DC2626" />
                </g>

                {/* Text (title + description) — fades in at this label's threshold. */}
                <g
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
                  opacity={0}
                  style={{ transition: "opacity 200ms ease-out" }}
                >
                  <text
                    x={label.textX}
                    y={label.textY}
                    textAnchor={label.side === "right" ? "start" : "end"}
                    fontSize={11}
                    fontWeight={600}
                    letterSpacing="2"
                    fill="#0F172A"
                  >
                    {label.name}
                  </text>
                  <foreignObject
                    x={label.side === "right" ? label.textX : label.textX - 240}
                    y={label.textY + 6}
                    width="240"
                    height="60"
                    style={{ overflow: "visible" }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#475569",
                        lineHeight: "1.4",
                        textAlign: label.side === "right" ? "left" : "right",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {label.description}
                    </div>
                  </foreignObject>
                </g>
              </g>
            ))}
          </svg>

          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              <p className="text-slate-500">
                Loading roof animation… ({loadedCount} of {FRAME_COUNT})
              </p>
            </div>
          )}
        </div>

        <div className="sr-only">
          This animation illustrates how a Bordi &amp; Sons premium GAF roofing
          system is assembled from the deck up: first the roof deck protection
          (synthetic underlayment), then the leak barrier membrane sealing eaves
          and valleys, followed by starter strip shingles along the edges, the
          architectural shingles across the main field of the roof, a Cobra
          ridge vent along the peak for attic ventilation, and finally the ridge
          cap shingles that seal and finish the ridge line.
        </div>
      </div>
    </section>
  );
}
