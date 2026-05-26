# Role-Based Operating System

> An **agent-ready website operating system**. Each file in this directory is a
> self-contained spec for one operating role. A spec can be read by a **new human
> team member** to start working, or handed to an **AI agent as its system prompt**
> to operate autonomously within a defined scope — or any mix of the two.

## Philosophy

A website is not a one-time build; it's an operated system. Traditionally that
operation is implicit — scattered across people's heads and Slack threads. This
template makes it **explicit and executable**: every recurring responsibility is a
role with a clear mission, defined inputs/outputs, quality gates, and handoff
protocols.

Three properties make it work:

1. **Single source of truth.** Brand, business info, and content live in
   `config/` and `content/` (see `ARCHITECTURE.md`). Roles read and write *files*,
   not tribal knowledge — so a handoff is just "this file is now ready."
2. **Bounded authority.** Each role has an explicit scope and an explicit list of
   what it does **not** do. Agents stay in their lane; humans know who owns what.
3. **Auditable handoffs.** Work moves between roles through Git (branches, PRs,
   commits) and a shared `STATUS.md` / PR description. Every transition is logged.

The result: a site you can operate as a solo builder wearing many hats, scale to a
human team, or progressively delegate to AI agents — without rewriting how the
system works.

## The Roles

| Layer | Role file | Owns |
|---|---|---|
| **Strategic / Creative** | [`brand-steward.md`](brand-steward.md) | Visual identity, brand voice, the `brand.config` |
| | [`content-strategist.md`](content-strategist.md) | Topic clusters, editorial calendar, briefs |
| | [`copywriter.md`](copywriter.md) | Page copy, blog drafts, voice/tone execution |
| **Marketing** | [`seo-specialist.md`](seo-specialist.md) | Keywords, on-page SEO, internal links, sitemap |
| | [`geo-specialist.md`](geo-specialist.md) | `llms.txt`, structured data, AI-citation readiness |
| | [`growth-marketing.md`](growth-marketing.md) | Paid media, email/lifecycle, social (channels) |
| **Technical** | [`frontend-developer.md`](frontend-developer.md) | Components, styling, responsive UI |
| | [`backend-developer.md`](backend-developer.md) | Forms, APIs, serverless integrations |
| | [`performance-engineer.md`](performance-engineer.md) | Bundles, images, Core Web Vitals |
| | [`security-engineer.md`](security-engineer.md) | Headers, CSP, audits, secrets |
| **Operations** | [`qa-devops.md`](qa-devops.md) | Pre-deploy checks, CI/CD, environments, rollback |
| | [`analytics-monitoring.md`](analytics-monitoring.md) | Events, reporting, uptime, error alerts |

> Note: the brief's 16 roles are consolidated to 12 where responsibilities overlap
> (the three marketing *channels* → Growth Marketing; QA + DevOps; Analytics +
> Monitoring). Each consolidated file keeps the sub-domains as distinct sections.

## How the Roles Connect

```
                          ┌──────────────────────────┐
                          │      OWNER (human)        │
                          │  approves brand, budget,  │
                          │  security, go-live        │
                          └────────────┬─────────────┘
                                       │ escalations
   STRATEGIC/CREATIVE                  ▼
   ┌───────────────┐   brief   ┌────────────────┐   draft   ┌────────────┐
   │ Brand Steward │◀────────▶ │ Content        │ ────────▶ │ Copywriter │
   │ (voice+visual)│  voice    │ Strategist     │           │            │
   └───────┬───────┘  guard    └────────────────┘           └─────┬──────┘
           │ tokens                                                │ copy (MDX)
           ▼                                                       ▼
   TECHNICAL                                              MARKETING
   ┌───────────────┐   build   ┌────────────────┐  optimize ┌────────────┐
   │ Frontend Dev  │◀────────▶ │ SEO Specialist │◀────────▶ │ GEO        │
   │ Backend Dev   │           │ (keywords,     │  schema   │ Specialist │
   │ Perf Engineer │           │  links,sitemap)│           │ (llms.txt) │
   │ Security Eng  │           └───────┬────────┘           └────────────┘
   └───────┬───────┘                   │ tracked links              
           │ PR                        ▼                            
           ▼                   ┌────────────────┐                   
   OPERATIONS                  │ Growth Mktg    │ (paid/email/social)
   ┌───────────────┐  gates    │ — drives demand│                   
   │ QA / DevOps   │◀──────────┴───────┬────────┘                   
   │ (CI, deploy)  │                   │ UTMs/events                
   └───────┬───────┘                   ▼                            
           │ ships             ┌────────────────┐                   
           └─────────────────▶ │ Analytics /    │ ── reports ──▶ Owner
                               │ Monitoring     │                   
                               └────────────────┘                   
```

