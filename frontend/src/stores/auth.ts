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

  const logout = async () => {
    loading.value = true
    try {
      await supabase.auth.signOut()
      user.value = null
      session.value = null
    } catch (error) {
      console.error('ログアウトエラー', error)
    } finally {
      loading.value = false
    }
  }

  const initialize = async () =>  {
    loading.value = true
    try {
      const { data: { session: currentSession }} = await supabase.auth.getSession()

      if (currentSession) {
        user.value = currentSession.user
        session.value = currentSession
      }

      supabase.auth.onAuthStateChange((event, newSession: Session | null) => {
        if (newSession) {
          user.value = newSession.user
          session.value = newSession
          // console.log("onAuthStateChange:", newSession)
        } else {
          user.value = null
          session.value = null
          // console.log("onAuthStateChange:", "sessionがnullになりました。")
        }
      })
    } catch (error) {
      console.error('認証の初期化エラー', error)
    } finally {
      loading.value = false
      console.log("session", session.value)
      console.log("isAuthenticated", isAuthenticated.value)
    }
  }
  return {
    user,
    session,
    loading,
    isAuthenticated,
    login,
    logout,
    initialize,
  }
})
