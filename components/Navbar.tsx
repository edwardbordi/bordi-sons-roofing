"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-slate-200 backdrop-blur transition-colors duration-300 ${
        scrolled ? "bg-white/95" : "bg-white/80"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {/* Vertical Italian flag accent: green / white / red */}
          <div className="mr-3 flex h-6 items-stretch" aria-hidden="true">
            <span className="w-[3px] bg-green-700" />
            <span className="w-[3px] border-y border-slate-200 bg-white" />
            <span className="w-[3px] bg-red-600" />
          </div>
          <a
            href="#"
            className="text-lg font-bold tracking-tight text-slate-900"
          >
            Bordi &amp; Sons
          </a>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button className="bg-red-600 font-semibold text-white hover:bg-red-700">
          Get a Free Quote
        </Button>
      </div>
    </header>
  );
}
