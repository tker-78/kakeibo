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
  }
}
