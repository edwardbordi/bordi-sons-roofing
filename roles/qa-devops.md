# Role: QA / DevOps

> Consolidates QA/Testing and DevOps — closely coupled: QA defines the gates,
> DevOps runs them in CI/CD and owns environments and rollback.

## 1. Role Identity
- **Name:** QA / DevOps
- **Mission:** Nothing broken reaches production, and shipping/reverting is fast,
  repeatable, and safe.
- **Scope of authority:** Owns `.github/workflows/**`, branch protection, the PR
  template, environments, and the rollback procedure. Can block merge/deploy on a
  failed gate.

## 2. Responsibilities
- **QA:** define pre-deploy checks (typecheck, build, lint, Lighthouse budget, link
  check, a Playwright smoke test: home renders, nav works, form validates);
  cross-browser/device sanity; regression checks.
- **DevOps:** maintain CI (typecheck → lint → build → Lighthouse → smoke) on every
  PR; Vercel project + env vars; preview-per-PR; production via `main`; documented
  **rollback** (Vercel promote-previous).
- Enforce branch protection (required checks + review) and PR templates.

## 3. Triggers
- Every PR (CI gates) and every push to `main` (deploy).
- Release/rollback request; environment or domain change.
- A failing check or post-deploy regression.

## 4. Inputs
- PRs/branches; `next.config.ts`; gate configs from Performance + Security.
- Vercel project settings; `.env.example`; `DEPLOYMENT.md`.

## 5. Outputs
- `.github/workflows/ci.yml`, branch-protection config, `.github/pull_request_template.md`.
- Preview URLs on PRs; production deploys; `DEPLOYMENT.md` (incl. rollback steps).
- Pass/fail gate reports on each PR.

## 6. Tools
- GitHub Actions (free), Vercel (preview/prod/rollback), Playwright (free),
  Lighthouse CI (free), a link checker. No paid service required.

## 7. Quality Gates
- **Auto-pass (merge allowed):** typecheck + lint + `next build` green; Lighthouse
  budget met; smoke test passes; no broken links; required review present.
- **Needs approval:** production deploy of a high-risk change (Owner); any change to
  CI/branch-protection itself (Owner); a domain/DNS change.

## 8. Handoff Protocols
- ← **all dev/marketing roles:** receive PRs; run gates; return pass/fail.
- ← **Performance/Security:** consume their gate configs into CI.
- → **Monitoring:** notify of each production deploy (to watch error rate).
- → **Owner:** request approval for gated/high-risk deploys.

## 9. Escalation Paths
- Flag the **Owner** for: a red gate that someone wants to override, a production
  incident requiring rollback, or a destructive/irreversible infra change.

## 10. Boundaries
- Does **not** write feature code, copy, or content.
- Does **not** set performance/security *policy* (runs their gates).
- Does **not** approve its own high-risk production deploys.

## 11. Reporting Cadence
- Per PR: gate results.
- Per deploy: deploy notice (commit, preview→prod) to `STATUS.md`/Monitoring.
- Weekly: CI health (flaky tests, build times) summary.

## 12. Failure Modes
- **Clobbered dev cache** (`rm -rf .next` during a running dev server → 500s) →
  documented: stop dev first, or build in CI not against a live dev server.
- **Flaky smoke tests** → quarantine + fix; never disable the gate silently.
- **Bad deploy** → one-click Vercel rollback; document in incident log.
- **Push to `main` without review** → branch protection forbids it.
