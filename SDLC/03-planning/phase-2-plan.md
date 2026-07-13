# Phase 2 Plan

Phase 2 makes Certra a sellable, multi-tenant SaaS with the operational and compliance
maturity real customers require. Approx. 6 months after Phase 1. Requirement IDs reference
[`requirements.md`](requirements.md).

## Workstreams

### 1. Multi-tenancy & identity (FR-AUTH-5)
- Multi-tenant data isolation (organizations, memberships).
- **SSO / SAML / OIDC** via Keycloak or Better Auth; fine-grained RBAC.

### 2. Regulatory-grade integrity (FR-LOG-3, FR-CHG-3)
- Tamper-evident audit trail; **PKI-based e-signature** (align with EU/ETSI requirements).
- Document version control with immutable history.

### 3. Integrations
- **UDI / EUDAMED** registration integration (reduce a major deficiency source).
- **CAPA** and complaint/vigilance modules.
- Notified Body communication portal.
- Integrated literature-search engine (supports CER writing).

### 4. Operations (NFR-OPS)
- Monitoring: **Prometheus + Grafana**, **Datadog** APM/logs.
- **IaC: Terraform**; deployment on **AWS**.
- Backups, DR, rate limiting, dependency/security scanning.

### 5. Commercial
- Billing + subscription tiers (see [`../00-product/pricing.md`](../00-product/pricing.md));
  AI usage credits metering.
- Onboarding, training material, beta program, sales enablement.

## Suggested sequence

| Month | Focus |
|---|---|
| 1 | Multi-tenant architecture |
| 2 | SSO/SAML/OIDC + RBAC |
| 3 | PKI e-signature + full audit trail + doc versioning |
| 4 | Monitoring + IaC (Terraform/AWS) |
| 5 | UDI/EUDAMED + CAPA + vigilance |
| 6 | Literature engine + billing + onboarding + beta |

## Exit criteria

A production-grade, multi-tenant SaaS with SSO, e-signature, integrations, billing, and
monitoring — running pilots with paying customers.

## Risks to watch (from source analysis)

- AI output quality at submission grade (needs evaluation harness and domain tuning).
- Correctness of change-impact logic (bidirectional traceability).
- Auditor-simulation deficiency taxonomy / knowledge base needs rigorous definition.
- E-signature legal jurisdiction and standards conformance.
- Market/adoption assumptions (see [`../05-references/regulatory-references.md`](../05-references/regulatory-references.md)).
