# Session 2026-07-14 — SDLC bootstrap

## Goal

Turn a half-finished planning document plus existing UI mockups into a complete,
agent-readable SDLC knowledge base. Design the product, architecture, requirements, and
the full MVP -> Phase 1 -> Phase 2 development process as Markdown. Write no application
code yet.

## What happened

- Reviewed the existing plan draft, `taslak.md`, and the TUBITAK 1812 BiGG application form.
- Reviewed all 6 app mockups (Dashboard, Technical Files, Risk Management, Clinical
  Evaluation, Post-Market, Audit Log) and 4 marketing mockups (Product Overview, Solutions,
  Pricing, Book a Demo). Extracted a full design-token system from the mockup HTML.
- Confirmed key decisions with the owner (see STATE.md): Node 22 + npm, NuxtUI free,
  Drizzle, brand "Certra"; MVP = all 6 modules at demo quality; marketing = landing +
  book-a-demo; MVP AI = mock.
- Reconciled the timeline: owner's fast demo = MVP; TUBITAK's 6-month MVP = Phase 1.
- Installed Node.js 22 LTS via Homebrew.

## Decisions made

- Introduce a `SDLC/` knowledge base as the single source of truth, with a start/end
  session protocol bridged by a root `AGENTS.md`.
- Two-gate process: Gate A (documentation, no code) then Gate B (implementation, only on
  explicit owner go-ahead).
- Archive `planlama/` to `eski-veriler/` (kept as visual reference for the mockups).

## Changes committed

- `chore: archive planlama directory to eski-veriler`
- `chore: add gitignore and stop tracking .DS_Store`
- SDLC documentation set (multiple `docs(sdlc): ...` commits).

## Next session

- Confirm Gate A docs with the owner; collect design assets (logo, photos, social-proof
  decision, certification badges).
- On explicit go-ahead, begin Gate B / S0: scaffold the Nuxt project per
  `03-planning/mvp-plan.md`.
