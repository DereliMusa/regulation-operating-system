# Backlog

A living, prioritized task inventory. Detailed sprint breakdowns are in
[`mvp-plan.md`](mvp-plan.md); this is the cross-cutting list. Update as work proceeds.

Status legend: `todo` / `doing` / `done` / `blocked`.

## MVP (Gate B — awaiting owner go-ahead)

| ID | Task | Req | Status |
|---|---|---|---|
| B-01 | Scaffold Nuxt + tooling + design tokens | S0 | todo |
| B-02 | Drizzle schema + migrations + seed + shared types | S1 | todo |
| B-03 | Auth (register/login/logout/session/guards) | FR-AUTH-1..4 | todo |
| B-04 | App shell (sidebar/topbar/footer) | FR (shell) | todo |
| B-05 | Shared UI components (badges/chips/table/ring/AI panel/bento) | S3 | todo |
| B-06 | Dashboard + stats API | FR-DASH-1..4 | todo |
| B-07 | Technical files list + detail | FR-TF-1..4 | todo |
| B-08 | GSPR matrix CRUD | FR-GSPR-1 | todo |
| B-09 | Risk register CRUD | FR-RISK-1 | todo |
| B-10 | Auditor Simulation (rule engine + UI + export) | FR-AUD-1..2 | todo |
| B-11 | Risk Management standalone screen | FR-RISK-2 | todo |
| B-12 | Clinical Evaluation screen | FR-CER-1 | todo |
| B-13 | Post-Market screen | FR-PMS-1 | todo |
| B-14 | Audit Log screen + auto-write on mutations | FR-LOG-1..2 | todo |
| B-15 | Landing (Product Overview) | FR-MKT-1 | todo |
| B-16 | Book a Demo form + API | FR-MKT-2 | todo |
| B-17 | CI/CD + Docker + Coolify deploy | S9 | todo |
| B-18 | Polish + coverage + docs | S9 | todo |

## Phase 1 (summary — see phase-1-plan.md)

| ID | Task | Req |
|---|---|---|
| P1-01 | Claude API integration (doc gen + auditor) | FR-*-AI |
| P1-02 | Full CRUD: Clinical Evaluation, Post-Market | FR-CER-2, FR-PMS-2 |
| P1-03 | Traceability matrix + change impact | FR-TRC-2 |
| P1-04 | Change control & approvals + e-sign | FR-CHG-1..2 |
| P1-05 | PostgreSQL + Redis migration | NFR-OPS |
| P1-06 | Sentry + i18n | NFR-OPS-1, NFR-I18N-1 |
| P1-07 | Solutions + Pricing + email | FR-MKT-3 |

## Phase 2 (summary — see phase-2-plan.md)

| ID | Task | Req |
|---|---|---|
| P2-01 | Multi-tenant + SSO/RBAC | FR-AUTH-5 |
| P2-02 | PKI e-sign + tamper-evident audit | FR-LOG-3, FR-CHG-3 |
| P2-03 | UDI/EUDAMED + CAPA + vigilance | - |
| P2-04 | Monitoring + IaC (Terraform/AWS) | NFR-OPS |
| P2-05 | Literature engine + billing + onboarding | - |

## Owner-dependent items

| ID | Item | Needed for |
|---|---|---|
| O-01 | Logo (SVG + favicon) | Branding, S0/S8 |
| O-02 | 3-5 marketing photos | Landing, S8 |
| O-03 | Social-proof decision (real vs sample) | Landing, S8 |
| O-04 | ISO 13485/HIPAA badges (only if certified) | Landing, S8 |
