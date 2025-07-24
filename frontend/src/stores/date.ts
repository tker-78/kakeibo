import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDateStore = defineStore('date', () => {
  const date = ref<string>(new Date().toISOString().split('T')[0] )

  const setMonth = (month: number) => {
    const char_year = date.value.split('-')[0]
    date.value = `${char_year}-${month}-1`
  }

  const getMonth = () => {
    return Number(date.value.split('-')[1])
  }

  return {
    date,
    setMonth,
    getMonth,
  }
})
