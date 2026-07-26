# Project State (read this first)

> Last updated: 2026-07-27 — session `2026-07-27-traceability-p1-03`

This file is the fast, always-current snapshot of where the project stands. Read it at
the start of every session. Update it at the end of every session.

## Current phase

**Phase 1 — in progress (parallel feature branches off `dev`).** The MVP (S0-S9) is code-complete
and verified. Phase 1 work is now split across two independent feature branches, each awaiting its
own PR into `dev` (Phase 1 makes PR + review mandatory — see `../02-standards/branching.md`):
- **P1-02 — Clinical + Post-Market full CRUD** on `feat/clinical-pms-crud` (see that branch; not on
  `dev` yet).
- **P1-03 — Traceability matrix + change-impact** on `feat/traceability-matrix` (**this session**).
The two branches are disjoint in the files they touch except for shared docs (`STATE.md`,
`phase-1-plan.md`, `data-model.md`) — expect a small docs merge when the second one lands.

**Gate B — Implementation: MVP complete (S0-S9).** Built the MVP sprint by sprint on branch
`dev` (see [`../03-planning/mvp-plan.md`](../03-planning/mvp-plan.md)). **All ten sprints are done
and verified** (lint, typecheck, tests, build, and coverage all green; every flow exercised against
a real running dev server and confirmed in a headless browser). S9 (CI/CD + Docker) shipped the
GitHub Actions pipelines, the production Dockerfile, and a coverage check — the one caveat is that
`docker build` could not be run in the S9 session's environment (no Docker daemon), so the image
must be built once on a Docker host or via the first `deploy.yml` run (see Open items).

**Build order** (S8 marketing was built out of sequence on owner instruction): S0-S2 foundation,
then S8 marketing, then S3 app shell, S4 dashboard, S5 technical files, S6 auditor simulation, and
S7 the four standalone module screens (Risk / Clinical / Post-Market / Audit Log) with audit
auto-write. The two shells (marketing vs app) are architecturally independent (each has its own
layout/nav/footer — see `architecture.md`).

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
  placeholder (real content lands in S4) + a public `index.vue` placeholder (replaced by the
  real landing page in S8, see below). **Verified two ways:** (1) automated — 8 Vitest unit/integration tests
  green; (2) manual — full curl-based session flow against a live dev server, and a
  Playwright screenshot confirming the brand palette (`#2456E6`) actually renders.
- **Three real bugs found and fixed during S2** (all documented in the relevant
  architecture/standards docs, not just here): `vue-router` version mismatch broke
  `vue-tsc`; `app.config.ts` at the repo root was silently ignored (Nuxt reads it from
  `app/`); a module-level DB singleton caused intermittent test failures under parallel
  workers. See [`../01-architecture/tech-stack.md`](../01-architecture/tech-stack.md),
  [`../01-architecture/architecture.md`](../01-architecture/architecture.md), and
  [`../02-standards/testing-strategy.md`](../02-standards/testing-strategy.md).
- **A fourth S2 bug, found later (2026-07-15) by the owner manually clicking through the
  app:** `server/middleware/auth.ts` protected all of `/api/*` except a small allowlist,
  which didn't cover Nuxt modules' own internal endpoints — nuxt-auth-utils' own session
  check (`/api/_auth/session`) and Nuxt Icon's icon fetch (`/api/_nuxt_icon/*`) were both
  getting a 401 from *this* middleware instead of their own handler. In practice: the
  login form could appear to do nothing, because `refreshSession()` right after a
  successful login POST hit the blocked session-check endpoint. The S2 session's own
  verification didn't catch this because it drove the flow with `curl` (which never
  triggers `useUserSession()`'s client-side re-check) rather than an actual browser click.
  Fixed by exempting `/api/_*` generally (the convention Nuxt modules use for their own
  routes) instead of allowlisting module by module; the prefix check now lives in
  `server/utils/publicApiPaths.ts`, unit-tested. Documented in
  [`../01-architecture/api-conventions.md`](../01-architecture/api-conventions.md) and the
  session log (`sessions/2026-07-15-marketing-s8.md`).
