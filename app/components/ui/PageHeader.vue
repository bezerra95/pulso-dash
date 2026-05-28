<template>
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-header-title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header-subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{ title: string; subtitle?: string }>()
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.page-header-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
  line-height: 1.2;
}
.page-header-subtitle {
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: 4px;
}
.page-header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
