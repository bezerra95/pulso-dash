<template>
  <div>
    <UiPageHeader title="Produtos" :subtitle="`${filteredProducts.length} produtos`">
      <template #actions>
        <v-btn-toggle v-model="viewMode" mandatory density="compact" rounded="lg" variant="outlined">
          <v-btn icon="mdi-view-grid-outline" value="grid" size="small" />
          <v-btn icon="mdi-view-list-outline" value="list" size="small" />
        </v-btn-toggle>
      </template>
    </UiPageHeader>

    <v-card rounded="xl" :border="true" class="mb-4 filters-card">
      <v-card-text class="filters-body">
        <UiSearchInput v-model="search" class="search-field" />
        <v-select
          v-model="categoryFilter"
          :items="categoryOptions"
          label="Categoria"
          clearable
          hide-details
          density="compact"
          style="max-width: 160px"
        />
      </v-card-text>
    </v-card>

    <!-- Grid view -->
    <v-row v-if="viewMode === 'grid'">
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <v-card rounded="xl" :border="true" class="product-card hover-lift">
          <v-card-text class="product-body">
            <div class="product-header">
              <v-chip size="x-small" variant="tonal" :color="categoryColor(product.category)">{{ product.category }}</v-chip>
              <UiStatusBadge :status="product.status" />
            </div>
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">{{ formatCurrency(product.price) }}</div>
            <div class="product-meta">
              <div class="product-meta-item">
                <v-icon icon="mdi-package-variant-closed" size="12" />
                <span>{{ product.stock }} em estoque</span>
              </div>
              <div class="product-meta-item">
                <v-icon icon="mdi-check-circle-outline" size="12" color="success" />
                <span>{{ product.sold }} vendidos</span>
              </div>
            </div>
            <v-progress-linear
              :model-value="Math.min((product.sold / (product.sold + product.stock)) * 100, 100)"
              color="accent"
              height="4"
              rounded
              class="mt-3"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- List view -->
    <v-card v-else rounded="xl" :border="true">
      <v-data-table
        :headers="headers"
        :items="filteredProducts"
        :loading="loading"
        density="comfortable"
      >
        <template #item.price="{ item }">
          <span class="font-weight-medium">{{ formatCurrency(item.price) }}</span>
        </template>
        <template #item.category="{ item }">
          <v-chip size="small" variant="tonal" :color="categoryColor(item.category)">{{ item.category }}</v-chip>
        </template>
        <template #item.status="{ item }">
          <UiStatusBadge :status="item.status" />
        </template>
        <template #item.stock="{ item }">
          <span :class="item.stock < 10 ? 'text-error font-weight-bold' : ''">{{ item.stock }}</span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ layout: 'dashboard' })

  const appStore = useAppStore()
  const { products } = useMockData()
  const { formatCurrency } = useDateFormat()

  appStore.setPageTitle('Produtos')

  const loading = ref(true)
  const search = ref('')
  const categoryFilter = ref<string | null>(null)
  const viewMode = ref('grid')

  onMounted(() => setTimeout(() => (loading.value = false), 500))

  const categoryOptions = ['software', 'hardware', 'service', 'addon']
  const categoryColors: Record<string, string> = {
    software: 'accent', hardware: 'info', service: 'success', addon: 'warning',
  }
  const categoryColor = (cat: string) => categoryColors[cat] ?? 'default'

  const filteredProducts = computed(() => products.value.filter((p) => {
    if (search.value && !p.name.toLowerCase().includes(search.value.toLowerCase())) return false
    if (categoryFilter.value && p.category !== categoryFilter.value) return false
    return true
  }))

  const headers = [
    { title: 'Produto', key: 'name', sortable: true },
    { title: 'Categoria', key: 'category', sortable: true },
    { title: 'Preço', key: 'price', sortable: true },
    { title: 'Estoque', key: 'stock', sortable: true },
    { title: 'Vendidos', key: 'sold', sortable: true },
    { title: 'Status', key: 'status', sortable: false },
  ]
</script>

<style scoped>
.filters-card :deep(.v-card-text) { padding: 12px 16px !important; }
.filters-body { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.search-field { min-width: 200px; flex: 1; }
.product-card { cursor: pointer; }
.product-body { padding: 16px !important; }
.product-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.product-name { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.product-price { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 10px; }
.product-meta { display: flex; gap: 12px; }
.product-meta-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: rgb(var(--v-theme-on-surface-variant)); }
</style>
