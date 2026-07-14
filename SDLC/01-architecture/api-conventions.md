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

- Query params: `page` (1-based, default 1), `pageSize` (default 20, max 100).
- Filters are explicit per resource, documented in the route (e.g. technical-files:
  `class`, `status`, `regulation`, `q` for text search).
- Sorting: `sort` = field, `order` = `asc`|`desc` where supported.

## Auth

- Protected routes rely on the session set by `nuxt-auth-utils`; `server/middleware/auth.ts`
  rejects unauthenticated requests to app APIs with 401.
- Public routes (auth, demo-requests, landing data) are explicitly exempt.

## Side effects

- Mutations (create/update/delete) call the `auditLog.ts` helper to record an audit entry.
- Keep handlers small (~30 lines); push shared logic into `server/utils`.
