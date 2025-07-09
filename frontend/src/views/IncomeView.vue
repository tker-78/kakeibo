<script setup lang="ts">
import { useHeaderStore } from '@/stores/header';
import { onMounted, ref } from 'vue';
import RegisterIncome from '@/components/RegisterIncome.vue'
import IncomeGraph from '@/components/IncomeGraph.vue'
import ListTable from '@/components/ListTable.vue'
import { supabase } from '@/lib/supabaseClient';



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

const getIncomeByCategory = async (month: string) => {
  const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('income_month', month)

  if (error) {
    console.log('error:', error)
    console.log('data:', data)
    console.log('収入の取得に失敗しました。もう一度試してください。')
  } else {
    console.log('data:', data)
  }

  // todo

}

const handleIncomeRegistered = async (item: IncomeItem) => {
  incomeData.value.push(item)
}

onMounted(async () => {
  headerStore.setTitle('収入分析')
  await getIncomeListData()
  await getIncomeByCategory('2025-07-01')
})

</script>

<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <v-col col="12" sm="6" md="6" lg="6" xl="6">
        <IncomeGraph
            :labels="['給与収入', '不動産収入', '補助金収入', 'その他収入']"
            :items="[1000000, 200000, 15000, 0]"></IncomeGraph>
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
