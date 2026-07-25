import { defineVitestConfig } from '@nuxt/test-utils/config'

// The default environment stays Node so the existing pure unit/integration
// tests (server utils, badge/table logic) run fast without a Nuxt runtime.
// Component render tests opt into the Nuxt environment per-file with the
// `// @vitest-environment nuxt` directive and mount via `mountSuspended`.
export default defineVitestConfig({})
