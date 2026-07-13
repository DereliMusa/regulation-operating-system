# Requirements

Functional (FR) and non-functional (NFR) requirements. IDs are stable references used by the
backlog and plans. Each FR notes its phase: **M** = MVP, **1** = Phase 1, **2** = Phase 2.

## Functional requirements

### Authentication & users
- **FR-AUTH-1 (M)** A user can register with name, email, and password.
- **FR-AUTH-2 (M)** A user can log in and log out; session persists via encrypted cookie.
- **FR-AUTH-3 (M)** Unauthenticated users are redirected from app routes to `/login`.
- **FR-AUTH-4 (M)** Users have a role (`admin`/`ra`/`qa`/`viewer`) stored on the account.
- **FR-AUTH-5 (2)** SSO/SAML/OIDC login; fine-grained RBAC; multi-tenant organizations.

### Dashboard
- **FR-DASH-1 (M)** Show overall compliance readiness (ring) across active files.
- **FR-DASH-2 (M)** List active technical files with per-file readiness.
- **FR-DASH-3 (M)** Show pending approvals and upcoming deadlines.
- **FR-DASH-4 (M)** Show AI-activity cards (mock drafts awaiting verification) and open
  deficiency findings.

### Technical files
- **FR-TF-1 (M)** List technical files with class, regulation, notified body, readiness,
  status, last-updated; support filters and pagination.
- **FR-TF-2 (M)** Create a technical file (device name, class, regulation, NB, UDI-DI,
  intended use).
- **FR-TF-3 (M)** View a file's detail with tabs: Overview, GSPR Matrix, Risk Register.
- **FR-TF-4 (M)** Edit file metadata; readiness derives from GSPR conformity.

### GSPR matrix
- **FR-GSPR-1 (M)** CRUD GSPR entries (ref, requirement text, conformity, evidence refs,
  standard refs, notes) within a technical file.
- **FR-GSPR-2 (1)** AI-suggested GSPR requirements and rationale drafts.

### Risk management (ISO 14971)
- **FR-RISK-1 (M)** CRUD risk entries (risk id, hazard, severity, probability, status,
  mitigation, control/verification refs, traceability refs) within a technical file.
- **FR-RISK-2 (M)** Standalone Risk Management screen: portfolio risk register + summary
  cards (read-mostly over seed data).
- **FR-RISK-3 (1)** Full CRUD on the standalone screen; AI risk-hazard suggestions.

### Clinical evaluation (CER)
- **FR-CER-1 (M)** Screen showing clinical evidence summary, literature table, and an
  AI-suggestions panel (read-mostly over seed data).
- **FR-CER-2 (1)** Full CRUD; AI-generated CER draft with multi-turn refinement.

### Post-market (PMS/PMCF/PSUR)
- **FR-PMS-1 (M)** Screen with milestone timeline, surveillance-plans table, and AI insight
  (read-mostly over seed data).
- **FR-PMS-2 (1)** Full CRUD; AI-generated PSUR/PMCF drafts; deadline tracking.

### Auditor simulation
- **FR-AUD-1 (M)** From a technical file, run a simulation that produces findings with
  severity, related GSPR ref, description, and recommendation (mock rule engine).
- **FR-AUD-2 (M)** Export the findings report (PDF/Markdown).
- **FR-AUD-3 (1)** AI-based analysis replaces the rule engine behind the same interface.

### Audit log
- **FR-LOG-1 (M)** Every create/update/delete writes an audit entry (actor, action, impact,
  entity).
- **FR-LOG-2 (M)** Audit Log screen lists entries with filters and KPI cards.
- **FR-LOG-3 (2)** Tamper-evident trail with e-signature.

### Change control & approvals
- **FR-CHG-1 (1)** Change request workflow with impact analysis and an approval chain.
- **FR-CHG-2 (1)** Basic e-signature on approvals; **FR-CHG-3 (2)** PKI-based e-signature.

### Traceability
- **FR-TRC-1 (M)** Display traceability reference chips on risk/GSPR items.
- **FR-TRC-2 (1)** Traceability matrix visualization + change-impact analysis
  (GSPR <-> risk <-> test <-> clinical).

### Marketing (public)
- **FR-MKT-1 (M)** Product Overview landing page (hero, module bento, CTA).
- **FR-MKT-2 (M)** Book a Demo form (6 fields) persisting to `demo_requests`.
- **FR-MKT-3 (1)** Solutions and Pricing pages; demo-request email notification.

## Non-functional requirements

- **NFR-PERF-1** Typical page interactions respond under ~200 ms locally; SSR landing is fast.
- **NFR-SEC-1** Meets the security baseline in [`../02-standards/security.md`](../02-standards/security.md).
- **NFR-A11Y-1** WCAG AA contrast; no color-only meaning; keyboard-navigable.
- **NFR-RESP-1** Responsive at 375 / 768 / 1280 px.
- **NFR-QUAL-1** ESLint clean; tests green; 60%+ coverage on MVP critical paths.
- **NFR-MAINT-1** Files <= 500 lines; functions ~30 lines; no `any`.
- **NFR-I18N-1 (1)** UI translatable (EN/TR/DE).
- **NFR-OPS-1 (1)** Error monitoring (Sentry); **(2)** metrics/alerting (Prometheus/Grafana/Datadog).
- **NFR-INTEG-1** No misleading claims; sample data labelled as such.
