import { supabase } from '@/lib/supabaseClient.ts'
import { getMonthRange } from '@/helpers/date'

export const incomeHelpers = {
  getIncomeListForThisMonth: async (user_id: string, date: string ) => {
    const { start, end } = getMonthRange(date)
    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', user_id)
      .gte('income_month', start)
      .lte('income_month', end)

    if (error) {
      console.log('error:', error)
      return []
    }
    console.log('data:', data)
    return data
  },
  getIncomeByCategory: async (user_id: string, date: string) => {
    const { start, end } = getMonthRange(date)

    let sum_salary = 0
    let sum_realstate = 0
    let sum_support = 0
    let sum_other = 0

    const { data, error }  = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', user_id)
      .gte('income_month', start)
      .lte('income_month', end)


    if (error) {
      console.log('error:', error)
      return []
    }

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

    return [sum_salary, sum_realstate, sum_support, sum_other]



  }
}
