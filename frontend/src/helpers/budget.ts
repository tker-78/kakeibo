import { supabase } from '@/lib/supabaseClient.ts'
import { getMonthRange } from '@/helpers/date.ts'

export const budgetHelpers = {
  fetchBudgetData: async (user_id: string, date: string) => {
    const { start, end } = getMonthRange(date)
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user_id)
      .gte('budget_month', start)
      .lte('budget_month', end)
    return { data, error}
  },
  getBudgetItems:  async (user_id: string, date: string) => {
    const list = []
    const { data, error } = await budgetHelpers.fetchBudgetData(user_id, date)
    if (error) {
      console.log('error:', error)
      return []
    }
    if ( data === null ) { return [] }

    for ( const item of data ) {
      if (item.budget_value != null) {
        list.push(item)
      }
    }
    return list
  },
  getBudgetByCategory: async (user_id: string, date: string) => {

    let food = 0
    let transport = 0
    let house = 0
    let medical = 0
    let education = 0
    let investment = 0
    let other = 0

    const { data, error } = await budgetHelpers.fetchBudgetData(user_id, date)
    if (error) {
      console.log('error:', error)
      return []
    }
    if ( data === null ) { return [] }
    for (const item of data) {
      if (item.category === '食費') {
        food += item.budget_value
      } else if (item.category === '交通費') {
        transport += item.budget_value
      } else if (item.category === '住宅費') {
        house += item.budget_value
      } else if (item.category === '医療費') {
        medical += item.budget_value
      } else if (item.category === '教育費') {
        education += item.budget_value
      } else if (item.category === '投資') {
        investment += item.budget_value
      } else if (item.category === 'その他費用') {
        other += item.budget_value
      }
    }
    return [food, transport, house, medical, education, investment, other]
  },
  getBudgetTotal: async (user_id: string, date: string) => {
    const list = await budgetHelpers.getBudgetItems(user_id, date)
    let total = 0
    for (const item of list) {
      total += item.budget_value
    }
    return total

  }
}
