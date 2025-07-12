<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'

interface Column {
  label: string,
  key: string,
}

const props = defineProps<{
  columns: Column[],
  items: Record<string, any>[],
}>()

// console.log(props.items)


</script>

<template>
  <v-table class="table-list">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td v-for="col in columns" :key="col.key">{{ item[col.key]}}</td>
      </tr>
    </tbody>
  </v-table>

</template>

<style scoped>
.table-list {
  margin: 100px 100px;
}

</style>
