export {};

// Minimal ambient types for the WordPress globals the admin app uses at runtime
// (provided by the enqueued `wp-api-fetch` script). We don't bundle the
// @wordpress packages — only their runtime globals.
declare global {
  interface Window {
    wp?: {
      apiFetch?: <T = unknown>(options: {
        path: string;
        method?: string;
        data?: unknown;
      }) => Promise<T>;
    };
    BordiWidgetsCore?: Record<string, unknown>;
  }
}