- Documentation gap analysis vs the original source files (`eski-veriler/taslak.md`, the
  TUBITAK form): `00-product/market-and-business.md`, `00-product/module-map.md`,
  `01-architecture/api-conventions.md`, `storage-and-reports.md`, `deployment.md`, plus
  STYLE_GUIDE microcopy/component-state sections and design-token reconciliation.
- **S8 — Marketing (built ahead of S3-S7, see "Current phase" above):** `marketing` layout
  + `MarketingNav`/`MarketingFooter`; Product Overview landing (`index.vue`, replacing the
  S2 placeholder) with hero, module bento, human-in-the-loop trust section, and CTA band;
  `book-a-demo.vue` (value props + form) posting to `POST /api/demo-requests`
  (Zod-validated, backed by `server/utils/demoRequests.ts`, unit-tested). Nav intentionally
  shows only "Product" (an in-page anchor) — Solutions/Pricing are Phase 1 pages that don't
  exist yet, so they're omitted rather than linked as dead routes (see
  `00-product/scope.md`). No stock photography, customer logos, testimonial, or
  certification badges were added: those are still open owner decisions (see "Open items"
  below and `01-architecture/STYLE_GUIDE.md` section 10); the hero/trust visuals are
  CSS-only placeholders instead. Added `components: [{ path: '~/components', pathPrefix:
  false }]` to `nuxt.config.ts` so component tags match their filename regardless of
  subfolder (e.g. `MarketingNav`, not `LayoutMarketingNav`) — keep naming components with
  an explicit feature prefix in the filename (as done here) to avoid collisions now that
  folder-based prefixing is off; this will matter for S3's own component library too.
  **Verified:** `npm run lint`/`typecheck`/`test`/`build` all green (10/10 tests); manual
  check against a live dev server (`curl` POST persisted a row, invalid input got a 400);
  Playwright screenshots of `/` and `/book-a-demo` at 1280px and 375px confirmed the brand
  palette, icons, and responsive layout render correctly.
- **S3 — App shell + shared components (this session, 2026-07-25):** the authenticated `app`
  layout (`AppSidebar` fixed 240px + mobile drawer, `AppTopbar` with breadcrumb / search /
  notifications / user menu + sign out, slim `AppFooter`), a shared component library in
  `app/components/common/` (ToneBadge + StatusBadge/SeverityBadge, TraceabilityChip,
  ReadinessRing, ReadinessBar, AiPanel, DataTable, BentoCard, ModulePlaceholder), and the
  navigation model in composables (`useAppNav`, `useSidebar`). Badge/table/readiness logic is
  extracted to pure, unit-tested `app/utils/{badges,readiness,table}.ts` (single tone
  vocabulary for all status/severity enums). `dashboard.vue` now uses `layout: 'app'`; every
  sidebar link resolves to a real guarded page (five module placeholders replaced in S4-S7),
  so there are no dead routes; Settings/Support render disabled (out of MVP scope). Component
  render tests use `@nuxt/test-utils` (`mountSuspended`) with a Node-default `vitest.config.ts`.
  **Verified:** lint/typecheck/test (32 pass)/build all green; curl smoke test of every route;
  headless-Chromium UI login lands on `/dashboard` with the shell rendering, screenshots at
  1280px + 390px. See `sessions/2026-07-25-app-shell-s3.md`. STYLE_GUIDE section 6 updated
  (slim app footer) and `eslint.config.mjs` disables `vue/require-default-prop` for TS props.
- **S4 — Dashboard (this session, 2026-07-25):** `GET /api/dashboard/stats` (auth-protected)
  backed by `getDashboardStats(db)` in `server/utils/dashboard.ts` (pure, unit-tested), plus
  the real `dashboard.vue` composed entirely from the S3 component library. Surfaces portfolio
  readiness (65% mean), per-file readiness bars toned by status, pending approvals (4),
  upcoming PMS deadlines (live days-remaining), mock AI drafts (3, by confidence), and open
  deficiency findings (4, critical-first, with GSPR traceability chips). `DataTable`'s generic
  relaxed to `T extends object` so typed row interfaces work. **Verified:** lint/typecheck/test
  (34 pass)/build green; API 401 without a session and correct aggregates with one; headless
  Chromium screenshots at 1280px + 390px. See `sessions/2026-07-25-dashboard-s4.md`.
