# Testing Strategy

Tests are not optional. When building with AI agents especially, tests are the safety net
that keeps working increments actually working.

## Tooling

- **Vitest** for unit and integration tests.
- **@nuxt/test-utils** for component/integration tests that need a Nuxt runtime.
- Coverage via `vitest --coverage`.

## Layers

| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest | Pure functions, composables, utils (e.g. readiness calc, auditor rules, formatters) |
| API / integration | Vitest + Nuxt test utils | Server routes: auth, CRUD, validation, auditor simulate, demo-requests |
| Component | @nuxt/test-utils | Critical components (Dashboard cards, GSPR table, Risk table) |

## What must be tested in the MVP

- Auth flow: register, login, logout, session, route guard.
- Technical file CRUD; GSPR CRUD; Risk CRUD.
- Dashboard stats computation.
- Auditor Simulation rule engine (given seed state, expected findings).
- Demo-request submission persists correctly.

**Coverage target (MVP):** 60%+ on critical paths. Coverage is a signal, not a goal in
itself; prioritize meaningful assertions over percentage.

## Workflow per feature

1. Write the API/unit test first (red).
2. Implement until green.
3. Refactor.
4. Commit (`test(...)` alongside or just before `feat(...)`).

## Test location

Alongside the source or under `tests/`. Example:

```
server/api/auth/login.post.ts
server/api/auth/__tests__/login.test.ts
```

## Test data isolation

- Integration tests run against a **separate SQLite database** (in-memory or a temp file),
  never the dev/prod database.
- Seed a known fixture per suite and reset between tests (fresh DB or transaction rollback)
  so tests are deterministic and independent of order.

## CI

`npm run test` runs in GitHub Actions on every push/PR and must pass before build/deploy.
