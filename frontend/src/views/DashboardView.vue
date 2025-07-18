<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useDateStore } from '@/stores/date';
import { useHeaderStore } from '@/stores/header';
import { onMounted, ref, watch } from 'vue';

import PieChart from '@/components/PieChart.vue'
import MonthPicker from '@/components/MonthPicker.vue'
import { lists } from '@/constants/lists'
import { supabase } from '@/lib/supabaseClient.ts'

const authStore = useAuthStore();
const dateStore = useDateStore();
const headerStore = useHeaderStore();

const incomeByCategory= ref<number[]>([])
const expenseByCategory= ref<number[]>([])


const getExpenseByCategory = async (date: string) => {
  const dateObject = new Date(date)
  const startObject = new Date(dateObject.getFullYear(), dateObject.getMonth(), 2)
  const endObject = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 1)
  const start = startObject.toISOString().split('T')[0]
  const end = endObject.toISOString().split('T')[0]

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

const getIncomeByCategory = async (date: string) => {
  // グラフでの集計は月単位だから、7月を指定した場合は、7/1を使う。
  // リストから情報を取得する際は、7月1日から31日までのデータを取得する。
  const dateObject = new Date(date)
  const startObject = new Date(dateObject.getFullYear(), dateObject.getMonth(), 2)
  const endObject = new Date(dateObject.getFullYear(), dateObject.getMonth()+ 1, 1)
  const start = startObject.toISOString().split('T')[0]
  const end = endObject.toISOString().split('T')[0]
  console.log('start:', start)
  console.log('end:', end)


  let sum_salary = 0
  let sum_realstate = 0
  let sum_support = 0
  let sum_other = 0


  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .eq('user_id', authStore.user?.id)
    .gte('income_month', start)
    .lte('income_month', end)


  if (error) {
    // todo
  } else {
    for (const item of data) {
      if (item.category === '給与収入') {
        sum_salary += item.income_value
      } else if (item.category === '不動産収入') {
        sum_realstate += item.income_value
      } else if (item.category === '補助金収入') {
        sum_support += item.income_value
      } else if (item.category === 'その他収入') {
        sum_other += item.income_value
      }
    }
  }

  // console.log('data:', data)
  incomeByCategory.value = [sum_salary, sum_realstate, sum_support, sum_other]
  // console.log(incomeByCategory.value)
}

const fetchData = async () => {
  await getExpenseByCategory(dateStore.date)
  await getIncomeByCategory(dateStore.date)
}




onMounted(() => {
  headerStore.setTitle('サマリー')
  fetchData()
})

watch(
  () => dateStore.date,
  async (newDate: string) => {
    await getExpenseByCategory(newDate)
    await getIncomeByCategory(newDate)
  }
)

</script>

<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <v-col col="12">
        <MonthPicker/>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col class="d-flex flex-column align-center" col="12" sm="6" md="6" lg="6" xl="6">
        <h2>収入</h2>
        <PieChart
          :labels="lists.income_labels"
          :items="incomeByCategory"
        ></PieChart>
      </v-col>
      <v-col class="d-flex flex-column align-center" col="12" sm="6" md="6" lg="6" xl="6">
        <h2>支出</h2>
        <PieChart
          :labels="lists.expense_labels"
          :items="expenseByCategory"
        ></PieChart>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
