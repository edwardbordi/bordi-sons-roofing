import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";

import { RoofWidget } from "./RoofWidget";
import { mergeConfig } from "./merge-config";
// Tailwind-compiled widget styles as a string, injected into the Shadow DOM so
// they're fully isolated from (and can't leak into) the host theme.
import widgetCss from "../styles/widget.css?inline";

const TAG = "roof-system-widget";

class RoofSystemWidgetElement extends HTMLElement {
  private root: Root | null = null;

  connectedCallback() {
    // Custom elements default to display:inline; the tall scroll runway needs
    // the host to be a block so its height expands with the content.
    this.style.display = "block";

    const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = widgetCss;
    const mount = document.createElement("div");
    shadow.replaceChildren(style, mount);

    let config = mergeConfig(this.readConfig());

    // "Inherit host font": read the host page's computed font and feed it into
    // the theming variable, the one intentional bridge across the shadow border.
    if (config.typography.inheritHostFont) {
      const hostFont = getComputedStyle(this).fontFamily;
      if (hostFont) {
        config = {
          ...config,
          typography: { ...config.typography, fontFamily: hostFont },
        };
      }
    }

    this.root = createRoot(mount);
    this.root.render(createElement(RoofWidget, { config }));
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }

  private readConfig(): unknown {
    const raw = this.getAttribute("data-config");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}

/** Register <roof-system-widget>. Idempotent. */
export function registerRoofWidget(): void {
  if (typeof customElements !== "undefined" && !customElements.get(TAG)) {
    customElements.define(TAG, RoofSystemWidgetElement);
  }
}
