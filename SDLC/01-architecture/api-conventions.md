# API Conventions

Consistent contracts for all Nitro server routes in `server/api`. Keeps the client simple
and the API predictable.

## Routing

- File-based Nitro routes: `index.get.ts`, `index.post.ts`, `[id].get.ts`, `[id].patch.ts`,
  grouped by resource (`technical-files/`, `gspr/`, `risk/`, ...).
- Resource-oriented, REST-ish. Actions that are not CRUD get a verb route
  (e.g. `auditor/simulate.post.ts`).

## Request validation

- Every route validates input with **Zod** at entry (body, query, params).
- On failure, throw `createError({ statusCode: 400, statusMessage: 'Validation failed',
  data: issues })`. Never trust unvalidated input.

## Responses

- Success handlers return typed data directly (Nitro serializes JSON). Types come from
  `shared/types`.
- List endpoints return a paginated envelope:
  `{ items: T[], total: number, page: number, pageSize: number }`.
- Timestamps are ISO 8601 UTC strings.

## Errors

Use `createError` with a proper status code:

| Code | When |
|---|---|
| 400 | Validation failed (include `data` with issues) |
| 401 | Not authenticated |
| 403 | Authenticated but not allowed (role) |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 500 | Unexpected server error (do not leak internals) |

Error body shape: `{ statusCode, statusMessage, data? }`. Do not include stack traces or
secrets in responses.

## Pagination, filtering, sorting

- Query params: `page` (1-based, default 1) and `pageSize` (per-resource default and cap).
  Technical-files (the first list endpoint, S5) uses `pageSize` default 10, max 50.
- Filters are explicit per resource and Zod-validated at entry. Technical-files (S5):
  `status`, `regulation`, and `search` (device-name text search, SQL `LIKE %term%`). A `class`
  filter is not in the MVP.
- Sorting: technical-files returns newest-updated first (`updatedAt` desc). A general
  `sort` = field, `order` = `asc`|`desc` convention applies where a resource supports it.

## Auth

- Protected routes rely on the session set by `nuxt-auth-utils`; `server/middleware/auth.ts`
  rejects unauthenticated requests to app APIs with 401.
- Public routes (auth, demo-requests, landing data) are explicitly exempt.
- `/api/_*` (leading underscore) is always exempt too: that's the convention Nuxt modules
  use for their own internal endpoints (nuxt-auth-utils' `/api/_auth/session`, Nuxt Icon's
  `/api/_nuxt_icon/*`, ...). This middleware runs before those modules' own handlers, so
  without the exemption they get a 401 from *our* middleware instead of behaving normally —
  found the hard way when it made the login form appear to do nothing (see STATE.md). Real
  app resource routes never use a `_`-prefixed segment, so this is safe to exempt as a
  whole.

## Side effects

- Mutations (create/update/delete) call the `auditLog.ts` helper to record an audit entry.
- Keep handlers small (~30 lines); push shared logic into `server/utils`.
