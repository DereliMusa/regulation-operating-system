import { defineVitestConfig } from '@nuxt/test-utils/config'

// The default environment stays Node so the existing pure unit/integration
// tests (server utils, badge/table logic) run fast without a Nuxt runtime.
// Component render tests opt into the Nuxt environment per-file with the
// `// @vitest-environment nuxt` directive and mount via `mountSuspended`.
//
// Coverage (npm run test:coverage) targets the pure business logic — the
// server/app utilities the MVP's critical paths run through. UI components and
// the app-wide DB singleton (db.ts, exercised only via the pure createDb
// factory in tests) are excluded so the 60% target reflects tested logic, not
// framework glue. See SDLC/02-standards/testing-strategy.md.
export default defineVitestConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: ['server/utils/**/*.ts', 'app/utils/**/*.ts'],
      exclude: ['**/__tests__/**', 'server/utils/db.ts'],
      thresholds: {
        lines: 60,
        functions: 60,
        statements: 60,
        branches: 60,
      },
    },
  },
})
