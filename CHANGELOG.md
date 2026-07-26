# Changelog

All notable changes to Certra are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project uses
[Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

The MVP (sprints S0–S9). AI features are mock (rule/template based); the real Claude
integration is planned for Phase 1.

### Added

- **Foundation (S0–S2):** Nuxt 4 (Nitro) + TypeScript scaffold with the brand design
  tokens; Drizzle schema, migrations and seeded demo data for all MVP entities;
  register/login/logout on nuxt-auth-utils sessions with server + client route guards.
- **App shell (S3):** authenticated layout (sidebar, topbar, footer) and a shared
  component library (status/severity badges, traceability chip, readiness ring/bar,
  AI panel, data table, bento card) with pure, unit-tested badge/table/readiness logic.
- **Dashboard (S4):** portfolio readiness, per-file readiness, pending approvals, PMS
  deadlines, mock AI drafts, and open deficiency findings from seed data.
- **Technical files (S5):** list (filters/pagination) and detail (Overview / GSPR matrix /
  Risk register) with full GSPR and ISO 14971 Risk CRUD; readiness recomputed from GSPR
  conformity.
- **Auditor simulation (S6):** deterministic mock rule engine over GSPR + risk state, with
  an in-app simulation tab and Markdown report export.
- **Module screens (S7):** standalone Risk Management, Clinical Evaluation, Post-Market,
  and Audit Log screens; every technical-file / GSPR / risk mutation auto-writes an
  audit-log entry.
- **Marketing (S8):** Product Overview landing page and a Book a Demo page that persists
  leads.
- **CI/CD & Docker (S9):** GitHub Actions CI (lint, typecheck, test, build) and deploy
  (Docker image → GHCR → Coolify redeploy); a multi-stage production Dockerfile that ships
  the SQL migrations alongside the Nitro output; `docker-compose.yml` for local
  production runs; and a `test:coverage` check (60%+ on core server/app logic).
