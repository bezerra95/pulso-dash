<template>
  <ClientOnly>
    <Line :data="chartData" :options="chartOptions" />
  </ClientOnly>
</template>

<script setup lang="ts">
  import { Line } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from 'chart.js'
  import { useTheme } from 'vuetify'

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

  const props = defineProps<{
    labels: string[]
    datasets: Array<{ label: string; data: number[]; color?: string }>
  }>()

  const theme = useTheme()
  const isDark = computed(() => theme.global.name.value === 'darkTheme')
  const textColor = computed(() => isDark.value ? '#94a3b8' : '#64748b')
  const gridColor = computed(() => isDark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')

  const chartData = computed(() => ({
    labels: props.labels,
    datasets: props.datasets.map((ds) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color ?? '#6366f1',
      backgroundColor: `${ds.color ?? '#6366f1'}18`,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      fill: true,
      tension: 0.4,
    })),
  }))

  const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: 'easeInOutQuart' as const },
    plugins: {
      legend: { display: false },
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
    scales: {
      x: {
        grid: { color: gridColor.value, drawBorder: false },
        ticks: { color: textColor.value, font: { size: 11 } },
      },
      y: {
        grid: { color: gridColor.value, drawBorder: false },
        ticks: { color: textColor.value, font: { size: 11 } },
      },
    },
  }))
</script>
