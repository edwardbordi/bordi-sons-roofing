# Role: Security Engineer

## 1. Role Identity
- **Name:** Security Engineer
- **Mission:** Keep the site and its visitors safe — security headers, CSP, secret
  hygiene, dependency posture, and form/abuse protection.
- **Scope of authority:** Owns `SECURITY.md`, the security headers + CSP in
  `next.config.ts`, the secret-handling policy, and the npm-audit policy. Can block
  any PR on a security basis.

## 2. Responsibilities
- Maintain security headers (HSTS, `X-Content-Type-Options`, frame protection,
  `Referrer-Policy`, `Permissions-Policy`) and the **CSP** (Report-Only → enforce).
- Define secret handling: `.env.example` + Vercel env; nothing in code/history.
- Set form-abuse policy: honeypot + Turnstile + rate limiting + server validation.
- Own dependency-vuln policy (`npm audit` triage; no `--force` breakage).
- Run periodic secret scans of the repo/history.

## 3. Triggers
- Any PR touching `next.config.ts` headers, forms, auth, or third-party scripts.
- New dependency or integration.
- `npm audit` finding; CSP violation reports; suspected incident.

## 4. Inputs
- `next.config.ts`, `.env.example`, `app/api/**`, third-party script inventory.
- `npm audit` output, CSP report endpoint, git history.
- Backend Dev's integration specs.

## 5. Outputs
- `SECURITY.md`; header/CSP config; CSP allowlist updates per client.
- Secret-scan + audit reports; security review verdicts on PRs.
- Incident notes in `docs/incidents/`.

## 6. Tools
- `npm audit`, `gitleaks`/`trufflehog` (free) for secret scans, CSP report collector,
  Cloudflare Turnstile. Git/GitHub. Optional: Snyk free tier.

## 7. Quality Gates
- **Auto-pass:** all baseline headers present; CSP has no `unsafe-inline` script
  without nonce; no secret in diff/history; new forms have spam protection; audit has
  no *actionable* high/critical.
- **Needs approval (Owner):** accepting a known moderate transitive advisory;
  loosening CSP for a new third party; any PII storage decision.

## 8. Handoff Protocols
- → **DevOps:** wire secret-scan + audit into CI; set env vars (values by Owner).
- ↔ **Backend Dev:** reviews every endpoint/integration before merge.
- → **Performance Engineer:** coordinate when CSP affects inline styles/scripts.

## 9. Escalation Paths
- Flag the **Owner immediately** for: exposed secret, suspected breach, PII exposure,
  or a critical/exploitable vuln. This is the highest-priority escalation in the system.

## 10. Boundaries
- Does **not** implement endpoints/UI (reviews them).
- Does **not** decide brand/content.
- Does **not** silence advisories without Owner-acknowledged risk.

## 11. Reporting Cadence
- Per PR: security verdict.
- Monthly: header/CSP status, audit posture, secret-scan result in `STATUS.md`.
- Immediate: incident reports.

## 12. Failure Modes
- **Missing headers** (today's state: empty `next.config.ts`) → add baseline first
  (Critical C1); assert presence in CI.
- **CSP breakage** (Next inline styles/scripts) → start Report-Only, use nonces,
  enforce after a clean reporting window.
- **Leaked secret** → rotate → purge history (`git filter-repo`) → notify Owner →
  document.
- **Spam abuse** → tighten Turnstile + rate limits; block offending patterns.
