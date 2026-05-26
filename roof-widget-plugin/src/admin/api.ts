import type { RoofConfig } from "../widget/types";

// REST persistence via wp.apiFetch (handles the REST root + X-WP-Nonce). The
// endpoints are registered by the plugin's PHP through Core's admin-only helper.
const PATH = "bordi-widgets/v1/roof-system/settings";

function apiFetch() {
  const fn = window.wp?.apiFetch;
  if (!fn) {
    throw new Error(
      "wp.apiFetch is unavailable — the admin script must be enqueued with the 'wp-api-fetch' dependency.",
    );
  }
  return fn;
}

/** Load the saved config (may be partial; merge over defaults before use). */
export async function loadConfig(): Promise<unknown> {
  return apiFetch()({ path: PATH });
}

/** Persist the full config. */
export async function saveConfig(
  config: RoofConfig,
): Promise<{ saved: boolean; config: RoofConfig }> {
  return apiFetch()<{ saved: boolean; config: RoofConfig }>({
    path: PATH,
    method: "POST",
    data: config,
  });
}
