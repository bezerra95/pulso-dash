<template>
  <ClientOnly>
    <Doughnut :data="chartData" :options="chartOptions" />
  </ClientOnly>
</template>

<script setup lang="ts">
  import { Doughnut } from 'vue-chartjs'
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
  import { useTheme } from 'vuetify'

  ChartJS.register(ArcElement, Tooltip, Legend)

  const props = defineProps<{
    labels: string[]
    data: number[]
    colors?: string[]
  }>()

  const theme = useTheme()
  const isDark = computed(() => theme.global.name.value === 'darkTheme')

  const DEFAULT_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#6366f1', '#8b5cf6']

  const chartData = computed(() => ({
    labels: props.labels,
    datasets: [{
      data: props.data,
      backgroundColor: (props.colors ?? DEFAULT_COLORS).map((c) => `${c}cc`),
      borderColor: isDark.value ? '#111' : '#fff',
      borderWidth: 3,
      hoverOffset: 6,
    }],
  }))

  const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    animation: { duration: 700, easing: 'easeInOutQuart' as const },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDark.value ? '#94a3b8' : '#64748b',
          font: { size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: isDark.value ? '#1e1e1e' : '#fff',
        titleColor: isDark.value ? '#f1f5f9' : '#0f172a',
        bodyColor: isDark.value ? '#94a3b8' : '#64748b',
        borderColor: isDark.value ? '#333' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
  }))
</script>
