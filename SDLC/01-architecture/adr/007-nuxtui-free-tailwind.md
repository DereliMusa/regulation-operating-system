# ADR-007: NuxtUI (free) + Tailwind for UI

- **Status:** Accepted
- **Date:** 2026-07-14

## Context

We need a component library that is Nuxt-native and covers dashboards, forms, and tables,
without a license cost. NuxtUI Pro (paid) was considered. The mockups are Tailwind-based
with a specific token set.

## Decision

Use **NuxtUI (free) + TailwindCSS**. Define Certra's design tokens in
`app/assets/css/main.css` (`@theme`) and `app.config.ts`. Deliver Material Symbols via
Iconify and Geist/Inter/Geist Mono via `@nuxt/fonts`. Hand-write any component NuxtUI does
not provide.

## Consequences

- No license cost; components are Nuxt-native.
- The mockup design system maps cleanly onto Tailwind tokens (see `STYLE_GUIDE.md`).
- NuxtUI v3 uses **Tailwind v4**; tokens are defined via CSS `@theme`. Exact versions are
  pinned during S0 and recorded in `tech-stack.md`.
- Trade-off: some polished templates from NuxtUI Pro must be built by hand; acceptable and
  bounded by the mockups.
