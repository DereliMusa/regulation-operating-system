# Scope: MVP / Phase 1 / Phase 2

This document defines what is in and out of each phase. The engineering breakdown lives in
[`../03-planning/`](../03-planning); the requirements live in
[`../03-planning/requirements.md`](../03-planning/requirements.md).

## Phase definitions

- **MVP** — a fast, working demo of the whole product story. Optimized for a compelling
  TUBITAK / investor demonstration and early user feedback. Shipped in working increments.
- **Phase 1** — the "full" product that matches the TUBITAK application's 6-month MVP:
  real AI, full CRUD everywhere, traceability + change impact, PostgreSQL.
- **Phase 2** — a sellable, multi-tenant SaaS with SSO, e-signature, integrations, and
  operational maturity.

## MVP module depth matrix

| Screen / capability | MVP depth |
|---|---|
| Dashboard | **Full**: readiness ring, active files, pending approvals, AI-activity cards, deficiency findings table (from seed data) |
| Technical Files (list) | **Full**: filters, table, pagination, "New Technical File" |
| Technical File (detail) | **Full CRUD**: Overview + GSPR Matrix tab + Risk Register tab + Auditor Simulation action |
| Risk Management (standalone) | **Medium**: portfolio risk register table + summary cards; read-mostly over seed data |
| Clinical Evaluation | **Medium**: evidence summary + literature table + AI-suggestions panel; read-mostly |
| Post-Market | **Medium**: milestone timeline + surveillance-plans table + AI insight; read-mostly |
| Audit Log | **Medium**: audit table (actor/action/impact) + KPI cards; auto-written on mutations |
| Auditor Simulation | **Full (mock)**: pick a file -> rule engine -> severity findings + recommendations + export |
| Landing (Product Overview) | **Full**: hero + module bento + CTA (public) |
| Book a Demo | **Full**: 6-field form -> persisted to `demo_requests` (public) |
| Auth | **Full**: register / login / logout / session / route guard |

"Read-mostly" = rendered from seed data with minimal or no editing in the MVP; full CRUD
for these modules arrives in Phase 1.

### Explicitly OUT of the MVP

- Real LLM calls (AI is mocked).
- Full CRUD on Risk Management / Clinical Evaluation / Post-Market / Audit Log.
- Traceability matrix visualization and change-impact analysis (beyond stored reference chips).
- Change control & approvals workflow and e-signature.
- Multi-tenant organizations; fine-grained RBAC.
- Solutions and Pricing marketing pages.
- i18n, email sending, error monitoring.

### Scope decisions to confirm (owner)

- **Traceability Thread (recommended add to MVP).** The product's signature visual — linked
  Risk <-> Test <-> Clinical <-> GSPR with connector lines and mono reference chips. A
  read-only, seed-driven version inside the Technical File detail is cheap and high-impact
  for the demo. Recommendation: include a static version in the MVP. The full interactive
  matrix + change-impact analysis stays in Phase 1.
- **AI Document Generator and Change & Approvals pages.** Core to the vision but Phase 1
  (they need real AI and a workflow engine). In the MVP the AI story is conveyed by the
  Dashboard "AI activity" mock cards and the Auditor Simulation. Confirm the demo does not
  need a mock generator page.

## Phase 1 scope (adds to MVP)

- **Real AI** (Claude API): document generation (CER, GSPR rationale, risk report,
  PSUR/PMCF drafts) with multi-turn refinement; AI-based Auditor Simulation. Still
  watermarked and human-approved.
- **Full CRUD** across all modules (Clinical Evaluation, Post-Market, deeper Audit).
- **Traceability matrix + change-impact analysis** (GSPR <-> risk <-> test <-> clinical).
- **Change control & approvals** workflow with an approval chain and basic e-signature.
- **PostgreSQL + Redis** migration (Drizzle dialect switch); **Sentry**; **i18n** (EN/TR/DE).
- Marketing **Solutions** and **Pricing** pages; **Nodemailer** for demo/notification email.
- Standards Library (reference). PR + review become mandatory.

## Phase 2 scope (adds to Phase 1)

- Multi-tenant architecture; **SSO / SAML / OIDC** (Keycloak or Better Auth).
- Full tamper-evident audit trail; **PKI-based e-signature**; document version control.
- **UDI / EUDAMED** integration; **CAPA** and complaint/vigilance modules; Notified Body
  communication portal.
- Monitoring (Prometheus + Grafana, Datadog); **IaC** (Terraform) + AWS.
- Integrated literature-search engine; onboarding, training, beta program, sales readiness.

## Guardrail

Follow YAGNI: nothing from a later phase is built early "just in case." The MVP exists to
demonstrate and to learn, not to be feature-complete.
