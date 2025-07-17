<script setup lang="ts">
import { useDateStore } from '@/stores/date'
import { ref, onMounted } from 'vue'

const dateStore = useDateStore()

const month = ref<number>(0)

const setMonth = (month: number) => {
  dateStore.setMonth(month)
  console.log(dateStore.date)
}

onMounted(() => {
  console.log(dateStore.date)
})


</script>

<template>
  <v-pagination
    v-model="month"
    :length="12"
    @click="setMonth(month)"
  ></v-pagination>
</template>

<style scoped>

</style>
