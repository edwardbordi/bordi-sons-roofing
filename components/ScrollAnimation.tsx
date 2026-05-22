"use client";

/**
 * Scroll-driven roof animation scaffold. The tall outer container gives
 * scroll "runway"; the inner container pins to the viewport while the
 * canvas paints frames mapped to scroll progress. Canvas + frame-loading
 * logic lands in a follow-up task — for now this renders a placeholder.
 */
export function ScrollAnimation() {
  return (
    <section id="process" className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center px-4">
        <div className="relative w-full max-w-[1280px]">
          <canvas
            width={1280}
            height={720}
            className="h-auto w-full max-w-full rounded-lg bg-slate-800"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-lg font-medium text-slate-300 md:text-2xl">
              Scroll-driven roof animation — canvas implementation coming next
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
