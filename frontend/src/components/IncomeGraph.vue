<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { ref } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const chartOptions = ref({})
const chartData = ref({
  labels: ['給与収入', '不動産収入', 'その他収入'],
  datasets: [
    {
      data: [10, 20, 30],
    }
  ]
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
