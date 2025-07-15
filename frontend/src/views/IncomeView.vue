<script setup lang="ts">
import { useDateStore } from '@/stores/date';
import { useHeaderStore } from '@/stores/header';
import { useTypeStore } from '@/stores/type';
import { onMounted, ref, watch } from 'vue';
import RegisterIncomeExpense from '@/components/RegisterIncomeExpense.vue'
import PieChart from '@/components/PieChart.vue'
import ListTable from '@/components/ListTable.vue'
import { supabase } from '@/lib/supabaseClient';
import MonthPicker from '@/components/MonthPicker.vue'
import { lists } from '@/constants/lists'
import type { Item } from '@/types/item'


const dateStore = useDateStore();
const headerStore = useHeaderStore();
const typeStore = useTypeStore();

const incomeData = ref<Item[]>([])
const incomeByCategory = ref<number[]>([])


const getIncomeListData = async () => {
  const { data, error } = await supabase.from('incomes').select()
  if (error) {
    console.log('error:', error)
    console.log('data:', data)
    console.log('収入の取得に失敗しました。もう一度試してください。')
  }
  // console.log('data:', data)
  if (data === null) {
    incomeData.value = []
  } else {
    for (const item of data) {
      if (item.income_value != null) {
        incomeData.value.push(item)
      }
    }
    // console.log('incomeData:', incomeData.value)
  }
}

const getIncomeListForThisMonth = async (date: string) => {
  incomeData.value = []
  const dateObject = new Date(date)
  const startObject = new Date(dateObject.getFullYear(), dateObject.getMonth(), 2)
  const endObject = new Date(dateObject.getFullYear(), dateObject.getMonth()+ 1, 1)
  const start = startObject.toISOString().split('T')[0]
  const end = endObject.toISOString().split('T')[0]
  console.log('start:', start)
  console.log('end:', end)


  // const start = date.split('-')[0] + '-' + dateStore.date.split('-')[1] + '-01'
  // const end = date.split('-')[0] + '-' + dateStore.date.split('-')[1] + '-31'
  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .gte('income_month', start)
    .lte('income_month', end)

  if (error) {
    console.log('error:', error)
    console.log('data:', data)
    console.log('収入の取得に失敗しました。もう一度試してください。')
  } else {
    for (const item of data) {
      if (item.income_value != null) {
        incomeData.value.push(item)
      }
    }
  }
  console.log('incomeData:', incomeData.value)
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
  console.log(incomeByCategory.value)


}

const fetchData = async () => {
  await getIncomeListForThisMonth(dateStore.date)
  await getIncomeByCategory(dateStore.date)
}

onMounted(async () => {
  headerStore.setTitle('収入分析')
  typeStore.setType('incomes')
  await getIncomeListForThisMonth(dateStore.date)
  await getIncomeByCategory(dateStore.date)
})

watch(
  () => dateStore.date,
  async (newDate: string) => {
    await getIncomeListForThisMonth(newDate)
    await getIncomeByCategory(newDate)
  }
)

</script>

<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <MonthPicker/>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="6" md="6" lg="6" xl="6">
        <PieChart
            :labels="lists.income_labels"
            :items="incomeByCategory"></PieChart>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="6" xl="6">
        <RegisterIncomeExpense
          type="income"
          @registered="fetchData"
        ></RegisterIncomeExpense>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="6" xl="6">
        <ListTable
          :columns="[
            { label: '日付', key: 'income_month'},
            { label: 'カテゴリ', key: 'category'},
            { label: '金額', key: 'income_value'},
          ]"
          :items="incomeData"
          @deleted="fetchData"
        ></ListTable>
      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>

</style>
