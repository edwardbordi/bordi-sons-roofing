"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Layer 1 — full-bleed farmhouse background */}
      <Image
        src="/images/hero-image.jpg"
        alt="The Bordi & Sons farmhouse — premium GAF-certified roofing"
        fill
        priority
        sizes="100vw"
        className="object-cover object-bottom"
      />

      {/* Layer 1.5 — readability scrim: dense white at top, clear over the lawn */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[70%] bg-gradient-to-b from-white/85 via-white/50 to-transparent" />

      {/* Layer 2 — text floating in the upper white sky */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-32 text-center md:pt-40"
      >
        {/* Trust-signal kicker */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <Award className="size-4 text-red-600" />
          <span className="text-xs font-semibold tracking-widest text-slate-600">
            GAF MASTER ELITE CERTIFIED
          </span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-7xl">
          Italian Craftsmanship. American Homes.
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-slate-600">
          Three generations of family pride in every roof. Premium GAF systems
          installed with the precision your home deserves.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 bg-red-600 px-8 text-base font-semibold text-white hover:bg-red-700"
          >
            Get a Free Inspection
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-slate-300 bg-transparent px-8 text-base text-slate-900 hover:bg-slate-100 hover:text-slate-900"
          >
            <a href="#process">Watch How It&apos;s Built</a>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
          <span>Free Inspection</span>
          <span aria-hidden="true">•</span>
          <span>Honest Quotes</span>
          <span aria-hidden="true">•</span>
          <span>No Pressure</span>
        </div>
      </motion.div>

      {/* Layer 3 — scroll indicator over the lawn */}
      <div className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 text-slate-700">
        <ChevronDown className="size-8 animate-bounce" aria-hidden="true" />
      </div>
    </section>
  );
}
