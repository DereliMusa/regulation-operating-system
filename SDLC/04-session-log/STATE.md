# Project State (read this first)

> Last updated: 2026-07-14 — session `2026-07-14-mvp-s0-s2`

This file is the fast, always-current snapshot of where the project stands. Read it at
the start of every session. Update it at the end of every session.

## Current phase

**Gate B — Implementation (in progress).** Building the MVP sprint by sprint on branch
`dev` (see [`../03-planning/mvp-plan.md`](../03-planning/mvp-plan.md)). **S0, S1, and S2 are
done and verified** (lint, typecheck, tests, build all green; auth flow verified end-to-end
against a real running dev server, including a visual screenshot check of brand styling).
Next up: **S3 — app shell + shared components**.

## Confirmed decisions (owner-approved)

- Stack: Nuxt 4 (Nitro) + TypeScript, Node.js 22 LTS + npm.
- UI: NuxtUI (free) + TailwindCSS; Material Symbols via Iconify; Geist/Inter/Geist Mono fonts.
- Data: Drizzle ORM; SQLite for MVP, PostgreSQL from Phase 1.
- Auth (MVP): nuxt-auth-utils (encrypted session cookie).
- Brand / package name: Certra.
- MVP screen scope: all 6 app modules at demo quality (deep CRUD on Technical Files + GSPR + Risk).
- Marketing in MVP: Product Overview (landing) + Book a Demo; Solutions + Pricing in Phase 1.
- AI in MVP: mock (rule/template based); real Claude integration in Phase 1.
- Repo: single Nuxt app at repo root; `SDLC/` is the source of truth; `planlama/` archived to `eski-veriler/`.
- Commits and docs carry no tool-attribution trailers (owner preference).
- Design tokens: colors/radius per `taslak.md` (primary `#2456E6`, AI `#6D5AE6`, radius
  10/8/6, bg `#F5F7FA`, ink `#0E1B2C`); icons use Material Symbols.

## Timeline framing

- Owner's fast "1-2 week working demo" = this plan's **MVP**.
- TUBITAK application's "6-month MVP" = this plan's **Phase 1**.
- Sellable SaaS = **Phase 2**.

## Done

- **Gate A (documentation) complete:** full SDLC knowledge base authored and merged to
  `main` (product, architecture, STYLE_GUIDE, ADRs, standards, requirements, phase plans,
  references); root `AGENTS.md` and `README.md`; `planlama/` archived to `eski-veriler/`.
- **S0 — Scaffold + tooling:** Nuxt 4.4.8 app scaffolded at the repo root; module stack
  installed and wired (NuxtUI 4.9, `@nuxt/fonts`, `@nuxt/eslint`, `nuxt-auth-utils`, `zod`,
  `drizzle-orm`, `better-sqlite3`, `vitest`, Material Symbols); brand design tokens applied
  from STYLE_GUIDE as Tailwind `@theme` variables + NuxtUI theme.
- **S1 — Database:** Drizzle schema for all 9 MVP entities, generated SQL migrations,
  auto-migrating `createDb()`, realistic seed data mirroring the approved mockups (via a
  dev-only `POST /api/dev/seed` endpoint, password hashing injected so the seed module never
  hard-depends on `nuxt-auth-utils`), and API-facing `shared/types` + `shared/constants`.
- **S2 — Auth:** register/login/logout API routes on `nuxt-auth-utils` sessions; auth domain
  logic unit-tested in isolation (`server/utils/auth.ts`, explicit `h3` import so it needs no
  Nuxt runtime to test); server-side guard middleware (allowlist-based, protects `/api/*` by
  default); named client middleware + login/register pages + a guarded `dashboard.vue`
  placeholder (real content lands in S4) + a public `index.vue` placeholder (real content
  lands in S8). **Verified two ways:** (1) automated — 8 Vitest unit/integration tests
  green; (2) manual — full curl-based session flow against a live dev server, and a
  Playwright screenshot confirming the brand palette (`#2456E6`) actually renders.
- **Three real bugs found and fixed during S2** (all documented in the relevant
  architecture/standards docs, not just here): `vue-router` version mismatch broke
  `vue-tsc`; `app.config.ts` at the repo root was silently ignored (Nuxt reads it from
  `app/`); a module-level DB singleton caused intermittent test failures under parallel
  workers. See [`../01-architecture/tech-stack.md`](../01-architecture/tech-stack.md),
  [`../01-architecture/architecture.md`](../01-architecture/architecture.md), and
  [`../02-standards/testing-strategy.md`](../02-standards/testing-strategy.md).
- Documentation gap analysis vs the original source files (`eski-veriler/taslak.md`, the
  TUBITAK form): `00-product/market-and-business.md`, `00-product/module-map.md`,
  `01-architecture/api-conventions.md`, `storage-and-reports.md`, `deployment.md`, plus
  STYLE_GUIDE microcopy/component-state sections and design-token reconciliation.

## In progress

- Nothing mid-flight. S2 is fully committed and verified; ready to start S3.

## Next

1. **S3 — App shell + shared components:** `app` layout (sidebar/topbar/footer per
   STYLE_GUIDE) and shared components (StatusBadge, SeverityBadge, TraceabilityChip,
   ReadinessRing/Bar, AiPanel, DataTable, BentoCard). Wire `dashboard.vue` to
   `definePageMeta({ layout: 'app' })` once it exists (currently uses no layout, by design
   — see architecture.md).
2. Then S4 (dashboard), S5 (technical files), S6 (auditor simulation), S7 (module screens),
   S8 (marketing), S9 (CI/CD + Docker) per
   [`../03-planning/mvp-plan.md`](../03-planning/mvp-plan.md).
3. S9 note: the Dockerfile must `COPY server/database/migrations` into the image
   alongside `.output` (see [`../01-architecture/deployment.md`](../01-architecture/deployment.md)).

## Open items awaiting the owner

- Design assets: logo (SVG + favicon), 3-5 marketing photos, social-proof decision
  (real vs. clearly-labelled sample), ISO 13485/HIPAA badges only if truly certified.
  See [`../01-architecture/STYLE_GUIDE.md`](../01-architecture/STYLE_GUIDE.md).
- Scope decisions to confirm: (a) include a static **Traceability Thread** visual in the MVP
  (recommended); (b) confirm the MVP needs no mock **AI Document Generator** page.
  See `00-product/scope.md` -> "Scope decisions to confirm".

## How to run things locally

- `.env` exists locally (git-ignored) with a generated `NUXT_SESSION_PASSWORD`; copy
  `.env.example` if it's missing.
- `npm run dev` — dev server at `http://localhost:3000`.
- `npm run lint` / `npm run typecheck` / `npm run test` / `npm run build` — all currently green.
- `npm run db:generate` — regenerate SQL migrations after a schema change.
- Demo data: `POST /api/dev/seed` while `npm run dev` is running (dev-only, 404s otherwise).
  Seeded login: `demo@certra.app` / `CertraDemo!2026`.

## Working branch

- `dev` (Gate B implementation), 14 commits ahead of `main`. Default branch `main` holds the
  SDLC docs (merged and pushed). `dev` has not been merged/pushed yet — do that at a
  natural milestone (e.g., after S3, or now if the owner wants incremental visibility).
