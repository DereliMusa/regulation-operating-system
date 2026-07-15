// Nuxt configuration.
// See https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/eslint',
    'nuxt-auth-utils',
  ],

  // Keep subfolder organization (layout/, marketing/, ...) without Nuxt's
  // default folder-name prefix on component tags (e.g. `MarketingNav`, not
  // `LayoutMarketingNav`).
  components: [
    { path: '~/components', pathPrefix: false },
  ],

  // NuxtUI + Tailwind v4 entry and design tokens (see SDLC STYLE_GUIDE).
  css: ['~/assets/css/main.css'],

  // Self-hosted brand fonts.
  fonts: {
    families: [
      { name: 'Geist', provider: 'google' },
      { name: 'Inter', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
    ],
  },
})
