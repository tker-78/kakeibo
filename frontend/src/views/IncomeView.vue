<script setup lang="ts">
import { useDateStore } from '@/stores/date';
import { useHeaderStore } from '@/stores/header';
import { onMounted, ref, watch } from 'vue';
import RegisterIncome from '@/components/RegisterIncome.vue'
import IncomeGraph from '@/components/IncomeGraph.vue'
import ListTable from '@/components/ListTable.vue'
import { supabase } from '@/lib/supabaseClient';
import MonthPicker from '@/components/MonthPicker.vue'


const dateStore = useDateStore();
const headerStore = useHeaderStore();

interface IncomeItem {
  id: number,
  category: string,
  income_month: string,
  income_value: number,
}

const incomeData = ref<IncomeItem[]>([])
// {id: 1, category: '給与収入', income_month: '2021-01', income_value: 10000000 },
// {id: 2, category: '給与収入', income_month: '2021-02', income_value: 10000000 },
// {id: 3, category: '給与収入', income_month: '2021-03', income_value: 10000000 },

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

const incomeByCategory = ref<number[]>([])

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

const handleIncomeRegistered = async (item: IncomeItem) => {
  incomeData.value.push(item)
}

onMounted(async () => {
  headerStore.setTitle('収入分析')
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
        <IncomeGraph
            :labels="['給与収入', '不動産収入', '補助金収入', 'その他収入']"
            :items="incomeByCategory"></IncomeGraph>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="6" xl="6">
        <RegisterIncome @registered="handleIncomeRegistered"></RegisterIncome>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="6" xl="6">
        <ListTable
        :items="incomeData"
        ></ListTable>
      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>

</style>
