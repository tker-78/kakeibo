<script setup lang="ts" xmlns:v-="http://www.w3.org/1999/html">
// import TheWelcome from '../components/TheWelcome.vue'
import TopPage from '@/components/TopPage.vue'
</script>

<template>
  <v-app-bar>
    <v-app-bar-title>Kakeibo</v-app-bar-title>
  </v-app-bar>
  <v-main>
    <v-container>
      <TopPage />
      <v-container class="d-flex flex-column w-75">
        <v-btn id="login_btn">
          <router-link to="/login">Login and Go to dashboard</router-link>
        </v-btn>
        <v-btn id="signup_btn">
          <router-link to="signup">Signup</router-link>
        </v-btn>
      </v-container>
    </v-container>
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
