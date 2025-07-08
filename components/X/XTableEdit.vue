<!-- components/organisms/XTableEdit.vue -->
<template>
    <div class="w-full">
      <table class="table-auto w-full text-sm text-left text-gray-900 font-bold border border-gray-600 mt-4">
        <thead>
          <tr>
            <XTableHeader
              v-for="(desc, i) in columnDescriptions"
              :key="i"
              :column-name="columns[i]"
              :description="desc"
              :width="columnWidths && columnWidths[columns[i]] ? columnWidths[columns[i]] : ''"
              :is-hidden="isHiddenColumn(columns[i])"
              :is-id-column="isIdColumn(columns[i])"
              :sortable="true"
              :sort-column="sortColumn"
              :sort-direction="sortDirection"
              @sort="handleSort"
            />
            <th class="px-4 py-2 border border-gray-600 bg-gray-200 text-gray-950">操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- 新增資料列 - 移至最上方 -->
          <XTableRow
            v-if="addingNew"
            :row-data="newRow"
            :columns="columns"
            :is-new="true"
            :hidden-columns="hiddenColumns"
            :errors="errors"
            @update:row-data="updateNewRow"
            @add="confirmAdd"
            @cancel="cancelAdd"
          />
          
          <!-- 既有資料列 -->
          <XTableRow
            v-for="(row, rowIndex) in sortedCurrentPageRows"
            :key="getRowKey(row, rowIndex)"
            :row-data="editingRow === rowIndex ? editableRow : row"
            :columns="columns"
            :is-editing="editingRow === rowIndex"
            :disabled="editingRow !== null && editingRow !== rowIndex || addingNew"
            :hidden-columns="hiddenColumns"
            :errors="errors"
            @update:row-data="updateEditableRow"
            @save="saveRow(rowIndex)"
            @cancel="cancelEdit"
            @edit="startEdit(rowIndex)"
            @delete="deleteRow(rowIndex)"
          />
        </tbody>
      </table>
  
      <div class="mt-4 flex justify-between items-center">
        <XButton
          variant="primary"
          :disabled="editingRow !== null || addingNew"
          @click="startAdd"
        >
          新增資料
        </XButton>
        
        <XPagination
          v-model:current-page="currentPage"
          :total="sortedRows.length"
          :page-size="pageSize"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, reactive, toRaw, watch } from 'vue'
  import XButton from '../atoms/XButton.vue'
  import XTableHeader from '../molecules/XTableHeader.vue'
  import XTableRow from '../molecules/XTableRow.vue'
  import XPagination from '../molecules/XPagination.vue'
  
  interface Props {
    rows: any[]
    columns: string[]
    columnDescriptions: string[]
    columnWidths?: Record<string, string>
    pageSize?: number
    requiredFields?: string[]
    hiddenColumns?: string[]
  }
  
  const props = withDefaults(defineProps<Props>(), {
    pageSize: 10,
    requiredFields: () => [],
    hiddenColumns: () => ['id', '_id']
  })
  
  const emit = defineEmits<{
    'update:rows': [rows: any[]]
    'row-click': [row: any]
    'delete-row': [row: any]
  }>()
  
  // 分頁相關
  const currentPage = ref(1)
  const pageSize = ref(props.pageSize)
  
  // 排序相關
  const sortColumn = ref('')
  const sortDirection = ref<'asc' | 'desc'>('asc')
  
  // 排序後的資料
  const sortedRows = computed(() => {
    if (!sortColumn.value) return props.rows
    
    const sorted = [...props.rows].sort((a, b) => {
      const aVal = a[sortColumn.value]
      const bVal = b[sortColumn.value]
      
      // 處理空值
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      
      // 數字比較
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      // 字串比較
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      
      if (aStr < bStr) return sortDirection.value === 'asc' ? -1 : 1
      if (aStr > bStr) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
    
    return sorted
  })
  
  // 當前頁面的資料
  const sortedCurrentPageRows = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return sortedRows.value.slice(start, start + pageSize.value)
  })
  
  // 編輯相關
  const editingRow = ref<number | null>(null)
  const addingNew = ref(false)
  const editableRow = reactive({})
  const newRow = reactive({})
  const errors = reactive<Record<string, string>>({})
  
  // 工具函數
  function isHiddenColumn(col: string) {
    return props.hiddenColumns.includes(col)
  }
  
  function isIdColumn(col: string) {
    return col === 'id' || col === '_id'
  }
  
  function getRowKey(row: any, index: number) {
    return row.id || row._id || `row-${index}`
  }
  
  // 排序處理
  function handleSort(column: string, direction: 'asc' | 'desc') {
    sortColumn.value = column
    sortDirection.value = direction
    currentPage.value = 1 // 排序後回到第一頁
  }
  
  // 驗證函數
  function validateRow(row: Record<string, any>) {
    let valid = true
    errorsClear()
    
    props.requiredFields.forEach(field => {
      if (!row[field] || String(row[field]).trim() === '') {
        errors[field] = '此欄位為必填'
        valid = false
      }
    })
    
    return valid
  }
  
  function errorsClear() {
    Object.keys(errors).forEach(k => delete errors[k])
  }
  
  // 編輯功能
  function startEdit(index: number) {
    if (addingNew.value || editingRow.value !== null) return
    
    const actualIndex = props.rows.findIndex(row => 
      getRowKey(row, -1) === getRowKey(sortedCurrentPageRows.value[index], -1)
    )
    
    editingRow.value = actualIndex
    Object.assign(editableRow, toRaw(props.rows[actualIndex]))
    errorsClear()
  }
  
  function cancelEdit() {
    editingRow.value = null
    Object.keys(editableRow).forEach(k => delete editableRow[k])
    errorsClear()
  }
  
  function updateEditableRow(data: Record<string, any>) {
    Object.assign(editableRow, data)
  }
  
  function saveRow(index: number) {
    if (!validateRow(editableRow)) return
    
    const actualIndex = props.rows.findIndex(row => 
      getRowKey(row, -1) === getRowKey(sortedCurrentPageRows.value[index], -1)
    )
    
    const newRows = [...props.rows]
    newRows[actualIndex] = { ...toRaw(editableRow) }
    emit('update:rows', newRows)
    editingRow.value = null
    Object.keys(editableRow).forEach(k => delete editableRow[k])
  }
  
  function deleteRow(index: number) {
    if (editingRow.value !== null || addingNew.value) return
    
    const rowToDelete = sortedCurrentPageRows.value[index]
    emit('delete-row', rowToDelete)
  }
  
  // 新增功能
  function startAdd() {
    if (editingRow.value !== null || addingNew.value) return
    
    addingNew.value = true
    
    // 初始化新資料列，ID 欄位不可編輯
    props.columns.forEach(col => {
      if (isIdColumn(col)) {
        newRow[col] = '' // ID 欄位設為空，由後端產生
      } else {
        newRow[col] = ''
      }
    })
    
    errorsClear()
  }
  
  function cancelAdd() {
    addingNew.value = false
    Object.keys(newRow).forEach(k => delete newRow[k])
    errorsClear()
  }
  
  function updateNewRow(data: Record<string, any>) {
    Object.assign(newRow, data)
  }
  
  function confirmAdd() {
    if (!validateRow(newRow)) return
    
    const newData = { ...toRaw(newRow) }
    
    // 如果有 ID 欄位但為空，生成一個臨時 ID
    const idColumn = props.columns.find(col => isIdColumn(col))
    if (idColumn && !newData[idColumn]) {
      newData[idColumn] = Date.now() // 臨時 ID，實際應由後端產生
    }
    
    emit('update:rows', [newData, ...props.rows]) // 新增到最前面
    cancelAdd()
  }
  
  // 監聽資料變化，調整分頁
  watch(() => props.rows, () => {
    const totalPages = Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value))
    if (currentPage.value > totalPages) {
      currentPage.value = totalPages
    }
  })
  
  // 監聽分頁大小變化
  watch(() => props.pageSize, (newSize) => {
    pageSize.value = newSize
    currentPage.value = 1
  })
  </script>