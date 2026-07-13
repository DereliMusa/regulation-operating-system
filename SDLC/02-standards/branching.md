# Branching Strategy

Kept deliberately simple for the MVP; tightened from Phase 1.

## MVP

```
main            # always deployable (production)
  └── dev       # integration branch
        ├── feat/<name>
        ├── fix/<name>
        └── docs/<name>
```

Rules:

- `main` is always in a deployable state.
- Tests must pass before merging into `dev`.
- During the MVP, `dev -> main` may be merged directly (PR optional).
- The SDLC bootstrap work happens on `docs/sdlc-bootstrap`.

## From Phase 1

- Pull requests become **mandatory**, with review before merge.
- Protected `main`; CI (lint + test + build) must be green to merge.
- Conventional Commit history is preserved (no force-squash of meaningful history).

## Deploy

- MVP: push to `main` triggers the Docker build + Coolify deploy workflow
  (see [`../03-planning/mvp-plan.md`](../03-planning/mvp-plan.md), S9).
