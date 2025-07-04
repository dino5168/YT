<template>
    <div class="p-4">


        <!-- 查詢區塊 -->
        <div class="mb-4 p-4 bg-gray-50 rounded-lg">

            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormInput v-for="col in searchableColumns" :key="col" v-model="searchForm[col]"
                    :label="getColumnDescription(col)" />

            </div>
            <div class="mt-3 flex gap-2">
                <ButtonBlue @click="searchData">查詢</ButtonBlue>
                <ButtonGray @click="resetSearch">重置</ButtonGray>
                <ButtonGreen @click="openAddModal">新增資料</ButtonGreen>
            </div>
        </div>


        <!-- 表格 -->
        <XTable :rows="filteredTableData" :columns="columns" :column-descriptions="columnDescriptions"
            @row-click="onRowClick">
            <!-- 自訂欄位顯示 -->

            <!-- 操作欄位 -->
            <template #cell-actions="{ row }">
                <div class="flex gap-2">
                    <ButtonYellow @click.stop="editRow(row)">修改</ButtonYellow>
                    <ButtonRed @click.stop="deleteRow(row)">刪除</ButtonRed>
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
                    <FormInput v-for="col in editableColumns" :key="col" v-model="formData[col]"
                        :label="getColumnDescription(col)" />
                </div>
                <div class="mt-6 flex gap-2 justify-end">
                    <ButtonGray @click="closeModal"> 取消</ButtonGray>
                    <ButtonBlue @click="submitForm">{{ isEditing ? '更新' : '新增' }}</ButtonBlue>
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
                    <ButtonGray @click="closeDeleteModal">取消</ButtonGray>
                    <ButtonRed @click="confirmDelete">確認刪除</ButtonRed>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import XTable from '~/components/Table/XTable.vue'
import { useToast } from '@/composables/useToast' // ✅ 確保此檔案存在
import FormInput from '~/components/Form/FormInput.vue'
import { ButtonBlue, ButtonGray, ButtonGreen, ButtonYellow, ButtonRed } from '~/components/Buttons'
const { showToast } = useToast()


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

                showToast('更新成功', "success")
            } else {
                showToast('更新失敗：' + (result.error || '未知錯誤'), "error")

            }
        } else {
            // 新增資料


            const result = await useApi(insertUrl, {
                method: 'POST',
                body: payload
            })

            if (!result.error) {
                // 新增成功後重新載入資料
                await loadData()
                closeModal()
                showToast('新增成功', "success")


            } else {
                showToast('新增失敗：' + (result.error || '未知錯誤'), "error")

            }
        }
    } catch (error) {
        console.error('提交失敗:', error)

        showToast('提交失敗', "error")
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

            showToast('刪除成功')
        } else {
            showToast('刪除失敗：' + (result.error || '未知錯誤'))

        }
    } catch (error) {
        console.error('刪除失敗:', error)

        showToast('刪除失敗')
    }
}

// 點擊表格列
const onRowClick = (row: any) => {
    // 可以在這裡添加詳細查看邏輯
    console.log('點擊了行:', row)
}
</script>