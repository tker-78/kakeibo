import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTypeStore = defineStore('type', () => {
  const type = ref<string>('')

  const setType = (newType: string) => {
    type.value = newType
  }
  return { type, setType}
})
