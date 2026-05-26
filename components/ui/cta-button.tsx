import * as React from "react";

import { cn } from "@/lib/utils";

// Two canonical site button styles. PRIMARY = lead-gen / conversion actions
// (e.g. "Get an Instant Estimate"); SECONDARY = informational / navigational
// actions (e.g. "Watch How It's Built"). All current CTAs are links, so this
// renders an <a>. (Named CtaButton, not Button, to avoid colliding with the
// shadcn primitive in ./button.tsx on case-insensitive filesystems.)
const variantClasses = {
  primary:
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-base shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200 ease-out active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
  // Primary action on a dark/colored background (e.g. the red CTA section):
  // white fill + brand-red text so it stays high-contrast and reads as primary.
  primaryInverse:
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white hover:bg-primary-50 text-primary-600 font-semibold text-base shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200 ease-out active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600",
  secondary:
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white hover:bg-slate-50 text-slate-900 font-semibold text-base border border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-200 ease-out active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
} as const;

type CtaButtonProps = {
  variant?: keyof typeof variantClasses;
} & React.ComponentPropsWithoutRef<"a">;

export function CtaButton({
  variant = "primary",
  className,
  ...props
}: CtaButtonProps) {
  return <a className={cn(variantClasses[variant], className)} {...props} />;
}
