"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { site } from "@/config/site.config";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-white md:min-h-screen"
    >
      {/* TEXT BLOCK — upper-left quadrant on desktop (over the sky), or stacked
          on top (over white) on mobile. Left-aligned throughout. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-20 max-w-xl px-8 pt-28 pb-10 text-left sm:px-12 md:pb-16 lg:max-w-[52%] lg:px-20 lg:pt-36 xl:px-28"
      >
        {/* Trust-signal kicker */}
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-white/60 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-slate-600 ring-1 ring-inset ring-slate-900/10 backdrop-blur-md">
            FAMILY-OWNED ROOFING · NEW JERSEY
          </span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Roofing you don&apos;t have to worry about.
        </h1>
        <p className="mb-8 max-w-xl text-lg text-slate-700 sm:text-xl">
          Honest pricing. Premium materials. A Bordi on every job, because our
          name is on the line. No high-pressure sales. No surprises after the
          contract is signed.
        </p>

        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row">
          <CtaButton
            variant="primary"
            href={site.estimateUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get an Instant Estimate
          </CtaButton>
          <CtaButton variant="secondary" href="#process">
            Watch How It&apos;s Built
          </CtaButton>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>Instant Estimate</span>
          <span aria-hidden="true">•</span>
          <span>Honest Pricing</span>
          <span aria-hidden="true">•</span>
          <span>No Pressure</span>
        </div>
      </motion.div>

      {/* SCENE IMAGE.
          - Mobile: an in-flow banner below the text (full scene visible).
          - Desktop (md+): a full-bleed background filling the section, with the
            truck/family/house/sign anchored at the bottom and sky extending up. */}
      <div className="relative z-0 aspect-video w-full md:absolute md:inset-0 md:aspect-auto md:h-auto">
        <Image
          src="/images/hero-scene.jpg"
          alt="Bordi & Sons family roofing project — finished home with family admiring the new roof"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom opacity-50"
        />
      </div>

      {/* White wash for legibility — DESKTOP ONLY. A left→right wash keeps the
          text column readable over the truck/sky while leaving the house and
          family on the right crisp; a softer top→bottom wash lifts the very top. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,0.99) 0%, rgba(255,255,255,0.95) 18%, rgba(255,255,255,0.6) 34%, rgba(255,255,255,0) 52%), linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 42%)",
        }}
      />

      {/* Bottom fade into the next (white) section for a clean handoff. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-24 bg-linear-to-b from-transparent to-white"
      />

      {/* CHEVRON — scroll cue. Desktop only (on mobile the image sits here). */}
      <ChevronDown
        className="absolute bottom-6 left-1/2 z-20 hidden size-8 -translate-x-1/2 animate-bounce text-slate-400 md:block"
        aria-hidden="true"
      />
    </section>
  );
}
