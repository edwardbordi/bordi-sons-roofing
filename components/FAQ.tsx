import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

type QA = { q: string; a: string };

// Single source of truth — drives both the accordion and the FAQPage schema.
const FAQS: QA[] = [
  {
    q: "How much does a new roof cost?",
    a: "It depends on the size and pitch of your roof and the materials you choose, so the honest answer is that we'll give you a real number after a free, no-obligation inspection. We walk you through every line item up front — no surprise charges after the contract is signed.",
  },
  {
    q: "How long does a roof replacement take?",
    a: "Most homes are completely torn off and re-roofed in one to two days. Larger or more complex roofs can take a little longer, but we'll give you a clear timeline before we start and keep you updated throughout.",
  },
  {
    q: "What warranty comes with my roof?",
    a: "As a GAF Master Elite contractor, every roof we install is backed by GAF's lifetime material warranty, plus our own workmanship warranty. If something isn't right, it's on us and the manufacturer — never on you.",
  },
  {
    q: "Do you help with storm damage and insurance claims?",
    a: "Yes. We inspect the damage, document everything your insurer needs, and walk you through the claims process so you're not navigating it alone. We've helped many neighbors get the coverage they were owed after a storm.",
  },
  {
    q: "Do I need a full replacement, or can my roof be repaired?",
    a: "Not every roof needs to be replaced. After a free inspection we'll give you a straight assessment — if a repair will genuinely solve the problem, that's what we'll recommend. We'd rather earn your trust than oversell you.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function FAQ() {
  return (
    <section id="faq" className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <FadeIn className="text-center">
          <span className="inline-flex items-center rounded-full bg-white/60 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-slate-600 ring-1 ring-inset ring-slate-900/10 backdrop-blur-md">
            FREQUENTLY ASKED
          </span>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Questions? We&apos;ve got answers.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Straight answers to what homeowners ask us most.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-12 space-y-3">
          {FAQS.map((f, i) => (
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
