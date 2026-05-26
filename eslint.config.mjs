import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The WP plugin products are separate projects (own tooling + bundled/
    // minified output) — the site's lint shouldn't cover them.
    "roof-widget-plugin/**",
    "bordi-widgets-core-plugin/**",
  ]),
]);

export default eslintConfig;
