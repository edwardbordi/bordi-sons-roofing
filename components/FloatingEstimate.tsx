"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { site } from "@/config/site.config";

/**
 * Persistent "Instant Estimate" control. Stays clear of the top navbar and the
 * right-edge scroll rail: a pill at bottom-right on desktop, a slim full-width
 * bar at the bottom on mobile. It appears once the hero has scrolled away (so
 * it isn't redundant with the hero CTA) and then stays visible all the way
 * down the page, including at the bottom.
 */
export function FloatingEstimate() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    // Show once the hero is fully scrolled out of view.
    const hero = document.getElementById("hero");
    if (!hero) {
      setPastHero(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => setPastHero(!entries[0].isIntersecting),
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const visible = pastHero;

  return (
    <>
      {/* Desktop — floating pill, bottom-right (clear of the scroll rail). */}
      <div
        className={`fixed bottom-6 right-6 z-40 hidden transition-all duration-300 md:block ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <CtaButton
          variant="primary"
          href={site.estimateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shadow-lg hover:shadow-xl"
          tabIndex={visible ? undefined : -1}
          aria-hidden={!visible}
        >
          <Zap className="size-4" aria-hidden="true" />
          Get an Instant Estimate
        </CtaButton>
      </div>

      {/* Mobile — slim full-width bottom bar. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm transition-transform duration-300 md:hidden ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <CtaButton
          variant="primary"
          href={site.estimateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
          tabIndex={visible ? undefined : -1}
          aria-hidden={!visible}
        >
          <Zap className="size-4" aria-hidden="true" />
          Get an Instant Estimate
        </CtaButton>
      </div>
    </>
  );
}
