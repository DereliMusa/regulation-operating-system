# ADR-006: Single-app repo + SDLC knowledge base

- **Status:** Accepted
- **Date:** 2026-07-14

## Context

The product has a public marketing surface and an authenticated app. We also want any AI
agent/chatbot session to understand the current state, scope, and history without re-deriving
it each time.

## Decision

1. Keep **one Nuxt application at the repo root** serving both public and app routes
   (auth-guarded), rather than a monorepo or split marketing/app projects.
2. Maintain a **`SDLC/` knowledge base** as the project's single source of truth, with a
   start/end **session protocol**. Bridge it to tools via a root `AGENTS.md`. Archive the
   old `planlama/` folder to `eski-veriler/`.

## Consequences

- Simpler build/deploy (one image) and shared design system across marketing and app.
- Every session starts by reading `SDLC/README.md` + `SDLC/04-session-log/STATE.md` and ends
  by updating them; code and docs must not drift.
- The mockups under `eski-veriler/` remain the visual reference.
- Trade-off: a single app couples marketing and app deploys; acceptable at this stage and
  revisitable in Phase 2 if the marketing site needs independent release cadence.
