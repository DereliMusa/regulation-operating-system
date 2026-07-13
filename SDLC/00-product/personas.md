# Personas

These personas drive scope and UI priorities. All of them care about two things above all:
**traceability** (which evidence supports which requirement) and **change impact** (if X
changes, what breaks).

## P1 — Regulatory Affairs Manager / Officer (primary)

- **Context:** Owns the technical file and the relationship with the Notified Body.
- **Jobs to be done:** map GSPR requirements to evidence; track overall compliance
  readiness; prepare for and respond to audits; manage submission deadlines.
- **Certra usage:** Dashboard (readiness, deadlines), Technical Files, GSPR Matrix,
  Auditor Simulation, AI document drafting.
- **Success:** submission-ready file with no surprise deficiencies.

## P2 — Quality Assurance Engineer (primary)

- **Context:** Owns the quality system and risk management (ISO 14971).
- **Jobs to be done:** maintain the risk register; link risks to controls, verification,
  and tests; run change control and approvals; keep the audit trail intact.
- **Certra usage:** Risk Management, Technical File risk tab, Change & Approvals (Phase 1),
  Audit Log.
- **Success:** every risk mitigated and traceable; every change reviewed and signed.

## P3 — Clinical / Product Manager (secondary)

- **Context:** Responsible for clinical evaluation and post-market clinical data.
- **Jobs to be done:** assemble clinical evidence; draft the CER; plan and track
  PMS/PMCF/PSUR.
- **Certra usage:** Clinical Evaluation, Post-Market, AI CER drafting.
- **Success:** defensible clinical evidence and on-time post-market reports.

## P4 — Founder / CTO of an SME (economic buyer)

- **Context:** Needs the product to reach market on time and on budget; not a regulatory
  specialist.
- **Jobs to be done:** see status at a glance; control cost and risk of delay; trust that
  nothing is falling through the cracks.
- **Certra usage:** Dashboard; high-level readiness and deadline views.
- **Success:** predictable path to CE marking; fewer/cheaper consultant hours.

## P5 — Compliance consultant (secondary / channel)

- **Context:** External advisor working across several manufacturers.
- **Jobs to be done:** efficiently prepare and review files for multiple clients.
- **Certra usage:** all modules, across multiple technical files.
- **Note:** multi-client / multi-tenant support is a Phase 2 concern.

## Roles in the system (MVP)

The MVP models roles as a single field on the user: `admin`, `ra`, `qa`, `viewer`.
Fine-grained permissions and multi-tenant organizations are deferred to Phase 2; see
[`scope.md`](scope.md).