Flow of value: **Strategy → Copy → Code → Optimize → Ship → Measure**, with Brand
Steward and Security Engineer acting as cross-cutting guardrails, and the Owner as
the single approval authority for irreversible/high-stakes decisions.

## Common Cross-Role Workflows

### Workflow A — Publish a new blog post
1. **Content Strategist** picks the topic from the cluster plan, writes a brief
   (target keyword, intent, internal-link targets) → `content/briefs/<slug>.md`.
2. **Copywriter** drafts `content/blog/<slug>.mdx` (`draft: true`), fills frontmatter.
3. **Brand Steward** reviews voice/tone (auto-pass if it matches the voice guide).
4. **SEO Specialist** checks title/description/keyword/internal links; **GEO
   Specialist** verifies frontmatter feeds clean structured data + `llms.txt`.
5. **Frontend Dev** (only if new MDX components are needed) wires them.
6. **QA/DevOps** runs CI on the PR (typecheck/build/Lighthouse); preview deploy.
7. **Owner or Content Strategist** flips `draft: false`, merges → live.
8. **Analytics/Monitoring** confirms the page is tracked; reports performance later.

### Workflow B — Onboard a new client (rebrand)
1. **Owner** provides brand assets + business info.
2. **Brand Steward** fills `config/brand.config.ts` (colors/fonts/logo).
3. **Copywriter** + **Content Strategist** fill `config/site.config.ts` + seed pages.
4. **Security Engineer** sets the CSP allowlist for the client's third parties.
5. **QA/DevOps** provisions the Vercel project + env + domain; **Analytics** wires tracking.
6. **SEO/GEO** generate sitemap/llms.txt/structured-data baseline. Ship.

### Workflow C — Ship a feature/section change
1. **Frontend/Backend Dev** implements on a branch.
2. **Performance Engineer** checks bundle/image/CWV impact; **Security Engineer**
   reviews if it touches headers/forms/third parties.
3. **QA/DevOps** gates CI + preview; **Owner** approves; merge → deploy.
4. **Monitoring** watches error rate post-deploy; rollback if regression.

### Workflow D — Incident (security or outage)
1. **Monitoring** detects → alerts **Owner** immediately (escalation).
2. **Security Engineer** or **DevOps** triages; **DevOps** rolls back if needed.
3. Post-incident note appended to `SECURITY.md` / `docs/incidents/`.

## Operating Modes

**As a human team** — assign each role (or several) to a person. The spec is their
job description, their definition of done, and their handoff checklist. `STATUS.md`
+ PRs are the coordination surface.

**As an AI agent network** — instantiate one agent per role with its spec as the
system prompt. Agents communicate by reading/writing the files named in their
Inputs/Outputs and by opening PRs. Quality gates marked **auto-pass** run without
humans; gates marked **needs approval** block on the Owner. Escalation paths route
to a human channel.

**Hybrid (recommended start)** — a solo builder or small team owns the Owner +
strategic roles and the irreversible approvals, while agents handle the mechanical,
well-bounded roles (SEO checks, GEO file generation, performance passes, CI gates,
analytics reporting). Expand agent coverage as trust grows.

### Conventions every role follows
- **Read before write:** consult `config/`, `content/`, and `CLAUDE.md`; for code,
  read `node_modules/next/dist/docs/` (Next 16 has breaking changes).
- **One branch per unit of work; one PR per handoff.** Never push to `main` directly.
- **Status lives in the PR description + `STATUS.md`.** A handoff = a ready PR with
  the next role @-mentioned (or the next agent triggered).
- **Stay in scope.** If a task needs another role's authority, hand off — don't
  overreach. When in doubt or above your authority, **escalate to the Owner.**
