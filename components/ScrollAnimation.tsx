"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const FRAME_COUNT = 151;
// Internal canvas resolution — matches the extracted source frames (1284x716).
const CANVAS_WIDTH = 1284;
const CANVAS_HEIGHT = 716;

// Fraction of the scroll runway used to play the animation. Past this point the
// fully-exploded final frame (with all labels) holds steady for the remaining
// tail of the runway, so the viewer dwells on it before the section scrolls by.
const HOLD_START = 0.67;

// Connector lines leave the dot with a short horizontal stub, then ramp
// diagonally to the label endpoint.
const STUB_LENGTH = 70;

// Mobile pill overlay: foreignObject box width (in SVG units). Titles wrap onto
// multiple lines within this cap so they never run off the screen edges. Units
// are in the 1284-wide viewBox, so they scale down with the canvas on a phone.
const MOBILE_PILL_WIDTH = 320;

// Mobile pills are aligned on their OUTER edges: left pills flush-left at
// MOBILE_LEFT_EDGE, right pills flush-right at MOBILE_RIGHT_EDGE (content-width,
// so their inner edges are ragged). Each connector ends at a fixed inner anchor
// per side, near where the pills' inner edges fall. Units are viewBox units.
const MOBILE_LEFT_EDGE = -15;
const MOBILE_RIGHT_EDGE = 1300;
const MOBILE_LEFT_LINE_END = 205;
const MOBILE_RIGHT_LINE_END = 1045;

// Desktop label bubble: a rounded card holding the numbered circle, title, and
// description. Anchored with its near edge at textX, growing away from the dot.
const DESKTOP_BUBBLE_WIDTH = 300;

const framePath = (frame: number) =>
  `/frames/frame_${String(frame).padStart(4, "0")}.webp`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type LabelConfig = {
  name: string;
  description: string;
  step: number; // installation sequence (a roof is built deck-up)
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
    step: 6,
    dotX: 680, dotY: 70, textX: 1080, textY: 70, lineEndX: 1070, side: "right", threshold: 0.69,
  },
  {
    name: "RIDGE VENT",
    description:
      "Continuous attic ventilation regulates temperature and moisture, releasing trapped heat. Extends roof life by years.",
    step: 5,
    dotX: 490, dotY: 70, textX: 210, textY: 58, lineEndX: 220, side: "left", threshold: 0.56,
  },
  {
    name: "ARCHITECTURAL SHINGLES",
    description:
      "Beautiful dimensional shingles — the striking, visible heart of your roofing system. Available in dozens of colors to match any taste or home, and built for decades of dependable protection.",
    step: 4,
    dotX: 720, dotY: 137, textX: 1080, textY: 187, lineEndX: 1070, side: "right", threshold: 0.43,
  },
  {
    name: "STARTER STRIP SHINGLES",
    description:
      "Premium pre-cut strips create the first sealed row at the eaves. Locks every shingle above firmly in place, preventing blow-offs.",
    step: 3,
    dotX: 620, dotY: 210, textX: 210, textY: 322, lineEndX: 220, side: "left", threshold: 0.30,
  },
  {
    name: "LEAK BARRIER",
    description:
      "Self-adhering rubberized membrane along vulnerable eaves and valleys. Stops ice dams and wind-driven rain dead in their tracks.",
    step: 2,
    dotX: 720, dotY: 235, textX: 1080, textY: 335, lineEndX: 1070, side: "right", threshold: 0.17,
  },
  {
    name: "ROOF DECK PROTECTION",
    description:
      "Synthetic underlayment is your roof's foundation. Protects your home from water and weather before shingles are even installed.",
    step: 1,
    dotX: 430, dotY: 140, textX: 210, textY: 190, lineEndX: 220, side: "left", threshold: 0.04,
  },
];

