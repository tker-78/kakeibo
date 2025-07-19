<script setup lang="ts">

import { defineProps, ref, computed } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  type: 'income' | 'expense' | 'budget',
}>()

const authStore = useAuthStore();
const category = ref<string>('');
const value = ref<number | null>(null);
const month = ref<string>('');

const categoryOptions = computed(() => {
  if (props.type === 'income') {
    return [ '給与収入', '不動産収入', '補助金収入', 'その他収入', ]
  }
  if (props.type === 'expense') {
    return [ '食費', '交通費', '住宅費', '医療費', '教育費', '投資', 'その他費用', ]
  }
  if (props.type === 'budget') {
    return [ '食費', '交通費', '住宅費', '医療費', '教育費', '投資', 'その他費用', ]
  }
  return []
})


const emit = defineEmits<{ registered: []}>() ;

const register = async () => {
  // supabaseのincomeテーブルに登録(INSERT)
  if (props.type === 'income') {
    const { data, error } = await supabase.from('incomes').insert(
      [{
        user_id: authStore.user?.id,
        category: category.value,
        income_month: month.value,
        income_value: value.value,
      }]).select()
    if (error) {
      console.log('error:', error)
      console.log('data:', data)
      console.log('収入の登録に失敗しました。もう一度試してください。')
    } else {
      // success
      console.log('収入の登録に成功しました。')
      console.log('data:', data)
      emit('registered')
    }
  } else if (props.type === 'expense') {
    const { data, error } = await supabase.from('expenses').insert(
      [{
        user_id: authStore.user?.id,
        category: category.value,
        expense_month: month.value,
        expense_value: value.value,
      }]).select()
    if (error) {
      console.log('error:', error)
    } else {
      // success
      console.log('支出の登録に成功しました。')
      console.log('data:', data)
      emit('registered')
    }
  } else if (props.type === 'budget') {
    const { data, error } = await supabase.from('budgets').insert(
      [{
        user_id: authStore.user?.id,
        category: category.value,
        budget_month: month.value,
        budget_value: value.value,
      }]).select()

    if (error) {
      console.log('error:', error)
    } else {
      // success
      console.log('予算の登録に成功しました。')
      console.log('data:', data)
      emit('registered')
    }
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
            <span v-if="type === 'income'">収入を登録</span>
            <span v-if="type === 'expense'">支出を登録</span>
            <span v-if="type === 'budget'">予算を登録</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent>
              <v-text-field
                v-model="month"
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
                v-model="value"
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
