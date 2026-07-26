# Regulation Operating System — Project Summary (Certra)

> Comprehensive English summary of the project scope, what has been built so far, and what
> remains. Compiled from the `SDLC/` knowledge base (the single source of truth) and the
> current codebase on branch `dev`.
>
> Snapshot date: **2026-07-26** · Phase: **Gate B — Implementation (in progress)** ·
> Status: **S0–S8 done & verified; only S9 (CI/CD + Docker + polish) remains.**

---

## 1. What this project is

**Certra** is an **AI-assisted compliance operating system for MDR/IVDR technical
documentation**. It helps medical-device manufacturers build technical files that are
complete, traceable, and ready to pass Notified Body review.

It is deliberately **not** a generic eQMS/PLM. Certra is purpose-built around the specific
regulatory artifacts — technical file, GSPR conformity, ISO 14971 risk, clinical evaluation,
post-market surveillance — and, crucially, the **links between them** (traceability).

- **One-liner value proposition:** "MDR/IVDR technical files, built to pass."
- **Package / brand name:** `certra`.
- **Business framing:** built as the working prototype for a **TÜBİTAK 1812 BiGG** grant
  application (CUBE Incubation, Teknopark İstanbul) — "LLM-based Medical Regulatory
  Compliance Assessment and Quality Management Platform."

### The problem it solves

Bringing a device to the EU market under **Regulation (EU) 2017/745 (MDR)** or **2017/746
(IVDR)** requires a large, interconnected technical file. For most SMEs and startups today:

- Documentation is assembled by hand across Word, Excel, and shared drives, often via
  expensive external consultants.
- A large share of first-time submissions come back significantly incomplete; one missing
  standard or requirement can cost months of certification delay.
- There is no reliable **traceability** between requirements and evidence
  (GSPR ↔ risk ↔ test ↔ clinical), so gaps and change impacts are hard to see.
- Revision cycles are long and costly.

### Who it is for

- **Primary users:** Regulatory Affairs (RA) and Quality Assurance (QA) staff inside **SMEs
  and startups** building medical devices / IVDs — especially higher-risk classes
  (MDR IIb/III, IVDR C/D) where the compliance burden is greatest.
- **Secondary:** compliance consultants, and (later) Notified Body reviewers.

### Differentiators

1. **Traceability-first data model** — the cross-artifact links are first-class, not an
   afterthought.
2. **Auditor Simulation** — pre-audit gap detection ("what would an auditor ask?") is the
   headline sales argument.
3. **Regulatory-native modules** — purpose-built for MDR/IVDR artifacts, not a generic
   document manager.

### The AI stance (core product principle)

AI is a **drafting and review assistant, never an unattended author**. Every AI output is
watermarked ("AI draft") and must be human-reviewed and approved before it becomes part of
the technical file. This **"AI draft → human review → approved"** loop is a trust and
compliance principle that shapes the UI (purple AI panels, confidence scores, explicit
Verify actions).

> In the **MVP the AI is mocked** (deterministic rules and templates) so the experience is
> demonstrable without external model dependencies. Real Claude API integration lands in
> Phase 1.

---

## 2. Phasing and timeline framing

Two "MVP" meanings existed in the source material; they are reconciled as three phases:

| This plan | Meaning | Rough horizon |
|---|---|---|
| **MVP** | Owner's fast, working demo (for the TÜBİTAK / investor story) | ~1–2 weeks focused build |
| **Phase 1** | The TÜBİTAK application's "6-month MVP": the full product | ~3 months |
| **Phase 2** | Sellable, multi-tenant SaaS | ~6 months after Phase 1 |

Delivery is agile and shipped in working increments; horizons are indicative.

---

## 3. Module inventory and MVP depth

The complete product superset (gathered from the mockups, the internal `taslak.md`, and the
TÜBİTAK application), each mapped to a phase. "Depth" describes the MVP.