- **Auth cookie fix (2026-07-25):** session cookie made `Secure` in production only (see
  "Open items" — the browser login bug the owner hit is resolved).
- **S5 — Technical files (2026-07-26, FR-TF-*, FR-GSPR-1, FR-RISK-1):** the full technical-file
  module. **Backend** (committed by the prior, unlogged session — `85c41d7`, `979b289`,
  `6b581ca`): list (filters/pagination), get-detail (file + GSPR + risks), create, patch, and
  GSPR + Risk CRUD as pure `server/utils/{technicalFiles,gspr,risk}.ts` behind thin routes, with
  readiness recomputed from GSPR conformity (`refreshReadiness`); +12 unit tests. **Frontend**
  (written by the prior session, verified/fixed/committed this session as `a47670c`): list page
  (`technical-files/index.vue`) and detail page (`[id].vue` — Overview / GSPR matrix / Risk
  register tabs) composed from six `app/components/technical-file/*` components + a shared
  `common/ConfirmDialog`. **The prior frontend was never type-checked**; this session fixed 7
  `vue-tsc` errors before committing — three UForm reactive states whose enum fields inferred as
  `string` (cast the initial value to its union type) and four inline `@click` handlers that
  returned a value (NuxtUI handlers are `void | Promise<void>` — use named void handlers). Both
  recorded in `coding-standards.md`. **Verified:** lint/typecheck/test (**46 pass**)/build green;
  a live dev server exercised the full create -> add GSPR -> readiness recompute
  (0->100->50->25->0) -> delete cycle, risk CRUD, filters/search, 401 without a session, 400 on
  bad input, and SSR-rendered the list + detail pages with zero component-resolution warnings.
  See `sessions/2026-07-26-technical-files-s5.md`.
- **S5 mutations now write audit-log entries (RESOLVED in S7).** `server/utils/auditLog.ts`
  (`writeAuditLog`) is called by every technical-file / GSPR / risk mutation route; the Audit Log
  screen lists them (FR-LOG-1/2).
- **S6 — Auditor Simulation (2026-07-26, FR-AUD-1..2):** a deterministic mock rule engine
  (`server/utils/auditorRules.ts`, `runAuditorSimulation`) over a file's GSPR conformity and ISO
  14971 risk state — missing GSPR = critical, partial = major, unmitigated high-severity risk =
  critical/major, mitigated-without-verification = minor, readiness < 70% = major. `POST
  /api/auditor/simulate` returns the **ephemeral** findings (not persisted; the seeded
  `auditor_findings` still back the dashboard). UI is a new **Auditor sim** tab on the
  technical-file detail that runs on mount and shows a pass banner or a severity summary + findings
  list; **Export report** downloads a Markdown report (pure `buildAuditorReportMarkdown`,
  unit-tested). Commits `e52c288` (engine + api + tests) and `47e3bc1` (ui + export). **Verified:**
  lint/typecheck/test (**52 pass**, +6)/build green; live API gave 401 unauth, 404 missing, 400 bad
  body, CardioGuard pass (0 findings) and GlucoCheck 6 findings (3 critical / 3 major,
  critical-first); a headless-Chromium run clicked the tab and confirmed findings and the pass
  banner render with zero console errors. See `sessions/2026-07-26-auditor-s6.md`.
