// Nuxt configuration.
// See https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  devtools: { enabled: true },

  // Auth session cookie (nuxt-auth-utils -> h3). h3 defaults the cookie to
  // `Secure`, which browsers only store over HTTPS. Safari and Firefox reject a
  // Secure cookie on an http:// origin (Chromium allows it on localhost), so in
  // dev the cookie was never stored and login silently bounced back to /login.
  // Keep Secure in production (served over HTTPS); drop it in dev so login works
  // over http://localhost in every browser.
  runtimeConfig: {
    session: {
      // Password is supplied at runtime from NUXT_SESSION_PASSWORD; '' is only a
      // typed placeholder (nuxt-auth-utils overrides it with the env value).
      password: '',
      cookie: {
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

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
