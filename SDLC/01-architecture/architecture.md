# System Architecture

## Overview

Certra is a **single Nuxt 4 application** that serves both the public marketing surface and
the authenticated app, with Nitro providing the server/API layer and Drizzle talking to the
database. One codebase, one deployable Docker image.

```
Browser
  |
  v
Nuxt 4 (Vue SSR)  --- public pages (/, /book-a-demo, /login, /register)
  |               --- app pages (/dashboard, /technical-files, /risk, ...)  [auth-guarded]
  v
Nitro server (server/api/*)  --- Zod validation --- auth (nuxt-auth-utils session)
  |
  v
Drizzle ORM  --->  SQLite (MVP)  /  PostgreSQL (Phase 1+)
```

## Layers and responsibilities

- **Pages (`app/pages`)** — routing and composition; no business logic beyond wiring.
- **Components (`app/components`)** — presentational and small interactive units, grouped
  by feature; shared primitives in `common/` and `layout/`.
- **Composables (`app/composables`)** — client-side data access and shared UI state
  (`useAuth`, `useTechnicalFiles`, `useToast`). They call server API routes; they never
  touch the database directly.
- **Server API (`server/api`)** — the only place with business logic and data mutations;
  each route validates input with Zod, checks auth, calls Drizzle, and returns typed data.
- **Server utils (`server/utils`)** — `db.ts` (Drizzle instance), `auditorRules.ts` (mock
  AI rule engine), `auditLog.ts` (writes audit entries on mutations).
- **Shared (`shared/`)** — TypeScript types and constants used by both client and server.

**Hard rule:** no database access from frontend code. All data flows through `server/api`.

## Directory structure

```
certra/ (repo root)
  app/
    app.config.ts              # NuxtUI theme (MUST live under app/, not root — see note below)
    assets/css/main.css        # design tokens (@theme) + base styles
    components/
      common/                  # StatusBadge, SeverityBadge, TraceabilityChip, ReadinessRing, AiPanel, DataTable, BentoCard
      layout/                  # AppSidebar, AppTopbar, AppFooter, MarketingNav, MarketingFooter
      dashboard/ technical-file/ risk/ clinical/ post-market/ audit/ auditor/ marketing/
    composables/
    layouts/                   # marketing.vue (public), app.vue (sidebar), auth.vue (fullscreen)
    middleware/auth.ts         # client route guard
    pages/
      index.vue book-a-demo.vue login.vue register.vue
      dashboard.vue
      technical-files/index.vue technical-files/[id].vue
      risk.vue clinical-evaluation.vue post-market.vue audit-log.vue
    utils/                     # format helpers, constants
  server/
    api/
      auth/{login,register,logout}.post.ts
      technical-files/{index.get,index.post,[id].get,[id].patch}.ts
      gspr/  risk/  clinical/  post-market/  audit-log/
      auditor/simulate.post.ts
      dashboard/stats.get.ts
      demo-requests/index.post.ts
    database/{schema.ts, migrations/, seed.ts}
    middleware/auth.ts         # server-side session check
    utils/{createDb.ts, db.ts, auth.ts, auditorRules.ts, auditLog.ts}
  shared/
    types/                     # technical-file.ts, gspr.ts, risk.ts, user.ts, ...
    constants/                 # gspr.ts, device-classes.ts
  SDLC/                        # this knowledge base (source of truth)
  eski-veriler/                # archived planning + UI mockups (visual reference)
  tests/{unit,integration}/
  AGENTS.md                    # session-protocol bridge for agent tools
  .github/workflows/{ci.yml, deploy.yml}
  Dockerfile docker-compose.yml drizzle.config.ts nuxt.config.ts
  .env.example eslint.config.mjs README.md CHANGELOG.md
```

**`app.config.ts` location (S2 finding):** Nuxt resolves `app.config.ts` from `dirs.app`
(the srcDir, `app/` in Nuxt 4), not the project root. A root-level `app.config.ts` is
silently ignored — no error, it just never applies, which is easy to miss (NuxtUI falls
back to its own default theme instead of throwing). Always place it at `app/app.config.ts`.

