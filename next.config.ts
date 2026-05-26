import type { NextConfig } from "next";

/**
 * Security headers (audit item C1, per /roles/security-engineer.md).
 *
 * The static headers below are safe to enforce immediately. The Content
 * Security Policy is shipped in **Report-Only** mode first: it does NOT block
 * anything, it only logs violations to the browser console, so we can observe
 * what a real policy needs (Next's inline hydration scripts, framer-motion
 * inline styles, next/image, self-hosted fonts) before switching to enforced.
 *
 * To enforce later: rename the header to `Content-Security-Policy`, tighten
 * script-src with nonces, and remove anything the report phase proved unused.
 * See SECURITY.md (to be authored) for the upgrade procedure.
 */
const cspReportOnly = [
  "default-src 'self'",
  // Next injects inline bootstrap scripts; dev uses eval. Tighten with nonces
  // when moving to enforced.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Tailwind/framer-motion emit inline styles.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  // The instant-estimate CTA links out; allow it as a form/navigation target.
  "form-action 'self' https://demo.sitescan.controlsuite.ai",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
