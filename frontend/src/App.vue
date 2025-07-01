<script setup lang="ts">
import {ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

interface MenuItem {
  title: string,
  icon?: string,
  to: string,
}

const menuItems = ref<MenuItem[]>([])

menuItems.value = [
  {
    title: 'サマリー',
    to: '/dashboard',
  },
  {
    title: '支出分析',
    to: '/expenses',
  },
  {
    title: '収入分析',
    to: '/incomes',
  },
  {
    title: '予算管理',
    to: '/budgets',
  }
]

onMounted( ()  =>  {
  authStore.initialize()
})

</script>


<template>
  <v-app>
    <v-navigation-drawer
      class="pt-4"
      color="grey-lighten-3"
      model-value
    >
<!--      <v-avatar-->
<!--        v-for="n in 6"-->
<!--        :key="n"-->
<!--        :color="`grey-${n === 1 ? 'darken' : 'lighten'}-1`"-->
<!--        :size="n === 1 ? 36 : 20"-->
<!--        class="d-block text-center mx-auto mb-9"-->
<!--      ></v-avatar>-->
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :title="item.title"
          :to="item.to"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div class="d-inline pa-4">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>


<style scoped>

</style>
