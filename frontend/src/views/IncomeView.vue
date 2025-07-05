<script setup lang="ts">
import { useHeaderStore } from '@/stores/header';
import { onMounted } from 'vue';
import RegisterIncome from '@/components/RegisterIncome.vue'
import IncomeGraph from '@/components/IncomeGraph.vue'



const headerStore = useHeaderStore();

onMounted(() => {
  headerStore.setTitle('収入分析')
})

</script>

<template>
  <v-container>
    <IncomeGraph></IncomeGraph>
    <RegisterIncome></RegisterIncome>

  </v-container>
</template>

<style scoped>

</style>
