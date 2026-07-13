# Agent Working Rules

Rules for any AI agent/chatbot working on Certra. The repo-root `AGENTS.md` points here so
every tool follows the same protocol.

## Session protocol

- **Start:** read `SDLC/README.md`, then `SDLC/04-session-log/STATE.md`, then the docs
  relevant to your task.
- **End:** update `STATE.md`, add a `SDLC/04-session-log/sessions/YYYY-MM-DD-<slug>.md`
  entry, and update any doc/ADR that changed. Code and docs must not drift.

## Project rules

- Language: TypeScript (strict). No `any`. Explicit return types on server handlers.
- Max 500 lines per file; ~30 lines per function. Split when exceeded.
- DRY / KISS / YAGNI. Do not build ahead of the current phase.
- English only; no emoji. Comment the why. JSDoc on public functions.
- `<script setup lang="ts">` for all components. Composables prefixed `use`.
- No database access from frontend; all data via `server/api`. Validate input with Zod.
- Follow the design tokens in `01-architecture/STYLE_GUIDE.md`; never hardcode colors.

## Commits and tests

- Conventional Commits; commit after each logical unit; never squash everything into one.
- Write tests for every new API endpoint and for composables/utilities.
- Do not mark work done unless lint and tests pass; report failures honestly.

## Gating

- Respect the current gate in `STATE.md`. During a documentation gate, do **not** write
  application code. Begin implementation only when the product owner explicitly says so.

## When unsure

- Prefer the simplest option consistent with the docs. If a decision is significant and
  ambiguous, ask the owner and record the outcome as an ADR.
