<template>
  <v-text-field
    :model-value="modelValue"
    placeholder="Buscar..."
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="compact"
    hide-details
    clearable
    class="search-input"
    @update:model-value="onInput"
    @click:clear="emit('update:modelValue', '')"
  />
</template>

<script setup lang="ts">
  const props = defineProps<{ modelValue: string }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
  const { debounce } = useLodash()

  const debouncedEmit = debounce((val: string) => emit('update:modelValue', val), 300)
  const onInput = (val: string | null) => debouncedEmit(val ?? '')

  onUnmounted(() => debouncedEmit.cancel())
</script>

<style scoped>
.search-input :deep(.v-field) {
  border-radius: 10px;
  font-size: 13px;
}
</style>
