import type { JwtPayload } from '~/types'

const ACCESS_TOKEN_KEY = 'access_token'

// ─── Storage ──────────────────────────────────────────────────────────────────
// Only the access token is stored here. The refresh token is an HttpOnly cookie
// set by the backend — it is invisible to JavaScript by design.

export const saveAccessToken = (token: string): void => {
  if (import.meta.client) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
}

export const getAccessToken = (): string | null => {
  if (import.meta.client) {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }
  return null
}

export const clearAccessToken = (): void => {
  if (import.meta.client) {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}

// ─── Decoding ─────────────────────────────────────────────────────────────────

const decodePayload = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const base64 = parts[1]!.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

export const isTokenExpired = (token: string): boolean => {
  const payload = decodePayload(token)
  if (!payload) return true
  return payload.exp < Math.floor(Date.now() / 1000)
}

export const isAccessTokenExpired = (): boolean => {
  const token = getAccessToken()
  return !token || isTokenExpired(token)
}

export const getTokenPayload = (): JwtPayload | null => {
  const token = getAccessToken()
  return token ? decodePayload(token) : null
}

export const secondsUntilExpiry = (token: string): number => {
  const payload = decodePayload(token)
  if (!payload) return -1
  return payload.exp - Math.floor(Date.now() / 1000)
}
