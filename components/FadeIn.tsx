"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds. */
  delay?: number;
};

/**
 * Reusable scroll-triggered fade + rise. Wrap any block to reveal it
 * once as it enters the viewport. Client boundary for Framer Motion's
 * whileInView so the sections that use it can stay server components.
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
