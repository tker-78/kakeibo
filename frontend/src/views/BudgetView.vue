<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useHeaderStore } from '@/stores/header';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const headerStore = useHeaderStore();

const router = useRouter();


const logout = async () => {
  await authStore.logout()
  await router.push('/')
}

onMounted(() => {
  headerStore.setTitle('予算管理')
})

</script>

<template>
</template>

<style scoped>

</style>