| Module | Purpose | Phase | MVP depth |
|---|---|---|---|
| Auth / users / roles | Login, roles (admin/ra/qa/viewer) | MVP | Full |
| Dashboard | Readiness, files, approvals, deadlines, AI activity, findings | MVP | Full |
| Technical File Builder | Device/UDI + structured technical file | MVP | Full (metadata + tabs) |
| GSPR Matrix | GSPR (Annex I) × conformity × evidence × standard | MVP | **Full CRUD** |
| Risk Management (ISO 14971) | Risk register, control, verification | MVP | **Full CRUD** (in file) + read screen |
| Clinical Evaluation (CER) | Evidence, literature, CER | MVP | Medium (read) / Phase 1 full |
| Post-Market (PMS/PMCF/PSUR) | Plans, calendar, reports | MVP | Medium (read) / Phase 1 full |
| Auditor Simulation | Auditor-style deficiency detection | MVP (mock) | **Full (rule engine)** |
| Audit Log | Activity trail on mutations | MVP | Medium + auto-write |
| Traceability | Risk ↔ Test ↔ Clinical ↔ GSPR links | MVP chips / Phase 1 matrix | Chips only |
| Landing (Product Overview) | Public hero + module bento + CTA | MVP | Full |
| Book a Demo | Public lead-capture form | MVP | Full |
| Electronic Forms | Structured data capture | Phase 1 | Out |
| V&V / Tests | Verification/validation test list | Phase 1 | Out |
| AI Document Generator | AI drafts CER/GSPR/Risk/PSUR | Phase 1 | Mock activity cards only |
| Change Control & Approvals | Change requests, approval chain, e-sign | Phase 1 | Out |
| Standards & Library | Harmonized standards + templates | Phase 1 | Out |
| Settings | Org, members/roles, NB, billing | Phase 1 | Out (roles exist in data) |
| CAPA / Complaint & vigilance | Corrective actions, safety events | Phase 2 | Out |
| Supplier management | Subcontractor oversight | Phase 2 | Out |
| UDI / EUDAMED integration | Identification + EU database | Phase 2 | Out |
| Notified Body portal | NB communication | Phase 2 | Out |
| Literature search engine | Retrieve clinical evidence | Phase 2 | Out |

**Technical File detail tabs** — MVP builds **Overview**, **GSPR Matrix**, **Risk / ISO
14971**, plus an **Auditor Sim** action. Electronic Forms, Clinical/CER, V&V/Tests,
Traceability, and Documents tabs are Phase 1.

**"Read-mostly"** = rendered from seed data with minimal or no editing in the MVP; full CRUD
for those modules arrives in Phase 1.

### Explicitly OUT of the MVP

Real LLM calls (AI is mocked) · full CRUD on Risk/Clinical/Post-Market/Audit Log ·
traceability matrix visualization & change-impact analysis · change control & approvals +
e-signature · multi-tenant orgs & fine-grained RBAC · Solutions & Pricing marketing pages ·
i18n, email sending, error monitoring.

---

## 4. Architecture and tech stack

**One Nuxt 4 application** serves both the public marketing surface and the authenticated
app; Nitro provides the server/API layer; Drizzle talks to the database. One codebase, one
deployable Docker image.

```
Browser
  → Nuxt 4 (Vue SSR)   public pages (/, /book-a-demo, /login, /register)
                       app pages (/dashboard, /technical-files, /risk, ...)  [auth-guarded]
  → Nitro server (server/api/*)  Zod validation · auth (nuxt-auth-utils session)
  → Drizzle ORM  →  SQLite (MVP)  /  PostgreSQL (Phase 1+)
```

**Layering rule (hard):** no database access from frontend code — all data flows through
`server/api`. Business logic lives in pure, unit-testable `server/utils/*` modules that thin
routes call.

### MVP stack

