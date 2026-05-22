"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full bg-white">
      {/* TEXT BLOCK */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto max-w-3xl px-6 pt-32 pb-12 text-center md:pt-40 md:pb-16"
      >
        {/* Trust-signal kicker */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <Award className="size-4 text-red-600" />
          <span className="text-xs font-semibold tracking-widest text-slate-600">
            GAF MASTER ELITE CERTIFIED
          </span>
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight text-slate-900 md:text-7xl">
          Italian Craftsmanship. American Homes.
        </h1>
        <p className="mb-8 text-xl text-slate-600">
          Three generations of family pride in every roof. Premium GAF systems
          installed with the precision your home deserves.
        </p>

        <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
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

        {/* Trust indicators — last item, no bottom margin */}
        <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
          <span>Free Inspection</span>
          <span aria-hidden="true">•</span>
          <span>Honest Quotes</span>
          <span aria-hidden="true">•</span>
          <span>No Pressure</span>
        </div>
      </motion.div>

      {/* IMAGE BLOCK — staggered slightly after the text */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        className="mx-auto max-w-5xl px-6 pb-16"
      >
        <Image
          src="/images/hero-image.jpg"
          alt="The Bordi & Sons farmhouse — premium GAF-certified roofing"
          width={1284}
          height={716}
          priority
          className="h-auto w-full"
        />
      </motion.div>

      {/* CHEVRON — "scroll to see more" cue */}
      <div className="flex justify-center pb-12">
        <ChevronDown className="size-8 animate-bounce text-slate-400" aria-hidden="true" />
      </div>
    </section>
  );
}
