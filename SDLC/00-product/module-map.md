# Module Map (complete inventory)

The complete set of product modules gathered from all sources (the mockups, `taslak.md`, and
the TUBITAK application), each mapped to a phase. This is the superset; the MVP builds a
demonstrable subset (see [`scope.md`](scope.md)). "Depth" describes the MVP.

| Module | Purpose | Phase | MVP depth |
|---|---|---|---|
| Auth / users / roles | Login, roles (admin/ra/qa/viewer) | MVP | full |
| Dashboard | Readiness, files, approvals, deadlines, AI activity, findings | MVP | full |
| Technical File Builder | Device/UDI, structured technical file | MVP | full (metadata + tabs) |
| Electronic Forms | Structured data capture (device def, intended use, class) | Phase 1 | out (Phase 1) |
| GSPR Matrix | GSPR (Annex I) x conformity x evidence x standard | MVP | full CRUD |
| Risk Management (ISO 14971) | Risk register, control, verification | MVP | full CRUD (file) + read screen |
| Clinical Evaluation (CER) | Evidence, literature, CER | MVP screen | medium (read) / Phase 1 full |
| V&V / Tests | Verification/validation test list (TEST-xx) | Phase 1 | out |
| Traceability | Risk <-> Test <-> Clinical <-> GSPR links | MVP chips / Phase 1 matrix | chips only |
| Change impact analysis | What a change affects across artifacts | Phase 1 | out |
| AI Document Generator | AI drafts CER/GSPR/Risk/PSUR (human-approved) | Phase 1 | mock activity cards only |
| Change Control & Approvals | Change requests, impact, approval chain, e-sign | Phase 1 | out |
| Post-Market (PMS/PMCF/PSUR) | Plans, calendar, reports | MVP screen | medium (read) / Phase 1 full |
| Auditor Simulation | Auditor-style deficiency detection | MVP (mock) | full (rule engine) |
| Audit Log | Activity trail on mutations | MVP | medium + auto-write |
| Standards & Library | Harmonized standards + templates | Phase 1 | out |
| Documents / e-signature | Version control, e-sign, audit trail | Phase 1 (basic) / Phase 2 (PKI) | out |
| CAPA | Corrective/preventive actions | Phase 2 | out |
| Complaint / vigilance | Post-market safety events | Phase 2 | out |
| Supplier management | Subcontractor oversight | Phase 2 | out |
| UDI / EUDAMED integration | Identification + EU database | Phase 2 | out |
| Notified Body portal | NB communication | Phase 2 | out |
| Literature search engine | Retrieve clinical evidence | Phase 2 | out |
| Settings | Org, members/roles, notified body, notifications, billing | Phase 1 | out (roles exist in data) |

## Technical File Detail tabs (full set)

The eventual detail workspace has these tabs (from `taslak.md` 2.4). MVP builds a subset:

- **Overview** (MVP), **GSPR Matrix** (MVP), **Risk / ISO 14971** (MVP).
- **Electronic Forms**, **Clinical / CER**, **V&V / Tests**, **Traceability**, **Documents**
  — Phase 1.

## Navigation note (source discrepancy)

The two design sources define different sidebars:

- **Mockups (used now):** Dashboard, Technical Documentation, Risk Management, Clinical
  Evaluation, Post-Market, Audit Log, + Settings, Support.
- **`taslak.md` 2.0:** Dashboard, Technical Files, AI Documents, Change & Approvals,
  Post-Market, Auditor Sim., Standards Library, + Settings.

Reconciliation: the MVP sidebar follows the **mockups** (concrete, newer). Additional
modules (AI Documents, Change & Approvals, Standards Library) appear in the sidebar as they
are built in Phase 1. This is part of the open design-source reconciliation flagged in
[`../01-architecture/STYLE_GUIDE.md`](../01-architecture/STYLE_GUIDE.md).
