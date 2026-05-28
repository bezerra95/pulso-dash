export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  lastPage: number
  from: number
  to: number
}

export interface ApiError {
  message: string
  statusCode: number
  error: string
  errors?: Record<string, string[]>
}

export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
  signal?: AbortSignal
}

export interface PaginationParams {
  page?: number
  perPage?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  status: RequestStatus
  error: ApiError | null
}
