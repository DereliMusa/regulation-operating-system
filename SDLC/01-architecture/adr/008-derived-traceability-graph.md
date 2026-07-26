# ADR-008: Derive the traceability graph before promoting to link tables

- **Status:** Accepted
- **Date:** 2026-07-27

## Context

Phase 1 workstream #3 (see [`../../03-planning/phase-1-plan.md`](../../03-planning/phase-1-plan.md))
has three parts: (a) promote the JSON reference lists to relational link tables, (b) a
traceability matrix visualization, and (c) change-impact analysis
([`FR-TRC-2`](../../03-planning/requirements.md)). The user-facing value is (b) and (c); (a)
is an internal data-model refactor with a migration cost.

Cross-artifact references already exist as fields: `risk_entries.traceability_refs` (points at
GSPR refs), `risk_entries.verification_ref` / `control_measure_ref`, `gspr_entries.standard_refs`
and `gspr_entries.evidence_refs`. These are enough to reconstruct the
GSPR <-> risk <-> test <-> clinical chain by matching on the reference strings.

## Decision

Deliver the traceability matrix and change-impact analysis **first**, computed by a pure graph
builder (`server/utils/traceability.ts`, `buildTraceabilityGraph`) over the existing reference
fields. Defer the JSON -> link-table promotion to a later increment in the same workstream.

The builder is a **stable seam**: it takes the file's GSPR, risk and clinical entities and
returns `{ nodes, links, matrix, gaps, summary }`. Whether the edges are derived from JSON
strings (now) or read from link tables (later) is an implementation detail behind that
function — consumers (the API route, the matrix UI, the change-impact BFS, the Markdown export)
do not change when the backing store does. This mirrors ADR-005's auditor-rules seam.

## Consequences

- The matrix and change-impact ship as a bounded, verifiable increment (P1-03) without a risky
  schema migration in the same change.
- Edges are matched by reference **string** (e.g. a risk's `traceability_refs` entry `"GSPR 17.1"`
  matches a GSPR whose `gspr_ref` is `"GSPR 17.1"`). This is exactly how the data is authored, so
  it is faithful for the current model, but it is not referentially enforced — a typo in a
  reference yields a missing edge rather than an error. The link-table increment closes this by
  making links first-class rows with foreign keys.
- Seed data was enriched with realistic cross-references so the matrix, gaps, and change-impact
  are demonstrable across the sample files.
- The change-impact traversal treats links as undirected (a change propagates both ways along a
  trace), which is the correct default for impact analysis.
