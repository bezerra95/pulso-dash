<template>
  <div>
    <UiPageHeader title="Pedidos" :subtitle="`${filteredOrders.length} pedidos`" />

    <v-card rounded="xl" :border="true" class="mb-4 filters-card">
      <v-card-text class="filters-body">
        <UiSearchInput v-model="search" class="search-field" placeholder="ID ou cliente..." />
        <v-btn-toggle v-model="statusFilter" density="compact" rounded="lg" variant="outlined" multiple>
          <v-btn v-for="s in statusOptions" :key="s.value" :value="s.value" size="small">{{ s.label }}</v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-card>

    <v-card rounded="xl" :border="true">
      <v-data-table
        :headers="headers"
        :items="paginatedOrders"
        :loading="loading"
        hide-default-footer
        density="comfortable"
      >
        <template #item.amount="{ item }">
          <span class="font-weight-semibold">{{ formatCurrency(item.amount) }}</span>
        </template>
        <template #item.status="{ item }">
          <UiStatusBadge :status="item.status" />
        </template>
        <template #item.createdAt="{ item }">
          <span class="text-caption">{{ formatDateTime(item.createdAt) }}</span>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon size="x-small" variant="text" @click="openDetail(item)">
            <v-icon icon="mdi-eye-outline" size="16" />
          </v-btn>
        </template>
        <template #bottom />
      </v-data-table>

      <v-divider />
      <div class="pagination-bar">
        <span class="pagination-info">
          {{ (page - 1) * perPage + 1 }}–{{ Math.min(page * perPage, filteredOrders.length) }} de {{ filteredOrders.length }}
        </span>
        <v-pagination v-model="page" :length="pageCount" :total-visible="5" density="compact" rounded="lg" />
      </div>
    </v-card>

    <!-- Detail modal -->
    <v-dialog v-model="detailModal" max-width="480">
      <v-card v-if="selectedOrder" rounded="xl">
        <v-card-title class="detail-header">
          <div>
            <div class="detail-id">{{ selectedOrder.id }}</div>
            <UiStatusBadge :status="selectedOrder.status" />
          </div>
          <v-btn icon variant="text" size="small" class="ml-auto" @click="detailModal = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Cliente</span><span>{{ selectedOrder.userName }}</span></div>
            <div class="detail-item"><span class="detail-label">Produto</span><span>{{ selectedOrder.product }}</span></div>
            <div class="detail-item"><span class="detail-label">Valor</span><span class="detail-value-large">{{ formatCurrency(selectedOrder.amount) }}</span></div>
            <div class="detail-item"><span class="detail-label">Data</span><span>{{ formatDateTime(selectedOrder.createdAt) }}</span></div>
          </div>

          <!-- Timeline -->
          <div class="timeline-section">
            <p class="detail-label mb-3">Linha do Tempo</p>
            <v-timeline density="compact" align="start" side="end">
              <v-timeline-item
                v-for="event in orderTimeline(selectedOrder)"
                :key="event.label"
                :dot-color="event.color"
                size="x-small"
              >
                <div class="timeline-item">
                  <span class="timeline-label">{{ event.label }}</span>
                  <span class="timeline-time">{{ formatDateTime(event.time) }}</span>
                </div>
              </v-timeline-item>
            </v-timeline>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import type { Order } from '~/types'

  definePageMeta({ layout: 'dashboard' })

  const appStore = useAppStore()
  const { orders } = useMockData()
  const { formatCurrency, formatDateTime } = useDateFormat()

  appStore.setPageTitle('Pedidos')

  const loading = ref(true)
  const search = ref('')
  const statusFilter = ref<string[]>([])
  const page = ref(1)
  const perPage = 12
  const detailModal = ref(false)
  const selectedOrder = ref<Order | null>(null)

  onMounted(() => setTimeout(() => (loading.value = false), 600))

  const statusOptions = [
    { value: 'paid', label: 'Pago' },
    { value: 'pending', label: 'Pendente' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'refunded', label: 'Reembolsado' },
  ]

  const filteredOrders = computed(() => orders.value.filter((o) => {
    if (search.value && !o.id.includes(search.value) && !o.userName.toLowerCase().includes(search.value.toLowerCase())) return false
    if (statusFilter.value.length && !statusFilter.value.includes(o.status)) return false
    return true
  }))

  const pageCount = computed(() => Math.ceil(filteredOrders.value.length / perPage))
  const paginatedOrders = computed(() => filteredOrders.value.slice((page.value - 1) * perPage, page.value * perPage))

  watch(search, () => (page.value = 1))
  watch(statusFilter, () => (page.value = 1))

  const openDetail = (order: Order) => { selectedOrder.value = order; detailModal.value = true }

  const orderTimeline = (order: Order) => [
    { label: 'Pedido criado', time: order.createdAt, color: 'info' },
    ...(order.status !== 'pending' ? [{ label: order.status === 'paid' ? 'Pagamento confirmado' : order.status === 'cancelled' ? 'Cancelado' : 'Reembolsado', time: order.updatedAt, color: order.status === 'paid' ? 'success' : 'error' }] : []),
  ]

  const headers = [
    { title: 'ID', key: 'id', sortable: false },
    { title: 'Cliente', key: 'userName', sortable: true },
    { title: 'Produto', key: 'product', sortable: false },
    { title: 'Valor', key: 'amount', sortable: true },
    { title: 'Status', key: 'status', sortable: false },
    { title: 'Data', key: 'createdAt', sortable: false },
    { title: '', key: 'actions', sortable: false },
  ]
</script>

<style scoped>
.filters-card :deep(.v-card-text) { padding: 12px 16px !important; }
.filters-body { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-field { min-width: 200px; }
.pagination-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; }
.pagination-info { font-size: 12px; color: rgb(var(--v-theme-on-surface-variant)); }
.detail-header { display: flex; align-items: center; padding: 20px; }
.detail-id { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.detail-item { display: flex; flex-direction: column; gap: 3px; }
.detail-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(var(--v-theme-on-surface-variant)); }
.detail-value-large { font-size: 18px; font-weight: 700; }
.timeline-section { border-top: 1px solid rgba(var(--v-border-color), 0.1); padding-top: 16px; }
.timeline-item { display: flex; flex-direction: column; }
.timeline-label { font-size: 13px; font-weight: 500; }
.timeline-time { font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); }
</style>
