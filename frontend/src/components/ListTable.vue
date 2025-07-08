<script setup lang="ts">
import { defineProps, ref } from 'vue'

interface Item {
  id: number,
  category: string,
  income_month: string,
  income_value: number,
}

const props = defineProps<{
  items: Item[]
}>()

// console.log(props.items)


</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th>月</th>
        <th>カテゴリ</th>
        <th>金額</th>
      </tr>
    </thead>
    <tbody>
    <tr
      v-for="item in items"
      :key="item.id"
    >
      <td>{{ item.income_month }}</td>
      <td>{{ item.category }}</td>
      <td>{{ item.income_value }}</td>
    </tr>
    </tbody>
  </v-table>

</template>

<style scoped>

</style>
