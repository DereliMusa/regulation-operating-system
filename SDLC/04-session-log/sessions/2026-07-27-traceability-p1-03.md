# Session 2026-07-27 — P1-03 Traceability matrix + change-impact

The owner said "continue developing the project" and, when asked which Phase 1 thread, chose the
**traceability matrix** (workstream #3, `FR-TRC-2`). Delivered the user-facing half of that
workstream on a new branch `feat/traceability-matrix` off `dev`. Branched off `dev` (not off the
parallel `feat/clinical-pms-crud`/P1-02 branch) because traceability only *reads* clinical evidence —
it does not depend on P1-02's CRUD — so the two Phase 1 threads stay independent PRs.

## Scope decision (ADR-008)

Phase 1 workstream #3 has three parts: promote JSON refs to link tables, a traceability matrix, and
change-impact analysis. Shipped the matrix + change-impact **first**, computed by a pure builder that
**derives** the graph from the existing reference fields, and **deferred** the JSON -> link-table
promotion. The builder is the stable seam (same idea as ADR-005's auditor-rules seam) so the later
link-table increment changes only its internals, not the API/UI/tests. Recorded as
`adr/008-derived-traceability-graph.md`.

## What shipped

### Derived traceability graph (backend)

- `shared/types/traceability.ts` — `TraceNode` / `TraceLink` / `TraceMatrix` / `CoverageGap` /
  `TraceabilityGraph` / `ChangeImpact`. Node kinds: `gspr | risk | test | clinical | standard`.
- `server/utils/traceability.ts` — `buildTraceabilityGraph(input)`, pure and DB-free (unit-testable
  like `auditorRules`). Nodes for every GSPR / risk / clinical record + referenced standard and
  verification/control artifact; links derived from the reference fields:
  - `risk.traceabilityRefs` -> GSPR (`traces-to`), guarded so a ref to a non-existent GSPR is ignored.
  - `risk.verificationRef` / `controlMeasureRef` -> `test` node (`verified-by` / `controlled-by`).
  - `gspr.standardRefs` -> `standard` (`conforms-to`); `gspr.evidenceRefs` -> clinical (matched by
    `cerRef`) else a `test` node (`evidenced-by`).
  Also builds the GSPR x risk matrix, the coverage gaps (GSPRs with no risk/clinical/test link; risks
  not traced to a GSPR), and a summary (coverage %, traced counts, gap count).
- `server/utils/clinical.ts` — added `getClinicalEvidenceForFile(db, id)` (the graph needs clinical
  rows, which `getTechnicalFileDetail` does not return).
- `server/api/technical-files/[id]/traceability.get.ts` — thin route: assembles GSPR/risk/clinical
  from the DB and hands them to the builder (mirrors the auditor route).

### Traceability tab (frontend)

- `app/utils/traceability.ts` — `computeChangeImpact(graph, nodeId)` (undirected BFS, nearest-first,
  returns each reachable node with its hop distance), `buildTraceabilityReportMarkdown(graph)`
  (Markdown export, matches `auditorReport.ts`), plus `KIND_META` / `RELATION_LABEL` / `nodeTone`
  display helpers. Pure and unit-tested.
- `app/components/technical-file/TraceabilityGrid.vue` — the GSPR x risk grid; a check marks a traced
  cell, headers are clickable to select an artifact for change-impact, selected/impacted headers are
  highlighted.
- `app/components/technical-file/TraceNodeChip.vue` — display-only node chip (tone dot + kind icon +
  mono ref + optional distance badge), reused in the "other artifacts" row and the impact list.
- `app/components/technical-file/TraceabilityMatrix.vue` — container: fetches the graph on mount,
  coverage stat row, the grid, legend, other-linked-artifacts, the change-impact panel, the gaps
  card, and the Markdown export.
- `app/pages/technical-files/[id].vue` — new **Traceability** tab between Risk register and Auditor sim.

### Seed enrichment

Added realistic cross-references to `seed-data.ts` (risk `traceabilityRefs`, gspr `evidenceRefs`,
verification/control refs) so the matrix, gaps, and change-impact are demonstrable across the sample
files without touching the schema.

## Gotcha found: seed enrichment broke an auditor test

Adding a `verificationRef` to OrthoFix's RISK-040 removed the "mitigated without verification" minor
finding the S6 auditor test asserts. Reverted just that field (kept `controlMeasureRef: 'RCM-40'`), so
RISK-040 stays a coherent example — traced to GSPR 1, has a control measure, but still lacks
verification (the auditor's minor finding, and a visible control link in traceability). Lesson: seed
changes can ripple into rule-engine tests; re-run the full suite after editing seed data.

## Verification (actually run, not claimed)

- `npm run lint` clean; `npm run typecheck` clean; `npm run test` **72 pass** (19 files; +14: 7 graph
  builder + 7 client util); `npm run build` succeeds; the `traceability.get` route is in the output.
- **Live dev server** (fresh DB, re-seeded): `GET /api/technical-files/:id/traceability` gave 401
  unauth, 400 on a bad id, 404 on a missing file, and correct graphs — CardioGuard 100% coverage / 0
  gaps / 12 nodes / 13 links, NeuroScan 67% / gaps `[GSPR 10.2, RISK-015]`, Orthopedic Fusion 50% /
  gap `[GSPR 1]`. The file-detail page SSR-renders with the new Traceability tab and zero Vue warnings.
- **Not browser-driven:** the Chrome extension was not connected this session, so the tab's
  change-impact click interaction was not exercised in a real browser — that click-through is a
  pre-merge follow-up (the BFS itself is unit-tested).

## Next

- Open the PR `feat/traceability-matrix -> dev` after a browser click-through of the Traceability tab.
- Remaining in workstream #3: promote the JSON reference lists to relational link tables (ADR-008).
