import type { AxiosInstance, AxiosError } from 'axios'
import type { Ref } from 'vue'
import type {
  ApiResponse,
  PaginatedResponse,
  RequestConfig,
  ApiError,
} from '~/types'

const normalizeError = (error: unknown): ApiError => {
  const axiosError = error as AxiosError<ApiError>
  if (axiosError.response?.data) return axiosError.response.data
  return {
    message: axiosError.message ?? 'Unknown request error',
    statusCode: axiosError.response?.status ?? 0,
    error: 'NetworkError',
  }
}

export const useApi = () => {
  const { $api } = useNuxtApp()
  const api = $api as AxiosInstance

  // ─── Standard CRUD ────────────────────────────────────────────────────────

  const get = async <T>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const { data } = await api.get<ApiResponse<T>>(url, config)
      return data
    } catch (error) {
      throw normalizeError(error)
    }
  }

  const getPaginated = async <T>(
    url: string,
    config?: RequestConfig
  ): Promise<PaginatedResponse<T>> => {
    try {
      const { data } = await api.get<PaginatedResponse<T>>(url, config)
      return data
    } catch (error) {
      throw normalizeError(error)
    }
  }

  const post = async <T>(
    url: string,
    payload?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const { data } = await api.post<ApiResponse<T>>(
        url,
        payload,
        config
      )
      return data
    } catch (error) {
      throw normalizeError(error)
    }
  }

  const put = async <T>(
    url: string,
    payload?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const { data } = await api.put<ApiResponse<T>>(
        url,
        payload,
        config
      )
      return data
    } catch (error) {
      throw normalizeError(error)
    }
  }

  const patch = async <T>(
    url: string,
    payload?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const { data } = await api.patch<ApiResponse<T>>(
        url,
        payload,
        config
      )
      return data
    } catch (error) {
      throw normalizeError(error)
    }
  }

  const del = async <T>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const { data } = await api.delete<ApiResponse<T>>(url, config)
      return data
    } catch (error) {
      throw normalizeError(error)
    }
  }

  const upload = async <T>(
    url: string,
    file: File,
    fields?: Record<string, string>
  ): Promise<ApiResponse<T>> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (fields) {
        Object.entries(fields).forEach(([key, value]) =>
          formData.append(key, value)
        )
      }
      const { data } = await api.post<ApiResponse<T>>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } catch (error) {
      throw normalizeError(error)
    }
  }

  // ─── Optimistic Updates ───────────────────────────────────────────────────

  const optimisticDelete = async <T>(
    url: string,
    list: Ref<T[]>,
    predicate: (item: T) => boolean
  ): Promise<void> => {
    const snapshot = [...list.value]
    list.value = list.value.filter((item) => !predicate(item))
    try {
      await api.delete(url)
    } catch (error) {
      list.value = snapshot
      throw normalizeError(error)
    }
  }

  const optimisticPatch = async <T>(
    url: string,
    list: Ref<T[]>,
    predicate: (item: T) => boolean,
    changes: Partial<T>
  ): Promise<ApiResponse<T>> => {
    const snapshot = [...list.value]
    const index = list.value.findIndex(predicate)
    if (index !== -1)
      list.value[index] = { ...list.value[index], ...changes } as T
    try {
      const { data } = await api.patch<ApiResponse<T>>(url, changes)
      if (index !== -1) list.value[index] = data.data
      return data
    } catch (error) {
      list.value = snapshot
      throw normalizeError(error)
    }
  }

  const optimisticCreate = async <T extends { id?: number | string }>(
    url: string,
    list: Ref<T[]>,
    draft: T
  ): Promise<ApiResponse<T>> => {
    const tempId = `temp_${Date.now()}`
    const tempItem: T = { ...draft, id: tempId as unknown as T['id'] }
    list.value = [...list.value, tempItem]
    try {
      const { data } = await api.post<ApiResponse<T>>(url, draft)
      list.value = list.value.map((item) =>
        item.id === tempId ? data.data : item
      )
      return data
    } catch (error) {
      list.value = list.value.filter((item) => item.id !== tempId)
      throw normalizeError(error)
    }
  }

  return {
    get,
    getPaginated,
    post,
    put,
    patch,
    del,
    upload,
    optimisticDelete,
    optimisticPatch,
    optimisticCreate,
  }
}
