# Coding Standards

Language of record: **English** for all code, comments, and docs. No emoji anywhere in the
codebase.

## Principles

- **DRY** — do not repeat yourself; extract shared logic.
- **KISS** — keep it simple; prefer the obvious solution.
- **YAGNI** — build only what the current phase needs.

## Size limits

- **Max 500 lines per source file.** If exceeded, split into logical sub-modules
  (e.g. a large page into child components; a large schema into per-domain files).
- **Functions around 30 lines.** If longer, decompose.

## TypeScript

- `strict` mode on. **No `any`** — use precise types, generics, or `unknown` with narrowing.
- Explicit return types on server API handlers and exported functions.
- Prefer `type`/`interface` in `shared/types` for cross-boundary shapes; infer Drizzle types
  from the schema.
- Validate all external input (forms, API bodies, query params) with **Zod**.

## Naming

| Kind | Convention | Example |
|---|---|---|
| Variables, functions | camelCase | `getTechnicalFile`, `readinessPercent` |
| Components, types/interfaces | PascalCase | `DashboardCard`, `TechnicalFile` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE` |
| File names | kebab-case | `technical-file.ts` |
| Vue component files | PascalCase | `DashboardCard.vue` |
| Composables | `use` prefix | `useAuth`, `useTechnicalFiles` |

## Vue / Nuxt

- Always `<script setup lang="ts">` (never the Options API).
- Type props with `defineProps<...>()` and emits with `defineEmits<...>()`.
- Keep components presentational; data access goes through composables -> server API.
- **No database access from frontend code.** Database logic lives only in `server/`.

## Comments and documentation

- Comment the **why**, not the **what**. Avoid comments that restate the code.
- Public/exported functions and composables get a **JSDoc** block (purpose, params, return).
- Keep an ADR for every significant architectural decision (`01-architecture/adr`).

### JSDoc example

```ts
/**
 * Calculate the overall compliance readiness percentage for a technical file,
 * based on the conformity status of its GSPR entries.
 *
 * @param fileId - The technical file id
 * @returns Readiness percentage in the range 0-100
 */
export function calculateReadiness(fileId: number): number { /* ... */ }
```

## Errors and validation

- Fail fast on invalid input; return typed, meaningful API errors.
- Never trust client input; parameterized queries only (Drizzle handles this).

## Enforcement

- ESLint (`@nuxt/eslint`) must pass with no errors.
- These rules are mirrored for AI agents in [`agent-rules.md`](agent-rules.md) and bridged
  by the repo-root `CLAUDE.md` / `.agents/AGENTS.md`.
