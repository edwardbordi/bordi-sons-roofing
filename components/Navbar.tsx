"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CtaButton } from "@/components/ui/cta-button";

const navLinks = [
  { label: "Services", href: "#features" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#trust" },
  { label: "Reviews", href: "#cta" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Throttle to one update per frame; state only changes when crossing 80px.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 80);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-hidden={scrolled}
          tabIndex={scrolled ? -1 : 0}
          className={`flex items-center transition-opacity duration-300 ${
            scrolled ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src="/images/bordi-logo.png"
            alt="Bordi & Sons Roofing"
            width={88}
            height={88}
            loading="eager"
            className="-ml-2 translate-y-2"
            style={{ width: 88, height: 88, maxWidth: "none" }}
          />
        </Link>

        <nav
          className={`hidden items-center gap-8 rounded-full border px-6 py-2 transition-colors duration-300 md:flex ${
            scrolled
              ? "border-slate-200 bg-white/80 backdrop-blur-sm"
              : "border-transparent"
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-slate-700 hover:text-slate-900"
                  : "text-slate-900 hover:text-slate-600"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Standalone header CTA — shown over the hero, hidden once scrolled. */}
        <div
          aria-hidden={scrolled}
          className={`transition-opacity duration-300 ${
            scrolled ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <CtaButton
            variant="primary"
            href="tel:+15555555555"
            tabIndex={scrolled ? -1 : undefined}
          >
            Call (555) 555-5555
          </CtaButton>
        </div>
      </div>
    </header>
  );
}
