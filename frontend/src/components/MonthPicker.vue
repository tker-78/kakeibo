<script setup lang="ts">
import { useDateStore } from '@/stores/date'
import { ref, onMounted, computed } from 'vue'

const dateStore = useDateStore()

const month = ref(dateStore.getMonth())

const months = computed(() => [
    {value: 1, text: '1月'},
    {value: 2, text: '2月'},
    {value: 3, text: '3月'},
    {value: 4, text: '4月'},
    {value: 5, text: '5月'},
    {value: 6, text: '6月'},
    {value: 7, text: '7月'},
    {value: 8, text: '8月'},
    {value: 9, text: '9月'},
    {value: 10, text: '10月'},
    {value: 11, text: '11月'},
    {value: 12, text: '12月'},
])


const setMonth = (month: number) => {
  dateStore.setMonth(month)
  console.log(dateStore.date)
}

onMounted(() => {
  console.log(dateStore.date)
})


</script>

<template>
  <v-container>
    <v-select
      v-model="month"
      :items="months"
      label="月を選択"
      item-title="text"
      item-value="value"
      :length="12"
      @update:model-value="setMonth(month)"
      class="month-picker"
    ></v-select>
  </v-container>
</template>

<style scoped>

</style>
