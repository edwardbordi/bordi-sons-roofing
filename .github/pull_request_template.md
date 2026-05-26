<!-- See CLAUDE.md §6 (git workflow) and AGENT-SOP.md for procedures. -->

## What & why

<!-- What does this change do, and why? Link the audit item / role if relevant. -->

## Architectural decisions (flag for Owner)

<!-- Anything ambiguous or worth the Owner's judgment. Write "none" if N/A. -->

## Verification

- [ ] `npm run typecheck` clean
- [ ] `npm run build` clean (validates MDX frontmatter)
- [ ] `npm run lint` clean
- [ ] `npm run drift` clean (no hardcoded brand colors / business info)
- [ ] Vercel preview renders the change
- [ ] No business info or brand colors hardcoded outside `config/` (CLAUDE.md §4)
- [ ] New/changed content has EN (and ES stub if applicable)
