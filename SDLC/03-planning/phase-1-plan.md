# Phase 1 Plan

Phase 1 turns the MVP demo into the "full" product that matches the TUBITAK application's
6-month MVP. Requirement IDs reference [`requirements.md`](requirements.md). Approx. 3 months;
PR + review become mandatory ([`../02-standards/branching.md`](../02-standards/branching.md)).

## Workstreams

### 1. Real AI (Claude API)
- Replace the mock behind the same interface (`auditorRules.ts` -> Claude-backed service).
- AI document generation: CER, GSPR rationale, risk report, PSUR/PMCF drafts, with
  multi-turn refinement (regenerate / edit / accept per section).
- All output watermarked; "AI draft -> human review -> approved" enforced.
- FR-GSPR-2, FR-CER-2, FR-PMS-2, FR-AUD-3.
- Concerns: prompt design, model selection, cost controls, output-quality evaluation.

### 2. Full CRUD across modules
- Clinical Evaluation and Post-Market get full create/edit/delete; deeper Audit views.
- FR-RISK-3, FR-CER-2, FR-PMS-2.

### 3. Traceability & change impact (FR-TRC-2, FR-CHG-1)
- Promote JSON reference lists to real link tables.
- Traceability matrix visualization; change-impact analysis (if X changes, flag linked
  risk/test/CER/GSPR).

### 4. Change control & approvals (FR-CHG-1..2)
- Change-request workflow, impact matrix, approval chain, basic e-signature.

### 5. Data platform migration
- SQLite -> **PostgreSQL** (Drizzle dialect change); **Redis** for sessions/cache.
- Least-privilege DB credentials; migration scripts.

### 6. Observability & i18n
- **Sentry** error tracking (PII-scrubbed).
- **i18n** EN/TR/DE ([`NFR-I18N-1`]).

### 7. Marketing completion (FR-MKT-3)
- Solutions and Pricing pages; **Nodemailer** demo/notification email.
- Standards Library (reference content).

## Suggested sequence

| Weeks | Focus |
|---|---|
| 1-2 | Claude integration + CER draft generation |
| 3-4 | AI GSPR rationale + risk report + AI auditor |
| 5-6 | Traceability matrix + change-impact |
| 7-8 | Change control & approvals + e-signature |
| 9-10 | Full CRUD: Clinical Evaluation + Post-Market |
| 11 | PostgreSQL + Redis migration |
| 12 | Sentry, i18n, Solutions + Pricing, polish |

## Exit criteria

A working, traceable platform with real AI drafting and auditor analysis, full module CRUD,
change control, running on PostgreSQL, suitable to present to the TUBITAK committee as the
6-month MVP.
