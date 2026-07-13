# Technology Stack

Guiding principle: **choose boring, well-integrated technology; add complexity only when a
phase truly needs it** (KISS / YAGNI). Decisions with meaningful trade-offs have an ADR in
[`adr/`](adr).

## MVP stack

| Layer | Choice | Why |
|---|---|---|
| Framework / server engine | **Nuxt 3** (Nitro) | Fullstack, SSR, built-in API routes; one codebase. See [ADR-001](adr/001-nuxt-fullstack.md) |
| Language | **TypeScript** (strict) | Type safety across app + server + shared |
| Runtime / package manager | **Node.js 22 LTS + npm** | Stable, fully Nuxt-tested; fastest safe path |
| UI | **NuxtUI (free) + TailwindCSS** | Nuxt-native components; no paid license |
| Icons | **Material Symbols via Iconify** (`@iconify-json/material-symbols`) | Matches mockups; offline, no Google Fonts dependency |
| Fonts | **Geist, Inter, Geist Mono** via `@nuxt/fonts` | Matches mockups; free (self-hosted) |
| Database | **SQLite** (`better-sqlite3`) | Zero-config single file; ideal for MVP. See [ADR-002](adr/002-sqlite-for-mvp.md) |
| ORM / data access | **Drizzle ORM** | SQL-like, type-safe, parameterized, easy dialect switch. See [ADR-003](adr/003-drizzle-orm.md) |
| Auth | **nuxt-auth-utils** | Encrypted session cookies; scrypt hashing. See [ADR-004](adr/004-session-auth.md) |
| Validation | **Zod** | Schema validation for forms and API inputs |
| AI | **Mock (rules/templates)** | Demonstrable without model dependency. See [ADR-005](adr/005-mock-ai-for-mvp.md) |
| Testing | **Vitest** + `@nuxt/test-utils` | Unit + integration + component tests |
| Linting | **ESLint** (`@nuxt/eslint`) | Nuxt-native config |
| Container | **Docker** (multi-stage) | Single lightweight image |
| CI/CD | **GitHub Actions** | Lint + test + build + deploy |
| Deploy | **Coolify on Hetzner** | Self-hosted PaaS, Docker deploy |
| VCS | **Git + GitHub** | Version control + repo |

## Phase 1 additions

| Choice | Why |
|---|---|
| **PostgreSQL + Redis** | Scalable, production-grade; Redis for session/cache |
| **Claude API** | Real AI document generation + auditor analysis |
| **Sentry** | Error tracking |
| **i18n** (`@nuxtjs/i18n`) | EN / TR / DE |
| **Nodemailer** | Demo-request and notification email |

## Phase 2 additions

| Choice | Why |
|---|---|
| **Keycloak or Better Auth** | SSO / SAML / OIDC, multi-tenant |
| **Prometheus + Grafana, Datadog** | Monitoring + APM |
| **Terraform + AWS** | Infrastructure as code |

## Notable compatibility notes

- NuxtUI v3 uses **Tailwind CSS v4**; design tokens are defined via CSS `@theme` in
  `app/assets/css/main.css` plus `app.config.ts`. Exact versions are pinned during S0 and
  recorded here once the scaffold exists.
- The Drizzle SQLite -> PostgreSQL switch is a dialect/config change; the schema stays
  largely the same. This is the main reason Drizzle was chosen over raw SQL.

## Explicitly rejected / deferred (with reason)

- **Bun** as runtime: deferred; occasional Nuxt/Nitro edge cases are not worth the risk
  under time pressure. May be trialed post-MVP on a separate branch.
- **NuxtUI Pro** (paid): not purchased; free NuxtUI + hand-written components suffice.
- **Raw SQL** instead of an ORM: rejected in favor of Drizzle (SQL-like but type-safe and
  parameterized).
- **Prisma / TypeORM / Mongoose**: rejected; heavier or further from SQL than Drizzle.
- **Separate Express backend**: unnecessary; Nitro is the server engine.
- **MongoDB**: rejected for MVP; the data is relational (traceability links).
- **Ansible**: only reconsider if server count grows enough to justify it.
