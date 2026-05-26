import { FRAME_COUNT_PRESETS } from "./types";
import type { RoofConfig } from "./types";

export type FrameLoaderCallbacks = {
  onProgress?: (loaded: number, total: number) => void;
  onReady?: () => void;
};

// WebP support, detected once (canvas-based, synchronous). Canvas frame
// scrubbing uses decoded Image objects, so we pick the URL ourselves rather
// than relying on a <picture> element.
let webpSupport: boolean | null = null;
function supportsWebp(): boolean {
  if (webpSupport !== null) return webpSupport;
  try {
    webpSupport = document
      .createElement("canvas")
      .toDataURL("image/webp")
      .startsWith("data:image/webp");
  } catch {
    webpSupport = false;
  }
  return webpSupport;
}

// Loads the frame sequence in parallel (decode-first, with an onload fallback).
// Picks the adaptive variant per SPEC.md §11: half-res on phones, full-res
// otherwise; WebP where supported, JPG fallback. The active smoothness preset
// is sampled evenly across the full sequence so "balanced"/"lite" still span
// the whole animation — just with fewer frames.
export class FrameLoader {
  readonly total: number;
  readonly size: "full" | "half";
  readonly ext: "webp" | "jpg";
  loadedCount = 0;

  private images: HTMLImageElement[];
  private sourceNumbers: number[];
  private started = false;

  constructor(
    private frames: RoofConfig["frames"],
    mode: RoofConfig["animation"]["frameCountMode"],
    private cb: FrameLoaderCallbacks = {},
  ) {
    const requested = FRAME_COUNT_PRESETS[mode] ?? frames.fullCount;
    this.total = Math.max(1, Math.min(requested, frames.fullCount));

    const isPhone =
      typeof window !== "undefined" && window.innerWidth < 768;
    this.size = isPhone ? "half" : "full";
    this.ext = supportsWebp() ? "webp" : "jpg";

    this.images = new Array(this.total);
    this.sourceNumbers = Array.from({ length: this.total }, (_, j) => {
      const t = this.total <= 1 ? 0 : j / (this.total - 1);
      return Math.round(t * (frames.fullCount - 1)) + 1; // 1-based file numbers
    });
  }

  private url(sourceNumber: number): string {
    const name = this.frames.pattern.replace(
      "%04d",
      String(sourceNumber).padStart(4, "0"),
    );
    return `${this.frames.basePath}${this.size}/${name}.${this.ext}`;
  }

  /** Begin loading every frame in parallel. Idempotent. */
  start(): void {
    if (this.started) return;
    this.started = true;

    const loadOne = async (i: number) => {
      const img = new Image();
      img.src = this.url(this.sourceNumbers[i]);
      try {
        await img.decode();
      } catch {
        if (!img.complete) {
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }
      }
      this.images[i] = img;
      this.loadedCount += 1;
      this.cb.onProgress?.(this.loadedCount, this.total);
    };

    Promise.all(
      Array.from({ length: this.total }, (_, i) => loadOne(i)),
    ).then(() => this.cb.onReady?.());
  }

  get(index: number): HTMLImageElement | undefined {
    return this.images[index];
  }

  /** URL of the first frame — used as the static placeholder before load. */
  placeholderUrl(): string {
    return this.url(this.sourceNumbers[0] ?? 1);
  }
}
