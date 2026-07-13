# Data Model

Defined with Drizzle ORM in `server/database/schema.ts`. MVP target is SQLite; the same
schema moves to PostgreSQL in Phase 1 via a Drizzle dialect change.

Conventions:

- Primary keys: `id` integer, autoincrement.
- Timestamps: `created_at` / `updated_at` as ISO 8601 **TEXT** (portable across SQLite/PG).
- Enumerated fields: stored as TEXT, constrained in application code via Zod and shared
  constants (`shared/constants`).
- List-valued fields (evidence/standard/traceability references): stored as **JSON TEXT**
  in the MVP; these become proper relations/link tables in Phase 1 when the traceability
  matrix needs to be queried and traversed.

## Entities

### users
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| email | TEXT UNIQUE NOT NULL | login identity |
| password_hash | TEXT NOT NULL | scrypt |
| name | TEXT NOT NULL | display name |
| role | TEXT | `admin` / `ra` / `qa` / `viewer` |
| created_at, updated_at | TEXT | ISO 8601 |

### technical_files
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| device_name | TEXT NOT NULL | |
| udi_di | TEXT | UDI-DI identifier |
| device_class | TEXT | MDR `I/IIa/IIb/III` or IVDR `A/B/C/D` |
| regulation | TEXT | `MDR` / `IVDR` |
| notified_body | TEXT | e.g. "TUV SUD (0123)" |
| intended_use | TEXT | |
| readiness_percent | INTEGER | 0-100, default 0 |
| status | TEXT | `draft` / `in_review` / `approved` / `deficiency` |
| owner_id | INTEGER FK -> users.id | |
| created_at, updated_at | TEXT | |

### gspr_entries
GSPR = General Safety and Performance Requirements (MDR Annex I).
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| technical_file_id | INTEGER FK | |
| gspr_ref | TEXT | e.g. "GSPR 10.2" |
| requirement_text | TEXT | |
| conformity | TEXT | `conforming` / `partial` / `missing` |
| evidence_refs | TEXT (JSON) | list of evidence ids/labels |
| standard_refs | TEXT (JSON) | e.g. ISO 14971, IEC 62366-1 |
| notes | TEXT | |
| updated_at | TEXT | |

### risk_entries
ISO 14971 risk register.
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| technical_file_id | INTEGER FK | |
| risk_id | TEXT | e.g. "RISK-014" |
| hazard_description | TEXT | |
| severity | TEXT | `critical` / `major` / `moderate` / `minor` |
| probability | TEXT | e.g. "P2" |
| status | TEXT | `draft` / `review` / `mitigated` |
| mitigation | TEXT | risk control measure |
| control_measure_ref | TEXT | e.g. "RCM-42" |
| verification_ref | TEXT | e.g. "V&V-102" |
| traceability_refs | TEXT (JSON) | linked test/requirement ids |
| updated_at | TEXT | |

### clinical_evidence
Backs the Clinical Evaluation (CER) screen.
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| technical_file_id | INTEGER FK | |
| cer_ref | TEXT | |
| source_type | TEXT | `literature` / `investigation` / `pms` |
| title | TEXT | |
| status | TEXT | `approved` / `in_review` / `draft` / `deficiency` |
| ai_summary | TEXT | mock AI summary preview |
| confidence | INTEGER | 0-100 |
| updated_at | TEXT | |

### pms_plans
Backs the Post-Market screen.
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| technical_file_id | INTEGER FK | |
| plan_type | TEXT | `PMS` / `PMCF` / `PSUR` |
| device_ref | TEXT | |
| next_due | TEXT | ISO date |
| status | TEXT | `pending_review` / `active` / `drafting` / `deficiency` |
| confidence | INTEGER | 0-100 |
| updated_at | TEXT | |

### auditor_findings
Output of the (mock) Auditor Simulation.
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| technical_file_id | INTEGER FK | |
| severity | TEXT | `critical` / `major` / `minor` |
| gspr_ref | TEXT | related requirement, if any |
| description | TEXT | |
| recommendation | TEXT | |
| status | TEXT | `open` / `resolved` |
| created_at, resolved_at | TEXT | |

### audit_log
Tamper-evidence-oriented activity log; written automatically on mutations.
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| log_ref | TEXT | e.g. "LOG-82941" |
| actor_type | TEXT | `user` / `ai` / `system` |
| actor_name | TEXT | |
| action | TEXT | short action label |
| description | TEXT | |
| impact | TEXT | `critical` / `high` / `medium` / `low` |
| entity_type | TEXT | e.g. "technical_file", "gspr_entry" |
| entity_ref | TEXT | affected entity id/label |
| created_at | TEXT | |

### demo_requests
Lead capture from the public "Book a Demo" form.
| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| full_name | TEXT NOT NULL | |
| work_email | TEXT NOT NULL | |
| company | TEXT | |
| role | TEXT | `ra_qa` / `founder_ceo` / `clinical` / `consultant` |
| regulation_focus | TEXT | `MDR` / `IVDR` / `both` |
| message | TEXT | |
| created_at | TEXT | |

## Relationships

- `technical_files.owner_id` -> `users.id`.
- `gspr_entries`, `risk_entries`, `clinical_evidence`, `pms_plans`, `auditor_findings`
  each reference `technical_files.id` (one file has many of each).
- `audit_log` and `demo_requests` are standalone (referencing entities loosely by label).

## Traceability (MVP vs Phase 1)

In the MVP, cross-artifact links (GSPR <-> risk <-> test <-> clinical) are stored as JSON
reference lists and rendered as traceability chips. There is **no** graph traversal or
change-impact computation yet. Phase 1 promotes these to real link tables and adds the
traceability matrix + change-impact analysis.

## Seed data

`server/database/seed.ts` provides realistic demo content so every screen looks alive:
sample devices (e.g. OrthoFix Pro, NeuroSensor Gen3, VascularStent Plus, GlucoCheck IVD
Assay), GSPR entries, RISK-xxx records, findings, clinical evidence, PMS plans, and audit
entries. Seed content is clearly demonstrative, not real regulatory data.
