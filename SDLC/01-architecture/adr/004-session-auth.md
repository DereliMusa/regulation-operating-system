# ADR-004: Session-based auth for the MVP

- **Status:** Accepted
- **Date:** 2026-07-14

## Context

The MVP needs simple, secure authentication without token-management overhead. SSO/SAML/OIDC
are explicitly a Phase-2 concern.

## Decision

Use **nuxt-auth-utils** with encrypted, `httpOnly` session cookies. Hash passwords with
scrypt (via the library's helpers). Enforce auth in `server/middleware/auth.ts` and guard
app routes in `app/middleware/auth.ts`.

## Consequences

- Minimal, secure setup; no JWT lifecycle to manage.
- Requires a `NUXT_SESSION_PASSWORD` secret (documented in `.env.example`).
- Cookies set `httpOnly` / `secure` / `sameSite`.
- Roles are a single field on the user for the MVP (`admin`/`ra`/`qa`/`viewer`);
  fine-grained RBAC and multi-tenant orgs come in Phase 2.
- Redis-backed sessions are introduced with the PostgreSQL move in Phase 1.
