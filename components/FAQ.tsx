import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import type { QA } from "@/content/home";

export function FAQ({
  eyebrow,
  heading,
  subhead,
  items,
}: {
  eyebrow: string;
  heading: string;
  subhead: string;
  items: QA[];
}) {
  // FAQPage structured data, generated from the same items.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <FadeIn className="text-center">
          <span className="inline-flex items-center rounded-full bg-white/60 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-slate-600 ring-1 ring-inset ring-slate-900/10 backdrop-blur-md">
            {eyebrow}
          </span>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">{subhead}</p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12 space-y-3">
          {items.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group rounded-xl border border-slate-200 bg-white shadow-sm transition-colors open:border-slate-300"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="px-5 pb-5 text-slate-600">{f.a}</div>
            </details>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
