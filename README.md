# Certra

AI-assisted MDR/IVDR regulatory compliance platform for medical-device manufacturers.
Certra helps build technical files that are complete, traceable, and ready for Notified
Body review — covering the technical file, GSPR conformity, ISO 14971 risk management,
clinical evaluation, post-market surveillance, and an auditor simulation.

## Status

**MVP implemented.** All MVP sprints (S0–S9) are done: scaffold, database, auth, app shell,
dashboard, technical files (GSPR + Risk CRUD), auditor simulation, the four module screens,
the marketing pages, and the CI/CD + Docker pipeline. AI features are mock (rule/template
based) in the MVP; the real Claude integration lands in Phase 1. The full design,
architecture, requirements, and plan live in [`SDLC/`](SDLC/).

Start here:

- [`SDLC/README.md`](SDLC/README.md) — how the knowledge base and session protocol work.
- [`SDLC/04-session-log/STATE.md`](SDLC/04-session-log/STATE.md) — current project state.
- [`SDLC/00-product/vision.md`](SDLC/00-product/vision.md) — what Certra is and why.
- [`SDLC/03-planning/mvp-plan.md`](SDLC/03-planning/mvp-plan.md) — the MVP build plan.

## Stack

Nuxt 4 (Nitro) + TypeScript, NuxtUI + Tailwind, Drizzle ORM (SQLite for the MVP,
PostgreSQL later), nuxt-auth-utils, Vitest, Docker + GitHub Actions. Details and rationale:
[`SDLC/01-architecture/tech-stack.md`](SDLC/01-architecture/tech-stack.md).

## Running locally

Requires Node.js 22 LTS and npm.

```bash
npm install
cp .env.example .env        # then set a long NUXT_SESSION_PASSWORD (>= 32 chars)
npm run dev                 # http://localhost:3000
```

Populate demo data by POSTing to the dev-only seed endpoint while the dev server runs
(`POST /api/dev/seed`, 404s outside development). Seeded login: `demo@certra.app` /
`CertraDemo!2026`.

Quality gate (all green):

```bash
npm run lint
npm run typecheck
npm run test
npm run test:coverage       # 60%+ on core logic (server/app utils)
npm run build
```

### Docker

```bash
docker build -t certra .
# needs a persistent volume for the SQLite file and a session password:
docker run -p 3000:3000 -e NUXT_SESSION_PASSWORD='a-long-random-secret-at-least-32-chars' \
  -v certra-data:/app/.data certra
```

Or `docker compose up --build` (see [`docker-compose.yml`](docker-compose.yml)). The image
ships the SQL migrations alongside the Nitro output; they apply automatically on first boot.

## Repository layout

- `app/` — Nuxt frontend (pages, layouts, components, composables, client utils).
- `server/` — Nitro backend (API routes, middleware, database schema/migrations, server utils).
- `shared/` — types and constants shared between client and server.
- `SDLC/` — single source of truth (product, architecture, standards, planning, session log).
- `.github/workflows/` — CI (lint/typecheck/test/build) and deploy (Docker → GHCR → Coolify).
- `eski-veriler/` — archived early planning material and the UI design mockups (visual reference).
- `AGENTS.md` — entry point for AI agents/tools (points into `SDLC/`).
