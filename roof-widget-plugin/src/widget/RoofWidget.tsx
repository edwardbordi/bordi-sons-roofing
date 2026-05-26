import { useEffect, useRef, useState } from "react";

import { DEFAULT_CONFIG } from "./defaults";
import { FrameLoader } from "./frame-loader";
import { rootStyle } from "./theme";
import type { RoofConfig } from "./types";

// Internal artwork resolution — matches the bundled frame sequence. Not a user
// setting in v1 (it's tied to the artwork), so it stays a module constant.
const CANVAS_WIDTH = 1284;
const CANVAS_HEIGHT = 716;

// Connector geometry (canvas/viewBox units). Layout internals, not user config.
const STUB_LENGTH = 70;
const MOBILE_PILL_WIDTH = 320;
const MOBILE_LEFT_EDGE = -15;
const MOBILE_RIGHT_EDGE = 1300;
const MOBILE_LEFT_LINE_END = 205;
const MOBILE_RIGHT_LINE_END = 1045;
const DESKTOP_BUBBLE_WIDTH = 300;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export type RoofWidgetProps = { config?: RoofConfig };

export function RoofWidget({ config = DEFAULT_CONFIG }: RoofWidgetProps) {
  const { content, labels, animation, layout, frames } = config;

  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<FrameLoader | null>(null);
  const prevFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  // Label subgroups, updated imperatively so scrolling never triggers a render.
  const textRefs = useRef<(SVGGElement | null)[]>([]);
  const arrowRefs = useRef<(SVGGElement | null)[]>([]);
  const mobileRefs = useRef<(SVGGElement | null)[]>([]);
  const mobileArrowRefs = useRef<(SVGGElement | null)[]>([]);

  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [placeholder, setPlaceholder] = useState("");

  // Build the loader and kick it off once the section nears the viewport
  // (progressive loading — frames don't compete with initial page load).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const loader = new FrameLoader(frames, animation.frameCountMode, {
      onProgress: (n) => setLoadedCount(n),
      onReady: () => setLoaded(true),
    });
    loaderRef.current = loader;
    setTotal(loader.total);
    setPlaceholder(loader.placeholderUrl());
    setLoaded(false);
    setStarted(false);
    setLoadedCount(0);
    prevFrameRef.current = -1;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loader.start();
          setStarted(true);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(section);

    return () => io.disconnect();
    // Reload only when the frame source / smoothness actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames.basePath, frames.fullCount, frames.pattern, animation.frameCountMode]);

  // Once frames are ready, wire scroll → requestAnimationFrame → draw.
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const loader = loaderRef.current;
    if (!canvas || !section || !loader) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameCount = loader.total;

    const drawFrame = (index: number) => {
      const img = loader.get(index);
      if (!img || !img.complete || img.naturalWidth === 0) return;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      prevFrameRef.current = index;
    };

    const setAllVisible = () => {
      [textRefs, arrowRefs, mobileRefs, mobileArrowRefs].forEach((r) =>
        r.current.forEach((el) => {
          if (el) el.style.opacity = "1";
        }),
      );
    };

    // Reduced motion: show the finished, fully-labelled frame, no scrubbing.
    if (prefersReducedMotion()) {
      drawFrame(frameCount - 1);
      setAllVisible();
      return;
    }

    const render = () => {
      rafRef.current = null;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      // Play the animation over the first holdStart of scroll; past that, the
      // final frame + all labels hold steady through the rest of the runway.
      const animProgress = clamp(progress / animation.holdStart, 0, 1);
      const frameIndex = Math.min(
        Math.floor(animProgress * frameCount),
        frameCount - 1,
      );
      if (frameIndex !== prevFrameRef.current) drawFrame(frameIndex);

      // Labels stream in as the build plays (each fades over 5% of scroll past
      // its threshold). Connectors are held until near the end.
      labels.forEach((label, i) => {
        const textOpacity = clamp((animProgress - label.threshold) / 0.05, 0, 1);
        const g = textRefs.current[i];
        if (g) g.style.opacity = textOpacity.toString();
        const m = mobileRefs.current[i];
        if (m) m.style.opacity = textOpacity.toString();
      });

      const arrowOpacity = clamp(
        (animProgress - animation.arrowThreshold) / 0.05,
        0,
        1,
      );
      arrowRefs.current.forEach((el) => {
        if (el) el.style.opacity = arrowOpacity.toString();
      });

      const mobileArrowOpacity = clamp(
        (animProgress - animation.mobileArrowThreshold) / 0.05,
        0,
        1,
      );
      mobileArrowRefs.current.forEach((el) => {
        if (el) el.style.opacity = mobileArrowOpacity.toString();
      });
    };

    const onScroll = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(render);
    };

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
  }, [loaded, labels, animation]);

  const fade = `opacity ${animation.fadeMs}ms ease-out`;
  const lineStyle = { stroke: "var(--rsw-color-line)" } as const;
  const dotStyle = { fill: "var(--rsw-color-dot)" } as const;
  const fontStyle = { fontFamily: "var(--rsw-font-family)" } as const;

  return (
    <section style={rootStyle(config)}>
      <div ref={sectionRef} className="relative" style={{ height: `${animation.runwayVh}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-4">
          {/* Intro copy */}
          <div className="mx-auto max-w-2xl text-center">
            {content.eyebrow.show && (
              <p className="mb-4 text-xs font-semibold tracking-widest text-[var(--rsw-eyebrow-color)]">
                {content.eyebrow.text}
              </p>
            )}
            <h2 className="mb-3 text-3xl font-bold text-[var(--rsw-heading-color)] md:text-5xl">
              {content.heading.text}
            </h2>
            {content.subhead.show && (
              <p className="mb-12 text-base text-[var(--rsw-subhead-color)]">
                {content.subhead.text}
              </p>
            )}
          </div>

          {/* Canvas + label overlays */}
          <div className="relative w-full" style={{ maxWidth: `${layout.maxWidth}px` }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              aria-label="Animated illustration showing the layers of a complete roofing system, assembled from the deck up."
              className="h-auto w-full max-w-full bg-[var(--rsw-section-bg)] will-change-transform"
            />

            {/* Static placeholder (first frame) until preload completes. */}
            {!loaded && placeholder && (
              <img
                src={placeholder}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}

            {/* Mobile-only pill overlay */}
            {layout.mobilePills && (
              <svg
                viewBox="0 0 1284 716"
                preserveAspectRatio="xMidYMid meet"
                overflow="visible"
                className="pointer-events-none absolute inset-0 h-auto w-full md:hidden"
                aria-hidden="true"
              >
                {labels.map((label, i) => {
                  const isRight = label.side === "right";
                  const foreignX = isRight
                    ? MOBILE_RIGHT_EDGE - MOBILE_PILL_WIDTH
                    : MOBILE_LEFT_EDGE;
                  const lineEndX = isRight ? MOBILE_RIGHT_LINE_END : MOBILE_LEFT_LINE_END;
                  const stubDirection = Math.sign(lineEndX - label.dotX);
                  const stubX = label.dotX + stubDirection * STUB_LENGTH;
                  return (
                    <g key={label.title}>
                      <g
                        ref={(el) => {
                          mobileArrowRefs.current[i] = el;
                        }}
                        opacity={0}
                        style={{ transition: fade }}
                      >
                        <polyline
                          points={`${label.dotX},${label.dotY} ${stubX},${label.dotY} ${lineEndX},${label.textY}`}
                          fill="none"
                          style={lineStyle}
                          strokeWidth={1}
                          strokeDasharray="3 3"
                        />
                        <circle
                          cx={label.dotX}
                          cy={label.dotY}
                          r={7}
                          style={dotStyle}
                          stroke="#ffffff"
                          strokeWidth={0.75}
                        />
                      </g>
                      <g
                        ref={(el) => {
                          mobileRefs.current[i] = el;
                        }}
                        opacity={0}
                        style={{ transition: fade }}
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
                              className="inline-flex items-center gap-2.5 rounded-3xl bg-white/65 px-3.5 py-2.5 backdrop-blur-md"
                              style={{
                                ...fontStyle,
                                // Ring + drop shadow set inline — Tailwind's ring/
                                // shadow utilities rely on @property vars that don't
                                // apply inside the Shadow DOM (same cause as the
                                // desktop bubble border).
                                boxShadow:
                                  "0 0 0 1px rgba(15,23,42,0.15), 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                              }}
                            >
                              <span
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--rsw-color-primary)] text-[20px] font-bold text-white"
                                style={{
                                  boxShadow:
                                    "0 0 0 2px rgba(255,255,255,0.8), 0 1px 2px 0 rgba(0,0,0,0.05)",
                                }}
                              >
                                {label.step}
                              </span>
                              <span
                                className="text-[24px] leading-tight font-bold text-[var(--rsw-bubble-text)]"
                                style={{
                                  letterSpacing: "0.03em",
                                  maxWidth: isRight ? "212px" : "162px",
                                  overflowWrap: "break-word",
                                }}
                              >
                                {label.title}
                              </span>
                            </span>
                          </div>
                        </foreignObject>
                      </g>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Desktop bubble overlay */}
            {layout.desktopLabels && (
              <svg
                viewBox="0 0 1284 716"
                preserveAspectRatio="xMidYMid meet"
                overflow="visible"
                className="pointer-events-none absolute inset-0 hidden h-auto w-full md:block"
                aria-hidden="true"
              >
                {labels.map((label, i) => {
                  const stubDirection = Math.sign(label.lineEndX - label.dotX);
                  const stubX = label.dotX + stubDirection * STUB_LENGTH;
                  return (
                    <g key={label.title}>
                      <g
                        ref={(el) => {
                          arrowRefs.current[i] = el;
                        }}
                        opacity={0}
                        style={{ transition: fade }}
                      >
                        <polyline
                          points={`${label.dotX},${label.dotY} ${stubX},${label.dotY} ${label.lineEndX},${label.textY}`}
                          fill="none"
                          style={lineStyle}
                          strokeWidth={1}
                          strokeDasharray="3 3"
                        />
                        <circle cx={label.dotX} cy={label.dotY} r={4} style={dotStyle} />
                      </g>

                      <g
                        ref={(el) => {
                          textRefs.current[i] = el;
                        }}
                        opacity={0}
                        style={{ transition: fade }}
                      >
                        <foreignObject
                          x={label.side === "right" ? label.textX : label.textX - DESKTOP_BUBBLE_WIDTH}
                          y={label.textY - 50}
                          width={DESKTOP_BUBBLE_WIDTH}
                          height={100}
                          style={{ overflow: "visible" }}
                        >
                          <div style={{ display: "flex", height: "100%", alignItems: "center" }}>
                            <div
                              className="flex w-full items-start gap-2.5 rounded-xl bg-[var(--rsw-bubble-bg)] px-3 py-2.5"
                              style={{
                                ...fontStyle,
                                // Border + shadow set inline (not Tailwind's
                                // `border`/`shadow-*`): they rely on @property vars
                                // that don't apply inside the Shadow DOM.
                                borderWidth: "1px",
                                borderStyle: "solid",
                                borderColor: "var(--rsw-bubble-border)",
                                boxShadow:
                                  "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
                              }}
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--rsw-color-primary)] text-xs font-bold text-white">
                                {label.step}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="text-[12px] leading-tight font-bold tracking-wider text-[var(--rsw-bubble-text)] uppercase">
                                  {label.title}
                                </div>
                                <div className="mt-1 text-[11px] leading-snug text-[var(--rsw-subhead-color)]">
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
            )}

            {started && !loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70">
                <svg
                  className="h-8 w-8 animate-spin text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="text-slate-500">
                  Loading roof animation… ({loadedCount} of {total})
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
