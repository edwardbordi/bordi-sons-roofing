import { Award, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

type Reason = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const reasons: Reason[] = [
  {
    icon: Award,
    title: "GAF Master Elite Certified",
    description:
      "Fewer than 2% of roofers earn GAF's top certification — meaning our work meets the manufacturer's strictest standards and unlocks GAF's best warranties.",
  },
  {
    icon: ShieldCheck,
    title: "Lifetime Material Warranty",
    description:
      "Every roof we install comes with GAF's full lifetime warranty on shingles and materials. If something fails, it's on us and the manufacturer — never on you.",
  },
  {
    icon: Users,
    title: "Family-Owned & Operated",
    description:
      "A New Jersey family business where the owner answers the phone and shows up to every job site. The name on the truck is the name on the line.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="trust" className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Built on Trust. Backed by GAF.
          </h2>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <FadeIn
                key={reason.title}
                delay={i * 0.1}
                className="flex flex-col items-center text-center"
              >
                <Icon className="size-12 text-green-700" />
                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {reason.title}
                </h3>
                <p className="mt-3 text-slate-600">{reason.description}</p>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
