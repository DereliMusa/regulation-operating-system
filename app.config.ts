// Runtime UI theme (NuxtUI). `primary` maps to the Certra brand scale defined
// in app/assets/css/main.css (@theme --color-brand-*); neutral uses slate.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      neutral: 'slate',
    },
  },
})
