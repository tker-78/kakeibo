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

const getIncomeData = async () => {
  const { data, error } = await supabase.from('incomes').select()
  if (error) {
    console.log('error:', error)
    console.log('data:', data)
    console.log('収入の取得に失敗しました。もう一度試してください。')
  }
  console.log('data:', data)
  if (data === null) {
    incomeData.value = []
  } else {
    for (const item of data) {
      if (item.income_value != null) {
        incomeData.value.push(item)
      }
    }
    console.log('incomeData:', incomeData.value)
  }
}

const handleIncomeRegistered = async (item: IncomeItem) => {
  incomeData.value.push(item)
}

onMounted(async () => {
  headerStore.setTitle('収入分析')
  await getIncomeData()
})

</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12"  sm="12" md="6" lg="12" xl="12">
        <IncomeGraph></IncomeGraph>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="12" xl="12">
        <RegisterIncome @registered="handleIncomeRegistered"></RegisterIncome>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="12" xl="12">
        <ListTable
        :items="incomeData"
        ></ListTable>
      </v-col>

    </v-row>

  </v-container>
</template>

<style scoped>

</style>
