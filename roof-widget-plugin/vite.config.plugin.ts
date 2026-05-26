import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Production plugin bundle: a single self-mounting IIFE at assets/dist/widget.js.
// React/ReactDOM are EXTERNAL — read from the Core plugin's window global
// (BordiWidgetsCore.*) so every Bordi widget shares one React. The widget's
// Tailwind CSS is imported via ?inline and bundled into the JS string (injected
// into the Shadow DOM), so there's no separate stylesheet to enqueue.
// Automatic JSX runtime; react/jsx-runtime is externalized to the Core global
// alongside react and react-dom/client.
export default defineConfig({
  // Lib builds don't auto-substitute this the way app builds do.
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "assets/dist",
    emptyOutDir: false,
    lib: {
      entry: "src/widget/plugin-entry.ts",
      formats: ["iife"],
      name: "RoofSystemWidget",
      fileName: () => "widget.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
      output: {
        globals: {
          react: "BordiWidgetsCore.React",
          "react-dom": "BordiWidgetsCore.ReactDOM",
          "react-dom/client": "BordiWidgetsCore.ReactDOM",
          "react/jsx-runtime": "BordiWidgetsCore.jsxRuntime",
        },
      },
    },
  },
});
