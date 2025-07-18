<script setup lang="ts">
import {ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useHeaderStore } from '@/stores/header.ts'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const headerStore = useHeaderStore()
const router = useRouter()
const drawer = ref(true)

interface MenuItem {
  title: string,
  icon?: string,
  to: string,
  type?: 'income' | 'expense'
}

const menuItems = ref<MenuItem[]>([])

menuItems.value = [
  {
    title: 'サマリー',
    icon: 'mdi-monitor-dashboard',
    to: '/dashboard',
  },
  {
    title: '支出分析',
    icon: 'mdi-cash-off',
    to: '/expenses',
  },
  {
    title: '収入分析',
    icon: 'mdi-cash-multiple',
    to: '/incomes',
  },
  {
    title: '予算管理',
    icon: 'mdi-piggy-bank-outline',
    to: '/budgets',
  }
]

const logout = async () => {
  await authStore.logout()
  await router.push('/')
}


onMounted( ()  =>  {
  authStore.initialize()
})

</script>


<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      class="pt-4"
      color="grey-lighten-3"
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :title="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

      <!--header -->
      <v-app-bar>
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>{{ headerStore.title }}</v-app-bar-title>
        <div>
          <v-btn
            variant="outlined"
            color="red"
            @click="logout"
            class="ma-4"
          >logout</v-btn>
        </div>
      </v-app-bar>
    <!-- main content -->
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>


<style scoped>
.v-application {
  max-width: 100vw;
}


</style>