| Layer | Choice |
|---|---|
| Framework / server engine | **Nuxt 4** (Nitro), pinned 4.4.8 |
| Language | **TypeScript** (strict, no `any`) |
| Runtime / package manager | **Node.js 22 LTS + npm** |
| UI | **NuxtUI (free) 4.9 + TailwindCSS v4** |
| Icons / fonts | **Material Symbols** (Iconify) · **Geist / Inter / Geist Mono** (`@nuxt/fonts`) |
| Database | **SQLite** (`better-sqlite3`) |
| ORM | **Drizzle ORM** (easy SQLite→PostgreSQL dialect switch) |
| Auth | **nuxt-auth-utils** (encrypted session cookie, scrypt hashing) |
| Validation | **Zod** |
| AI | **Mock** (deterministic rules / templates) |
| Testing | **Vitest** + `@nuxt/test-utils` |
| Lint | **ESLint** (`@nuxt/eslint`) |
| Container / CI / Deploy | **Docker** · **GitHub Actions** · **Coolify on Hetzner** |

**Phase 1 additions:** PostgreSQL + Redis · Claude API · Sentry · i18n (EN/TR/DE) ·
Nodemailer. **Phase 2 additions:** Keycloak/Better Auth (SSO/SAML/OIDC) · Prometheus +
Grafana / Datadog · Terraform + AWS.

**Design tokens:** primary `#2456E6`, AI accent `#6D5AE6`, background `#F5F7FA`, ink
`#0E1B2C`; radii 10/8/6. Two architecturally independent shells — `marketing` (public) and
`app` (authenticated sidebar) — each with its own layout/nav/footer, plus a fullscreen `auth`
layout.

### Data model (SQLite, 9 core entities)

`users`, `technical_files`, `gspr_entries`, `risk_entries`, `clinical_evidence`,
`pms_plans`, `auditor_findings`, `audit_log`, `demo_requests`.

Key conventions: integer PKs; ISO-8601 **TEXT** timestamps (portable to PostgreSQL);
enumerated fields stored as TEXT and constrained in app code via Zod + shared constants;
list-valued reference fields stored as **JSON TEXT** in the MVP (they become real link tables
in Phase 1 when the traceability matrix must be traversed).

**Readiness is derived, not entered:** a technical file's `readiness_percent` is the mean
GSPR conformity score (conforming = 100, partial = 50, missing = 0), recomputed and persisted
on every GSPR create/update/delete.

---

## 5. What has been built so far

Implementation runs sprint by sprint on branch `dev`. Build order deviated from the numeric
sequence on the owner's instruction (marketing S8 was built early). **Every sprint below is
done and verified** — lint, typecheck, tests, and build all green, and each flow was
exercised against a real running dev server and confirmed in a headless browser.

| Sprint | Scope | State |
|---|---|---|
| **S0** | Nuxt 4 scaffold + tooling + design tokens | ✅ Done |
| **S1** | Drizzle schema (9 entities) + migrations + seed + shared types | ✅ Done |
| **S2** | Auth: register / login / logout / session / route guard | ✅ Done |
| **S8** | Marketing: Product Overview landing + Book a Demo (built ahead of sequence) | ✅ Done |
| **S3** | App shell (sidebar / topbar / footer) + shared component library | ✅ Done |
| **S4** | Dashboard | ✅ Done |
| **S5** | Technical Files: list + detail; GSPR + Risk full CRUD; readiness recompute | ✅ Done |
| **S6** | Auditor Simulation (mock rule engine) + report export | ✅ Done |
| **S7** | Standalone module screens (Risk / Clinical / Post-Market / Audit Log) + audit auto-write | ✅ Done |
| **S9** | CI/CD + Docker + polish | ⏳ **Remaining** |

### Sprint detail

- **S0 — Scaffold & tooling.** Nuxt 4.4.8 app at the repo root; module stack installed and
  wired (NuxtUI 4.9, `@nuxt/fonts`, `@nuxt/eslint`, `nuxt-auth-utils`, `zod`, `drizzle-orm`,
  `better-sqlite3`, `vitest`, Material Symbols); brand design tokens applied as Tailwind
  `@theme` variables + NuxtUI theme.

