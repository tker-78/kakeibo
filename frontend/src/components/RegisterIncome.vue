<script setup lang="ts">

import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';

const category = ref<string>('');
const income = ref<number | null>(null);
const income_month = ref<string>('');
const categoryOptions = [
  '給与収入',
  '不動産収入',
  '補助金収入',
  'その他収入',
]

interface IncomeItem {
  id: number,
  category: string,
  income_month: string,
  income_value: number,
}

const emit = defineEmits<{
  registered: [item: IncomeItem]
}>();

const register = async () => {
  // supabaseのincomeテーブルに登録(INSERT)
  const { data, error } = await supabase.from('incomes').insert(
    [{
      category: category.value,
      income_month: income_month.value,
      income_value: income.value,
    }]).select()
  if (error) {
    console.log('error:', error)
    console.log('data:', data)
    console.log('収入の登録に失敗しました。もう一度試してください。')
  } else {
    // success
    console.log('収入の登録に成功しました。')
    console.log('data:', data)
    emit('registered', data[0])
  }
}

</script>

<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col>
        <v-card>
          <v-card-title class="test-center">
            <v-icon large color="primary">mdi-cash</v-icon>
            収入を登録
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent>
              <v-text-field
                v-model="income_month"
                label="対象月"
                type="date"
                prepend-icon="mdi-calendar"
              ></v-text-field>
              <v-select
                v-model="category"
                v-bind:items="categoryOptions"
                label="分類"
                prepend-icon="mdi-cash"
                type="list"
              ></v-select>
              <v-text-field
                v-model="income"
                label="金額"
                prepend-icon="mdi-piggy-bank"
              ></v-text-field>
              <v-btn
                type="submit"
                color="primary"
                @click="register"
              >登録</v-btn>
            </v-form>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  </v-container>


</template>

<style scoped>

</style>
