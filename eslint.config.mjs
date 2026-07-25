// Flat ESLint config from @nuxt/eslint. The generated base is created by the
// module during `nuxt prepare`. Add project-specific overrides in withNuxt().
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Optional props here are typed with TypeScript (`prop?: T`), which already
    // expresses an implicit `undefined` default; requiring an explicit runtime
    // default is redundant and noisy for TS-first components.
    'vue/require-default-prop': 'off',
  },
})
