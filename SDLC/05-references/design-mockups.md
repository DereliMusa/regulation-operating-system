# Design Mockups Index

The approved UI mockups live under `eski-veriler/` (archived planning material). Each folder
has a `code.html` (Tailwind mockup) and a `screen.png` (screenshot). These are the
**visual reference** for implementation; the design system is codified in
[`../01-architecture/STYLE_GUIDE.md`](../01-architecture/STYLE_GUIDE.md).

## App screens — `eski-veriler/certa-mvp/`

| Folder | Screen | Notes |
|---|---|---|
| `certra_saas_dashboard/` | Dashboard | readiness ring, active files, pending approvals, AI activity, deficiency findings table |
| `certra_technical_files/` | Technical Files list | filters, table (class/reg/NB/readiness/status), pagination |
| `certra_risk_management/` | Risk Management | bento summary cards, risk register table, mitigation thread, audit preparedness |
| `certra_clinical_evaluation/` | Clinical Evaluation | evidence summary, literature table, AI suggestions panel, traceability thread |
| `certra_post_market_surveillance/` | Post-Market | milestone timeline, surveillance plans table, AI insight, resource allocation |
| `certra_audit_log/` | Audit Log | audit table (actor/action/impact), KPI cards |
| `certra_narrative/DESIGN.md` | Design spec | narrative design-system notes (source for STYLE_GUIDE) |

## Marketing pages — `eski-veriler/certa-web-sitesi/`

| Folder | Page | MVP? |
|---|---|---|
| `certra_product_overview/` | Product Overview (landing) | Yes (MVP) |
| `certra_book_a_demo/` | Book a Demo (form) | Yes (MVP) |
| `certra_solutions/` | Solutions | Phase 1 |
| `certra_pricing_optimized_layout/` | Pricing | Phase 1 |
| `certra_narrative/DESIGN.md` | Design spec | reference |

## Notes

- There is no dedicated "Technical File detail" mockup; the detail page (Overview / GSPR /
  Risk tabs) is composed from the Technical Files list styling plus the Risk Management and
  Clinical Evaluation table/panel patterns.
- Book-a-Demo form fields: Full Name, Work Email, Company, Role
  (RA/QA, Founder/CEO, Clinical, Consultant), Regulation Focus (MDR/IVDR/Both), Message.
- Marketing and app share one design language; the marketing shell uses a distinct top nav
  and 4-column footer.
