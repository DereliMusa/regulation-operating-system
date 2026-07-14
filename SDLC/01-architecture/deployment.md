# Deployment, CI/CD & Configuration

Concrete build/deploy and configuration reference. Templates below are authored during S0
(implementation); this doc is the specification.

## Environments

- **Local:** `npm run dev`; SQLite file on disk.
- **CI:** GitHub Actions runs lint + test + build on push/PR.
- **Production (MVP):** Docker image deployed to Coolify on Hetzner.

## Environment variables

| Var | Phase | Purpose |
|---|---|---|
| `NUXT_SESSION_PASSWORD` | MVP | Encrypts the session cookie (>= 32 chars) |
| `DATABASE_PATH` | MVP | SQLite file location |
| `NODE_ENV` | MVP | `development` / `production` |
| `NUXT_PUBLIC_SITE_URL` | MVP | Canonical URL for links/SSR |
| `DATABASE_URL` | Phase 1 | PostgreSQL connection string |
| `REDIS_URL` | Phase 1 | Session/cache store |
| `ANTHROPIC_API_KEY` | Phase 1 | Claude API for real AI |
| `SENTRY_DSN` | Phase 1 | Error tracking |
| `SMTP_*` | Phase 1 | Nodemailer (demo/notification email) |
| `COOLIFY_WEBHOOK`, `COOLIFY_TOKEN` | MVP (deploy) | Trigger redeploy (GitHub secrets) |

`.env` is git-ignored; `.env.example` documents every required var. Secrets live in GitHub
Actions secrets / the host, never in the repo. Prefer Nuxt `runtimeConfig` over reading
`process.env` directly in app code.

## CI pipeline (`.github/workflows/ci.yml`)

On push to `main`/`dev` and PRs to `main`: checkout, setup Node 22 (npm cache), `npm ci`,
`npm run lint`, `npm run test`, `npm run build`. All must pass.

## Deploy pipeline (`.github/workflows/deploy.yml`)

On push to `main`: build the Docker image and push to GHCR
(`ghcr.io/<owner>/<repo>:latest`), then call the Coolify redeploy webhook.

## Dockerfile

Multi-stage `node:22-alpine`: build stage runs `npm ci` + `npm run build`; production stage
copies `.output` and runs `node .output/server/index.mjs` on port 3000 with
`NODE_ENV=production`.

Note: SQLite in a container needs a **persistent volume** (otherwise data resets on
redeploy). This is acceptable for a single-user demo; real multi-user production uses
PostgreSQL (Phase 1).

**Migrations directory must ship alongside `.output` (S9 requirement, found in S2):**
`server/utils/createDb.ts` resolves the migrations folder as
`resolve(process.cwd(), 'server/database/migrations')` rather than via `import.meta.url`,
because Nitro's dev bundler does not preserve real source file locations. This means the
Docker image's production stage must **also `COPY server/database/migrations` into the
image** at the same relative path from `WORKDIR`, alongside `.output` — `npm run build`
alone does not include it. Verify after building the S9 image that a fresh container boots
without a "Can't find meta/_journal.json file" error.

## Database migrations & seeding

- Schema changes: `drizzle-kit generate` (`npm run db:generate`) produces SQL migrations
  checked into `server/database/migrations/`.
- Migrations are applied **automatically** the first time any server code imports `db` from
  `server/utils/db.ts` (`createDb()` calls Drizzle's `migrate()` before returning) — there is
  no separate manual apply step for the MVP.
- **Seeding is guarded**: the dev-only `POST /api/dev/seed` endpoint (404s outside
  development) is the only way to populate demo data; nothing seeds automatically or against
  production. Seed content is clearly demonstrative (see `server/database/seed-data.ts`).

## Rollout notes

- `main` is always deployable; MVP allows direct `dev -> main`. From Phase 1, PR + green CI
  is required to merge (see [`../02-standards/branching.md`](../02-standards/branching.md)).
