type SnackbarColor = 'success' | 'error' | 'info' | 'warning'

interface SnackbarState {
  show: boolean
  message: string
  color: SnackbarColor
  timeout: number
}

interface AppState {
  loading: boolean
  sidebarOpen: boolean
  snackbar: SnackbarState
  pageTitle: string
}

const DEFAULT_SNACKBAR_TIMEOUT = 3000
const ERROR_SNACKBAR_TIMEOUT = 5000

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    loading: false,
    sidebarOpen: true,
    snackbar: {
      show: false,
      message: '',
      color: 'info',
      timeout: DEFAULT_SNACKBAR_TIMEOUT,
    },
    pageTitle: '',
  }),

  getters: {
    isLoading: (state): boolean => state.loading,
    isSidebarOpen: (state): boolean => state.sidebarOpen,
    currentSnackbar: (state): SnackbarState => state.snackbar,
  },

  actions: {
    setLoading(value: boolean): void {
      this.loading = value
    },

    toggleSidebar(): void {
      this.sidebarOpen = !this.sidebarOpen
    },

    setSidebar(value: boolean): void {
      this.sidebarOpen = value
    },

    setPageTitle(title: string): void {
      this.pageTitle = title
    },

    showSnackbar(
      message: string,
      color: SnackbarColor = 'info',
      timeout = DEFAULT_SNACKBAR_TIMEOUT
    ): void {
      this.snackbar = { show: true, message, color, timeout }
    },

    notifySuccess(message: string): void {
      this.showSnackbar(message, 'success')
    },

    notifyError(message: string): void {
      this.showSnackbar(message, 'error', ERROR_SNACKBAR_TIMEOUT)
    },

    notifyWarning(message: string): void {
      this.showSnackbar(message, 'warning')
    },

    hideSnackbar(): void {
      this.snackbar.show = false
    },
  },
})
