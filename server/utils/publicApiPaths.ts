// Pure logic, split out from server/middleware/auth.ts so it is
// unit-testable without a Nitro runtime (same reason as createDb.ts vs
// db.ts -- importing a file also runs its top-level code, and
// middleware/auth.ts's top-level `defineEventHandler(...)` call needs
// Nitro's auto-imports).
//
// `/api/_*` (leading underscore) is the general convention Nuxt modules use
// for their own internal endpoints -- e.g. nuxt-auth-utils' `/api/_auth/
// session` (GET returns `{}` when logged out, by design) and Nuxt Icon's
// `/api/_nuxt_icon/*` (fetches icon data for components like UButton's
// loading spinner). The auth middleware runs before those modules' own
// handlers, so without this exemption every one of them got a 401 from the
// middleware instead of behaving normally -- e.g. every unauthenticated
// `useUserSession()` check, or any icon load, anywhere in the app. Real app
// resource routes never use a `_`-prefixed segment, so this is safe to
// exempt as a whole rather than allowlisting module by module.
const PUBLIC_API_PREFIXES = ['/api/auth/', '/api/_', '/api/demo-requests', '/api/dev/']

/** Whether an API path is exempt from the session check in server/middleware/auth.ts. */
export function isPublicApiPath(path: string): boolean {
  return PUBLIC_API_PREFIXES.some((prefix) => path.startsWith(prefix))
}
