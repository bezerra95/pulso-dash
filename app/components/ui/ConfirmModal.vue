<template>
  <v-dialog v-model="show" max-width="400">
    <v-card rounded="xl">
      <v-card-text class="pt-6 pb-2 px-6">
        <div class="confirm-icon-wrap">
          <v-icon :icon="icon" :color="color" size="28" />
        </div>
        <h3 class="confirm-title">{{ title }}</h3>
        <p class="confirm-message">{{ message }}</p>
      </v-card-text>
      <v-card-actions class="px-6 pb-5">
        <v-spacer />
        <v-btn variant="text" @click="emit('cancel')">Cancelar</v-btn>
        <v-btn :color="color" variant="flat" rounded="lg" @click="emit('confirm')">{{ confirmLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    modelValue: boolean
    title: string
    message: string
    confirmLabel?: string
    color?: string
    icon?: string
  }>(), {
    confirmLabel: 'Confirmar',
    color: 'error',
    icon: 'mdi-alert-circle-outline',
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    confirm: []
    cancel: []
  }>()

  const show = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
  })
</script>

<style scoped>
.confirm-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(var(--v-theme-error), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.confirm-title {
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
}
.confirm-message {
  text-align: center;
  font-size: 13px;
  color: rgb(var(--v-theme-on-surface-variant));
}
</style>
