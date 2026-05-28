<template>
  <div>
    <UiPageHeader title="Assinaturas" subtitle="Gestão de planos e receita recorrente" />

    <!-- MRR/ARR cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="xl" :border="true" class="metric-mini">
          <v-card-text>
            <div class="mini-label">MRR</div>
            <div class="mini-value">{{ formatCurrency(metrics.mrr) }}</div>
            <div class="mini-sub">Receita mensal recorrente</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="xl" :border="true" class="metric-mini">
          <v-card-text>
            <div class="mini-label">ARR</div>
            <div class="mini-value">{{ formatCurrency(metrics.arr) }}</div>
            <div class="mini-sub">Receita anual recorrente</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="xl" :border="true" class="metric-mini">
          <v-card-text>
            <div class="mini-label">Assinaturas ativas</div>
            <div class="mini-value text-success">{{ activeSubs }}</div>
            <div class="mini-sub">de {{ subscriptions.length }} total</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-card rounded="xl" :border="true" class="metric-mini">
          <v-card-text>
            <div class="mini-label">Churn Rate</div>
            <div class="mini-value text-error">{{ churnRate }}%</div>
            <div class="mini-sub">Últimos 30 dias</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card rounded="xl" :border="true" class="mb-4">
      <v-card-text class="filters-body">
        <v-btn-toggle v-model="planFilter" density="compact" rounded="lg" variant="outlined" multiple>
          <v-btn value="starter" size="small">Starter</v-btn>
          <v-btn value="pro" size="small">Pro</v-btn>
          <v-btn value="enterprise" size="small">Enterprise</v-btn>
        </v-btn-toggle>
        <v-btn-toggle v-model="statusFilter" density="compact" rounded="lg" variant="outlined" multiple>
          <v-btn value="active" size="small">Ativo</v-btn>
          <v-btn value="trial" size="small">Trial</v-btn>
          <v-btn value="churned" size="small">Churn</v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-card>

    <v-card rounded="xl" :border="true">
      <v-data-table
        :headers="headers"
        :items="filteredSubs"
        :loading="loading"
        density="comfortable"
      >
        <template #item.plan="{ item }">
          <v-chip size="small" variant="tonal" :color="planColor(item.plan)" class="font-weight-semibold">
            {{ item.plan }}
          </v-chip>
        </template>
        <template #item.status="{ item }">
          <UiStatusBadge :status="item.status" />
        </template>
        <template #item.mrr="{ item }">
          <span class="font-weight-medium">{{ formatCurrency(item.mrr) }}</span>
        </template>
        <template #item.nextBilling="{ item }">
          <span class="text-caption">{{ formatDate(item.nextBilling) }}</span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'dashboard' })

  const appStore = useAppStore()
  const { subscriptions, metrics } = useMockData()
  const { formatCurrency, formatDate } = useDateFormat()

  appStore.setPageTitle('Assinaturas')

  const loading = ref(true)
  const planFilter = ref<string[]>([])
  const statusFilter = ref<string[]>([])

  onMounted(() => setTimeout(() => (loading.value = false), 500))

  const activeSubs = computed(() => subscriptions.value.filter((s) => s.status === 'active').length)
  const churnedSubs = computed(() => subscriptions.value.filter((s) => s.status === 'churned').length)
  const churnRate = computed(() => ((churnedSubs.value / subscriptions.value.length) * 100).toFixed(1))

  const filteredSubs = computed(() => subscriptions.value.filter((s) => {
    if (planFilter.value.length && !planFilter.value.includes(s.plan)) return false
    if (statusFilter.value.length && !statusFilter.value.includes(s.status)) return false
    return true
  }))

  const planColor = (plan: string) => ({ starter: 'info', pro: 'accent', enterprise: 'warning' }[plan] ?? 'default')

  const headers = [
    { title: 'ID', key: 'id', sortable: true },
    { title: 'Usuário', key: 'userName', sortable: true },
    { title: 'Plano', key: 'plan', sortable: true },
    { title: 'Status', key: 'status', sortable: false },
    { title: 'MRR', key: 'mrr', sortable: true },
    { title: 'Próx. cobrança', key: 'nextBilling', sortable: false },
  ]
</script>

<style scoped>
.filters-body { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; padding: 12px 16px; }
.metric-mini :deep(.v-card-text) { padding: 16px !important; }
.mini-label { font-size: 12px; font-weight: 500; color: rgb(var(--v-theme-on-surface-variant)); margin-bottom: 4px; }
.mini-value { font-size: 24px; font-weight: 700; letter-spacing: -0.3px; }
.mini-sub { font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); margin-top: 2px; }
</style>
