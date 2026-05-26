import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/FadeIn";
import type { FeatureItem } from "@/content/home";

export function Features({
  heading,
  subhead,
  items,
}: {
  heading: string;
  subhead: string;
  items: FeatureItem[];
}) {
  return (
    <section id="features" className="bg-stone-50 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">{heading}</h2>
          <p className="mt-4 text-lg text-slate-600">{subhead}</p>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={i * 0.05}>
                <Card className="h-full border border-slate-200 bg-white text-slate-900 shadow-sm ring-0">
                  <CardHeader>
                    <Icon className="size-10 text-primary-600" />
                    <CardTitle className="mt-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                        {i + 1}
                      </span>
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
