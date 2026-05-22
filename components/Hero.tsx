"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex h-screen flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex max-w-4xl flex-col items-center"
      >
        <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
          The Roof Over Your Family Matters
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-slate-400">
          Premium GAF-certified roofing systems built to protect what&apos;s
          most important.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 bg-amber-500 px-8 text-base font-semibold text-slate-950 hover:bg-amber-400"
          >
            Get a Free Inspection
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-slate-700 bg-transparent px-8 text-base text-slate-100 hover:bg-slate-800 hover:text-white"
          >
            See How We Work
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 text-amber-500"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <ChevronDown className="size-8" />
      </motion.div>
    </section>
  );
}
