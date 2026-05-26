# Form Safety Policy (audit C4)

> Any form that submits to a backend MUST follow this policy before it goes
> live. Owned by the Security Engineer + Backend Developer roles
> (`/roles/security-engineer.md`, `/roles/backend-developer.md`).

## Current state

The callback form (`components/CallbackForm.tsx`) is **front-end only** on this
demo — it validates in the browser and shows a success state, but **submits
nowhere**. That is safe (no endpoint, no data). The moment it's wired to a real
backend (email/CRM/ESP), the requirements below become mandatory.

## Required controls for any live form

1. **Server-side validation.** Never trust client input. Re-validate every field
   on the server (type, length, format) in the route handler / server action.
   Reject malformed payloads with a 400.
2. **Honeypot field.** Add a hidden field (e.g. `company`) that real users never
   fill. If it's non-empty, silently drop the submission.
3. **CAPTCHA — Cloudflare Turnstile** (free, privacy-friendly, no cost). Render the
   widget, send the token, and **verify it server-side** before processing.
4. **Rate limiting.** Cap submissions per IP (e.g. 5 / 10 min) on the endpoint to
   blunt automated abuse. Use a lightweight store (Vercel KV / Upstash free tier)
   or an in-memory limiter for low volume.
5. **No secrets in code.** ESP/CRM API keys live in environment variables
   (`.env.example` documents them; real values in Vercel project env). Never
   commit a key; never expose one to the client bundle.
6. **Consent + compliance.** Keep the explicit, unchecked-by-default A2P 10DLC SMS
   consent checkbox (already present) and store proof of consent (timestamp + the
   text shown) with the lead. Email opt-in must be explicit (CAN-SPAM). Don't send
   to anyone who didn't opt in.
7. **PII handling.** Treat name/email/phone/address as PII: transmit over HTTPS
   only, don't log raw payloads, and confirm any processor (ESP/CRM) is acceptable
   with the Owner before adding it.

## Recommended wiring (when the time comes)

- **Transport:** a Next.js Route Handler or Server Action (`app/api/contact`),
  not a third-party form post from the client.
- **Email:** Resend or MailerLite (free tiers) for the notification + autoreply.
  Add a fallback (e.g. log + alert) if the provider call fails.
- **Spam stack:** honeypot → Turnstile verify → rate limit → validate → send.
- **Observability:** log submission *outcomes* (not PII) and alert on errors
  (Monitoring role).

## CSP note

The CSP (currently Report-Only in `next.config.ts`) must allow the Turnstile
script + frame and the form-action endpoint before enforcing. Update the policy
in the same PR that wires the form, and verify with the report-only phase first.

## Definition of done (Security gate)

A live form PR passes only when: server validation ✓, honeypot ✓, Turnstile
verified server-side ✓, rate limit ✓, no secrets in repo ✓, consent captured +
stored ✓, CSP updated ✓.
