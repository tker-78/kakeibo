<script setup lang="ts">
import {ref, onMounted, createApp} from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// onMounted( async () => {
//   await authStore.initialize()
// })

onMounted( ()  =>  {
  authStore.initialize()
})

</script>


<template>
  <v-app id="kakeibo">
    <v-navigation-drawer
      class="pt-4"
      color="grey-lighten-3"
      model-value
      rail
    >
      <v-avatar
        v-for="n in 6"
        :key="n"
        :color="`grey-${n === 1 ? 'darken' : 'lighten'}-1`"
        :size="n === 1 ? 36 : 20"
        class="d-block text-center mx-auto mb-9"
      ></v-avatar>
    </v-navigation-drawer>

    <v-main>
        <router-view></router-view>
    </v-main>

  </v-app>
</template>


<style scoped>

#kakeibo {
  margin-top: 100px;

}
</style>