- **S7 — Standalone module screens (2026-07-26, FR-RISK-2, FR-CER-1, FR-PMS-1, FR-LOG-1..2):** the
  four seed-driven screens replacing the S3 placeholders — Risk Management (portfolio ISO 14971
  register + summary cards), Clinical Evaluation (evidence table + AI-suggestions panel), Post-Market
  (milestone timeline + plans table + AI insight), and Audit Log (KPI cards + actor/impact filters +
  table), each backed by a pure `server/utils/{riskRegister,clinical,postMarket}.ts` + GET route.
  **`server/utils/auditLog.ts` now auto-writes an audit entry on every mutation** (technical-file /
  GSPR / risk create/update/delete via `writeAuditLog` in each route; `getAuditLogView` backs the
  screen with KPIs + filters) — this **resolves the S5 deferral above**. Commits `611b4ba` (audit),
  `813417f` (risk), `c7e6b9b` (cer), `a32831d` (pms). **Verified:** lint/typecheck/test (**58 pass**,
  +6)/build green; live API returned correct aggregates for all four endpoints and a create mutation
  wrote a "Created technical file" audit entry that surfaced at the top of the log (FR-LOG-1); all
  four screens SSR-render and were confirmed in a headless browser with zero console errors. See
  `sessions/2026-07-26-modules-s7.md`.
- **S9 — CI/CD, Docker & coverage (2026-07-26, final MVP sprint):** two GitHub Actions workflows —
  `ci.yml` (push to `main`/`dev` + PRs to `main`: `npm ci` -> lint -> typecheck -> test -> build)
  and `deploy.yml` (push to `main`: build the image, push to GHCR `latest` + short-SHA, then a
  Coolify redeploy webhook that self-skips when the secrets are unset). A multi-stage
  `node:22-alpine` **Dockerfile** (build stage copies full source before `npm ci` so `nuxt prepare`
  + better-sqlite3's native build both run; runtime stage adds `libstdc++`, runs as non-root `node`,
  and **`COPY`s `server/database/migrations` alongside `.output`** per the S2 finding), plus
  `.dockerignore` and a `docker-compose.yml` (named volume for the SQLite file). Coverage wired up:
  `@vitest/coverage-v8`, a `test:coverage` script, and a 60% threshold in `vitest.config.ts` scoped
  to `server/utils` + `app/utils`. Root `README.md` rewritten (MVP built; run/Docker instructions),
  new `CHANGELOG.md`, and `deployment.md` synced. Commits `470ad38` (ci), `03d25ef` (docker),
  `be4870c` (coverage), `c6107a0` (docs). **Verified:** lint / typecheck / test (**58 pass**) /
  build all green, and coverage **93.8% stmts, 80% branch, 97.8% funcs, 96.8% lines** (>> 60%
  threshold). **Not verified locally: `docker build`** — no Docker daemon in this environment; the
  Dockerfile/paths were checked by inspection (`.output` and `server/database/migrations` both
  present) but the image must be built once on a Docker host or by the first `deploy.yml` run. See
  `sessions/2026-07-26-cicd-s9.md`.

### Phase 1

- **P1-03 — Traceability matrix + change-impact (2026-07-27, FR-TRC-2):** cross-artifact traceability
  for a technical file, delivered as the user-facing half of Phase 1 workstream #3. A **pure graph
  builder** (`server/utils/traceability.ts`, `buildTraceabilityGraph`) **derives** the graph
  (GSPR <-> risk <-> test <-> clinical, plus standards) from the existing reference fields
  (`risk.traceabilityRefs/verificationRef/controlMeasureRef`, `gspr.standardRefs/evidenceRefs`) — no
  schema migration; promoting those JSON refs to relational link tables stays deferred, with the
  builder as the stable seam (**ADR-008**). New `GET /api/technical-files/:id/traceability` (thin
  route, mirrors the auditor route), a **Traceability tab** on the file detail
  (`TraceabilityMatrix` + `TraceabilityGrid` + `TraceNodeChip`) showing a GSPR x risk coverage
  matrix, coverage-gap list, click-a-node **change-impact** (undirected BFS, `app/utils/traceability.ts`),
  and a Markdown export. Seed data enriched with realistic cross-refs so the matrix/gaps/impact are
  demonstrable. +14 unit tests. **Verified:** lint / typecheck / test (**72 pass**, +14) / build all
  green; live API gave 401 unauth, 400 bad id, 404 missing, and correct graphs for three files —
  CardioGuard 100% coverage / 0 gaps, NeuroScan 67% / gaps [GSPR 10.2, RISK-015], Orthopedic Fusion
  50% / gap [GSPR 1]; the detail page SSR-renders with the new tab and zero Vue warnings. **Not
  browser-driven this session** (Chrome extension not connected) — a click-through of the tab's
  change-impact interaction is a pre-merge follow-up. On `feat/traceability-matrix`. See
  `sessions/2026-07-27-traceability-p1-03.md`.

