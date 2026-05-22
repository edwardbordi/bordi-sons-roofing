"use client";

import { motion } from "framer-motion";
import { Award, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex max-w-4xl flex-col items-center"
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

      <motion.div
        className="absolute bottom-10 text-slate-400"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <ChevronDown className="size-8" />
      </motion.div>
    </section>
  );
}
