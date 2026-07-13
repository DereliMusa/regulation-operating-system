# Commit Conventions

Follow **Conventional Commits**. Commit messages are in **English**, imperative mood, with a
description of about 50 characters or fewer.

## Format

```
<type>(<scope>): <description>

[optional body: what and why]

[optional footer]
```

## Types

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `style` — formatting, no behavior change
- `refactor` — restructuring, no behavior change
- `test` — add or fix tests
- `chore` — maintenance (deps, config)
- `ci` — CI/CD changes

## Scopes

`auth`, `dashboard`, `technical-file`, `gspr`, `risk`, `cer`, `pms`, `auditor`, `audit`,
`db`, `api`, `ui`, `layout`, `marketing`, `sdlc`, `docker`, `deps`, `init`.

## Rules

- Imperative mood: "add login page", not "added login page".
- **Commit after each logical unit of work.** Do not squash everything into one commit.
- Do not bundle unrelated changes in one commit.
- Keep the subject line short; put the reasoning in the body.
- Commits carry no co-author or tool-attribution trailer.

## Example flow (MVP)

```
chore(sdlc): establish knowledge base
chore(init): scaffold nuxt project with typescript
chore(deps): add drizzle, nuxt-auth-utils, zod
feat(db): add schema and seed data
feat(auth): add server session management
feat(auth): add login and register pages
feat(layout): add sidebar and topbar
feat(dashboard): add dashboard with stats
feat(technical-file): add file detail with tabs
feat(gspr): add GSPR matrix crud
feat(risk): add risk register crud
feat(auditor): add mock auditor simulation
test(api): add technical file api tests
ci: add github actions workflow
```


