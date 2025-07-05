<script setup lang="ts">
import { useHeaderStore } from '@/stores/header';
import { onMounted } from 'vue';
import RegisterIncome from '@/components/RegisterIncome.vue'



const headerStore = useHeaderStore();

onMounted(() => {
  headerStore.setTitle('収入分析')
})

</script>

<template>
  <v-container>
    <RegisterIncome></RegisterIncome>

  </v-container>
</template>

<style scoped>

</style>
