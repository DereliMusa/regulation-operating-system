// Named middleware, applied per-page via definePageMeta({ middleware: ['auth'] })
// once protected pages exist (dashboard, technical-files, ...). Redirects
// unauthenticated visitors to /login.
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, fetch } = useUserSession()

  if (!loggedIn.value) {
    await fetch()
  }

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
