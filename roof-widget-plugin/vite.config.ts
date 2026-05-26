import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// P1 demo build/dev config. The plugin (IIFE/Web-Component) build with React
// externalized is added in a later phase; this config just runs the standalone
// demo page. `publicDir: "assets"` serves the bundled frames at /frames/...
export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: "assets",
  build: {
    outDir: "demo-dist",
    emptyOutDir: true,
  },
});
