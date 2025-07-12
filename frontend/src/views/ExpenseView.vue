<script setup lang="ts">
import { useHeaderStore } from '@/stores/header';
import { useDateStore } from '@/stores/date';
import { onMounted, ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import ExpenseGraph from '@/components/ExpenseGraph.vue'
import MonthPicker from '@/components/MonthPicker.vue'
import IncomeGraph from '@/components/IncomeGraph.vue'
import ListTable from '@/components/ListTable.vue'
import RegisterIncomeExpense from '@/components/RegisterIncomeExpense.vue'


const dateStore = useDateStore();
const headerStore = useHeaderStore();

interface Item {
  id: number,
  category: string,
  month: string,
  value: number,
}

const expenseData = ref<Item[]>([])

const getExpenseDataForThisMonth = async (date: string) => {
  expenseData.value = []
  const dateObject = new Date(date)
  const startObject = new Date(dateObject.getFullYear(), dateObject.getMonth(), 2)
  const endObject = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 1)
  const start = startObject.toISOString().split('T')[0]
  const end = endObject.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
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

onMounted(() => {
  headerStore.setTitle('支出分析')
  getExpenseDataForThisMonth(dateStore.date)
})

watch(
  () => dateStore.date,
  async (newDate: string) => {
    await getExpenseDataForThisMonth(newDate)
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
          :items="[]"></IncomeGraph>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="6" xl="6">
        <RegisterIncomeExpense
          type="expense"
          @registered="handleIncomeRegistered"
        ></RegisterIncomeExpense>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="6" xl="6">
        <ListTable
          :columns="[
            { label: '月', key: 'expense_month'},
            { label: 'カテゴリ', key: 'category'},
            { label: '金額', key: 'expense_value'},
          ]"
          :items="expenseData"
        ></ListTable>
      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>

</style>