## In progress

- **P1-03 awaits its PR into `dev`** (feature branch `feat/traceability-matrix`, off `dev`).
  Code-complete, quality gate green; a browser click-through of the Traceability tab (select a GSPR/risk
  header and confirm the change-impact highlight + list) is the recommended pre-merge check.
- **P1-02 also awaits its PR into `dev`** (parallel branch `feat/clinical-pms-crud`; see the
  "Current phase" note). Nothing else mid-flight.

## Next

1. **Open the two Phase 1 PRs into `dev`** (`feat/traceability-matrix` and `feat/clinical-pms-crud`),
   each after its recommended browser click-through. When the second merges, resolve the small docs
   overlap in `STATE.md` / `phase-1-plan.md` / `data-model.md`.
2. **Pick the next Phase 1 thread.** Flagship is #1 real AI (Claude) integration; the natural
   follow-on to P1-03 is the **link-table promotion** (workstream #3 remainder) or #7
   Solutions/Pricing marketing pages. See [`../03-planning/phase-1-plan.md`](../03-planning/phase-1-plan.md).
3. **Still open from the MVP (owner-gated):** verify the Docker image on a Docker host (or via the
   first `deploy.yml` run) — `docker build -t certra .`, run with a `NUXT_SESSION_PASSWORD` and a
   volume on `/app/.data`, confirm a fresh container boots without a "Can't find meta/_journal.json"
   error; set the deploy secrets (`COOLIFY_WEBHOOK`, `COOLIFY_TOKEN`); and merge `dev -> main` to ship
   the MVP (triggers `deploy.yml`).

## Open items awaiting the owner

- **RESOLVED (2026-07-25), two distinct auth bugs:**
  1. The S2 `/api/_*` middleware 401 — confirmed fixed (`/api/_auth/session` returns 200 with
     and without a cookie).
  2. **Session cookie `Secure`-over-http** — found when the owner tested login in their own
     browser and it would not reach `/dashboard`. The cookie's default `secure: true` is
     rejected over `http://localhost` by Safari/Firefox (Chromium allows it, which is why the
     headless-Chromium check passed and masked it). Fixed in `nuxt.config.ts`:
     `runtimeConfig.session.cookie.secure = NODE_ENV === 'production'` (Secure in prod/HTTPS,
     off in dev). Verified: dev `Set-Cookie` no longer carries `Secure`; login + session both
     200. See `architecture.md` auth section. **Owner: hard-reload `/login` and retry.**
- **Seed endpoint is not idempotent (dev tooling):** `POST /api/dev/seed` returns 500
  (`UNIQUE constraint failed: users.email`) once the local `.data` DB is already seeded.
  Harmless (data + login work), but re-seeding a populated DB fails; consider clear-then-seed
  or a graceful 409. Not an S3 change.
- Design assets: logo (SVG + favicon), 3-5 marketing photos, social-proof decision
  (real vs. clearly-labelled sample), ISO 13485/HIPAA badges only if truly certified.
  See [`../01-architecture/STYLE_GUIDE.md`](../01-architecture/STYLE_GUIDE.md). The S8
  landing/book-a-demo pages are live now without these (CSS-only hero/trust visuals, no
  testimonial or badges) — swapping in real assets is a follow-up, not a blocker.
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

- **`feat/traceability-matrix`** (off `dev`) holds the P1-03 work — open a PR into `dev` (Phase 1
  requires PR + review).
- **`feat/clinical-pms-crud`** (off `dev`) holds the parallel P1-02 work — also awaiting a PR into `dev`.
- `dev` carries the full S0-S9 MVP and is pushed to `origin/dev`. Default branch `main` holds the SDLC
  docs; a `dev -> main` merge (the MVP is code-complete) is the owner's call and triggers `deploy.yml`.
