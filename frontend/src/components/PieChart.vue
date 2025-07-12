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
            '#ff6384', // pink
            '#36a2eb', // blue
            '#ffce56', // yellow
            '#00b894', // green
            '#e74c3c', // red
            '#9b59b6', // purple
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
