<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { ref, computed } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  labels: string[],
  items: number[],
}>()

const chartOptions = ref({})
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
    ],
  }
})


</script>

<template>
  <Bar
    :options="chartOptions"
    :data="chartData"
  ></Bar>

</template>

<style scoped>

</style>
