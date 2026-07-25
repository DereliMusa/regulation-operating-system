# Project State (read this first)

> Last updated: 2026-07-26 — session `2026-07-26-auditor-s6`

This file is the fast, always-current snapshot of where the project stands. Read it at
the start of every session. Update it at the end of every session.

## Current phase

**Gate B — Implementation (in progress).** Building the MVP sprint by sprint on branch
`dev` (see [`../03-planning/mvp-plan.md`](../03-planning/mvp-plan.md)). **S0, S1, S2, S3, S4,
S5, S6, and S8 are done and verified** (lint, typecheck, tests, build all green; flows verified
against a real running dev server — the S6 Auditor Simulation was exercised end-to-end via the API
and confirmed in a headless browser, findings rendering on the technical-file detail tab).

**S8 — Marketing was built out of sequence** (owner instruction), then **S3 — app shell**,
**S4 — Dashboard**, **S5 — Technical files**, and **S6 — Auditor Simulation** were built. The
remaining app-side screen is **S7 (next)**, plus **S9** (CI/CD + Docker). The two shells
(marketing vs app) are architecturally independent (each has its own layout/nav/footer — see
`architecture.md`).

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
- **S5 mutations do not yet write audit-log entries** (`server/utils/auditLog.ts` doesn't exist
  yet). Per `mvp-plan.md` this is S7's job (it wires `auditLog.ts` across all earlier mutations),
  so it's expected — flagged here so S7 doesn't miss it.
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

## In progress

- Nothing mid-flight. S6 is fully committed and verified; ready to start S7.

## Next

1. **S7 — Standalone module screens (FR-RISK-2, FR-CER-1, FR-PMS-1, FR-LOG-1..2):** the Risk
   Management, Clinical Evaluation, Post-Market, and Audit Log screens (seed-driven, read-mostly),
   replacing the S3 placeholder pages, plus `server/utils/auditLog.ts` wired to auto-write an audit
   entry on every mutation from earlier sprints (technical-file / GSPR / risk create/update/delete).
   The Audit Log screen then lists those entries with filters + KPI cards.
2. Then S9 (CI/CD + Docker) per
   [`../03-planning/mvp-plan.md`](../03-planning/mvp-plan.md). S8 (marketing) is already done.
3. S9 note: the Dockerfile must `COPY server/database/migrations` into the image
   alongside `.output` (see [`../01-architecture/deployment.md`](../01-architecture/deployment.md)).

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

- `dev` (Gate B implementation), ahead of `main` by the S0-S5 + S8 implementation commits.
  **Pushed to `origin/dev` this session** (S5 done), so the remote branch is current. Default
  branch `main` holds the SDLC docs (merged and pushed); a `dev -> main` merge is still the
  owner's call.
