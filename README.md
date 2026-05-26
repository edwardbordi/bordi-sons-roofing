# Agency Site Template (Bordi & Sons Roofing)

An agency-grade **Next.js 16** marketing-site template: fast, secure, SEO/GEO-ready,
editable by non-developers, and operable by humans **or** AI agents. The live demo
is Bordi & Sons Roofing; the same codebase is the starting point for new client
sites.

## 30-minute orientation

Three places hold everything (see [ARCHITECTURE](docs/ARCHITECTURE.md)):

| Folder | What | Edit it to… |
|---|---|---|
| **`config/`** | `site.config.ts` (business info, NAP, URLs, i18n) + `brand.config.ts` (colors, fonts, logo) | rebrand / change business facts |
| **`content/`** | MDX posts + `authors/*.json` + `home.ts` (section copy) | add/edit content (no code) |
| **`components/`** | brand-agnostic UI: `ui/` primitives, `sections/` blocks, `blog/`, `content/` | change how things look/work |

Supporting: `lib/` (content loader, SEO/i18n helpers), `app/` (routes, metadata,
sitemap/robots/manifest/llms.txt), `roles/` (the operating system), `docs/` (guides).

## Quickstart

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build (stop dev first)
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run drift          # standards / "never hardcode" checks
```

## Stack

Next.js 16 (App Router + Turbopack) · React 19 · Tailwind CSS v4 · TypeScript 5 ·
shadcn/ui · framer-motion · MDX (next-mdx-remote) · zod. Deploys on Vercel.

> ⚠️ **Next 16 differs from older Next.** Read `node_modules/next/dist/docs/`
> before writing Next code (see `AGENTS.md`).

## Read next

- **[CLAUDE.md](CLAUDE.md)** — the operating contract (rules every change follows). Start here.
- **[AGENT-SOP.md](AGENT-SOP.md)** — step-by-step runbooks.
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — how it's built and why.
- **[docs/BRANDING-CONFIG.md](docs/BRANDING-CONFIG.md)** — swap a client in under an hour.
- **[docs/ADDING-A-BLOG-POST.md](docs/ADDING-A-BLOG-POST.md)** · **[docs/ADDING-A-PAGE.md](docs/ADDING-A-PAGE.md)**
- **[docs/CONTENT-EDITING-GUIDE.md](docs/CONTENT-EDITING-GUIDE.md)** — for non-developers (GitHub web UI).
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** · **[docs/SECURITY.md](docs/SECURITY.md)** · **[docs/SCALING.md](docs/SCALING.md)**
- **[roles/README.md](roles/README.md)** — the role-based operating system (human or AI).
- **[AGENCY-PLAYBOOK-AUDIT.md](AGENCY-PLAYBOOK-AUDIT.md)** — the audit + target architecture this all implements.
