# Security Standards

Certra handles regulatory documentation, so security and integrity matter from day one.
The MVP implements a baseline; later phases harden it.

## MVP baseline

- **Sessions:** encrypted cookies via nuxt-auth-utils; `httpOnly`, `secure`, `sameSite`.
- **Passwords:** hashed with scrypt (never stored or logged in plaintext).
- **Input validation:** every API input validated with **Zod**; reject unexpected shapes.
- **SQL injection:** only parameterized queries via Drizzle; never string-build SQL.
- **Secrets:** `.env` is git-ignored; `.env.example` documents required vars
  (`NUXT_SESSION_PASSWORD`, etc.). No secrets in the repo or in logs.
- **AuthZ:** protected routes enforced server-side (`server/middleware/auth.ts`), not only
  in the client guard.
- **CORS:** configured to the app's own origin.
- **Audit trail:** mutations write to `audit_log` for traceability.
- **Integrity of claims:** do not display false certification/compliance badges; mark
  non-real data as "sample" (see `../01-architecture/STYLE_GUIDE.md`).

## Phase 1 hardening

- Move sessions to Redis; migrate to PostgreSQL with least-privilege DB credentials.
- Add **Sentry** for error visibility (scrub PII).
- Rate-limit auth and public form endpoints.
- Dependency scanning in CI.

## Phase 2 hardening

- SSO/SAML/OIDC; fine-grained RBAC; multi-tenant isolation.
- **PKI-based e-signature** and tamper-evident audit trail for regulatory compliance
  (align with applicable EU/ETSI requirements).
- Full monitoring/alerting; documented incident response.

## Never

- Never commit secrets or real customer/patient data.
- Never log credentials, tokens, or full session contents.
- Never bypass server-side authorization checks for convenience.
