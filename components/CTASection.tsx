import Image from "next/image";
import { CtaButton } from "@/components/ui/cta-button";
import { FadeIn } from "@/components/FadeIn";
import { site } from "@/config/site.config";

export function CTASection({
  heading,
  subhead,
  ctaLabel,
  truckAlt,
}: {
  heading: string;
  subhead: string;
  ctaLabel: string;
  truckAlt: string;
}) {
  return (
    <section id="cta" className="bg-primary-600 px-4 py-24 sm:px-6 lg:px-8">
      <FadeIn className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-10">
        {/* Truck — left column on desktop, stacked on top on mobile. Vertically
            centered, with a soft white glow so it stands out on the red. */}
        <div className="flex justify-center">
          <Image
            src="/images/truck-t.png"
            alt={truckAlt}
            width={3371}
            height={1663}
            className="h-auto w-full max-w-2xl drop-shadow-[0_0_32px_rgba(255,255,255,0.65)]"
          />
        </div>

        {/* Text — right column on desktop, below the truck on mobile.
            Left-aligned within the column on desktop. */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h2 className="text-4xl font-bold text-white md:text-5xl">{heading}</h2>
          <p className="mt-4 text-lg text-primary-100">{subhead}</p>
          <CtaButton
            variant="primaryInverse"
            href={site.estimateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8"
          >
            {ctaLabel}
          </CtaButton>
        </div>
      </FadeIn>
    </section>
  );
}
