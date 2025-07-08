<template>
    <div class="w-full">
      <table class="table-auto w-full text-sm text-left text-gray-900 font-bold border border-gray-600 mt-4">
        <thead class="bg-gray-200 text-gray-950">
          <tr>
            <th
              v-for="(desc, i) in columnDescriptions"
              :key="i"
              :class="[
                'px-4 py-2 border border-gray-600',
                isHiddenColumn(columns[i]) ? 'hidden' : '',
                'select-none cursor-pointer hover:bg-gray-300'
              ]"
              @click="handleSort(columns[i])"
              :style="columnWidths && columnWidths[columns[i]] ? `width: ${columnWidths[columns[i]]}` : ''"
            >
              <div class="flex items-center justify-between">
                <span :class="!isIdColumn(columns[i]) && desc ? 'italic text-blue-800' : ''">
                  {{ desc || '（無描述）' }}
                </span>
                <span v-if="!isIdColumn(columns[i])">
                  <span v-if="sortColumn === columns[i] && sortDirection === 'asc'">▲</span>
                  <span v-else-if="sortColumn === columns[i] && sortDirection === 'desc'">▼</span>
                  <span v-else class="text-gray-400">▼</span>
                </span>
              </div>
            </th>
            <th class="px-4 py-2 border border-gray-600">操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- 既有資料列 -->
          <tr
            v-for="(row, rowIndex) in currentPageRows"
            :key="rowIndex"
            :class="['border-t border-gray-700', editingRow === rowIndex ? 'bg-yellow-100' : 'hover:bg-gray-200']"
          >
            <td
              v-for="(col, colIndex) in columns"
              :key="colIndex"
              :class="[isHiddenColumn(col) ? 'hidden' : '', 'px-4 py-2 border border-gray-600']"
            >
              <!-- 編輯模式輸入框 -->
              <template v-if="editingRow === rowIndex && !isIdColumn(col)">
                <input
                  v-model="editableRow[col]"
                  type="text"
                  class="w-full border border-gray-400 rounded px-2 py-1 text-sm"
                />
                <div v-if="errors[col]" class="text-red-600 text-xs mt-1">{{ errors[col] }}</div>
              </template>
              <!-- 只讀 -->
              <template v-else>
                {{ row[col] }}
              </template>
            </td>
            <td class="px-4 py-2 border border-gray-600 whitespace-nowrap">
              <template v-if="editingRow === rowIndex">
                <button
                  class="mr-2 px-2 py-1 bg-green-600 text-white rounded"
                  @click="saveRow(rowIndex)"
                >
                  儲存
                </button>
                <button class="px-2 py-1 bg-gray-400 text-white rounded" @click="cancelEdit">
                  取消
                </button>
              </template>
              <template v-else>
                <button
                  class="mr-2 px-2 py-1 bg-yellow-500 text-white rounded"
                  :disabled="editingRow !== null || addingNew"
                  @click="startEdit(rowIndex)"
                >
                  編輯
                </button>
                <button
                  class="px-2 py-1 bg-red-600 text-white rounded"
                  :disabled="editingRow !== null || addingNew"
                  @click="deleteRow(rowIndex)"
                >
                  刪除
                </button>
              </template>
            </td>
          </tr>
  
          <!-- 新增資料列 -->
          <tr v-if="addingNew" class="bg-green-50 border-t border-gray-700">
            <td
              v-for="(col, colIndex) in columns"
              :key="colIndex"
              :class="[isHiddenColumn(col) ? 'hidden' : '', 'px-4 py-2 border border-gray-600']"
            >
              <template v-if="!isIdColumn(col)">
                <input
                  v-model="newRow[col]"
                  type="text"
                  class="w-full border border-gray-400 rounded px-2 py-1 text-sm"
                  placeholder="請輸入"
                />
                <div v-if="errors[col]" class="text-red-600 text-xs mt-1">{{ errors[col] }}</div>
              </template>
              <template v-else>&nbsp;</template>
            </td>
            <td class="px-4 py-2 border border-gray-600 whitespace-nowrap">
              <button class="mr-2 px-2 py-1 bg-green-600 text-white rounded" @click="confirmAdd">新增</button>
              <button class="px-2 py-1 bg-gray-400 text-white rounded" @click="cancelAdd">取消</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div class="mt-4 flex justify-between items-center">
        <button
          class="px-3 py-1 bg-blue-600 text-white rounded"
          :disabled="editingRow !== null || addingNew"
          @click="startAdd"
        >
          新增資料
        </button>
        <div class="text-sm text-gray-900">
          顯示 {{ startRow }}-{{ endRow }} 筆，共 {{ rows.length }} 筆資料
        </div>
        <div>
          <button
            class="px-3 py-1 border rounded mx-1"
            :disabled="currentPage === 1"
            @click="goToPage(1)"
          >
            &laquo;
          </button>
          <button
            class="px-3 py-1 border rounded mx-1"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            &lsaquo;
          </button>
          <button
            v-for="page in displayedPages"
            :key="page"
            class="px-3 py-1 border rounded mx-1"
            :class="{'bg-blue-600 text-white': currentPage === page}"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            class="px-3 py-1 border rounded mx-1"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            &rsaquo;
          </button>
          <button
            class="px-3 py-1 border rounded mx-1"
            :disabled="currentPage === totalPages"
            @click="goToPage(totalPages)"
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, reactive, toRaw, watch } from 'vue'
  
  const props = defineProps({
    rows: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    columnDescriptions: {
      type: Array,
      required: true
    },
    columnWidths: {
      type: Object,
      required: false
    },
    pageSize: {
      type: Number,
      default: 10
    },
    requiredFields: {
      type: Array,
      default: () => []
    },
    hiddenColumns: {
      type: Array,
      default: () => ['id', '_id']
    }
  })
  
  const emit = defineEmits(['update:rows', 'row-click', 'delete-row'])
  
  // Pagination
  const currentPage = ref(1)
  const pageSize = ref(props.pageSize)
  
  const totalPages = computed(() => Math.max(1, Math.ceil(props.rows.length / pageSize.value)))
  const startRow = computed(() => props.rows.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1)
  const endRow = computed(() => Math.min(currentPage.value * pageSize.value, props.rows.length))
  const currentPageRows = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return props.rows.slice(start, start + pageSize.value)
  })
  
  // Sorting (optional, 也可不實作)
  
  const sortColumn = ref('')
  const sortDirection = ref('asc')
  
  function handleSort(col) {
    if (props.hiddenColumns.includes(col)) return
  
    if (sortColumn.value === col) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = col
      sortDirection.value = 'asc'
    }
    // 這裡可 emit 事件讓父元件排序
    // 但這版 XTableEdit 不做排序處理
  }
  
  // Editable / Add mode
  const editingRow = ref<number | null>(null)
  const addingNew = ref(false)
  const editableRow = reactive({})
  const newRow = reactive({})
  const errors = reactive({})
  
  function isHiddenColumn(col) {
    return props.hiddenColumns.includes(col)
  }
  
  function isIdColumn(col) {
    return col === 'id' || col === '_id'
  }
  
  // 驗證必填
  function validateRow(row) {
    let valid = true
    errorsClear()
    props.requiredFields.forEach(field => {
      if (!row[field] || row[field].toString().trim() === '') {
        errors[field] = '此欄位為必填'
        valid = false
      }
    })
    return valid
  }
  
  function errorsClear() {
    Object.keys(errors).forEach(k => delete errors[k])
  }
  
  function startEdit(index) {
    if (addingNew.value) return
    if (editingRow.value !== null) return
    editingRow.value = index
    Object.assign(editableRow, toRaw(props.rows[index]))
    errorsClear()
  }
  
  function cancelEdit() {
    editingRow.value = null
    errorsClear()
  }
  
  function saveRow(index) {
    if (!validateRow(editableRow)) return
    const newRows = [...props.rows]
    newRows[index] = { ...toRaw(editableRow) }
    emit('update:rows', newRows)
    editingRow.value = null
  }
  
  function deleteRow(index) {
    if (editingRow.value !== null || addingNew.value) return
    emit('delete-row', props.rows[index])
  }
  
  function startAdd() {
    if (editingRow.value !== null || addingNew.value) return
    addingNew.value = true
    props.columns.forEach(col => {
      if (!isIdColumn(col)) {
        newRow[col] = ''
      }
    })
    errorsClear()
  }
  
  function cancelAdd() {
    addingNew.value = false
    errorsClear()
    Object.keys(newRow).forEach(k => delete newRow[k])
  }
  
  function confirmAdd() {
    if (!validateRow(newRow)) return
    emit('update:rows', [...props.rows, { ...toRaw(newRow) }])
    cancelAdd()
  }
  
  function goToPage(page) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }
  
  watch(() => props.rows, () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  })
  
  </script>
  
  <style scoped>
  /* 你可以自行微調樣式 */
  </style>
  