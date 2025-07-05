<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useHeaderStore } from '@/stores/header';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const headerStore = useHeaderStore();


onMounted(() => {
  headerStore.setTitle('支出分析')
})

</script>

<template>
</template>

<style scoped>

</style>
