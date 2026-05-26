"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";

// Favorites persist here as a JSON array of color names.
const FAVORITES_KEY = "bordi-favorite-colors";

const titleCase = (s: string) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

// 18 GAF Timberline HDZ colors, in grid order. `name` (uppercase) is the
// favorite identifier (kept identical to the previous version so existing
// saved favorites still match); `file` is the basename in /images/.
type ShingleColor = { name: string; file: string };

const COLORS: ShingleColor[] = [
  { name: "OYSTER GRAY", file: "01-oyster-gray" },
  { name: "PEWTER GRAY", file: "02-pewter-gray" },
  { name: "FOX HOLLOW GRAY", file: "03-fox-hollow-gray" },
  { name: "SLATE", file: "04-slate" },
  { name: "WILLIAMSBURG SLATE", file: "05-williamsburg-slate" },
  { name: "BISCAYNE BLUE", file: "06-biscayne-blue" },
  { name: "WEATHERED WOOD", file: "07-weathered-wood" },
  { name: "CLIFFSIDE", file: "08-cliffside" },
  { name: "MIDNIGHT MESA", file: "09-midnight-mesa" },
  { name: "CHARCOAL", file: "10-charcoal" },
  { name: "HUNTER GREEN", file: "11-hunter-green" },
  { name: "PATRIOT RED", file: "12-patriot-red" },
  { name: "SIERRA SAND", file: "13-sierra-sand" },
  { name: "BARKWOOD", file: "14-barkwood" },
  { name: "SHAKEWOOD", file: "15-shakewood" },
  { name: "HICKORY", file: "16-hickory" },
  { name: "MISSION BROWN", file: "17-mission-brown" },
  { name: "CHESTNUT VALLEY", file: "18-chestnut-valley" },
];

export function ShingleColorGrid() {
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
            THE BORDI SYSTEM
          </span>
          <h2 className="mt-5 mb-3 text-3xl font-bold text-slate-900 md:text-5xl">
            18 Authentic Colors. One Standard of Quality.
          </h2>
          <p className="text-base text-slate-600">
            Every GAF Timberline HDZ shingle is engineered to the same
            lifetime-rated specification. The only thing that changes is the
            character of your home.
          </p>
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
                className="ml-2 text-red-600 hover:underline"
              >
                Clear
              </button>
            </span>
          )}
        </div>

        {/* The grid: 3×6 on mobile, 6×3 on desktop. Each cell is a button. */}
        <div className="mt-6 grid w-full grid-cols-3 gap-3 md:grid-cols-6">
          {COLORS.map((color, i) => {
            const fav = favorites.has(color.name);
            return (
              <button
                key={color.name}
                type="button"
                aria-label={`Save ${titleCase(color.name)} as a favorite color`}
                aria-pressed={fav}
                onClick={() => toggleFavorite(color.name)}
                className="group cursor-pointer rounded-md transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
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
                    fill={fav ? "#dc2626" : "none"}
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
              href="https://demo.sitescan.controlsuite.ai/"
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
