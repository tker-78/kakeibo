import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  // state
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)

  //getters
  const isAuthenticated = computed(() => !!session.value)
})

