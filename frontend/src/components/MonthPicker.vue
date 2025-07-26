<script setup lang="ts">
import { useDateStore } from '@/stores/date'
import { ref, onMounted, computed, watch } from 'vue'

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

// モバイル判定
const isMobile = computed(() => {
  return window.innerWidth <= 768
})

const showBottomSheet = ref(false)

const selectMonth = (selectedMonth: number) => {
  month.value = selectedMonth
  setMonth(selectedMonth)
  showBottomSheet.value = false
}

const selectedMonthText = computed(() => {
  const found = months.value.find(m => m.value === dateStore.month)
  return found ? found.text : "月を選択"
})

watch(() => dateStore.month, (newMonth) => {
  month.value = newMonth
}, { immediate: true })


</script>

<template>
  <div v-if="isMobile">
    <v-btn
      @click="showBottomSheet = true"
      variant="outlined"
      block
      class="month-button"
    >{{ selectedMonthText }}</v-btn>

    <v-bottom-sheet v-model="showBottomSheet">
      <v-card>
        <v-card-title class="text-center">月を選択</v-card-title>
        <v-card-text>
          <v-list-item
          v-for="m in months"
          :key="m.value"
          @click="selectMonth(m.value)"
          :active="month === m.value"
          >
            <v-list-item-title>{{ m.text }}</v-list-item-title>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
  <v-select
    v-else
    v-model="month"
    :items="months"
    label="月を選択"
    item-title="text"
    item-value="value"
    :length="12"
    @update:model-value="setMonth(month)"
    class="month-picker"
  ></v-select>
</template>

<style scoped>

</style>
