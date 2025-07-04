<template>
    <div class="p-4">


        <!-- 查詢區塊 -->
        <div class="mb-4 p-4 bg-gray-50 rounded-lg">

            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div v-for="col in searchableColumns" :key="col" class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700 mb-1">{{ getColumnDescription(col) }}</label>
                    <input v-model="searchForm[col]" class="px-2 py-1 text-sm border rounded"
                        :placeholder="`搜尋 ${getColumnDescription(col)}`" @keyup.enter="searchData" />
                </div>
            </div>
            <div class="mt-3 flex gap-2">
                <button @click="searchData"
                    class="bg-blue-600 text-white px-2 py-1 text-xs rounded-sm hover:bg-blue-700">
                    查詢
                </button>
                <button @click="resetSearch"
                    class="bg-gray-600 text-xs text-white px-2 py-1 rounded-sm hover:bg-gray-700">
                    重置
                </button>
                <button @click="openAddModal"
                    class="bg-green-600 text-white px-2 py-1 text-xs rounded-sm hover:bg-green-700">
                    新增資料
                </button>
            </div>
        </div>


        <!-- 表格 -->
        <XTable :rows="filteredTableData" :columns="columns" :column-descriptions="columnDescriptions"
            @row-click="onRowClick">
            <!-- 自訂欄位顯示 -->
            <template #cell-status="{ value }">
                <span :class="value === 'ACTIVE' ? 'text-green-600' : 'text-red-600'">
                    {{ value === 'ACTIVE' ? '啟用' : '停用' }}
                </span>
            </template>

            <!-- 操作欄位 -->
            <template #cell-actions="{ row }">
                <div class="flex gap-2">
                    <button @click.stop="editRow(row)"
                        class="bg-yellow-600 text-white text-xs px-2 py-1 rounded hover:bg-yellow-700">
                        修改
                    </button>
                    <button @click.stop="deleteRow(row)"
                        class="bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700">
                        刪除
                    </button>
                </div>
            </template>
        </XTable>

        <!-- 新增/修改 Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold mb-4">
                    {{ isEditing ? '修改資料' : '新增資料' }}
                </h3>

                <div class="space-y-4">
                    <div v-for="col in editableColumns" :key="col" class="flex flex-col">
                        <label class="text-sm font-medium text-gray-700 mb-1">
                            {{ getColumnDescription(col) }}
                        </label>
                        <input v-model="formData[col]"
                            class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            :placeholder="getColumnDescription(col)" />
                    </div>
                </div>

                <div class="mt-6 flex gap-2 justify-end">
                    <button @click="closeModal"
                        class="px-2 py-1 text-xs text-gray-600 border rounded-sm hover:bg-gray-50">
                        取消
                    </button>
                    <button @click="submitForm"
                        class="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                        {{ isEditing ? '更新' : '新增' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- 刪除確認 Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
                <h3 class="text-lg font-semibold mb-4 text-red-600">確認刪除</h3>
                <p class="text-gray-700 mb-6">
                    確定要刪除這筆資料嗎？此操作無法復原。
                </p>
                <div class="flex gap-2 justify-end">
                    <button @click="closeDeleteModal"
                        class="px-2 py-1 text-xs text-gray-600 border rounded-sm hover:bg-gray-50">
                        取消
                    </button>
                    <button @click="confirmDelete"
                        class="px-2 py-1 text-xs bg-red-600 text-white rounded-sm hover:bg-red-700">
                        確認刪除
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import XTable from '~/components/Table/XTable.vue'

const baseUrl = useBaseUrl()
const apiUrl = `${baseUrl}/DBQuery/TableSchema/TABLE_SCHEMAT_COMMENT?table_name=dic_sql`
const dataUrl = `${baseUrl}/DBQuery/SELECT_DIC_SQL_ALL`
const insertUrl = `${baseUrl}/DBCreate/TABLE_INSERT/INSERT_DIC_SQL`
const updateUrl = `${baseUrl}/DBUpdate/TABLE_UPDATE/UPDATE_DIC_SQL` // 假設更新 API URL
const deleteUrl = `${baseUrl}/DBDelete/TABLE_DELETE/DELETE_DIC_SQL` // 假設刪除 API URL

const columns = ref<string[]>([])
const columnDescriptions = ref<string[]>([])
const tableData = ref<any[]>([])
const searchForm = ref<Record<string, string>>({})
const formData = ref<Record<string, string>>({})
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const editingRow = ref<any>(null)
const deleteTarget = ref<any>(null)


// 自訂欄位定義
const formFields = ref([
    { key: 'sql_key', label: 'SQL 鍵', type: 'text' },
    { key: 'sql_value', label: 'SQL 值', type: 'textarea' },
])
// 計算屬性
const editableColumns = computed(() => {
    // 排除操作欄位和可能的 ID 欄位
    return columns.value.filter(col => col !== 'actions' && col !== 'id')
})

