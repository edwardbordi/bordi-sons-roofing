import Image from "next/image";
import { CtaButton } from "@/components/ui/cta-button";
import { FadeIn } from "@/components/FadeIn";

export function CTASection() {
  return (
    <section id="cta" className="bg-red-600 px-4 py-24 sm:px-6 lg:px-8">
      <FadeIn className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-10">
        {/* Truck — left column on desktop, stacked on top on mobile. Vertically
            centered, with a soft white glow so it stands out on the red. */}
        <div className="flex justify-center">
          <Image
            src="/images/truck-t.png"
            alt="Bordi & Sons Roofing service truck"
            width={3371}
            height={1663}
            className="h-auto w-full max-w-2xl drop-shadow-[0_0_32px_rgba(255,255,255,0.65)]"
          />
        </div>

        {/* Text — right column on desktop, below the truck on mobile.
            Left-aligned within the column on desktop. */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Ready When You Are.
          </h2>
          <p className="mt-4 text-lg text-red-100">
            Get an honest estimate in minutes, not days. No phone calls, no
            pressure, no surprises.
          </p>
          <CtaButton
            variant="primaryInverse"
            href="https://demo.sitescan.controlsuite.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8"
          >
            Get an Instant Estimate
          </CtaButton>
        </div>
      </FadeIn>
    </section>
  );
}
