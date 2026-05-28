import type { AuthCredentials, User, AuthTokens, LoginResponse } from '~/types'

export const useAuth = () => {
  const authStore = useAuthStore()
  const appStore = useAppStore()
  const api = useApi()
  const router = useRouter()

  const isAuthenticated = computed<boolean>(
    () => authStore.isAuthenticated
  )
  const currentUser = computed<User | null>(() => authStore.currentUser)
  const isAdmin = computed<boolean>(() => authStore.isAdmin)

  const login = async (credentials: AuthCredentials): Promise<void> => {
    appStore.setLoading(true)
    try {
      const response = await api.post<LoginResponse>(
        '/auth/login',
        credentials
      )
      const { user, tokens } = response.data

      saveAccessToken(tokens.accessToken)
      authStore.setUser(user)
      authStore.setTokens(tokens)

      appStore.notifySuccess(`Welcome, ${user.name}!`)
      await router.push('/dashboard')
    } finally {
      appStore.setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    await api.post('/auth/logout').catch(() => null)
    clearAccessToken()
    authStore.logout()
    await router.push('/login')
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await api.post<AuthTokens>('/auth/refresh')
      const tokens = response.data

      saveAccessToken(tokens.accessToken)
      authStore.setTokens(tokens)
      return true
    } catch {
      clearAccessToken()
      authStore.logout()
      return false
    }
  }

  const fetchCurrentUser = async (): Promise<User | null> => {
    try {
      const response = await api.get<User>('/auth/me')
      authStore.setUser(response.data)
      return response.data
    } catch {
      return null
    }
  }

  const initSession = async (): Promise<void> => {
    const token = getAccessToken()

    if (!token || isTokenExpired(token)) {
      const renewed = await refreshToken()
      if (!renewed) return
    }

    if (!authStore.currentUser) {
      await fetchCurrentUser()
    }
  }

  return {
    login,
    logout,
    refreshToken,
    fetchCurrentUser,
    initSession,
    isAuthenticated,
    currentUser,
    isAdmin,
  }
}
