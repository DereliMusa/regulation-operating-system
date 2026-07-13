# ADR-002: SQLite for the MVP database

- **Status:** Accepted
- **Date:** 2026-07-14

## Context

The MVP must be built and demoed fast. We do not yet need concurrency, horizontal scaling,
or managed backups. We do need a frictionless local and CI setup.

## Decision

Use **SQLite** via `better-sqlite3` for the MVP, accessed through Drizzle ORM. Plan to
migrate to **PostgreSQL** in Phase 1.

## Consequences

- Zero configuration; a single file database; trivial local and CI runs.
- Fast to seed realistic demo data.
- Migration path is cheap because Drizzle only needs a dialect/config change (see
  [ADR-003](003-drizzle-orm.md)); the schema is largely portable (ISO-8601 TEXT
  timestamps, TEXT enums, JSON TEXT for reference lists).
- Trade-off: not suitable for multi-user production writes; explicitly a Phase-1 upgrade.
