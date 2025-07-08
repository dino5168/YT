<!-- testXTableEdit.vue -->
<template>
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">XTableEdit 重構版測試頁</h1>
      
      <!-- 測試資料統計 -->
      <div class="mb-4 p-4 bg-gray-100 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">資料統計</h2>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>總筆數: {{ tableData.length }}</div>
          <div>啟用: {{ activeCount }}</div>
          <div>停用: {{ inactiveCount }}</div>
        </div>
      </div>
  
      <!-- 主要表格 -->
      <XTableEdit
        v-model:rows="tableData"
        :columns="columns"
        :column-descriptions="columnDescriptions"
        :column-widths="columnWidths"
        :required-fields="['name', 'code']"
        :page-size="8"
        @delete-row="handleDeleteRow"
        @row-click="handleRowClick"
      />
  
      <!-- 操作記錄 -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">操作記錄</h2>
        <div class="max-h-32 overflow-y-auto">
          <div v-for="(log, index) in operationLogs" :key="index" class="text-sm text-gray-700 mb-1">
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import XTableEdit from '~/components/organisms/XTableEdit.vue'
  
  const columns = ['category_id', 'name', 'code', 'is_active', 'description', 'created_at']
  const columnDescriptions = ['類別ID', '名稱', '代碼', '啟用狀態', '描述', '建立時間']
  const columnWidths = {
    category_id: '80px',
    name: '150px',
    code: '120px',
    is_active: '100px',
    description: '200px',
    created_at: '120px'
  }
  
  const tableData = ref([
    { category_id: 1, name: '分類A', code: 'A001', is_active: '是' },
    { category_id: 2, name: '分類B', code: 'B001', is_active: '否' },
    { category_id: 3, name: '分類C', code: 'C001', is_active: '是' },
  ])
  </script>