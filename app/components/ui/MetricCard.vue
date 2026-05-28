<template>
  <v-card class="metric-card hover-lift" :border="true">
    <v-card-text class="metric-body">
      <template v-if="loading">
        <v-skeleton-loader type="text" width="60%" />
        <v-skeleton-loader type="heading" class="mt-2" />
        <v-skeleton-loader type="text" width="40%" class="mt-2" />
      </template>
      <template v-else>
        <div class="metric-header">
          <span class="metric-label">{{ label }}</span>
          <div class="metric-icon-wrap" :style="{ background: `rgba(var(--v-theme-${color}), 0.1)` }">
            <v-icon :icon="icon" :color="color" size="18" />
          </div>
        </div>
        <div class="metric-value">{{ formattedValue }}</div>
        <div class="metric-change">
          <v-icon
            :icon="change >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
            :color="change >= 0 ? 'success' : 'error'"
            size="14"
          />
          <span :class="change >= 0 ? 'text-success' : 'text-error'">
            {{ Math.abs(change).toFixed(1) }}%
          </span>
          <span class="metric-period">vs. mês anterior</span>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label: string
    value: number
    change: number
    icon: string
    color?: string
    format?: 'currency' | 'number' | 'percent'
    loading?: boolean
  }>()

  const { formatCurrency, formatNumber } = useDateFormat()

  const formattedValue = computed(() => {
    if (props.format === 'currency') return formatCurrency(props.value)
    if (props.format === 'percent') return `${props.value.toFixed(1)}%`
    return formatNumber(props.value)
  })
</script>

<style scoped lang="scss">
  .metric-card {
    border-radius: 12px !important;
    border: 1px solid rgba(var(--v-border-color), 0.08) !important;
  }

  .metric-body {
    padding: 20px !important;
  }

  .metric-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .metric-label {
    font-size: 13px;
    font-weight: 500;
    color: rgb(var(--v-theme-on-surface-variant));
  }

  .metric-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .metric-value {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1;
    margin-bottom: 8px;
    transition: all 0.3s ease;
  }

  .metric-change {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .metric-period {
    color: rgb(var(--v-theme-on-surface-variant));
    font-weight: 400;
  }
</style>
