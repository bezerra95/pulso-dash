<template>
  <div class="empty-state">
    <v-icon :icon="icon" size="48" color="on-surface-variant" class="mb-3" />
    <p class="empty-title">{{ title }}</p>
    <p v-if="subtitle" class="empty-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
  defineProps<{ icon?: string; title: string; subtitle?: string }>()
  withDefaults(defineProps<{ icon?: string; title: string; subtitle?: string }>(), {
    icon: 'mdi-inbox-outline',
  })
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  color: rgb(var(--v-theme-on-surface-variant));
}
.empty-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}
.empty-subtitle {
  font-size: 13px;
}
</style>
