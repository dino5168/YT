<template>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">XTableEdit 測試頁</h1>
      <XTableEdit
        :rows="tableData"
        :columns="columns"
        :columnDescriptions="columnDescriptions"
        :requiredFields="['name', 'code']"
        @update:rows="updateTableData"
        @delete-row="handleDeleteRow"
        @row-click="handleRowClick"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import XTableEdit from '~/components/Table/XTableEdit.vue'
  
  const columns = ['category_id', 'name', 'code', 'is_active']
  const columnDescriptions = ['ID', '名稱', '代碼', '啟用']
  
  const tableData = ref([
    { category_id: 1, name: '分類A', code: 'A001', is_active: '是' },
    { category_id: 2, name: '分類B', code: 'B001', is_active: '否' },
    { category_id: 3, name: '分類C', code: 'C001', is_active: '是' },
  ])
  
  function updateTableData(newRows) {
    tableData.value = newRows
  }
  
  function handleDeleteRow(row) {
    tableData.value = tableData.value.filter(r => r.category_id !== row.category_id)
  }
  
  function handleRowClick(row) {
    console.log('點擊列:', row)
  }
  </script>
  