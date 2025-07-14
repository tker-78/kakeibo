<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'

interface Column {
  label: string,
  key: string,
}

const props = defineProps<{
  columns: Column[],
  items: Record<string, any>[],
}>()

// console.log(props.items)

const showDialog = ref(false)

const confirmDelete = async () => {
  console.log('削除しました')
  showDialog.value = false
}


</script>

<template>
  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title>確認</v-card-title>
      <v-card-text>
        このレコードを削除しますか？</br>
        この操作は取り消せません。
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="showDialog = false">キャンセル</v-btn>
        <v-btn color="error" @click="confirmDelete">削除</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-table class="table-list">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        <th>削除</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td v-for="col in columns" :key="col.key">{{ item[col.key]}}</td>
        <td>
          <v-btn color="error" class="success d-flex justify-center" @click="showDialog = true">削除</v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>

</template>

<style scoped>
.table-list {
  margin: 100px 100px;
}

</style>
