"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { brand } from "@/config/brand.config";
import { site } from "@/config/site.config";
import type { ShingleColor } from "@/content/home";

// Favorites persist here as a JSON array of color names.
const FAVORITES_KEY = "bordi-favorite-colors";

const titleCase = (s: string) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

// The GAF color catalog + section copy now live in content/home.ts.

export function ShingleColorGrid({
  eyebrow,
  heading,
  subhead,
  colors,
}: {
  eyebrow: string;
  heading: string;
  subhead: string;
  colors: ShingleColor[];
}) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Hydrate favorites from localStorage once on mount. State is set in the
  // effect (not a render-time initializer) so server and client produce the
  // same initial markup — avoiding a hydration mismatch on the counter text.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional one-time hydration */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setFavorites(new Set(parsed));
      }
    } catch {
      // Malformed/unavailable storage — start with no favorites.
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist on every change (after hydration, so we never clobber stored data).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    } catch {
      // Storage may be unavailable (e.g. private mode) — ignore.
    }
  }, [favorites, hydrated]);

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const clearFavorites = () => setFavorites(new Set());

  const count = favorites.size;

  return (
    <section
      id="colors"
      className="bg-white px-4 py-16 sm:px-6 md:py-24"
    >
      {/* Scale-in keyframe for a heart when it becomes favorited. */}
      <style>{`@keyframes shingleHeartFav{from{transform:scale(0.6)}to{transform:scale(1)}}`}</style>

      <div className="mx-auto flex w-full max-w-[920px] flex-col items-center">
        {/* Heading */}
        <div className="max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-white/60 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-slate-600 ring-1 ring-inset ring-slate-900/10 backdrop-blur-md">
            {eyebrow}
          </span>
          <h2 className="mt-5 mb-3 text-3xl font-bold text-slate-900 md:text-5xl">
            {heading}
          </h2>
          <p className="text-base text-slate-600">{subhead}</p>
        </div>

        {/* Favorites counter — reserves its line so saving the first color
            doesn't shift the grid. Shown only when favorites exist. */}
        <div className="mt-6 flex h-6 items-center justify-center text-sm">
          {count > 0 && (
            <span className="text-slate-700">
              {count} favorite{count === 1 ? "" : "s"} saved
              <button
                type="button"
                onClick={clearFavorites}
                className="ml-2 text-primary-600 hover:underline"
              >
                Clear
              </button>
            </span>
          )}
        </div>

        {/* The grid: 3×6 on mobile, 6×3 on desktop. Each cell is a button. */}
        <div className="mt-6 grid w-full grid-cols-3 gap-3 md:grid-cols-6">
          {colors.map((color, i) => {
            const fav = favorites.has(color.name);
            return (
              <button
                key={color.name}
                type="button"
                aria-label={`Save ${titleCase(color.name)} as a favorite color`}
                aria-pressed={fav}
                onClick={() => toggleFavorite(color.name)}
                className="group cursor-pointer rounded-md transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-md ring-1 ring-black/5">
                  <Image
                    src={`/images/${color.file}.png`}
                    alt={titleCase(color.name)}
                    width={800}
                    height={800}
                    sizes="(min-width: 768px) 150px, 33vw"
                    className="h-full w-full object-cover"
                  />
                  <Heart
                    aria-hidden="true"
                    className="pointer-events-none absolute size-5 shrink-0"
                    style={{
                      top: "8%",
                      right: "8%",
                      opacity: fav ? 1 : 0.75,
                      animation: fav
                        ? "shingleHeartFav 200ms ease-out"
                        : undefined,
                    }}
                    fill={fav ? brand.colors.primary.DEFAULT : "none"}
                    stroke="#ffffff"
                    strokeWidth={fav ? 1.5 : 2}
                  />
                </div>
                <span className="mt-2 block overflow-visible text-center text-[11px] font-semibold tracking-wider whitespace-nowrap text-slate-900 uppercase">
                  {`${i + 1}. ${color.name}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section CTA — shown whenever colors are saved. */}
        {count > 0 && (
          <div className="mt-10 px-4 text-center">
            <CtaButton
              variant="primary"
              href={site.estimateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-full whitespace-normal text-center"
            >
              {`Get an Instant Estimate — we'll quote your ${count} saved color${count === 1 ? "" : "s"}`}
            </CtaButton>
          </div>
        )}

        <div className="sr-only">
          This grid shows the range of GAF Timberline HDZ shingle colors
          available from Bordi &amp; Sons. Every color shares the same
          lifetime-rated specification; only the appearance changes.
        </div>
      </div>
    </section>
  );
}
