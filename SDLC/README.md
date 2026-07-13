# Certra SDLC Knowledge Base

This directory is the **single source of truth** for the Certra product: what we are
building, why, how, and the complete development process from MVP through Phase 2.

Certra is an AI-assisted MDR/IVDR regulatory compliance platform (RegTech SaaS) for
medical-device manufacturers. See [`00-product/vision.md`](00-product/vision.md).

---

## Session protocol (read this first)

Every AI agent / chatbot session works against this knowledge base so that context is
never lost between sessions.

### At the START of a session

Read, in this order:

1. `SDLC/README.md` (this file) — the map and the rules.
2. `SDLC/04-session-log/STATE.md` — the **current state**: what is done, what is in
   progress, what is next.
3. The specific docs relevant to your task (product / architecture / standards / planning).

The repo-root `CLAUDE.md` and `.agents/AGENTS.md` point here so any agent tool follows
the same protocol automatically.

### At the END of a session

1. Update `SDLC/04-session-log/STATE.md` — move items between Done / In progress / Next,
   and record any new decisions or blockers.
2. Add a session summary file under `SDLC/04-session-log/sessions/` named
   `YYYY-MM-DD-<short-slug>.md`.
3. Update any product / architecture / standards / planning doc that changed, and add an
   ADR under `01-architecture/adr/` for any significant new decision.

**Rule:** the code and this knowledge base must never drift. If an implementation choice
differs from a doc, update the doc in the same session.

---

## Directory map

| Path | Contents |
|---|---|
| `00-product/` | Vision, personas, scope (MVP/Phase 1/Phase 2), roadmap, pricing |
| `01-architecture/` | Tech stack, system architecture, data model, `STYLE_GUIDE.md`, ADRs |
| `02-standards/` | Coding standards, commit conventions, testing strategy, branching, security, agent rules |
| `03-planning/` | Requirements, MVP plan, Phase 1 plan, Phase 2 plan, backlog |
| `04-session-log/` | `STATE.md` (read first) + per-session summaries |
| `05-references/` | Design mockup index, regulatory references, glossary |

## Current project phase

Development is gated in two stages:

- **Gate A — Documentation (this stage):** author the full SDLC knowledge base. No
  application code is written.
- **Gate B — Implementation:** scaffold and build the product, sprint by sprint. Starts
  only when the product owner explicitly says "start".

The authoritative, up-to-date status is always in
[`04-session-log/STATE.md`](04-session-log/STATE.md).

## Conventions for these docs

- English, plain Markdown, no emoji.
- Keep each doc focused; split when it grows unwieldy.
- Explain the *why*, not only the *what*.
- Cross-link related docs with relative links.
