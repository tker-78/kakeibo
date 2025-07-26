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
import { getMonthRange } from '@/helpers/date.ts'
import { budgetHelpers } from '@/helpers/budget.ts'

const authStore = useAuthStore();
const headerStore = useHeaderStore();
const dateStore = useDateStore();
const typeStore = useTypeStore();

const budgetData = ref<Item[]>([])
const budgetList = ref<number[]> ([])

const getBudgetItems = async (date: string) => {
  // 当月の予算データを取得する
  budgetData.value = []
  if (!authStore.user?.id )  { return }

  budgetData.value = await budgetHelpers.getBudgetItems(authStore.user.id, date)

  console.log('budgetData:', budgetData.value)
}

const getBudgetByCategory = async (date: string) => {
  if (!authStore.user?.id )  { return }
  budgetList.value = await budgetHelpers.getBudgetByCategory(authStore.user?.id, date)

  console.log('budgetList:', budgetList.value)
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
    await getBudgetByCategory(newDate)
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
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
        <PieChart
          :labels="lists.budget_labels"
          :items="budgetList"
        />
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
        <RegisterData
          type="budget"
          @registered="fetchData"
        ></RegisterData>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
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
