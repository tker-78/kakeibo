import { supabase } from '@/lib/supabaseClient.ts'
import { getMonthRange } from '@/helpers/date.ts'

export const expenseHelpers = {
  getExpenseDataForThisMonth: async (user_id: string, date: string ) => {
    const list = []
    const { start, end } = getMonthRange(date)

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user_id)
      .gte('expense_month', start)
      .lte('expense_month', end)

    if (error) {
      console.log('error:', error)
      return []
    }

    if ( data === null ) {
      return []
    }

    for (const item of data) {
      if (item.expense_value != null) {
        list.push(item)
      }
    }
    return list
  },
  getExpenseByCategory: async (user_id: string, date: string) => {

    let sum_food = 0
    let sum_transprot = 0
    let sum_house = 0
    let sum_medical = 0
    let sum_education = 0
    let sum_investment = 0
    let sum_other = 0


    const { start, end } = getMonthRange(date)

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user_id)
      .gte('expense_month', start)
      .lte('expense_month', end)

    if (error) {
      console.log('error:', error)
      return []
    }

    if ( data === null ) { return [] }

    for ( const item of data ) {
      if (item.category === '食費') {
        sum_food += item.expense_value
      } else if (item.category === '交通費') {
        sum_transprot += item.expense_value
      } else if (item.category === '住宅費') {
        sum_house += item.expense_value
      } else if (item.category === '医療費') {
        sum_medical += item.expense_value
      } else if (item.category === '教育費') {
        sum_education += item.expense_value
      } else if (item.category === '投資') {
        sum_investment += item.expense_value
      } else if (item.category === 'その他費用') {
        sum_other += item.expense_value
      }
    }

    return [
      sum_food,
      sum_transprot,
      sum_house,
      sum_medical,
      sum_education,
      sum_investment,
      sum_other,
    ]


  },
}
