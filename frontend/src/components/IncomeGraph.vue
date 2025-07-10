<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { ref, computed } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  items: number[],
  labels: string[]
}>()

const chartOptions = ref({
  responsive: true,
})

const chartData = computed(() => {
    return {
      labels: props.labels,
      datasets: [
        {
          data: props.items,
          backgroundColor: [
            '#ff6384',
            '#36a2eb',
            '#ffce56',
          ],
        },
      ]
    }
  })

</script>

<template>
  <Pie
    :options="chartOptions"
    :data="chartData"
  ></Pie>

</template>

<style scoped>

</style>
