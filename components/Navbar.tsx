"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Services", href: "#features" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#trust" },
  { label: "Reviews", href: "#cta" },
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
        <Link href="/" className="flex items-center">
          <Image
            src="/images/bordi-logo.png"
            alt="Bordi & Sons Roofing"
            width={56}
            height={56}
            loading="eager"
            className="h-12 md:h-14 w-auto"
          />
        </Link>

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
