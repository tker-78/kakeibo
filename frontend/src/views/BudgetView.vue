<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useHeaderStore } from '@/stores/header';
import { useDateStore } from '@/stores/date';
import { useTypeStore } from '@/stores/type';
import { supabase } from '@/lib/supabaseClient';
import { onMounted, ref, watch } from 'vue';
import type { Item } from '@/types/Item.ts'
import MonthPicker from '@/components/MonthPicker.vue'
import RegisterData from '@/components/RegisterData.vue'
import ListTable from '@/components/ListTable.vue'
import PieChart from '@/components/PieChart.vue'

import { lists } from '@/constants/lists'

const authStore = useAuthStore();
const headerStore = useHeaderStore();
const dateStore = useDateStore();
const typeStore = useTypeStore();

const budgetData = ref<Item[]>([])
const budgetList = ref<number[]> ([])

const getBudgetItems = async (date: string) => {
  // 当月の予算データを取得する
  budgetData.value = []
  budgetList.value = []
  const dateObject = new Date(date)
  const startObject = new Date(dateObject.getFullYear(), dateObject.getMonth(), 2)
  const endObject = new Date(dateObject.getFullYear(), dateObject.getMonth()+ 1, 1)
  const start = startObject.toISOString().split('T')[0]
  const end = endObject.toISOString().split('T')[0]
  console.log('start:', start)
  console.log('end:', end)

  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', authStore.user?.id)
    .gte('budget_month', start)
    .lte('budget_month', end)

  if (error) {
    console.log('error:', error)
    console.log('data:', data)
    console.log('予算の取得に失敗しました。もう一度試してください。')
  } else {
    console.log('data:', data)
    for (const item of data)  {
      if (item.budget_value != null) {
        budgetData.value.push(item)
      }
    }
  }
  console.log('budgetData:', budgetData.value)
}

const getBudgetByCategory = async (date: string) => {
  const dateObject = new Date(date)
  const startObject = new Date(dateObject.getFullYear(), dateObject.getMonth(), 2)
  const endObject = new Date(dateObject.getFullYear(), dateObject.getMonth()+ 1, 1)
  const start = startObject.toISOString().split('T')[0]
  const end = endObject.toISOString().split('T')[0]
  console.log('start:', start)
  console.log('end:', end)

  let food = 0
  let transport = 0
  let house = 0
  let medical = 0
  let education = 0
  let investment = 0
  let other = 0

  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', authStore.user?.id)
    .gte('budget_month', start)
    .lte('budget_month', end)

  if (error) {
    console.log('error:', error)
  } else {
    for (const item of data) {
      if (item.category === '食費') {
        food += item.budget_value
      } else if (item.category === '交通費') {
        transport += item.budget_value
      } else if (item.category === '住宅費') {
        house += item.budget_value
      } else if (item.category === '医療費') {
        medical += item.budget_value
      } else if (item.category === '教育費') {
        education += item.budget_value
      } else if (item.category === '投資') {
        investment += item.budget_value
      } else if (item.category === 'その他費用') {
        other += item.budget_value
      }
    }
    budgetList.value = [food, transport, house, medical, education, investment, other]
    console.log('budgetList:', budgetList.value)
  }
}

const getBudgetTotal = async (date: string) => {
  //　予算金額の合計値を計算する
  // todo
}


const fetchData = async () => {
  // データ更新を反映する
  await getBudgetItems(dateStore.date)
  await getBudgetByCategory(dateStore.date)
  await getBudgetTotal(dateStore.date)
}


watch(
  () => dateStore.date,
  async (newDate: string) => {
    await getBudgetItems(newDate)
    await getBudgetTotal(newDate)
  }
)


onMounted(() => {
  headerStore.setTitle('予算管理')
  typeStore.setType('budgets')
  fetchData()
})

</script>

<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <MonthPicker />
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="6" xl="6">
        <PieChart
          v-if="budgetList.length > 0"
          :labels="lists.budget_labels"
          :items="budgetList"
        />
        <div v-else>データ取得中</div>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="6" xl="6">
        <RegisterData
          type="budget"
          @registered="fetchData"
        ></RegisterData>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="6" xl="6">
        <ListTable
          :columns="[
            // { label: '月', key: 'budget_month'},
            { label: 'カテゴリ', key: 'category'},
            { label: '金額', key: 'budget_value'},
          ]"
          :items="budgetData"
          @deleted="fetchData"
        ></ListTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