**`server/utils/createDb.ts` vs `db.ts` (S1/S2 finding):** `createDb(path)` is a pure
factory (no module-level side effects); `db.ts` builds the app's singleton `db` from it at
import time. Keeping them separate matters because importing *anything* from a module also
runs that module's top-level code — if the singleton lived in the same file as the factory,
tests importing `createDb` for an in-memory database would also open the real file-based
database as a side effect, which caused `SqliteError: database is locked` under parallel
test workers. App code imports `db` from `db.ts`; tests import `createDb` from `createDb.ts`
directly and never touch the real database file.

**Migrations path resolution (S2 finding):** `createDb.ts` resolves the migrations folder
via `resolve(process.cwd(), 'server/database/migrations')`, not `import.meta.url`. Nitro's
dev bundler does not preserve the real source file location, so an `import.meta.url`-relative
path silently pointed at a non-existent directory and `migrate()` threw "Can't find
meta/_journal.json file" at dev-server startup. `process.cwd()` works consistently in `nuxt
dev` (project root) and will keep working in Docker as long as the S9 image's `WORKDIR` and
the copied `server/database/migrations` path preserve the same relative layout (see
[`deployment.md`](deployment.md)).

File-size rule: keep source files under 500 lines and functions around 30 lines; split by
responsibility when exceeded (e.g. schema or a large page split into sub-modules/partials).

## Request flow (example: create a GSPR entry)

1. User submits the GSPR form in the Technical File detail page.
2. Composable `useTechnicalFiles` POSTs to `server/api/gspr/index.post.ts`.
3. The route runs server middleware auth check, validates the body with Zod, inserts via
   Drizzle, and writes an audit entry via `auditLog.ts`.
4. Typed result returns; the composable updates local state; the UI reflects it.

## Auth flow (MVP) — implemented in S2

- `nuxt-auth-utils` stores an encrypted session cookie (`httpOnly`, `secure`, `sameSite=lax`).
- Passwords hashed with scrypt (via nuxt-auth-utils' `hashPassword`/`verifyPassword`).
- `server/middleware/auth.ts` protects `/api/*` by default, allowlisting only
  `/api/auth/*`, `/api/demo-requests`, `/api/dev/*` as public; every new resource API is
  protected automatically without touching this file. `app/middleware/auth.ts` is a named
  (not global) client middleware, applied per-page via `definePageMeta({ middleware:
  ['auth'] })` (currently just the `dashboard.vue` placeholder).
- Auth domain logic (`createUser`, `verifyCredentials`, `findUserByEmail` in
  `server/utils/auth.ts`) explicitly imports from `h3` rather than relying on Nitro's
  auto-imports, so it is unit-testable with plain Vitest and no Nuxt runtime.
- Requires `NUXT_SESSION_PASSWORD` (see `.env.example`).
- Verified end-to-end against a real running dev server (not just unit tests): register ->
  protected route without session (401) -> with session (passes the guard) -> wrong-password
  login (401) -> correct login -> logout clears the cookie -> protected route 401s again.
- **MVP simplifications (explicit):** registration has no email verification; the "Forgot
  password" link is shown but password reset is deferred to Phase 1; session expiry uses the
  library default and is revisited in Phase 1.
- **RBAC scope (MVP):** any authenticated user can use the app; the `role` field is stored
  and displayed but not yet enforced per action. Per-action enforcement lands in Phase 1;
  multi-tenant isolation in Phase 2.

## AI (mock) architecture

`server/utils/auditorRules.ts` holds a deterministic rule set that inspects a technical
file's GSPR/risk state and emits findings (severity + recommendation). "AI drafts" shown on
the Dashboard are template-generated with static confidence values. In Phase 1 this module
is swapped for a Claude-backed implementation behind the same interface, so the UI and API
contracts do not change. See [`adr/005-mock-ai-for-mvp.md`](adr/005-mock-ai-for-mvp.md).

## Environments

- **Local:** `npm run dev`; SQLite file on disk; `docker-compose` for a container run.
- **CI:** GitHub Actions runs lint + test + build on push/PR.
- **Production (MVP):** Docker image deployed to Coolify on Hetzner.

## Evolution to Phase 1+

- Swap SQLite for PostgreSQL by changing the Drizzle dialect/config; add Redis for sessions.
- Replace the mock AI module with real Claude calls behind the same interface.
- Add traceability/change-impact services and the change-control workflow.
