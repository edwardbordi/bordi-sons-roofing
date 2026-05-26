# Security

Owned by the Security Engineer role (`/roles/security-engineer.md`). Threat model: a
static marketing site — minimal attack surface (no DB, no CMS login), so the focus is
headers, secret hygiene, form abuse, and dependency posture.

## Security headers

Set in `next.config.ts` `headers()`, applied to all routes:
- **HSTS** `max-age=63072000; includeSubDomains; preload`
- **X-Content-Type-Options** `nosniff`
- **X-Frame-Options** `SAMEORIGIN`
- **Referrer-Policy** `strict-origin-when-cross-origin`
- **Permissions-Policy** `camera=(), microphone=(), geolocation=(), browsing-topics=()`
- **Content-Security-Policy** — shipped **Report-Only** (non-blocking) so violations
  log to the console without breaking the site.

### Enforcing the CSP

1. Watch Report-Only console violations across the real pages (incl. forms, video,
   any third-party scripts).
2. Add only what's needed (e.g. Turnstile, analytics) to the directives.
3. Replace inline-script reliance with **nonces** where possible.
4. Rename the header `Content-Security-Policy-Report-Only` → `Content-Security-Policy`.
5. Re-test every page + the forms before merging.

## Secrets

- No secrets in the repo or git history (verified clean). `.env*` is gitignored.
- Document every variable in `.env.example`; set real values in Vercel project env.
- A leaked secret = rotate immediately → purge history → notify Owner → log incident.

## Forms

Any backend-wired form must follow **[form-safety.md](form-safety.md)** (honeypot +
Turnstile + server validation + rate limit + consent). The current demo form is
front-end only (safe).

## Dependencies

- Keep Next/React/Tailwind current.
- `npm audit`: triage, don't blindly `--force`. The known **2 moderate** advisories
  are transitive (PostCSS inside Next's toolchain), not actionable without a breaking
  downgrade, and not on a user-facing runtime path — accepted + tracked upstream.
- Consider Dependabot/Renovate (grouped, scheduled PRs).

## Standards enforcement

`scripts/drift-check.mjs` (CI) blocks hardcoded business info and brand colors —
preventing the kind of drift that leaks secrets/values into the client bundle.

## Escalation

Flag the Owner **immediately** for: exposed secret, suspected breach, PII exposure,
or a critical/exploitable vuln. Branch protection + required CI reviews prevent
unreviewed code reaching production.
