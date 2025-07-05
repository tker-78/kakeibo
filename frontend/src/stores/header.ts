import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHeaderStore = defineStore('header', () => {
  const title = ref('')

  const setTitle = (newTitle: string) =>  {
    title.value = newTitle
  };
  return { title, setTitle }
})
