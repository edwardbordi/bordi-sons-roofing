import { Star } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import type { Testimonial } from "@/content/home";

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function TestimonialCard({ t, duplicate }: { t: Testimonial; duplicate?: boolean }) {
  return (
    <figure
      aria-hidden={duplicate}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <Stars />
        <span className="text-sm font-medium text-slate-400">5.0/5</span>
      </div>
      <blockquote className="text-[15px] leading-relaxed text-slate-700">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 text-sm font-semibold text-slate-900">
        {t.name}
        <span className="font-normal text-slate-500"> · {t.town}</span>
      </figcaption>
    </figure>
  );
}

/**
 * One vertically-scrolling column. The card list is rendered twice so the
 * animation can translate by exactly one set height (-50% / +50%) and loop
 * with no visible seam. `direction` picks the keyframes (see the <style> in
 * the section): "up" slides toward the top, "down" toward the bottom.
 */
function MarqueeColumn({
  items,
  direction,
}: {
  items: Testimonial[];
  direction: "up" | "down";
}) {
  const loop = [...items, ...items];
  return (
    <div className={`tm-col ${direction === "up" ? "tm-up" : "tm-down"} flex flex-col gap-4`}>
      {loop.map((t, i) => (
        <TestimonialCard key={i} t={t} duplicate={i >= items.length} />
      ))}
    </div>
  );
}

// Soft fade at the top and bottom of the scroll window (matches the reference).
const FADE_MASK =
  "linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)";

export function Testimonials({
  eyebrow,
  heading,
  subhead,
  columnA,
  columnB,
}: {
  eyebrow: string;
  heading: string;
  subhead: string;
  columnA: Testimonial[];
  columnB: Testimonial[];
}) {
  return (
    <section id="testimonials" className="overflow-hidden bg-stone-50 px-4 py-24 sm:px-6 lg:px-8">
      {/* Marquee animation. Defined here (not Tailwind) so the seamless loop,
          hover-pause, and reduced-motion handling live in one place. */}
      <style>{`
        @keyframes tmUp { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes tmDown { from { transform: translateY(-50%); } to { transform: translateY(0); } }
        .tm-col { will-change: transform; }
        .tm-up { animation: tmUp 48s linear infinite; }
        .tm-down { animation: tmDown 55s linear infinite; }
        .tm-col:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .tm-up, .tm-down { animation: none; }
        }
      `}</style>

      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
        {/* Heading — left side. */}
        <div className="lg:w-[40%]">
          <FadeIn>
            <span className="inline-flex items-center rounded-full bg-white/60 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-slate-600 ring-1 ring-inset ring-slate-900/10 backdrop-blur-md">
              {eyebrow}
            </span>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {heading}
            </h2>
            <p className="mt-5 max-w-md text-lg text-slate-600">{subhead}</p>
          </FadeIn>
        </div>

        {/* Two scrolling columns — left slides down, right slides up. */}
        <div className="lg:w-[60%]">
          <div
            className="relative grid h-[600px] grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 lg:h-[660px]"
            style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
          >
            <MarqueeColumn items={columnA} direction="down" />
            <div className="hidden sm:block">
              <MarqueeColumn items={columnB} direction="up" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
