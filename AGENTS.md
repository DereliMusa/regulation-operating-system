# AGENTS.md

Guidance for any AI agent or automated tool working in this repository. This file is the
entry point; the authoritative details live in the `SDLC/` knowledge base.

## Start of session (required reading, in order)

1. `SDLC/README.md` — how this knowledge base works and the session protocol.
2. `SDLC/04-session-log/STATE.md` — the current state: what is done, in progress, and next,
   plus the active gate.
3. The task-relevant docs under `SDLC/00-product`, `SDLC/01-architecture`,
   `SDLC/02-standards`, `SDLC/03-planning`.

## Working rules (summary)

Full rules: `SDLC/02-standards/agent-rules.md` and `SDLC/02-standards/coding-standards.md`.

- Respect the current **gate** in `STATE.md`. During a documentation gate, do not write
  application code; begin implementation only on the owner's explicit go-ahead.
- TypeScript strict, no `any`; files <= 500 lines, functions ~30 lines; DRY/KISS/YAGNI.
- English only; no emoji. Follow the design tokens in `SDLC/01-architecture/STYLE_GUIDE.md`.
- No database access from frontend; all data via `server/api`; validate input with Zod.
- Conventional Commits; commit after each logical unit; never squash everything into one.
  Commits carry no co-author or tool-attribution trailer.
- Write tests for every new API endpoint and for composables/utilities.

## End of session (required)

1. Update `SDLC/04-session-log/STATE.md`.
2. Add a summary under `SDLC/04-session-log/sessions/YYYY-MM-DD-<slug>.md`.
3. Update any doc or ADR that changed. Code and docs must not drift.
