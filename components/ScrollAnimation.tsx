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

export function ScrollAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Decoded frames live in a ref so updating them never triggers a re-render.
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const prevFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);

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
            className="h-auto w-full max-w-full bg-white [will-change:transform]"
          />

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
