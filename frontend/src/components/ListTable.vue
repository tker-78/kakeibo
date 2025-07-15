<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useTypeStore } from '@/stores/type'

interface Column {
  label: string,
  key: string,
}

const typeStore = useTypeStore()

const props = defineProps<{
  columns: Column[],
  items: Record<string, any>[],
}>()

const emit = defineEmits(["deleted"])

// console.log(props.items)

const showDialog = ref(false)
const targetId = ref<number>(0)

const confirmDelete = async () => {
  await deleteItem()
  showDialog.value = false
}

const getTargetId = (id: number) => {
  targetId.value = id
  console.log(targetId.value)
}

const deleteItem = async () => {
  if (targetId.value === null) return
  const { data, error } = await supabase.from(typeStore.type).delete().eq('id', targetId.value).select()
  if (error) {
    console.log('error:', error)
  } else {
    // success
    console.log('data:', data)
    emit("deleted")
  }
}


</script>

<template>
  <v-dialog v-model="showDialog" max-width="400px">
    <v-card>
      <v-card-title>確認</v-card-title>
      <v-card-text>
        このレコードを削除しますか？<br>
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
          <v-btn color="error" class="success d-flex justify-center" @click="showDialog = true, getTargetId(item.id)">削除</v-btn>
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
