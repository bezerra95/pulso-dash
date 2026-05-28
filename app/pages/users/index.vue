<template>
  <div>
    <UiPageHeader title="Usuários" :subtitle="`${filteredUsers.length} usuários encontrados`">
      <template #actions>
        <v-btn prepend-icon="mdi-account-plus-outline" color="primary" rounded="lg" @click="appStore.notifySuccess('Funcionalidade em desenvolvimento')">
          Novo Usuário
        </v-btn>
      </template>
    </UiPageHeader>

    <!-- Filters -->
    <v-card rounded="xl" :border="true" class="mb-4 filters-card">
      <v-card-text class="filters-body">
        <UiSearchInput v-model="search" class="search-field" />
        <v-select
          v-model="roleFilter"
          :items="roleOptions"
          label="Função"
          clearable
          hide-details
          density="compact"
          style="max-width: 160px"
        />
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Status"
          clearable
          hide-details
          density="compact"
          style="max-width: 160px"
        />
        <v-chip v-if="activeFilters > 0" color="accent" size="small" closable @click:close="clearFilters">
          {{ activeFilters }} filtro(s) ativo(s)
        </v-chip>
      </v-card-text>
    </v-card>

    <!-- Table -->
    <v-card rounded="xl" :border="true">
      <v-data-table
        :headers="headers"
        :items="paginatedUsers"
        :loading="loading"
        hide-default-footer
        density="comfortable"
      >
        <template #item.name="{ item }">
          <div class="user-cell">
            <v-avatar size="32">
              <v-img :src="item.avatar" />
            </v-avatar>
            <div>
              <div class="user-name">{{ item.name }}</div>
              <div class="user-email">{{ item.email }}</div>
            </div>
          </div>
        </template>
        <template #item.role="{ item }">
          <v-chip size="small" variant="tonal" :color="roleColor(item.role)">{{ item.role }}</v-chip>
        </template>
        <template #item.status="{ item }">
          <UiStatusBadge :status="item.status" />
        </template>
        <template #item.lastLogin="{ item }">
          <span class="text-caption">{{ formatRelative(item.lastLogin) }}</span>
        </template>
        <template #item.actions="{ item }">
          <div class="actions-cell">
            <v-btn icon size="x-small" variant="text" @click="openDetail(item)">
              <v-icon icon="mdi-eye-outline" size="16" />
            </v-btn>
            <v-btn
              icon
              size="x-small"
              variant="text"
              :color="item.status === 'active' ? 'error' : 'success'"
              @click="toggleStatus(item)"
            >
              <v-icon :icon="item.status === 'active' ? 'mdi-account-off-outline' : 'mdi-account-check-outline'" size="16" />
            </v-btn>
          </div>
        </template>
        <template #bottom />
      </v-data-table>

      <!-- Pagination -->
      <v-divider />
      <div class="pagination-bar">
        <span class="pagination-info">
          {{ (page - 1) * perPage + 1 }}–{{ Math.min(page * perPage, filteredUsers.length) }} de {{ filteredUsers.length }}
        </span>
        <v-pagination v-model="page" :length="pageCount" :total-visible="5" density="compact" rounded="lg" />
      </div>
    </v-card>

    <!-- Detail modal -->
    <v-dialog v-model="detailModal" max-width="500">
      <v-card v-if="selectedUser" rounded="xl">
        <v-card-title class="detail-header">
          <v-avatar size="48">
            <v-img :src="selectedUser.avatar" />
          </v-avatar>
          <div>
            <div class="detail-name">{{ selectedUser.name }}</div>
            <UiStatusBadge :status="selectedUser.status" />
          </div>
          <v-btn icon variant="text" size="small" class="ml-auto" @click="detailModal = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="detail-body">
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Email</span><span>{{ selectedUser.email }}</span></div>
            <div class="detail-item"><span class="detail-label">Função</span><span>{{ selectedUser.role }}</span></div>
            <div class="detail-item">
              <span class="detail-label">Telefone</span>
              <span>{{ selectedUser.phone }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">CPF</span>
              <span>{{ selectedUser.cpf }}</span>
            </div>
            <div class="detail-item"><span class="detail-label">Cadastro</span><span>{{ formatDate(selectedUser.createdAt) }}</span></div>
            <div class="detail-item"><span class="detail-label">Último acesso</span><span>{{ formatRelative(selectedUser.lastLogin) }}</span></div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import type { DashboardUser } from '~/types'

  definePageMeta({ layout: 'dashboard' })

  const appStore = useAppStore()
  const { users, startRealtime, stopRealtime } = useMockData()
  const { formatDate, formatRelative } = useDateFormat()

  appStore.setPageTitle('Usuários')

  const loading = ref(true)
  const search = ref('')
  const roleFilter = ref<string | null>(null)
  const statusFilter = ref<string | null>(null)
  const page = ref(1)
  const perPage = 10
  const detailModal = ref(false)
  const selectedUser = ref<DashboardUser | null>(null)

  onMounted(() => { setTimeout(() => (loading.value = false), 600); startRealtime() })
  onUnmounted(() => stopRealtime())

  const roleOptions = ['admin', 'user', 'moderator']
  const statusOptions = [{ title: 'Ativo', value: 'active' }, { title: 'Inativo', value: 'inactive' }]

  const activeFilters = computed(() => [search.value, roleFilter.value, statusFilter.value].filter(Boolean).length)

  const filteredUsers = computed(() => users.value.filter((u) => {
    if (search.value && !u.name.toLowerCase().includes(search.value.toLowerCase()) && !u.email.toLowerCase().includes(search.value.toLowerCase())) return false
    if (roleFilter.value && u.role !== roleFilter.value) return false
    if (statusFilter.value && u.status !== statusFilter.value) return false
    return true
  }))

  const pageCount = computed(() => Math.ceil(filteredUsers.value.length / perPage))
  const paginatedUsers = computed(() => filteredUsers.value.slice((page.value - 1) * perPage, page.value * perPage))

  watch(search, () => (page.value = 1))
  watch([roleFilter, statusFilter], () => (page.value = 1))

  const clearFilters = () => { search.value = ''; roleFilter.value = null; statusFilter.value = null }

  const roleColor = (role: string) => ({ admin: 'error', moderator: 'warning', user: 'info' }[role] ?? 'default')

  const openDetail = (user: DashboardUser) => { selectedUser.value = user; detailModal.value = true }

  const toggleStatus = (user: DashboardUser) => {
    user.status = user.status === 'active' ? 'inactive' : 'active'
    appStore.notifySuccess(`${user.name} ${user.status === 'active' ? 'ativado' : 'desativado'}`)
  }

  const headers = [
    { title: 'Usuário', key: 'name', sortable: true },
    { title: 'Função', key: 'role', sortable: true },
    { title: 'Status', key: 'status', sortable: false },
    { title: 'Último acesso', key: 'lastLogin', sortable: false },
    { title: '', key: 'actions', sortable: false },
  ]
</script>

<style scoped>
.filters-card :deep(.v-card-text) { padding: 12px 16px !important; }
.filters-body { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-field { min-width: 200px; flex: 1; }
.user-cell { display: flex; align-items: center; gap: 10px; padding: 6px 0; }
.user-name { font-size: 13px; font-weight: 600; }
.user-email { font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); }
.actions-cell { display: flex; gap: 2px; }
.pagination-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
.pagination-info { font-size: 12px; color: rgb(var(--v-theme-on-surface-variant)); }
.detail-header { display: flex; align-items: center; gap: 14px; padding: 20px; }
.detail-name { font-size: 16px; font-weight: 700; }
.detail-body { padding: 16px 20px !important; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-item { display: flex; flex-direction: column; gap: 2px; }
.detail-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(var(--v-theme-on-surface-variant)); }
</style>
