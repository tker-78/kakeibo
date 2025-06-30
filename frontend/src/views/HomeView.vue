<script setup lang="ts" xmlns:v-="http://www.w3.org/1999/html">
// import TheWelcome from '../components/TheWelcome.vue'
import TopPage from '@/components/TopPage.vue'
</script>

<template>
  <v-app-bar rounded>
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Kakeibo</v-app-bar-title>
    <div>
      <v-btn
        id="login_btn"
        variant="outlined"
        color="success"
        class="ma-4"
      >
        <router-link to="/login">Login and Go to Dashboard</router-link>
      </v-btn>
    </div>
  </v-app-bar>
  <v-main class="d-flex align-center justify-center">
    <v-container>
      <TopPage />
    </v-container>
  </v-main>
</template>

<style scoped >
#main {
  margin: 30px 30px 30px 30px;
}

</style>
