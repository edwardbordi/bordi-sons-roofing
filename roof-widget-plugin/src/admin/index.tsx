import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

// Mounts the settings app into the container the plugin's admin page prints.
// React/ReactDOM are externalized to the Core global at build time.
const el = document.getElementById("roof-system-admin-root");
if (el) {
  createRoot(el).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
