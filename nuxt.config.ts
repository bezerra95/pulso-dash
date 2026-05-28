export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  devServer: { port: 3000 },

  ssr: true,
  typescript: {
    strict: true,
    typeCheck: true,
  },
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET ?? '',
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api',
    },
  },

  modules: [
    'vuetify-nuxt-module',
    '@nuxt/eslint',
    '@pinia/nuxt',
  ],

  eslint: {
    config: { stylistic: false },
  },

  build: {
    transpile: ['vuetify'],
  },

  css: ['~/assets/css/main.css'],

  vuetify: {
    vuetifyOptions: {
      icons: { defaultSet: 'mdi' },
      theme: {
        defaultTheme: 'customTheme',
        themes: {
          customTheme: {
            dark: false,
            colors: {
              primary: '#7F63F4',
              secondary: '#FFA000',
              error: '#DD2C00',
              success: '#00E676',
              info: '#26A69A',
              warning: '#FFC107',
              'on-surface-variant': '#000000',
            },
          },
          customThemeDark: {
            dark: true,
            colors: {
              primary: '#7F63F4',
              secondary: '#FFA000',
              error: '#DD2C00',
              success: '#00E676',
              info: '#26A69A',
              warning: '#FFC107',
              'on-surface-variant': '#FFFFFF',
            },
          },
        },
      },
      defaults: {
        VTextField: { variant: 'outlined' },
        VTextarea: { variant: 'outlined' },
        VSelect: { variant: 'outlined' },
        VAutocomplete: { variant: 'outlined' },
        VCombobox: { variant: 'outlined' },
        VFileInput: { variant: 'outlined' },
        VBtn: { rounded: 'lg', variant: 'elevated', density: 'default' },
        VCard: { rounded: 'lg', elevation: 2 },
        VSnackbar: { timeout: 3000, location: 'bottom right' },
        VDialog: { maxWidth: '600px' },
      },
      locale: { locale: 'pt', fallback: 'en' },
      localeMessages: ['pt', 'en'],
      labComponents: true,
    },
  },

  vite: {
    optimizeDeps: {
      include: ['lodash-es', 'maska/vue'],
    },
  },
})
