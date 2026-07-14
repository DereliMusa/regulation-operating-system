// Rejects unauthenticated requests to app API routes. Auth, demo-request,
// and dev-only routes are intentionally public. As protected resource
// routes are added (technical-files, dashboard, ...) they are covered
// automatically since this defaults to "protected".
const PUBLIC_API_PREFIXES = ['/api/auth/', '/api/demo-requests', '/api/dev/']

export default defineEventHandler(async (event) => {
  const path = event.path
  if (!path.startsWith('/api/')) return
  if (PUBLIC_API_PREFIXES.some((prefix) => path.startsWith(prefix))) return

  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }
})
