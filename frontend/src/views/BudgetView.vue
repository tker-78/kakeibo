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

const authStore = useAuthStore();
const headerStore = useHeaderStore();
const dateStore = useDateStore();
const typeStore = useTypeStore();

const budgetData = ref<Item[]>([]);

const getBudgetItems = async (date: string) => {
  // 当月の予算データを取得する
  budgetData.value = []
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

const getBudgetTotal = async (date: string) => {
  //　予算金額の合計値を計算する
  // todo
}


const fetchData = async () => {
  // データ更新を反映する
  await getBudgetItems(dateStore.date)
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
