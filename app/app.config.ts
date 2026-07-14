// Runtime UI theme (NuxtUI). `primary` maps to the Certra brand scale defined
// in app/assets/css/main.css (@theme --color-brand-*); neutral uses slate.
// NOTE: must live under app/ (the Nuxt 4 srcDir), not the project root —
// Nuxt resolves app.config from `dirs.app`.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'slate',
    },
  },
})