const searchableColumns = computed(() => {
    // 可搜尋的欄位（排除操作欄位）
    return columns.value.filter(col => col !== 'actions')
})

const filteredTableData = computed(() => {
    let filtered = tableData.value

    // 根據搜尋條件過濾資料
    Object.keys(searchForm.value).forEach(key => {
        const searchValue = searchForm.value[key]?.trim()
        if (searchValue) {
            filtered = filtered.filter(row =>
                String(row[key] || '').toLowerCase().includes(searchValue.toLowerCase())
            )
        }
    })

    return filtered
})

// 取得欄位描述
const getColumnDescription = (columnName: string) => {
    const index = columns.value.indexOf(columnName)
    return columnDescriptions.value[index] || columnName
}

// 初始化
onMounted(async () => {
    await loadSchema()
    await loadData()
})

// 載入表格結構
const loadSchema = async () => {
    try {
        const result = await useApi(apiUrl)
        const meta = result?.data || []

        columns.value = meta.map((item: any) => item.column_name)
        columnDescriptions.value = meta.map((item: any) => item.comment || item.column_name)

        // 添加操作欄位
        columns.value.push('actions')
        columnDescriptions.value.push('操作')

        // 初始化搜尋表單
        resetSearchForm()
    } catch (error) {
        console.error('載入結構失敗:', error)
        alert('載入表格結構失敗')
    }
}

// 載入資料
const loadData = async () => {
    try {
        const data = await useApi(dataUrl)
        tableData.value = data?.data || []
    } catch (error) {
        console.error('載入資料失敗:', error)
        alert('載入資料失敗')
    }
}

// 重設搜尋表單
const resetSearchForm = () => {
    searchForm.value = {}
    searchableColumns.value.forEach(col => {
        searchForm.value[col] = ''
    })
}

// 重設編輯表單
const resetFormData = () => {
    formData.value = {}
    editableColumns.value.forEach(col => {
        formData.value[col] = ''
    })
}

// 查詢資料
const searchData = async () => {
    await loadData() // 重新載入資料，過濾會由 computed 自動處理
}

// 重置查詢
const resetSearch = () => {
    resetSearchForm()
}

// 開啟新增 Modal
const openAddModal = () => {
    isEditing.value = false
    resetFormData()
    showModal.value = true
}

// 編輯資料
const editRow = (row: any) => {
    isEditing.value = true
    editingRow.value = row

    // 填入現有資料
    editableColumns.value.forEach(col => {
        formData.value[col] = row[col] || ''
    })

    showModal.value = true
}

// 關閉 Modal
const closeModal = () => {
    showModal.value = false
    editingRow.value = null
    resetFormData()
}

// 提交表單
const submitForm = async () => {
    try {
        const payload = { ...formData.value }

        if (isEditing.value) {
            // 更新資料
            alert(editingRow.value.id)
            const result = await useApi(updateUrl, {
                method: 'PUT',
                body: {
                    ...payload,
                    id: editingRow.value.id // 假設有 id 欄位
                }
            })

            if (!result.error) {
                // 更新本地資料
                const index = tableData.value.findIndex(row => row.id === editingRow.value.id)
                if (index !== -1) {
                    tableData.value[index] = { ...editingRow.value, ...payload }
                }
                closeModal()
                alert('更新成功')
            } else {
                alert('更新失敗：' + (result.error || '未知錯誤'))
            }
        } else {
            // 新增資料
            alert(payload)
            console.log(payload)
            const result = await useApi(insertUrl, {
                method: 'POST',
                body: payload
            })

            if (!result.error) {
                // 新增成功後重新載入資料
                await loadData()
                closeModal()
                alert('新增成功')
            } else {
                alert('新增失敗：' + (result.error || '未知錯誤'))
            }
        }
    } catch (error) {
        console.error('提交失敗:', error)
        alert('操作失敗')
    }
}

// 刪除資料
const deleteRow = (row: any) => {
    deleteTarget.value = row
    showDeleteModal.value = true
}

// 關閉刪除確認 Modal
const closeDeleteModal = () => {
    showDeleteModal.value = false
    deleteTarget.value = null
}

// 確認刪除
const confirmDelete = async () => {
    alert(deleteTarget.value.id)
    try {
        const result = await useApi(deleteUrl, {
            method: 'DELETE',
            body: { id: deleteTarget.value.id } // 假設有 id 欄位
        })

        if (!result.error) {
            // 從本地資料中移除
            const index = tableData.value.findIndex(row => row.id === deleteTarget.value.id)
            if (index !== -1) {
                tableData.value.splice(index, 1)
            }
            closeDeleteModal()
            alert('刪除成功')
        } else {
            alert('刪除失敗：' + (result.error || '未知錯誤'))
        }
    } catch (error) {
        console.error('刪除失敗:', error)
        alert('刪除失敗')
    }
}

// 點擊表格列
const onRowClick = (row: any) => {
    // 可以在這裡添加詳細查看邏輯
    console.log('點擊了行:', row)
}
</script>