- **S1 — Database.** Drizzle schema for all 9 MVP entities; generated SQL migrations;
  auto-migrating `createDb()`; realistic seed data mirroring the approved mockups (sample
  devices such as OrthoFix Pro, NeuroSensor Gen3, GlucoCheck IVD Assay) via a dev-only
  `POST /api/dev/seed`; API-facing `shared/types` + `shared/constants`.

- **S2 — Auth.** register/login/logout routes on `nuxt-auth-utils` sessions; scrypt hashing;
  server-side guard middleware (allowlist-based, protects `/api/*` by default) + named client
  middleware + login/register pages. Auth domain logic isolated for unit testing.
  **Four real bugs were found and fixed** during/after S2 (all documented in the architecture
  and standards docs): a `vue-router` version mismatch that broke `vue-tsc`; a root-level
  `app.config.ts` silently ignored (Nuxt reads it from `app/`); a module-level DB singleton
  causing intermittent parallel-test failures; and a middleware bug that 401'd Nuxt modules'
  own `/api/_*` endpoints (making login appear to do nothing). A later **session-cookie
  `Secure`-over-http bug** was fixed by making the cookie `Secure` in production only.

- **S8 — Marketing.** `marketing` layout + nav/footer; Product Overview landing (`index.vue`)
  with hero, module bento, human-in-the-loop trust section, and CTA band; `book-a-demo.vue`
  (value props + 6-field form) posting to a Zod-validated `POST /api/demo-requests`.
  Solutions/Pricing are intentionally omitted (Phase 1 pages — no dead routes). Hero/trust
  visuals are CSS-only placeholders (no stock photos, logos, testimonials, or badges yet).

- **S3 — App shell + shared components.** The authenticated `app` layout (`AppSidebar` fixed
  240px + mobile drawer, `AppTopbar` with breadcrumb/search/notifications/user menu, slim
  `AppFooter`); a shared component library in `app/components/common/` (ToneBadge /
  StatusBadge / SeverityBadge, TraceabilityChip, ReadinessRing, ReadinessBar, AiPanel,
  DataTable, BentoCard, ModulePlaceholder); navigation model in composables. Badge/table/
  readiness logic extracted to pure, unit-tested utilities. No dead routes; Settings/Support
  render disabled (out of MVP scope).

- **S4 — Dashboard.** `GET /api/dashboard/stats` (auth-protected) backed by a pure
  `getDashboardStats(db)`, plus the real `dashboard.vue` composed from the S3 library.
  Surfaces portfolio readiness (65% mean), per-file readiness bars, pending approvals,
  upcoming PMS deadlines (live days-remaining), mock AI drafts by confidence, and open
  deficiency findings (critical-first, with GSPR traceability chips).

- **S5 — Technical Files.** The full technical-file module: list page (filters + pagination)
  and detail page (Overview / GSPR matrix / Risk register tabs), plus create/patch and GSPR +
  Risk CRUD as pure `server/utils/*` behind thin routes, with **readiness recomputed** from
  GSPR conformity. The full create → add GSPR → readiness recompute (0→100→50→25→0) → delete
  cycle and risk CRUD were exercised live.

- **S6 — Auditor Simulation.** A deterministic mock rule engine (`runAuditorSimulation`) over
  a file's GSPR conformity and ISO 14971 risk state — missing GSPR = critical, partial =
  major, unmitigated high-severity risk = critical/major, mitigated-without-verification =
  minor, readiness < 70% = major. `POST /api/auditor/simulate` returns **ephemeral** findings;
  the UI adds an **Auditor Sim** tab that runs on mount and shows a pass banner or a severity
  summary + findings, with a Markdown **Export report** action.

