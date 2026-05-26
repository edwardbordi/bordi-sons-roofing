import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Admin settings bundle → assets/dist/admin.js. Like the widget bundle, React is
// externalized to the Core global (one shared React). No Tailwind here — the
// admin UI uses plain inline styles so it can't disturb wp-admin's own CSS.
export default defineConfig({
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  plugins: [react()],
  build: {
    outDir: "assets/dist",
    emptyOutDir: false,
    lib: {
      entry: "src/admin/index.tsx",
      formats: ["iife"],
      name: "RoofSystemAdmin",
      fileName: () => "admin.js",
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
