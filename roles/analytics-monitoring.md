# Role: Analytics / Monitoring

> Consolidates Analytics/Tracking and Monitoring — both are "know what's happening":
> Analytics measures user behavior/conversions; Monitoring watches uptime/errors.

## 1. Role Identity
- **Name:** Analytics / Monitoring
- **Mission:** Make the site's behavior and health observable — measure what matters
  (traffic, conversions, CWV) and detect problems (downtime, errors) before users do.
- **Scope of authority:** Owns analytics implementation, event taxonomy, dashboards,
  uptime checks, and error alerting config. Does **not** set marketing strategy or
  fix the code defects it surfaces (it routes them).

## 2. Responsibilities
- **Analytics:** install privacy-friendly analytics (Vercel Web Analytics or
  Plausible — no cookie banner); define the **event taxonomy** (CTA clicks, form
  starts/submits, estimate-link clicks) per the UTM convention; build reports.
- Track conversions defined by Growth Marketing; attribute by UTM/source.
- **Monitoring:** uptime checks on key pages; error tracking (Sentry free tier);
  field Core Web Vitals collection; alerting thresholds + routing.

## 3. Triggers
- New page/conversion to track; new campaign (UTM/events).
- Post-deploy (watch error rate); uptime/error/CWV threshold breach.
- Reporting cadence (weekly/monthly).

## 4. Inputs
- Conversion + UTM spec from **Growth Marketing**; deploy notices from **DevOps**.
- `config/site.config.ts` (analytics flags/keys via env), event spec.
- Provider dashboards (analytics, Sentry, uptime).

## 5. Outputs
- Analytics + Sentry wiring (via env-config, no hardcoded keys), `docs/analytics.md`
  (event taxonomy), dashboards.
- Alert rules + routing; weekly/monthly reports in `STATUS.md`; incident pings.

## 6. Tools
- Vercel Web Analytics **or** Plausible (privacy-first), Sentry (free tier),
  UptimeRobot/Better Uptime (free), Vercel Speed Insights for field CWV. Keys via env.

## 7. Quality Gates
- **Auto-pass:** analytics loads without blocking render or harming CWV; all defined
  events fire correctly in preview; no PII in event payloads; uptime + error alerts
  active on prod.
- **Needs approval:** adding a tracker that sets cookies / affects privacy posture
  (Owner + Security — consent/GDPR); any tool with cost.

## 8. Handoff Protocols
- ← **Growth Marketing:** conversion/event definitions; → returns performance reports.
- ← **DevOps:** deploy notices to watch; ← **Backend Dev:** server-side events.
- → **Performance Engineer:** field CWV regressions.
- → **Owner / relevant role:** route detected defects/incidents to the right owner.

## 9. Escalation Paths
- Flag the **Owner immediately** for: site down, error-rate spike, or a privacy/
  consent concern with a tracker. Route security-looking errors to **Security**.

## 10. Boundaries
- Does **not** fix the bugs it finds (routes them to dev roles).
- Does **not** set marketing strategy or budgets.
- Does **not** add cookie-based tracking without consent + approval.

## 11. Reporting Cadence
- Real-time: alerts on threshold breaches.
- Weekly: traffic/conversion/health snapshot in `STATUS.md`.
- Monthly: full report (traffic, conversions, CWV, uptime, top errors) to Owner.

## 12. Failure Modes
- **Analytics hurting CWV** → load async/deferred; prefer lightweight providers.
- **Alert fatigue** (noisy thresholds) → tune thresholds; group alerts; route by severity.
- **PII in events** → scrub payloads; review event spec with Security.
- **Blind spot after deploy** → DevOps deploy notice must trigger a watch window.