- **S7 — Standalone module screens.** The four seed-driven screens replacing the S3
  placeholders — Risk Management (portfolio ISO 14971 register + summary cards), Clinical
  Evaluation (evidence table + AI-suggestions panel), Post-Market (milestone timeline + plans
  table + AI insight), and Audit Log (KPI cards + actor/impact filters + table). **Audit log
  now auto-writes an entry on every mutation** (technical-file / GSPR / risk create/update/
  delete), resolving the earlier deferral.

### Verification status (current)

- **Tests:** ~58 passing (17 test files across `server/utils`, `app/utils`, `app/components`,
  `server/database`).
- `npm run lint` / `npm run typecheck` / `npm run test` / `npm run build` — **all green.**
- Every flow exercised against a live dev server and confirmed in a headless browser
  (screenshots at 1280px + 375/390px).

### Codebase at a glance (what exists on disk)

- **Pages (11):** `index`, `book-a-demo`, `login`, `register`, `dashboard`,
  `technical-files/index`, `technical-files/[id]`, `risk`, `clinical-evaluation`,
  `post-market`, `audit-log`.
- **API routes (21):** auth (register/login/logout), technical-files (list/get/create/patch),
  gspr (create/patch/delete), risk (list/create/patch/delete), clinical, post-market,
  audit-log, auditor/simulate, dashboard/stats, demo-requests, dev/seed.
- **Server utils (16):** `auth`, `db`/`createDb`, `technicalFiles`, `gspr`, `risk`,
  `riskRegister`, `clinical`, `postMarket`, `dashboard`, `auditorRules`, `auditLog`,
  `demoRequests`, `publicApiPaths`, `patch`, `routeParams`.
- **Components:** `common/` (11 shared), `layout/` (5), `marketing/` (4), `technical-file/`
  (7).

---

## 6. What remains

### S9 — CI/CD, deploy & polish (the final MVP sprint)

- **GitHub Actions** — `ci.yml` (lint + test + build) and `deploy.yml` (Docker build +
  Coolify deploy).
- **Production Dockerfile** — must `COPY server/database/migrations` into the image alongside
  `.output` (the migrations path resolves via `process.cwd()`).
- Responsive/hover polish; coverage check (target 60%+ on critical paths); README /
  CHANGELOG update.
- **Acceptance:** CI green on push; Docker image runs; the manual MVP checklist passes.

After S9 the MVP is complete. A `dev → main` merge is the owner's call (the SDLC docs live on
`main`; the S0–S8 implementation commits are on `dev`, pushed to `origin/dev`).

### Open items awaiting the owner

- **Design assets:** logo (SVG + favicon), 3–5 marketing photos, a social-proof decision
  (real vs. clearly-labelled sample), and ISO 13485 / HIPAA badges *only if truly certified*.
  The landing/book-a-demo pages are live now without these (CSS-only visuals) — swapping in
  real assets is a follow-up, not a blocker.
- **Two scope decisions to confirm:** (a) include a static **Traceability Thread** visual in
  the MVP (recommended, cheap, high-impact for the demo); (b) confirm the demo needs no mock
  **AI Document Generator** page.
- **Dev tooling nit:** `POST /api/dev/seed` is not idempotent (re-seeding a populated DB 500s
  on the unique email constraint). Harmless; consider clear-then-seed or a graceful 409.

### Phase 1 (next major phase, ~3 months)

Real **Claude API** integration (CER draft first, then GSPR rationale, risk report,
PSUR/PMCF, and AI-based Auditor Simulation — all still watermarked and human-approved) ·
**full CRUD** across all modules · **traceability matrix + change-impact analysis** · **change
control & approvals** with basic e-signature · **PostgreSQL + Redis** migration · **Sentry** ·
**i18n** (EN/TR/DE) · marketing **Solutions + Pricing** pages · **Nodemailer** email · PR +
review become mandatory.

### Phase 2 (~6 months after Phase 1)

