# ADR-005: Mock AI for the MVP

- **Status:** Accepted
- **Date:** 2026-07-14

## Context

AI is the product's headline differentiator (document generation + Auditor Simulation), but
real LLM integration adds API keys, cost, latency, and prompt-quality risk. The MVP's job is
to demonstrate the experience quickly and cheaply.

## Decision

Implement AI features as **deterministic mocks** for the MVP:

- Auditor Simulation uses a rule engine in `server/utils/auditorRules.ts` that inspects a
  technical file's GSPR/risk state and emits findings (severity + recommendation).
- "AI drafts" and confidence scores are template-generated.

The mock lives behind a stable interface so Phase 1 can swap in Claude without changing the
UI or API contracts.

## Consequences

- Fast, offline, free, and predictable for demos.
- The full "AI draft -> human review -> approve" UX is exercised end-to-end.
- Trade-off: findings are only as good as the rules; that is acceptable for the MVP and is
  explicitly replaced by real model reasoning in Phase 1.
- Keeps the trust principle intact: even mock AI output is watermarked and requires human
  approval.
