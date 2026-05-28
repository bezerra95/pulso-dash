<template>
  <ClientOnly>
    <Bar :data="chartData" :options="chartOptions" />
  </ClientOnly>
</template>

<script setup lang="ts">
  import { Bar } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
  import { useTheme } from 'vuetify'

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
      backgroundColor: `${ds.color ?? '#6366f1'}99`,
      borderColor: ds.color ?? '#6366f1',
      borderWidth: 0,
      borderRadius: 6,
    })),
  }))

  const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
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
        grid: { display: false },
        ticks: { color: textColor.value, font: { size: 11 } },
      },
      y: {
        grid: { color: gridColor.value, drawBorder: false },
        ticks: { color: textColor.value, font: { size: 11 } },
      },
    },
  }))
</script>
