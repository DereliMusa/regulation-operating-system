# Session 2026-07-26 — P1-02 Clinical Evaluation + Post-Market full CRUD

First Phase 1 increment. The MVP (S0-S9) was code-complete, so on the owner's "continue
developing" the direction was picked from the Phase 1 plan: **P1-02 — full CRUD for the two
modules that shipped read-only in S7** (Clinical Evaluation and Post-Market). Self-contained, no
external dependencies or owner secrets required, fully verifiable locally. Delivers the CRUD half of
FR-CER-2 / FR-PMS-2 (the AI-drafting half stays with the Phase 1 AI workstream #1).

Built on a feature branch `feat/clinical-pms-crud` off `dev` — Phase 1 makes feature branches + PR
mandatory (see `02-standards/branching.md`).

## What shipped

### Clinical Evaluation CRUD (FR-CER-2, CRUD portion)

- `server/utils/clinical.ts` extended with `createClinicalEvidence` / `updateClinicalEvidence` /
  `deleteClinicalEvidence` (+ `Create`/`Update` input interfaces), mirroring `risk.ts` exactly:
  `createError` 404 on a missing record, `definedFields` for partial PATCH, delete returns the
  `cerRef` for the audit trail. `getClinicalOverview` unchanged.
- Routes: `POST /api/clinical`, `PATCH /api/clinical/[id]`, `DELETE /api/clinical/[id]` — each
  Zod-validated, `requireUserSession`-guarded, and calls `writeAuditLog` (entityType
  `clinical_evidence`, ref = `cerRef`).
- `app/components/clinical/ClinicalEvidenceFormModal.vue` — add/edit modal. Because this is a
  standalone (portfolio-wide) screen with no parent technical file in context, **create requires a
  device picker** (`USelect` over the technical-files list); on edit the device is fixed and shown
  read-only. Optional AI summary + confidence fields.
- `app/pages/clinical-evaluation.vue` — added an "Add evidence" header button, an actions column
  (edit/delete) on the evidence table, the form modal, and a `ConfirmDialog` for delete, all wired to
  `refresh()`.

### Post-Market CRUD (FR-PMS-2, CRUD portion)

- `server/utils/postMarket.ts` extended with `createPmsPlan` / `updatePmsPlan` / `deletePmsPlan`
  (+ input interfaces). `getPostMarketOverview` unchanged.
- Routes: `POST /api/post-market`, `PATCH /api/post-market/[id]`, `DELETE /api/post-market/[id]` —
  same guard/validate/audit pattern (entityType `pms_plans`, ref = `planType`).
- `app/components/post-market/PmsPlanFormModal.vue` — add/edit modal with device picker (create),
  plan type, a native `type="date"` next-due input, status, and optional confidence.
- `app/pages/post-market.vue` — "Add plan" button, actions column on the plans table, form modal +
  delete confirm.

### Design notes

- **Device picker via a second `useFetch`.** Both pages fetch `/api/technical-files?pageSize=50` and
  map it to `{ label: deviceName, value: id }` for the create select. `USelect` values are the numeric
  file ids — not the empty string — so the S7 empty-string-value gotcha does not apply here.
- **`deviceRef` left null on create.** The overview join already falls back to the technical file's
  `deviceName` (`p.deviceRef ?? deviceName.get(...)`), so new plans display the right device without
  the form having to duplicate the name. Seed rows keep their `deviceRef`; both paths render the same.
- **`nextDue` date handling.** The modal binds a `YYYY-MM-DD` value; on edit it slices the stored ISO
  string to its date part. `Date.parse` handles both, so `daysRemaining` stays correct.
- Enum form-state fields are cast to their union type (`'draft' as ClinicalEvidenceStatus`, etc.) per
  the S5 UForm-state coding-standard; confidence is kept as a string in state and coerced to
  `number | null` on submit.

## Tests

- `server/utils/__tests__/clinical.test.ts` and `postMarket.test.ts` (+6 tests total, mirroring
  `risk.test.ts`): create -> overview reflects it -> update -> delete round-trip; device-name join /
  AI-suggestion ranking for a new clinical record; `deviceRef`-null fallback for a new plan; 404
  throws for missing ids.

## Verification (actually run, not claimed)

- `npm run lint` clean; `npm run typecheck` exit 0; `npm run test` **64 pass** (19 files, +6);
  `npm run build` succeeds; `npm run test:coverage` exit 0 — `clinical.ts` 93.75% stmts / 100% funcs,
  `postMarket.ts` 93.33% / 100% funcs (project 93.16% stmts, well over the 60% gate).
- **Live dev server, full CRUD via curl (cookie session):**
  - Clinical: 401 unauth POST; login 200; create (id 4, device joined = "CardioGuard Pro S2", status
    draft); PATCH -> approved / confidence 95; 400 on invalid `sourceType`; DELETE -> total back to 3.
  - Post-Market: create (id 4, device fallback = "CardioGuard Pro S2", `daysRemaining` 232 computed);
    PATCH -> active / new due date; 400 on invalid `planType`; DELETE -> total back to 3.
  - **FR-LOG-1 proof:** all six mutations appear at the top of `GET /api/audit-log` with the correct
    action / entityType / entityRef / actor ("Added/Updated/Deleted clinical evidence | CER-VERIFY-1"
    and the three "... post-market plan | PSUR").
  - Both pages SSR-render (200) authenticated with the new "Add evidence" / "Add plan" buttons; dev
    log had **zero** warnings or component-resolution errors.
- **Not browser-driven this session:** the interactive modal open/submit was not exercised in a
  headless browser. The CRUD is proven through the API, both pages render clean, and the modal reuses
  the identical `UModal`/`UForm`/`USelect`/`ConfirmDialog` patterns that S5/S7 already verified in a
  browser (and no `USelect` item uses the empty-string value that the one known runtime gotcha needs).
  A browser click-through of the two new modals is a reasonable follow-up before the PR merges.
- Left the local `.data` DB back at its pristine seed (all verify records deleted).

## Next

- Browser click-through of the two new modals (device picker dropdown especially), then open the PR
  `feat/clinical-pms-crud -> dev`.
- Remaining Phase 1 threads: AI (Claude) integration (#1, the flagship), traceability matrix (#3),
  change control (#4), PostgreSQL/Redis (#5), Solutions/Pricing marketing (#7). See
  `03-planning/phase-1-plan.md`.
