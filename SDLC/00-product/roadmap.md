# Roadmap

## Timeline framing

Two "MVP" meanings existed in the source material; we reconcile them as:

| This plan | Meaning | Rough horizon |
|---|---|---|
| **MVP** | Owner's fast, working demo | ~1-2 weeks of focused build |
| **Phase 1** | TUBITAK application's "6-month MVP": full product | ~3 months |
| **Phase 2** | Sellable, multi-tenant SaaS | ~6 months after Phase 1 |

Horizons are indicative; delivery is agile and shipped in working increments.

## MVP milestones (sprints)

Detailed tasks and commit checkpoints are in
[`../03-planning/mvp-plan.md`](../03-planning/mvp-plan.md).

- **S0** SDLC + project scaffold + design tokens + tooling.
- **S1** Database schema + seed + shared types.
- **S2** Auth (register/login/logout/session/guard).
- **S3** App shell (sidebar/topbar/footer) + shared UI components.
- **S4** Dashboard.
- **S5** Technical Files (list + detail; GSPR + Risk CRUD).
- **S6** Auditor Simulation (mock rule engine).
- **S7** Standalone module screens (Risk, Clinical, Post-Market, Audit Log; seed-driven).
- **S8** Marketing (Product Overview + Book a Demo).
- **S9** CI/CD + Docker deploy + polish.

## TUBITAK demo readiness criteria

The evaluation wants to see a credible working prototype. Target demo script:

1. Dashboard showing portfolio compliance readiness and deadlines.
2. A technical file with structured data, GSPR matrix, and risk register.
3. Auditor Simulation producing deficiency findings with severity and recommendations.
4. The AI "draft -> review -> approve" experience (mocked in MVP).
5. Breadth: all six modules visible and navigable.
6. A public landing page and a working "Book a Demo" capture.

## Phase 1 outline (~3 months)

| Weeks | Focus |
|---|---|
| 1-2 | Claude API integration; AI document generator (CER draft first) |
| 3-4 | AI GSPR rationale + risk report; AI-based Auditor Simulation |
| 5-6 | Traceability matrix + change-impact analysis |
| 7-8 | Change control & approvals + basic e-signature |
| 9-10 | Full CRUD for Clinical Evaluation and Post-Market |
| 11 | PostgreSQL + Redis migration |
| 12 | Sentry, i18n, Solutions + Pricing pages, polish |

## Phase 2 outline (~6 months)

| Month | Focus |
|---|---|
| 1 | Multi-tenant architecture |
| 2 | SSO/SAML/OIDC; RBAC |
| 3 | PKI e-signature + full audit trail + document versioning |
| 4 | Monitoring (Prometheus/Grafana/Datadog) + IaC (Terraform/AWS) |
| 5 | UDI/EUDAMED integration; CAPA + vigilance |
| 6 | Literature-search engine; onboarding; beta; sales readiness |

## Business context (for reference)

Monetization model and market assumptions are summarized in [`pricing.md`](pricing.md).
Underlying market claims to verify are in
[`../05-references/regulatory-references.md`](../05-references/regulatory-references.md).
