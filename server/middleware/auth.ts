// Rejects unauthenticated requests to app API routes. Auth, demo-request,
// and dev-only routes (plus Nuxt modules' own `/api/_*` endpoints -- see
// publicApiPaths.ts) are intentionally public. As protected resource routes
// are added (technical-files, dashboard, ...) they are covered
// automatically since this defaults to "protected".
import { isPublicApiPath } from '../utils/publicApiPaths'

export default defineEventHandler(async (event) => {
  const path = event.path
  if (!path.startsWith('/api/')) return
  if (isPublicApiPath(path)) return

  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }
})
