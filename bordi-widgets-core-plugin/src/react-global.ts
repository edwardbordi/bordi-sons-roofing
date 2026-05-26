// Exposes a single shared React + ReactDOM on the page so every Bordi widget
// plugin can reuse them instead of each bundling its own copy. Built to
// assets/dist/react-global.js and enqueued by the Core plugin.
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as jsxRuntime from "react/jsx-runtime";

declare global {
  interface Window {
    BordiWidgetsCore?: Record<string, unknown>;
  }
}

// Expose the pieces widget bundles externalize: React (hooks/createElement),
// ReactDOM (createRoot), and the automatic-runtime JSX helpers.
const core = (window.BordiWidgetsCore = window.BordiWidgetsCore || {});
core.React = React;
core.ReactDOM = ReactDOM;
core.jsxRuntime = jsxRuntime;
core.version = "0.1.0";
