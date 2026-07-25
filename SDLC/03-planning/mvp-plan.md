# MVP Plan

Delivered in working increments (agile). Each sprint ends with a runnable state and one or
more commits. Sprints are units of work, not calendar days. Requirement IDs reference
[`requirements.md`](requirements.md).

> Implementation is **Gate B** and starts only on the owner's explicit go-ahead. Until then
> this plan is a blueprint, not a task in progress. Current status: see
> [`../04-session-log/STATE.md`](../04-session-log/STATE.md).

## S0 — Scaffold & tooling

- Scaffold the Nuxt 4 project (TypeScript strict) at the repo root.
- Add NuxtUI, Tailwind, `@nuxt/fonts` (Geist/Inter/Geist Mono), Iconify Material Symbols.
- Implement design tokens in `app/assets/css/main.css` + `app.config.ts` per `STYLE_GUIDE.md`.
- Configure ESLint, `.env.example` (`NUXT_SESSION_PASSWORD`), Dockerfile, docker-compose.
- Root README + `AGENTS.md` bridge.
- **Acceptance:** `npm run dev` serves a themed blank app; `npm run lint` passes.
- Commits: `chore(init)`, `chore(deps)`, `feat(ui): add design tokens`.

## S1 — Database & seed

- Drizzle schema for all entities ([`../01-architecture/data-model.md`](../01-architecture/data-model.md)).
- Migrations + `seed.ts` with realistic demo data; shared types in `shared/types`.
- **Acceptance:** seed runs; a smoke test reads seeded rows. (FR data foundation)
- Commits: `feat(db): add schema`, `feat(db): add seed data`, `test(db): add schema smoke test`.

## S2 — Auth (FR-AUTH-1..4)

- `server/api/auth/{register,login,logout}.post.ts`; session via nuxt-auth-utils; scrypt.
- Server + client auth middleware; `login.vue`, `register.vue` in the `auth` layout.
- **Acceptance:** register -> login -> guarded route -> logout works; tests green.
- Commits: `feat(auth): server session`, `feat(auth): login and register pages`, `test(auth)`.

## S3 — App shell & shared components

- `app` layout: `AppSidebar`, `AppTopbar`, `AppFooter`.
- Shared components: StatusBadge, SeverityBadge, TraceabilityChip, ReadinessRing/Bar,
  AiPanel, DataTable, BentoCard.
- **Acceptance:** navigable shell matching the mockups; component tests for badges/table.
- Commits: `feat(layout): app shell`, `feat(ui): shared components`, `test(ui)`.

## S4 — Dashboard (FR-DASH-1..4)

- `server/api/dashboard/stats.get.ts`; `dashboard.vue` with all cards from seed data.
- **Acceptance:** dashboard renders readiness, files, approvals, deadlines, AI activity,
  findings; stats test green.
- Commits: `feat(dashboard): stats api`, `feat(dashboard): page`, `test(api): dashboard stats`.

## S5 — Technical files (FR-TF-*, FR-GSPR-1, FR-RISK-1)

- List page (filters, pagination) + detail page (Overview / GSPR / Risk tabs).
- APIs: technical-files list/get/create/patch; GSPR CRUD; Risk CRUD.
- Readiness recomputed from GSPR conformity.
- **Acceptance:** create a file; add/edit/delete GSPR and Risk entries; changes persist;
  API tests green.
- Commits: `feat(technical-file): list and detail`, `feat(gspr): matrix crud`,
  `feat(risk): register crud`, `test(api): technical file crud`.

## S6 — Auditor Simulation (FR-AUD-1..2)

- `server/utils/auditorRules.ts` rule engine; `server/api/auditor/simulate.post.ts`.
- UI: pick a file, run, show findings (severity + recommendation), export report.
- **Acceptance:** given seed state, expected findings appear; rule-engine unit tests green.
- Commits: `feat(auditor): rule engine`, `feat(auditor): simulation ui`, `test(auditor)`.

## S7 — Standalone module screens (FR-RISK-2, FR-CER-1, FR-PMS-1, FR-LOG-1..2)

- Risk Management, Clinical Evaluation, Post-Market, Audit Log screens (seed-driven).
- `auditLog.ts` writes entries on every mutation from earlier sprints.
- **Acceptance:** all four screens render from seed; mutations appear in the Audit Log.
- Commits: `feat(risk): standalone screen`, `feat(cer): screen`, `feat(pms): screen`,
  `feat(audit): log screen and auto-write`.

## S8 — Marketing (FR-MKT-1..2)

- Product Overview landing (`index.vue`) + Book a Demo (`book-a-demo.vue`).
- `server/api/demo-requests/index.post.ts` persists leads.
- **Acceptance:** landing renders; form submits and persists; endpoint test green.
- Commits: `feat(marketing): landing page`, `feat(marketing): book a demo`,
  `test(api): demo requests`.

## S9 — CI/CD, deploy & polish

- GitHub Actions: lint + test + build (`ci.yml`); Docker build + Coolify deploy (`deploy.yml`).
- Responsive/hover polish; coverage check; docs/README/CHANGELOG update.
- **Acceptance:** CI green on push; Docker image runs; manual checklist passes
  (see [`../01-architecture/architecture.md`](../01-architecture/architecture.md) + verification below).
- Commits: `ci: add pipelines`, `chore(docker): production image`, `fix`, `docs`.

## Verification (end of MVP)

```
npm run lint
npm run test
npm run test -- --coverage   # 60%+ critical paths
npm run build
docker build -t certra .
```

Manual: register/login/logout; dashboard from seed; technical file GSPR+Risk CRUD; auditor
simulation + export; the four module screens render; mutations appear in Audit Log; landing
+ book-a-demo persist; responsive; container runs.
