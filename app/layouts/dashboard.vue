<template>
  <v-app>
  <v-layout>
    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="sidebar"
      :rail="rail"
      permanent
      :width="260"
      class="sidebar"
    >
      <div class="sidebar-header">
        <div class="logo-area" @click="rail = !rail">
          <div class="logo-icon">
            <v-icon icon="mdi-hexagon-multiple" size="22" color="accent" />
          </div>
          <transition name="fade">
            <span v-if="!rail" class="logo-text">Dasboard</span>
          </transition>
        </div>
      </div>

      <v-divider />

      <v-list nav density="compact" class="nav-list">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="rail ? '' : item.label"
          :value="item.to"
          rounded="lg"
          class="nav-item"
          active-class="nav-item--active"
        >
          <template v-if="rail" #prepend>
            <v-tooltip :text="item.label" location="end">
              <template #activator="{ props }">
                <v-icon v-bind="props" :icon="item.icon" />
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
      </v-list>

      <template #append>
        <v-divider />
        <div class="sidebar-footer">
          <v-list-item
            :prepend-avatar="currentUser?.avatar"
            :title="rail ? '' : currentUser?.name"
            :subtitle="rail ? '' : currentUser?.email"
            density="compact"
            class="user-item"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main>
      <!-- Header -->
      <div class="app-header">
        <div class="header-left">
          <v-btn
            :icon="sidebar ? 'mdi-menu-open' : 'mdi-menu'"
            variant="text"
            size="small"
            @click="appStore.toggleSidebar()"
          />
          <span class="page-title">{{ appStore.pageTitle }}</span>
        </div>

        <div class="header-right">
          <v-btn
            :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'"
            variant="text"
            size="small"
            @click="toggleTheme"
          />

          <v-btn
            icon
            variant="text"
            size="small"
            class="notif-btn"
            @click="notifDrawer = !notifDrawer"
          >
            <v-badge
              v-if="unreadCount > 0"
              :content="unreadCount"
              color="error"
              floating
            >
              <v-icon icon="mdi-bell-outline" />
            </v-badge>
            <v-icon v-else icon="mdi-bell-outline" />
          </v-btn>

          <v-avatar size="32" class="cursor-pointer">
            <v-img :src="currentUser?.avatar" :alt="currentUser?.name" />
          </v-avatar>
        </div>
      </div>

      <!-- Page content -->
      <div class="page-content">
        <transition name="fade" mode="out-in">
          <div :key="$route.path">
            <slot />
          </div>
        </transition>
      </div>
    </v-main>

    <!-- Notification drawer -->
    <v-navigation-drawer v-model="notifDrawer" location="right" temporary width="360">
      <div class="notif-header">
        <span class="notif-title">Notificações</span>
        <v-btn variant="text" size="small" @click="markAllRead()">Marcar tudo como lido</v-btn>
      </div>
      <v-divider />
      <v-list lines="two">
        <v-list-item
          v-for="notif in notifications"
          :key="notif.id"
          :class="['notif-item', { 'notif-item--unread': !notif.read }]"
          @click="notif.read = true"
        >
          <template #prepend>
            <v-icon
              :icon="notifIcon(notif.type)"
              :color="notif.type"
              size="20"
              class="mr-2"
            />
          </template>
          <v-list-item-title class="notif-item-title">{{ notif.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ notif.message }}</v-list-item-subtitle>
          <template #append>
            <span class="notif-time">{{ formatRelative(notif.createdAt) }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Global snackbar -->
    <v-snackbar
      v-model="appStore.snackbar.show"
      :color="appStore.snackbar.color"
      :timeout="appStore.snackbar.timeout"
      location="bottom right"
    >
      {{ appStore.snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="appStore.hideSnackbar()">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-layout>
  </v-app>
</template>

<script setup lang="ts">
  import { useTheme } from 'vuetify'

  const theme = useTheme()
  const appStore = useAppStore()
  const authStore = useAuthStore()
  const { notifications, unreadCount, markAllRead, startRealtime, stopRealtime } = useMockData()
  const { formatRelative } = useDateFormat()

  const sidebar = computed({
    get: () => appStore.isSidebarOpen,
    set: (v) => appStore.setSidebar(v),
  })
  const rail = ref(false)
  const notifDrawer = ref(false)
  const searchQuery = ref('')
  const isDark = computed(
    () => theme.global.name.value === 'customThemeDark'
  )
  const currentUser = computed(() => authStore.currentUser ?? {
    name: 'Admin User',
    email: 'admin@pulsodash.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  })

  const toggleTheme = () => {
    theme.global.name.value = isDark.value
      ? 'customTheme'
      : 'customThemeDark'
  }

  const navItems = [
    { to: '/dashboard', icon: 'mdi-view-dashboard-outline', label: 'Dashboard' },
    { to: '/users', icon: 'mdi-account-group-outline', label: 'Usuários' },
    { to: '/orders', icon: 'mdi-shopping-outline', label: 'Pedidos' },
    { to: '/products', icon: 'mdi-package-variant-closed', label: 'Produtos' },
    { to: '/subscriptions', icon: 'mdi-credit-card-outline', label: 'Assinaturas' },
    { to: '/settings', icon: 'mdi-cog-outline', label: 'Configurações' },
  ]

  const notifIcon = (type: string) => {
    const map: Record<string, string> = {
      success: 'mdi-check-circle-outline',
      error: 'mdi-alert-circle-outline',
      warning: 'mdi-alert-outline',
      info: 'mdi-information-outline',
    }
    return map[type] ?? 'mdi-bell-outline'
  }

  onMounted(() => startRealtime())
  onUnmounted(() => stopRealtime())
</script>

<style scoped lang="scss">
  .sidebar {
    border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  }

  .sidebar-header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 12px;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 8px;
    transition: background 0.15s;
    &:hover { background: rgba(var(--v-theme-on-surface), 0.05); }
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background: rgba(var(--v-theme-accent), 0.12);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-text {
    font-weight: 700;
    font-size: 16px;
    letter-spacing: -0.3px;
  }

  .nav-list {
    padding: 8px;
  }

  .nav-item {
    margin-bottom: 2px;
    transition: background 0.15s;
  }

  .nav-item--active {
    background: rgba(var(--v-theme-primary), 0.08) !important;
    font-weight: 600;
  }

  .sidebar-footer {
    padding: 8px;
  }

  .user-item {
    border-radius: 8px;
    margin-bottom: 4px;
  }

  .app-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgb(var(--v-theme-surface));
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .page-title {
    font-weight: 600;
    font-size: 15px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-search {
    width: 220px;
  }

  .page-content {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;

    @media (max-width: 599px) {
      padding: 16px;
    }
  }

  .notif-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
  }

  .notif-title {
    font-weight: 600;
    font-size: 15px;
  }

  .notif-item {
    cursor: pointer;
    transition: background 0.15s;
    &:hover { background: rgba(var(--v-theme-on-surface), 0.04); }
    &--unread { background: rgba(var(--v-theme-primary), 0.04); }
  }

  .notif-item-title {
    font-size: 13px !important;
    font-weight: 600;
  }

  .notif-time {
    font-size: 11px;
    color: rgb(var(--v-theme-on-surface-variant));
    white-space: nowrap;
  }
</style>
