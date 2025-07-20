<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { useHeaderStore } from '@/stores/header';
import { useDateStore } from '@/stores/date';
import { useTypeStore } from '@/stores/type';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabaseClient';
import { getMonthRange } from '@/helpers/date.ts'

import MonthPicker from '@/components/MonthPicker.vue'
import PieChart from '@/components/PieChart.vue'
import ListTable from '@/components/ListTable.vue'
import RegisterData from '@/components/RegisterData.vue'

import { lists } from '@/constants/lists'
import type { Item } from '@/types/Item.ts'


const dateStore = useDateStore();
const headerStore = useHeaderStore();
const authStore = useAuthStore();
const typeStore = useTypeStore();
const expenseData = ref<Item[]>([])
const expenseByCategory = ref<number[]>([])


const getExpenseDataForThisMonth = async (date: string) => {
  expenseData.value = []
  // const dateObject = new Date(date)
  // const startObject = new Date(dateObject.getFullYear(), dateObject.getMonth(), 2)
  // const endObject = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 1)
  // const start = startObject.toISOString().split('T')[0]
  // const end = endObject.toISOString().split('T')[0]
  const { start, end } = getMonthRange(date)
  console.log('start:', start)
  console.log('end:', end)

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', authStore.user?.id)
    .gte('expense_month', start)
    .lte('expense_month', end)

  if (error) {
    console.log('error:', error)
    console.log('data:', data)
    console.log('支出の取得に失敗しました。もう一度試してください。')
  }
  if ( data === null) {
    expenseData.value = []
  } else {
    for (const item of data) {
      if (item.expense_value != null) {
        expenseData.value.push(item)
      }
    }
  }
  console.log('expenseData:', expenseData.value)
}

const getExpenseByCategory = async (date: string) => {
  // const dateObject = new Date(date)
  // const startObject = new Date(dateObject.getFullYear(), dateObject.getMonth(), 2)
  // const endObject = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 1)
  // const start = startObject.toISOString().split('T')[0]
  // const end = endObject.toISOString().split('T')[0]
  const { start, end } = getMonthRange(date)
  console.log('start:', start)
  console.log('end:', end)

  let sum_food = 0
  let sum_transprot = 0
  let sum_house = 0
  let sum_medical = 0
  let sum_education = 0
  let sum_investment = 0
  let sum_other = 0

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', authStore.user?.id)
    .gte('expense_month', start)
    .lte('expense_month', end)

  if (error) {
    console.log('error:', error)
  } else {
    for (const item of data) {
      if (item.category === '食費') {
        sum_food += item.expense_value
      } else if (item.category === '交通費') {
        sum_transprot += item.expense_value
      } else if (item.category === '住宅費') {
        sum_house += item.expense_value
      } else if (item.category === '医療費') {
        sum_medical += item.expense_value
      } else if (item.category === '教育費') {
        sum_education += item.expense_value
      } else if (item.category === '投資') {
        sum_investment += item.expense_value
      } else if (item.category === 'その他費用') {
        sum_other += item.expense_value
      }
    }
  }

  expenseByCategory.value = [sum_food, sum_transprot, sum_house, sum_medical, sum_education, sum_investment, sum_other]
  console.log(expenseByCategory.value)
}


const fetchData = async () => {
  await getExpenseDataForThisMonth(dateStore.date)
  await getExpenseByCategory(dateStore.date)
}

onMounted(() => {
  headerStore.setTitle('支出分析')
  typeStore.setType('expenses')
  getExpenseDataForThisMonth(dateStore.date)
  getExpenseByCategory(dateStore.date)
  console.log('authStore.user:', authStore.user?.id)
})

watch(
  () => dateStore.date,
  async (newDate: string) => {
    await getExpenseDataForThisMonth(newDate)
    await getExpenseByCategory(newDate)
  }
)

</script>

<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <MonthPicker/>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
        <PieChart
          :labels="lists.expense_labels"
          :items="expenseByCategory"></PieChart>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
        <RegisterData
          type="expense"
           @registered="fetchData"
        ></RegisterData>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
        <ListTable
          :columns="[
            { label: '月', key: 'expense_month'},
            { label: 'カテゴリ', key: 'category'},
            { label: '金額', key: 'expense_value'},
          ]"
          :items="expenseData"
          @deleted="fetchData"
        ></ListTable>
      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>

</style>