Multi-tenant architecture · **SSO / SAML / OIDC** + fine-grained RBAC · **PKI e-signature** +
tamper-evident audit trail + document versioning · monitoring (Prometheus/Grafana/Datadog) +
IaC (Terraform/AWS) · **UDI / EUDAMED** integration · **CAPA** + complaint/vigilance ·
supplier management · Notified Body portal · integrated literature-search engine · onboarding,
training, beta program, sales readiness.

---

## 7. Requirements coverage (MVP)

All MVP-flagged functional requirements are implemented:

- **Auth:** FR-AUTH-1..4 ✅
- **Dashboard:** FR-DASH-1..4 ✅
- **Technical files:** FR-TF-1..4 ✅
- **GSPR:** FR-GSPR-1 ✅
- **Risk:** FR-RISK-1 (in-file CRUD), FR-RISK-2 (standalone screen) ✅
- **Clinical:** FR-CER-1 ✅
- **Post-market:** FR-PMS-1 ✅
- **Auditor simulation:** FR-AUD-1..2 ✅
- **Audit log:** FR-LOG-1..2 ✅
- **Traceability:** FR-TRC-1 (chips) ✅
- **Marketing:** FR-MKT-1..2 ✅

Non-functional targets: strict TS (no `any`), files ≤ 500 lines / functions ~30 lines, WCAG
AA contrast, responsive at 375/768/1280px, ESLint clean + tests green (60%+ coverage on
critical paths as an S9 gate), and "no misleading claims — sample data labelled as such."

---

## 8. Business model (reference)

Tiered SaaS subscription + AI usage credits + services (Pricing page ships in Phase 1):

| Tier | Monthly | Target |
|---|---|---|
| Free | €0 | Spin-off / trial |
| Starter | €499 | SME / startup — 3 technical files, AI copilot (low quota) |
| Professional (most popular) | €1,299 | Larger manufacturer — 10 files, SSO/API, advanced AI |
| Enterprise | €3,599+ | Global org — 25+ files, unlimited AI, on-prem option |

Add-ons: AI credit packs (~€100 / 1,000 transactions) and services. Market figures from the
TÜBİTAK application (EU market size, compliance-cost growth, revenue targets) are treated as
**claims to verify**, not settled facts.

---

## 9. Repository layout and how to run

**Structure:** `app/` (Vue pages, components, composables, layouts, middleware, utils),
`server/` (`api/`, `database/`, `middleware/`, `utils/`), `shared/` (types + constants),
`SDLC/` (the source-of-truth knowledge base), `eski-veriler/` (archived planning material and
UI design mockups). The `AGENTS.md` bridge points agents/tools into `SDLC/`.

**Working process (from `SDLC/`):** documentation-first, session-based. `SDLC/04-session-log/
STATE.md` is the always-current snapshot; each session ends by updating STATE.md and adding a
session log. Conventional Commits, committed after each logical unit; commits carry no
tool-attribution trailers.

**Local commands:**

```bash
npm run dev         # dev server at http://localhost:3000
npm run lint        # ESLint (currently green)
npm run typecheck   # vue-tsc (currently green)
npm run test        # Vitest (~58 tests, green)
npm run build       # Nitro production build (green)
npm run db:generate # regenerate SQL migrations after a schema change
```

- `.env` (git-ignored) holds a generated `NUXT_SESSION_PASSWORD`; copy `.env.example` if
  missing.
- Demo data: `POST /api/dev/seed` while the dev server runs (dev-only). Seeded login:
  `demo@certra.app` / `CertraDemo!2026`.

---

## 10. Bottom line

The MVP is **feature-complete across all six app modules plus marketing and auth** (S0–S8),
fully verified, and running green on `dev`. The AI is mocked but the full "draft → review →
approve" story is demonstrable, and the signature **Auditor Simulation** produces real
severity-ranked deficiency findings from a file's GSPR/risk state. The **only remaining MVP
work is S9** — CI/CD pipelines, a production Docker image, and polish — after which the
prototype is ready for the TÜBİTAK demo and the project moves into Phase 1 (real Claude
integration, full CRUD, traceability matrix, and the PostgreSQL migration).
