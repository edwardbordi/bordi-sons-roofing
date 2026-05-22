import { Shield, Droplets, Layers, Home, Wind, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/FadeIn";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Shield,
    title: "Roof Deck Protection",
    description:
      "Synthetic underlayment forms the foundation. Protects your home from water infiltration before shingles are even installed.",
  },
  {
    icon: Droplets,
    title: "Leak Barrier",
    description:
      "Rubberized membrane seals high-risk areas like eaves and valleys. Stops ice dams and wind-driven rain in their tracks.",
  },
  {
    icon: Layers,
    title: "Starter Strip Shingles",
    description:
      "Premium pre-cut strips create the first sealed row. Eliminates blow-offs and ensures every shingle above sits perfectly.",
  },
  {
    icon: Home,
    title: "Architectural Shingles",
    description:
      "Dimensional charcoal shingles deliver curb appeal and decades of protection. The visible heart of your roofing system.",
  },
  {
    icon: Wind,
    title: "Cobra Ridge Vent",
    description:
      "Continuous attic ventilation regulates temperature and moisture. Extends your roof's life by years.",
  },
  {
    icon: Crown,
    title: "Ridge Cap Shingles",
    description:
      "Premium ridge caps seal the peak. The finishing touch that protects against wind and water at the most vulnerable spot on your roof.",
  },
];

export function Features() {
  return (
    <section id="services" className="bg-stone-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Anatomy of a Premium Roof
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Every layer matters. Here&apos;s what&apos;s protecting your home.
          </p>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={i * 0.05}>
                <Card className="h-full border border-slate-200 bg-white text-slate-900 shadow-sm ring-0">
                  <CardHeader>
                    <Icon className="size-10 text-red-600" />
                    <CardTitle className="mt-4 text-xl font-semibold text-slate-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
