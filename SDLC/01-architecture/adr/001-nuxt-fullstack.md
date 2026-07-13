# ADR-001: Nuxt 3 as the fullstack framework

- **Status:** Accepted
- **Date:** 2026-07-14

## Context

We need to ship a working MVP quickly with both a Vue frontend and a server/API layer,
minimal moving parts, and SSR for the marketing surface. The team wants a Vue.js + Nuxt.js
application and low operational complexity.

## Decision

Use **Nuxt 3** with its built-in **Nitro** server engine as a single fullstack application.
API routes live in `server/api`; no separate backend service.

## Consequences

- One codebase, one deployable image; less infrastructure to manage.
- SSR/SSG available for the landing page and SEO.
- Server routes, middleware, and shared types are first-class.
- Trade-off: we are tied to the Nitro/Nuxt conventions; acceptable given the productivity
  gain. A separate Express backend was considered and rejected as unnecessary complexity.
