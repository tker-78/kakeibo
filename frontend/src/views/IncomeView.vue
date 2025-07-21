<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { useDateStore } from '@/stores/date';
import { useHeaderStore } from '@/stores/header';
import { useTypeStore } from '@/stores/type';
import { useAuthStore } from '@/stores/auth';
import { lists } from '@/constants/lists'
import type { Item } from '@/types/Item.ts'
import { incomeHelpers } from '@/helpers/income.ts'

import RegisterData from '@/components/RegisterData.vue'
import PieChart from '@/components/PieChart.vue'
import ListTable from '@/components/ListTable.vue'
import { supabase } from '@/lib/supabaseClient';
import MonthPicker from '@/components/MonthPicker.vue'
import { getMonthRange } from '@/helpers/date.ts'


const dateStore = useDateStore();
const headerStore = useHeaderStore();
const typeStore = useTypeStore();
const authStore = useAuthStore();

const incomeData = ref<Item[]>([])
const incomeByCategory = ref<number[]>([])


const getIncomeListForThisMonth = async () => {
  incomeData.value = []
  if (!authStore.user?.id )  { return }

  const data = await incomeHelpers.getIncomeListForThisMonth(authStore.user.id, dateStore.date)

  if (data != null) {
    for (const item of data) {
      if (item.income_value != null) {
        incomeData.value.push(item)
      }
    }
  }
}


const getIncomeByCategory = async (date: string) => {

  if (!authStore.user?.id )  { return }

  incomeByCategory.value = await incomeHelpers.getIncomeByCategory(authStore.user?.id, date)
  console.log(incomeByCategory.value)
}

const fetchData = async () => {
  await getIncomeListForThisMonth()
  await getIncomeByCategory(dateStore.date)
}

onMounted(async () => {
  headerStore.setTitle('収入分析')
  typeStore.setType('incomes')
  await getIncomeListForThisMonth()
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
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
        <PieChart
            :labels="lists.income_labels"
            :items="incomeByCategory"></PieChart>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
        <RegisterData
          type="income"
          @registered="fetchData"
        ></RegisterData>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="10" md="12" lg="10" xl="10">
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
