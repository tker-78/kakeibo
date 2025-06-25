<script setup lang="ts" xmlns:v-="http://www.w3.org/1999/html">
// import TheWelcome from '../components/TheWelcome.vue'
import TopPage from '@/components/TopPage.vue'
</script>

<template>
  <v-main>
    <v-btn id="login_btn">
      <router-link to="/login">Login</router-link>
    </v-btn>
    <TopPage />
  </v-main>
</template>

<style scoped >
#main {
  margin: 30px 30px 30px 30px;
}

#login_btn {
  margin-bottom: 30px;

}

</style>
