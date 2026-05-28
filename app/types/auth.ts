export type UserRole = 'admin' | 'user' | 'moderator'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: UserRole
  emailVerifiedAt?: string
  createdAt: string
  updatedAt: string
}

export interface AuthCredentials {
  email: string
  password: string
  remember?: boolean
}

// The refreshToken is NOT included here. The backend stores it in an HttpOnly
// cookie via Set-Cookie — it is never exposed to JavaScript.
export interface AuthTokens {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
}

export interface JwtPayload {
  sub: number
  email: string
  role: UserRole
  iat: number
  exp: number
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface UpdateProfilePayload {
  name?: string
  email?: string
  avatar?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}
