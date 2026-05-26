import { defineConfig } from "vite";

// Builds the shared React global (React + ReactDOM bundled) to
// assets/dist/react-global.js as a self-executing IIFE.
export default defineConfig({
  // Lib builds don't auto-substitute this the way app builds do; React needs it.
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "assets/dist",
    emptyOutDir: false,
    lib: {
      entry: "src/react-global.ts",
      formats: ["iife"],
      name: "BordiWidgetsCoreReactGlobal",
      fileName: () => "react-global.js",
    },
  },
});
