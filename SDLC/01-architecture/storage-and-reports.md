# File Storage & Report Generation

The product is document-heavy (evidence attachments, generated regulatory documents,
exported reports, e-signature artifacts). This defines how files and reports are handled per
phase. It was an implicit gap in the initial architecture; captured here explicitly.

## MVP

- **No user file uploads.** Evidence and standard references are stored as labels / JSON
  reference lists, not binary files. The Technical File "Documents" tab is deferred to Phase 1.
- **Report export (Auditor Simulation):** export findings as **Markdown/HTML**. A printable
  view enables browser "print to PDF" without a heavy dependency. No server-side PDF library
  in the MVP.
- Rationale: keeps the MVP simple and dependency-light while still demoing "Export report".

## Phase 1

- **Document/file storage abstraction** with two backends: local disk (dev) and an
  S3-compatible object store (prod). All access goes through a small storage service so the
  backend can change without touching callers.
- **Evidence attachments** on GSPR/risk/clinical items; validated by type and size.
- **Generated documents** (CER, GSPR rationale, risk report, PSUR/PMCF) are stored as
  artifacts with versioning and status (draft/approved).
- **Server-side PDF generation** for regulatory documents and reports. Decision deferred;
  candidate approaches to evaluate: a headless-Chromium renderer (HTML -> PDF, best fidelity)
  vs a lighter PDF library. Record the choice as an ADR when selected.

## Phase 2

- **E-signature artifacts** with PKI; tamper-evident storage; signed URLs for downloads.
- Retention, backup, and (where required) virus scanning of uploads.

## Security

- Validate file type and size on upload; never trust client-provided content type alone.
- Serve user files via signed, time-limited URLs; never from a public bucket root.
- Keep storage credentials in env/secrets, never in the repo.
