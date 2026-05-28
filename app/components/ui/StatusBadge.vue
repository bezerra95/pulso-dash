<template>
  <v-chip :color="color" size="small" variant="tonal" class="status-chip">
    <v-icon :icon="icon" size="12" start />
    {{ label }}
  </v-chip>
</template>

<script setup lang="ts">
  const props = defineProps<{ status: string }>()

  const statusMap: Record<string, { color: string; icon: string; label: string }> = {
    active:    { color: 'success', icon: 'mdi-circle-small', label: 'Ativo' },
    inactive:  { color: 'error',   icon: 'mdi-circle-small', label: 'Inativo' },
    paid:      { color: 'success', icon: 'mdi-check',        label: 'Pago' },
    pending:   { color: 'warning', icon: 'mdi-clock-outline', label: 'Pendente' },
    cancelled: { color: 'error',   icon: 'mdi-close',        label: 'Cancelado' },
    refunded:  { color: 'info',    icon: 'mdi-refresh',      label: 'Reembolsado' },
    trial:     { color: 'info',    icon: 'mdi-flask-outline', label: 'Trial' },
    churned:   { color: 'error',   icon: 'mdi-account-remove-outline', label: 'Churn' },
  }

  const config = computed(() => statusMap[props.status] ?? { color: 'default', icon: 'mdi-circle', label: props.status })
  const color = computed(() => config.value.color)
  const icon = computed(() => config.value.icon)
  const label = computed(() => config.value.label)
</script>

<style scoped>
.status-chip {
  font-size: 11px !important;
  font-weight: 600;
  letter-spacing: 0.02em;
}
</style>
