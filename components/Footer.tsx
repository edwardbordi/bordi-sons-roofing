import type { SVGProps } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";

const serviceLinks = [
  "Roof Replacement",
  "Roof Repair",
  "Inspections",
  "Storm Damage",
];

// lucide-react 1.x removed brand glyphs, so the social marks are inline
// SVGs. fill="currentColor" lets the slate text/hover classes apply.
function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="footer" className="border-t border-slate-200 bg-stone-100">
      {/* Full-width horizontal Italian flag accent: green / white / red */}
      <div className="flex h-1 w-full" aria-hidden="true">
        <div className="flex-1 bg-green-700" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Image
                src="/images/bordi-logo.png"
                alt="Bordi & Sons Roofing"
                width={120}
                height={120}
                className="h-24 w-auto mb-4"
              />
              <p className="mt-3 max-w-xs text-sm text-slate-700">
                Premium GAF-certified roofing systems built to protect what
                matters most.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                Services
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {serviceLinks.map((label) => (
                  <li key={label}>
                    <a
                      href="#services"
                      className="transition-colors hover:text-slate-900"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                Contact
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>
                  <a
                    href="tel:+15551234567"
                    className="transition-colors hover:text-slate-900"
                  >
                    (555) 123-4567
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@bordiandsons.com"
                    className="transition-colors hover:text-slate-900"
                  >
                    hello@bordiandsons.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                Follow Us
              </h4>
              <div className="mt-4 flex gap-4 text-slate-600">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="transition-colors hover:text-slate-900"
                >
                  <FacebookIcon className="size-5" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="transition-colors hover:text-slate-900"
                >
                  <InstagramIcon className="size-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
            © 2026 Bordi &amp; Sons Roofing. All rights reserved.
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
