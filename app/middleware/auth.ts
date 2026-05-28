export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const authStore = useAuthStore()

  if (authStore.isAuthenticated) return

  const token = getAccessToken()

  if (!token || isTokenExpired(token)) {
    clearAccessToken()
    return navigateTo('/login')
  }
})
