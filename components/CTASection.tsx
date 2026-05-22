import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/FadeIn";

export function CTASection() {
  return (
    <section className="bg-slate-900 px-4 py-24 sm:px-6 lg:px-8">
      <FadeIn className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="text-4xl font-bold text-white md:text-5xl">
          Ready to Protect Your Home?
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Free inspection. Honest pricing. Premium materials. No pressure.
        </p>
        <Button
          size="lg"
          className="mt-8 h-12 bg-amber-500 px-8 text-base font-semibold text-slate-950 hover:bg-amber-400"
        >
          Get Your Free Inspection
        </Button>
      </FadeIn>
    </section>
  );
}
