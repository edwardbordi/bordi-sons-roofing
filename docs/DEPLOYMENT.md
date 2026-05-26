# Deployment

Hosted on **Vercel** with Git integration. Branches → previews; `main` → production.

## One-time setup (per client/project)

1. Create a Vercel project, import the GitHub repo. Framework auto-detects as Next.js.
2. Set environment variables in the Vercel project (Production + Preview) — see
   `.env.example` for the list. Never commit real values.
3. Attach the custom domain; Vercel provisions HTTPS automatically.
4. Configure **branch protection** on `main` (see below).

## Day-to-day flow

- Open a PR → Vercel posts a **preview deployment** URL (updates on every commit).
- CI runs (`.github/workflows/ci.yml`): typecheck · lint · build · drift (required),
  Lighthouse (informational). A drift report is posted as a PR comment.
- Merge to `main` → **production deploy** automatically.

## Branch protection (GitHub repo setting — do this once)

Settings → Branches → add a rule for `main`:
- Require a pull request before merging (≥1 review).
- Require status checks to pass: the **CI / verify** job.
- Disallow direct pushes / force-pushes to `main`.

> The repo enforces "branches + PRs only" by policy (CLAUDE.md §6); branch
> protection makes it mechanical.

## Rollback

Production deploys are immutable and instantly revertable:
1. Vercel dashboard → Deployments → pick the last good deployment.
2. **Promote to Production** (or "Instant Rollback").
3. Then fix forward on a branch + PR (don't hotfix `main` directly).

Record what happened in `docs/incidents/` (Monitoring/DevOps roles).

## Content publishing

Adding/editing content is a normal PR (often from the GitHub web UI — see
[CONTENT-EDITING-GUIDE.md](CONTENT-EDITING-GUIDE.md)). Merge = publish; rebuild is
a couple of minutes. At high content volume, switch to ISR (see [SCALING.md](SCALING.md)).
