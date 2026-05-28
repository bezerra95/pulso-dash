import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const api: AxiosInstance = axios.create({
    baseURL: runtimeConfig.public.apiBaseUrl as string,
    timeout: 15_000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  api.interceptors.request.use(
    (
      config: InternalAxiosRequestConfig
    ): InternalAxiosRequestConfig => {
      if (import.meta.client) {
        const token = localStorage.getItem('access_token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    },
    (error: AxiosError) => Promise.reject(error)
  )

  api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError) => {
      const original = error.config as RetryableConfig

      if (
        error.response?.status === 401 &&
        original &&
        !original._retry
      ) {
        original._retry = true

        if (import.meta.client) {
          try {
            const { data } = await axios.post(
              `${runtimeConfig.public.apiBaseUrl}/auth/refresh`,
              null,
              { withCredentials: true }
            )

            const newToken: string =
              data?.data?.accessToken ?? data?.accessToken

            localStorage.setItem('access_token', newToken)

            if (original.headers) {
              original.headers.Authorization = `Bearer ${newToken}`
            }

            const authStore = useAuthStore()
            authStore.updateAccessToken(newToken)

            return api(original)
          } catch {
            localStorage.removeItem('access_token')
            useAuthStore().logout()
            await navigateTo('/login')
          }
        }
      }

      return Promise.reject(error)
    }
  )

  // Suppress unused variable warning — nuxtApp is required by defineNuxtPlugin
  void nuxtApp

  return { provide: { api } }
})
