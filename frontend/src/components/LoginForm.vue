<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('' );
const password = ref('' );

const emailErrors = ref<string[]>([]);
const passwordErrors = ref<string[]>([]);

  const login = async () => {
    const { data, error } = await authStore.login(
      email.value,
      password.value,
    );
    console.log(data, error)
    if (error) {
      // something went wrong
      passwordErrors.value.push('ログインに失敗しました。もう一度試してください。');
    } else {
      // success
      console.log('isAuthenticated:', authStore.isAuthenticated)
      await router.push('/dashboard')
    }
  }


</script>

<template>
  <v-container fluid class="mx-auto" width="600">
    <v-row justify="center" align="center">
      <v-col>
        <v-card>
          <v-card-title class="text-center">
            <v-icon large color="primary" class="mr-2">mdi-account</v-icon>
            ログイン
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent>
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="メールアドレス"
                prepend-icon="mdi-email"
                type="email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                label="パスワード"
                prepend-icon="mdi-lock"
                :type='password'
                required
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                block
                large
                @click="login"
              >
                ログイン
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>




</template>

<style scoped>

</style>
