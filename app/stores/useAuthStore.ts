import type { User, AuthTokens } from '~/types'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    tokens: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.tokens?.accessToken,
    currentUser: (state): User | null => state.user,
    userName: (state): string => state.user?.name ?? '',
    userEmail: (state): string => state.user?.email ?? '',
    userAvatar: (state): string | undefined => state.user?.avatar,
    userRole: (state): string => state.user?.role ?? '',
    isAdmin: (state): boolean => state.user?.role === 'admin',
    accessToken: (state): string | null =>
      state.tokens?.accessToken ?? null,
  },

  actions: {
    setUser(user: User | null): void {
      this.user = user
    },

    setTokens(tokens: AuthTokens | null): void {
      this.tokens = tokens
    },

    updateAccessToken(token: string): void {
      if (this.tokens) {
        this.tokens.accessToken = token
      }
    },

    logout(): void {
      this.user = null
      this.tokens = null
    },
  },
})
