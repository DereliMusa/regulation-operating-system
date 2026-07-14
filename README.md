# Certra

AI-assisted MDR/IVDR regulatory compliance platform for medical-device manufacturers.
Certra helps build technical files that are complete, traceable, and ready for Notified
Body review — covering the technical file, GSPR conformity, ISO 14971 risk management,
clinical evaluation, post-market surveillance, and an auditor simulation.

## Status

Early stage. The product design, architecture, requirements, and full development plan
live in [`SDLC/`](SDLC/). **No application code has been written yet**; implementation
starts after the documentation phase is approved.

Start here:

- [`SDLC/README.md`](SDLC/README.md) — how the knowledge base and session protocol work.
- [`SDLC/04-session-log/STATE.md`](SDLC/04-session-log/STATE.md) — current project state.
- [`SDLC/00-product/vision.md`](SDLC/00-product/vision.md) — what Certra is and why.
- [`SDLC/03-planning/mvp-plan.md`](SDLC/03-planning/mvp-plan.md) — the MVP build plan.

## Planned stack

Nuxt 4 (Nitro) + TypeScript, NuxtUI + Tailwind, Drizzle ORM (SQLite for the MVP,
PostgreSQL later), nuxt-auth-utils, Vitest, Docker + GitHub Actions. Details and rationale:
[`SDLC/01-architecture/tech-stack.md`](SDLC/01-architecture/tech-stack.md).

## Repository layout

- `SDLC/` — single source of truth (product, architecture, standards, planning, session log).
- `eski-veriler/` — archived early planning material and the UI design mockups (visual reference).
- `AGENTS.md` — entry point for AI agents/tools (points into `SDLC/`).

The application code will live at the repo root (`app/`, `server/`, `shared/`) once
implementation begins.
