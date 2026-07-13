# ADR-003: Drizzle ORM instead of raw SQL

- **Status:** Accepted
- **Date:** 2026-07-14

## Context

The owner's preference was to stay close to SQL rather than adopt a heavy ORM. We also want
type safety, protection against SQL injection, and an easy SQLite -> PostgreSQL path.

## Decision

Use **Drizzle ORM**. Its query API is SQL-like and thin, queries are parameterized, types
are inferred from the schema, and switching dialects (SQLite -> PostgreSQL) is a
configuration change.

## Consequences

- Honors the "close to SQL" intent without hand-writing queries, types, and injection
  guards.
- Type-safe queries reduce a class of runtime bugs.
- Single schema definition powers migrations and seed.
- Rejected alternatives: raw SQL (more manual safety/typing burden), Prisma/TypeORM
  (heavier, further from SQL), Mongoose/MongoDB (data is relational due to traceability).
