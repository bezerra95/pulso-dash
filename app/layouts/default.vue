<script setup lang="ts">
  const { initSession } = useAuth()

  onMounted(async () => {
    await initSession()
  })
</script>

<template>
  <div class="layout-default">
    <slot />
  </div>
</template>

<style scoped>
  .layout-default {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
