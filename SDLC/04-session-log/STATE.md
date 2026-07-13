# Project State (read this first)

> Last updated: 2026-07-14 — session `2026-07-14-sdlc-bootstrap`

This file is the fast, always-current snapshot of where the project stands. Read it at
the start of every session. Update it at the end of every session.

## Current phase

**Gate A — Documentation.** Authoring the SDLC knowledge base. **No application code has
been written and none should be written until the product owner explicitly says "start".**

## Confirmed decisions (owner-approved)

- Stack: Nuxt 3 (Nitro) + TypeScript, Node.js 22 LTS + npm.
- UI: NuxtUI (free) + TailwindCSS; Material Symbols via Iconify; Geist/Inter/Geist Mono fonts.
- Data: Drizzle ORM; SQLite for MVP, PostgreSQL from Phase 1.
- Auth (MVP): nuxt-auth-utils (encrypted session cookie).
- Brand / package name: Certra.
- MVP screen scope: all 6 app modules at demo quality (deep CRUD on Technical Files + GSPR + Risk).
- Marketing in MVP: Product Overview (landing) + Book a Demo; Solutions + Pricing in Phase 1.
- AI in MVP: mock (rule/template based); real Claude integration in Phase 1.
- Repo: single Nuxt app at repo root; `SDLC/` is the source of truth; `planlama/` archived to `eski-veriler/`.

## Timeline framing

- Owner's fast "1-2 week working demo" = this plan's **MVP**.
- TUBITAK application's "6-month MVP" = this plan's **Phase 1**.
- Sellable SaaS = **Phase 2**.

## Done

- Product/business context extracted from `eski-veriler/taslak.md` and the TUBITAK form.
- All 6 app mockups and 4 marketing mockups reviewed; design tokens extracted.
- Node.js 22 installed via Homebrew.
- `planlama/` archived to `eski-veriler/`; `.gitignore` added.
- SDLC knowledge base authoring in progress (see next).

## In progress

- Writing the SDLC documentation set (Gate A). Order: README + state (done) ->
  product -> architecture + STYLE_GUIDE + ADRs -> standards -> requirements + phase plans
  -> references -> root CLAUDE.md / AGENTS.md.

## Next

1. Finish all Gate A docs and commit each logical group.
2. **STOP.** Wait for the owner to say "start" before any implementation (Gate B).
3. Gate B first step (when approved): S0 — scaffold Nuxt project (see
   [`../03-planning/mvp-plan.md`](../03-planning/mvp-plan.md)).

## Open items awaiting the owner

- Design assets: logo (SVG + favicon), 3-5 marketing photos, social-proof decision
  (real vs. clearly-labelled sample), ISO 13485/HIPAA badges only if truly certified.
  See [`../01-architecture/STYLE_GUIDE.md`](../01-architecture/STYLE_GUIDE.md).

## Working branch

- `docs/sdlc-bootstrap` (Gate A documentation). Default branch: `main`.
