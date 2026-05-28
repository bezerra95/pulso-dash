<template>
  <div>
    <UiPageHeader title="Dashboard" subtitle="Visão geral em tempo real da sua plataforma">
      <template #actions>
        <v-btn-toggle v-model="period" mandatory density="compact" rounded="lg" variant="outlined">
          <v-btn value="7d" size="small">7d</v-btn>
          <v-btn value="30d" size="small">30d</v-btn>
          <v-btn value="90d" size="small">90d</v-btn>
        </v-btn-toggle>
      </template>
    </UiPageHeader>

    <!-- Metric cards -->
    <v-row class="mb-6">
      <v-col v-for="card in metricCards" :key="card.label" cols="12" sm="6" lg="3">
        <UiMetricCard
          :label="card.label"
          :value="card.value"
          :change="card.change"
          :icon="card.icon"
          :color="card.color"
          :format="card.format"
          :loading="loading"
        />
      </v-col>
    </v-row>

    <!-- Charts row -->
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <v-card rounded="xl" :border="true" class="chart-card">
          <v-card-title class="chart-card-title">
            <span>Receita</span>
            <span class="chart-total">{{ formatCurrency(chartTotal) }}</span>
          </v-card-title>
          <v-card-text class="chart-body">
            <ChartsLineChart
              :labels="salesLabels"
              :datasets="[{ label: 'Receita', data: salesValues, color: '#6366f1' }]"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card rounded="xl" :border="true" class="chart-card">
          <v-card-title class="chart-card-title">Status de Pedidos</v-card-title>
          <v-card-text class="chart-body">
            <ChartsDonutChart :labels="donutLabels" :data="donutData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent orders + notifications -->
    <v-row>
      <v-col cols="12" lg="8">
        <v-card rounded="xl" :border="true">
          <v-card-title class="table-card-title">
            <span>Pedidos Recentes</span>
            <v-btn variant="text" size="small" to="/orders" append-icon="mdi-arrow-right">Ver todos</v-btn>
          </v-card-title>
          <v-divider />
          <v-data-table
            :headers="orderHeaders"
            :items="recentOrders"
            :loading="loading"
            hide-default-footer
            density="comfortable"
            class="orders-table"
          >
            <template #item.amount="{ item }">
              <span class="font-weight-medium">{{ formatCurrency(item.amount) }}</span>
            </template>
            <template #item.status="{ item }">
              <UiStatusBadge :status="item.status" />
            </template>
            <template #item.createdAt="{ item }">
              <span class="text-caption">{{ formatRelative(item.createdAt) }}</span>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card rounded="xl" :border="true" class="notif-card">
          <v-card-title class="table-card-title">
            <span>Atividade</span>
            <v-badge v-if="unreadCount > 0" :content="unreadCount" color="error" inline />
          </v-card-title>
          <v-divider />
          <v-list lines="two" density="compact">
            <v-list-item
              v-for="notif in recentNotifs"
              :key="notif.id"
              :class="['notif-item', { 'notif-item--unread': !notif.read }]"
              @click="notif.read = true"
            >
              <template #prepend>
                <v-avatar size="28" :color="`${notif.type}-lighten-4`" class="notif-avatar">
                  <v-icon :icon="typeIcon(notif.type)" :color="notif.type" size="14" />
                </v-avatar>
              </template>
              <v-list-item-title class="notif-item-title">{{ notif.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ notif.message }}</v-list-item-subtitle>
              <template #append>
                <span class="text-caption text-medium-emphasis">{{ formatRelative(notif.createdAt) }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import type { ChartPeriod } from '~/types'

  definePageMeta({ layout: 'dashboard' })

  const appStore = useAppStore()
  const { orders, notifications, metrics, salesData, unreadCount, updateSalesData } = useMockData()
  const { formatCurrency, formatRelative } = useDateFormat()

  appStore.setPageTitle('Dashboard')

  const loading = ref(true)
  const period = ref<ChartPeriod>('30d')

  onMounted(() => setTimeout(() => (loading.value = false), 800))

  watch(period, (val) => updateSalesData(val))

  const metricCards = computed(() => [
    { label: 'Receita Total', value: metrics.revenue, change: metrics.revenueChange, icon: 'mdi-currency-usd', color: 'success', format: 'currency' as const },
    { label: 'Pedidos', value: metrics.orders, change: metrics.ordersChange, icon: 'mdi-shopping-outline', color: 'info', format: 'number' as const },
    { label: 'Usuários Ativos', value: metrics.users, change: metrics.usersChange, icon: 'mdi-account-group-outline', color: 'accent', format: 'number' as const },
    { label: 'Churn Rate', value: metrics.churnRate, change: metrics.churnChange, icon: 'mdi-account-remove-outline', color: 'error', format: 'percent' as const },
  ])

  const salesLabels = computed(() => salesData.value.map((d) => d.date.slice(5)))
  const salesValues = computed(() => salesData.value.map((d) => d.revenue))
  const chartTotal = computed(() => salesValues.value.reduce((a, b) => a + b, 0))

  const statusGroups = computed(() => {
    const groups: Record<string, number> = {}
    orders.value.forEach((o) => { groups[o.status] = (groups[o.status] ?? 0) + 1 })
    return groups
  })
  const donutLabels = computed(() => Object.keys(statusGroups.value))
  const donutData = computed(() => Object.values(statusGroups.value))

  const recentOrders = computed(() => [...orders.value].slice(0, 8))
  const recentNotifs = computed(() => notifications.value.slice(0, 6))

  const orderHeaders = [
    { title: 'ID', key: 'id', sortable: false },
    { title: 'Cliente', key: 'userName', sortable: false },
    { title: 'Produto', key: 'product', sortable: false },
    { title: 'Valor', key: 'amount', sortable: false },
    { title: 'Status', key: 'status', sortable: false },
    { title: 'Data', key: 'createdAt', sortable: false },
  ]

  const typeIcon = (type: string) => ({
    success: 'mdi-check',
    error: 'mdi-close',
    warning: 'mdi-alert',
    info: 'mdi-information',
  }[type] ?? 'mdi-bell')
</script>

<style scoped>
.chart-card { min-height: 320px; }
.chart-card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 8px;
  font-size: 14px;
  font-weight: 600;
}
.chart-total {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
}
.chart-body { height: 240px; padding: 8px 16px 16px; }
.table-card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 600;
}
.orders-table :deep(th) { font-size: 12px !important; }
.notif-card { height: 100%; }
.notif-item { cursor: pointer; }
.notif-item--unread { background: rgba(var(--v-theme-primary), 0.03); }
.notif-item-title { font-size: 12px !important; font-weight: 600; }
.notif-avatar { flex-shrink: 0; }
</style>
