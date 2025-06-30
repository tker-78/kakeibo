<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();

const router = useRouter();

const logout = async () => {
  await authStore.logout()
  await router.push('/')
}

</script>

<template>
  <v-app-bar rounded>
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Dashboard</v-app-bar-title>
    <div>
      <v-btn
        variant="outlined"
        color="red"
        class="ma-2"
        @click="logout"
      >logout</v-btn>
    </div>
  </v-app-bar>

</template>

<style scoped>

</style>
