<script setup lang="ts" xmlns:v-="http://www.w3.org/1999/html">
// import TheWelcome from '../components/TheWelcome.vue'
import TopPage from '@/components/TopPage.vue'
</script>

<template>
  <v-container>
    <TopPage />
  </v-container>
  <v-container class="d-flex flex-column w-100">
    <v-btn id="login_btn">
      <router-link to="/login">Login</router-link>
    </v-btn>
    <v-btn id="signup_btn">
      <router-link to="signup">Signup</router-link>
    </v-btn>
  </v-container>
</template>

<style scoped >
#login_btn {
  margin-bottom: 30px;

}

</style>