export function ScrollAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Decoded frames live in a ref so updating them never triggers a re-render.
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const prevFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  // Label subgroups, updated imperatively to avoid re-renders on scroll.
  const textRefs = useRef<(SVGGElement | null)[]>([]);
  const arrowRefs = useRef<(SVGGElement | null)[]>([]);
  // Mobile-only pill labels, index-parallel to textRefs — faded in imperatively
  // like the desktop labels.
  const mobileRefs = useRef<(SVGGElement | null)[]>([]);
  // Mobile connector line + dot per label — revealed at the end (like the
  // desktop arrows) so they only point once the layers have settled.
  const mobileArrowRefs = useRef<(SVGGElement | null)[]>([]);

  const [loaded, setLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  // Frames are heavy (~150 images). Hold off fetching them until the section
  // is approaching the viewport so they don't compete with the hero LCP.
  const [shouldLoad, setShouldLoad] = useState(false);

  // Trigger the preload once the section nears the viewport (or immediately if
  // IntersectionObserver isn't available).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      // Start fetching ~600px before the section scrolls into view.
      { rootMargin: "0px 0px 600px 0px" }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Preload + decode every frame in parallel, once gated in by shouldLoad.
  useEffect(() => {
    if (!shouldLoad) return;
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
  }, [shouldLoad]);

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
      // Play the full animation over the first HOLD_START of the scroll; beyond
      // that, animProgress pins at 1 so the final frame and labels hold steady
      // through the remaining runway before the section scrolls away.
      const animProgress = clamp(progress / HOLD_START, 0, 1);
      const frameIndex = Math.min(
        Math.floor(animProgress * FRAME_COUNT),
        FRAME_COUNT - 1
      );
      if (frameIndex !== prevFrameRef.current) drawFrame(frameIndex);

      // Text labels (title + description): each fades in over the 5% of scroll
      // past its threshold. Thresholds are spread from the very start (0.04) and
      // ordered by install step (deck first → ridge cap last), so the labels
      // stream in 1→6 as the animation plays. Only the text shows during the
      // build-up — the connector arrows are held until the end (below).
      labels.forEach((label, i) => {
        const textOpacity = Math.max(
          0,
          Math.min(1, (animProgress - label.threshold) / 0.05)
        );
        const g = textRefs.current[i];
        if (g) g.style.opacity = textOpacity.toString();
        // Mobile pill label fades in on the same per-layer threshold.
        const m = mobileRefs.current[i];
        if (m) m.style.opacity = textOpacity.toString();
      });

      // Arrows (dotted line + dot): held hidden through the whole build-up and
      // faded in together only at the very end, once the roof is fully exploded
      // — so the dots land on settled layers instead of pointing at empty space
      // while the labels are still streaming in.
      const arrowsThreshold = 0.88;
      const arrowOpacity = Math.max(
        0,
        Math.min(1, (animProgress - arrowsThreshold) / 0.05)
      );
      arrowRefs.current.forEach((arrowEl) => {
        if (arrowEl) arrowEl.style.opacity = arrowOpacity.toString();
      });
      // Mobile connector lines + dots reveal a touch earlier than the desktop
      // arrows — so the user catches them sliding in just before each layer
      // reaches its final position, rather than only once fully settled.
      const mobileArrowsThreshold = 0.82;
      const mobileArrowOpacity = Math.max(
        0,
        Math.min(1, (animProgress - mobileArrowsThreshold) / 0.05)
      );
      mobileArrowRefs.current.forEach((el) => {
        if (el) el.style.opacity = mobileArrowOpacity.toString();
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
    <section id="process" className="bg-white">
      {/* Scroll runway (400vh). The canvas animation is driven by this element's
          rect — sectionRef lives here so the desktop scroll experience is
          unchanged. The mobile card list sits AFTER this runway so the pinned
          canvas never covers it. */}
      <div ref={sectionRef} className="relative h-[550vh]">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-4">
        {/* Static intro — scrolls in and out with the section naturally */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/60 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-slate-600 ring-1 ring-inset ring-slate-900/10 backdrop-blur-md">
            HOW WE BUILD A ROOF
          </span>
          <h2 className="mt-5 mb-3 text-3xl font-bold text-slate-900 md:text-5xl">
            Six layers. Zero shortcuts.
          </h2>
          <p className="mb-12 text-base text-slate-600">
            Every Bordi roof includes the complete GAF system — installed
            exactly as the manufacturer specifies. No corner-cutting, no
            surprises.
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

          {/* Mobile-only label overlay — mirrors the desktop SVG structure but
              renders compact red pills (numbered chip + title, no description)
              instead of floating text. Shares the canvas box + viewBox so the
              dotX/dotY/textX coordinates map 1:1. Hidden on desktop, where the
              text overlay takes over. */}
          <svg
            viewBox="0 0 1284 716"
            preserveAspectRatio="xMidYMid meet"
            overflow="visible"
            className="pointer-events-none absolute inset-0 mx-auto h-auto w-full max-w-5xl md:hidden"
            aria-hidden="true"
          >
            {labels.map((label, i) => {
              // Pills align on their outer edges (left flush-left, right
              // flush-right); each connector ends at a fixed inner anchor per
              // side. Same stub + diagonal geometry otherwise.
              const isRight = label.side === "right";
              const foreignX = isRight
                ? MOBILE_RIGHT_EDGE - MOBILE_PILL_WIDTH
                : MOBILE_LEFT_EDGE;
              const lineEndX = isRight
                ? MOBILE_RIGHT_LINE_END
                : MOBILE_LEFT_LINE_END;
              const stubDirection = Math.sign(lineEndX - label.dotX);
              const stubX = label.dotX + stubDirection * STUB_LENGTH;
              return (
                <g key={label.name}>
                  {/* Connector line + dot — revealed only at the end (like the
                      desktop arrows) so they point at settled layers, not at
                      shingles still mid-animation. */}
                  <g
                    ref={(el) => {
                      mobileArrowRefs.current[i] = el;
                    }}
                    opacity={0}
                    style={{ transition: "opacity 600ms ease-out" }}
                  >
                    {/* Stub + diagonal connector — dark slate, matching desktop. */}
                    <polyline
                      points={`${label.dotX},${label.dotY} ${stubX},${label.dotY} ${lineEndX},${label.textY}`}
                      fill="none"
                      stroke="#475569"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    {/* Red dot on the layer, with a thin white ring. */}
                    <circle
                      cx={label.dotX}
                      cy={label.dotY}
                      r={7}
                      fill="#dc2626"
                      stroke="#ffffff"
                      strokeWidth={0.75}
                    />
                  </g>
                  {/* Pill: numbered chip + uppercase title (no description).
                      Flush-left on the left side, flush-right on the right.
                      Fades in at this label's per-layer threshold. */}
                  <g
                    ref={(el) => {
                      mobileRefs.current[i] = el;
                    }}
                    opacity={0}
                    style={{ transition: "opacity 600ms ease-out" }}
                  >
                  <foreignObject
                    x={foreignX}
                    y={label.textY - 55}
                    width={MOBILE_PILL_WIDTH}
                    height={110}
                    style={{ overflow: "visible" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: isRight ? "flex-end" : "flex-start",
                      }}
                    >
                      <span
                        className="inline-flex items-center gap-2.5 rounded-3xl bg-white/65 px-3.5 py-2.5 shadow-lg ring-1 ring-slate-900/15 backdrop-blur-md"
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-[20px] font-bold text-white shadow-sm ring-2 ring-white/80">
                          {label.step}
                        </span>
                        <span
                          className="text-[24px] leading-tight font-bold text-slate-900"
                          style={{
                            letterSpacing: "0.03em",
                            maxWidth: label.side === "right" ? "212px" : "162px",
                            overflowWrap: "break-word",
                          }}
                        >
                          {label.name}
                        </span>
                      </span>
                    </div>
                  </foreignObject>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Scroll-driven labels overlay — shares the canvas's box + viewBox
              so SVG units map 1:1 onto canvas pixels at any width. */}
          <svg
            viewBox="0 0 1284 716"
            preserveAspectRatio="xMidYMid meet"
            overflow="visible"
            className="pointer-events-none absolute inset-0 mx-auto hidden h-auto w-full max-w-5xl md:block"
            aria-hidden="true"
          >
            {labels.map((label, i) => {
              // The stub leaves the dot in the label's direction (left/right);
              // the line then ramps diagonally to (lineEndX, textY).
              const stubDirection = Math.sign(label.lineEndX - label.dotX);
              const stubX = label.dotX + stubDirection * STUB_LENGTH;
              return (
                <g key={label.name}>
                {/* Arrow (line + dot) — all six snap in together near the end. */}
                <g
                  ref={(el) => {
                    arrowRefs.current[i] = el;
                  }}
                  opacity={0}
                  style={{ transition: "opacity 300ms ease-out" }}
                >
                  {/* Stub + diagonal connector: dot → short horizontal stub
                      (grounds the line to the house) → diagonal ramp to the
                      label. Line first, dot second — so the dot sits in front.
                      (textY === dotY ⇒ the second segment is horizontal too.) */}
                  <polyline
                    points={`${label.dotX},${label.dotY} ${stubX},${label.dotY} ${label.lineEndX},${label.textY}`}
                    fill="none"
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
                  <foreignObject
                    x={
                      label.side === "right"
                        ? label.textX
                        : label.textX - DESKTOP_BUBBLE_WIDTH
                    }
                    y={label.textY - 50}
                    width={DESKTOP_BUBBLE_WIDTH}
                    height={100}
                    style={{ overflow: "visible" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="flex w-full items-start gap-2.5 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm"
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                          {label.step}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[12px] leading-tight font-bold tracking-wider text-slate-900 uppercase">
                            {label.name}
                          </div>
                          <div className="mt-1 text-[11px] leading-snug text-slate-600">
                            {label.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              </g>
              );
            })}
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
      </div>
    </section>
  );
}
