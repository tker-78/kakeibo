import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!session.value)

  const login = async (email: string, password: string) =>  {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        throw error
      }
      user.value = data.user
      session.value = data.session
      return { data, error: null}
    } catch (error) {
      return { data: null, error}
    } finally {
      loading.value = false
    }
  }

  const initialize = async () =>  {
    loading.value = true
    try {
      const { data: { session }} = await supabase.auth.getSession()

      if (session) {
        user.value = session.user
        session.value = session
      }

      supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          user.value = session.user
          session.value = session
        } else {
          user.value = null
          session.value = null
        }
      })
    } catch (error) {
      console.error('認証の初期化エラー', error)
    } finally {
      loading.value = false
    }
  }
  return {
    user,
    session,
    loading,
    isAuthenticated,
    login,
    initialize,
  }
})
