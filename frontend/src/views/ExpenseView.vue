<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import { useHeaderStore } from '@/stores/header'
import { useDateStore } from '@/stores/date'
import { useTypeStore } from '@/stores/type'
import { useAuthStore } from '@/stores/auth'
import { expenseHelpers } from '@/helpers/expense.ts'

import MonthPicker from '@/components/MonthPicker.vue'
import PieChart from '@/components/PieChart.vue'
import ListTable from '@/components/ListTable.vue'
import RegisterData from '@/components/RegisterData.vue'

import { lists } from '@/constants/lists'
import type { Item } from '@/types/Item.ts'

const dateStore = useDateStore()
const headerStore = useHeaderStore()
const authStore = useAuthStore()
const typeStore = useTypeStore()

const expenseData = ref<Item[]>([])
const expenseByCategory = ref<number[]>([])

const getExpenseDataForThisMonth = async (date: string) => {
  expenseData.value = []
  if (!authStore.user?.id) { return }
  expenseData.value = await expenseHelpers.getExpenseDataForThisMonth(authStore.user.id, date)
  console.log('expenseData:', expenseData.value)
}

const getExpenseByCategory = async (date: string) => {
  // expenseByCategory.value = []
  if (!authStore.user?.id ) { return }
  expenseByCategory.value = await expenseHelpers.getExpenseByCategory(authStore.user?.id, date)
  console.log("expenseByCategory:", expenseByCategory.value)
}

const fetchData = async () => {
  await getExpenseDataForThisMonth(dateStore.date)
  await getExpenseByCategory(dateStore.date)
}

onMounted(async () => {
  headerStore.setTitle('支出分析')
  typeStore.setType('expenses')
  await getExpenseDataForThisMonth(dateStore.date)
  await getExpenseByCategory(dateStore.date)
  // console.log('authStore.user:', authStore.user?.id)
})

watch(
  () => dateStore.date,
  async (newDate: string) => {
    await getExpenseDataForThisMonth(newDate)
    await getExpenseByCategory(newDate)
  },
)
</script>

<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <MonthPicker />
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
        <PieChart :labels="lists.expense_labels" :items="expenseByCategory"></PieChart>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
        <RegisterData type="expense" @registered="fetchData"></RegisterData>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
        <ListTable
          :columns="[
            { label: '月', key: 'expense_month' },
            { label: 'カテゴリ', key: 'category' },
            { label: '金額', key: 'expense_value' },
          ]"
          :items="expenseData"
          @deleted="fetchData"
        ></ListTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
