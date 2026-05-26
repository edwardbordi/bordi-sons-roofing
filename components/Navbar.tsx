"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Home, Droplets, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";

// Simple anchor links (Services is a mega menu, handled separately below).
const navLinks = [
  { label: "Process", href: "#process" },
  { label: "About", href: "#contact" },
  { label: "Reviews", href: "#testimonials" },
];

type ServiceColumn = {
  title: string;
  icon: LucideIcon;
  items: { label: string; href: string }[];
};

// Sample service categories. Links point at the most relevant existing
// section (no dedicated service pages on this demo site).
const serviceMenu: ServiceColumn[] = [
  {
    title: "Roofing",
    icon: Home,
    items: [
      { label: "Roof Replacement", href: "#process" },
      { label: "New Roof Installation", href: "#process" },
      { label: "Shingle Color Options", href: "#colors" },
      { label: "Roof Inspections", href: "#contact" },
    ],
  },
  {
    title: "Gutters",
    icon: Droplets,
    items: [
      { label: "Seamless Gutters", href: "#contact" },
      { label: "Gutter Guards", href: "#contact" },
      { label: "Gutter Cleaning", href: "#contact" },
      { label: "Downspouts", href: "#contact" },
    ],
  },
  {
    title: "Repair",
    icon: Wrench,
    items: [
      { label: "Leak Repair", href: "#contact" },
      { label: "Storm Damage", href: "#contact" },
      { label: "Missing Shingles", href: "#contact" },
      { label: "Emergency Tarping", href: "#contact" },
    ],
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

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

  const linkColor = scrolled
    ? "text-slate-700 hover:text-slate-900"
    : "text-slate-900 hover:text-slate-600";

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
          {/* Services — mega menu trigger. Opens on hover or keyboard focus. */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            onFocus={() => setServicesOpen(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setServicesOpen(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setServicesOpen(false);
            }}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className={`flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors ${linkColor}`}
            >
              Services
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  servicesOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Panel. `pt-3` (not margin) keeps the hover bridge continuous so
                moving the cursor onto the panel doesn't close it. */}
            <div
              className={`absolute left-0 top-full pt-3 transition-all duration-200 ${
                servicesOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="grid w-160 grid-cols-3 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                {serviceMenu.map((col) => {
                  const Icon = col.icon;
                  return (
                    <div key={col.title}>
                      <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Icon className="size-5 text-red-600" aria-hidden="true" />
                        <h3 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                          {col.title}
                        </h3>
                      </div>
                      <ul className="space-y-1">
                        {col.items.map((item) => (
                          <li key={item.label}>
                            <a
                              href={item.href}
                              onClick={() => setServicesOpen(false)}
                              className="block rounded-md px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-stone-50 hover:text-red-600"
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors ${linkColor}`}
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
