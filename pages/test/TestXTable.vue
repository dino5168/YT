<template>
    <div class="p-4">
        <!-- 搜尋區域 -->
        <div class="mb-4 bg-gray-100 p-4 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- 代碼搜尋 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">代碼搜尋</label>
                    <input v-model="searchFilters.code" type="text" placeholder="輸入代碼關鍵字..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- 類別篩選 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">類別篩選</label>
                    <select v-model="searchFilters.category"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">全部類別</option>
                        <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
                            {{ cat }}
                        </option>
                    </select>
                </div>

                <!-- 名稱搜尋 -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">名稱搜尋</label>
                    <input v-model="searchFilters.name" type="text" placeholder="輸入名稱關鍵字..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>

            <!-- 搜尋按鈕和重置按鈕 -->
            <div class="mt-4 flex space-x-2">
                <button @click="applyFilters"
                    class="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    搜尋
                </button>
                <button @click="resetFilters"
                    class="px-2 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                    重置
                </button>
            </div>

            <!-- 搜尋結果統計 -->
            <div v-if="isFiltered" class="mt-2 text-sm text-gray-600">
                搜尋結果：{{ filteredData.length }} 筆資料 (共 {{ data.length }} 筆)
            </div>
        </div>

        <!-- 批量操作按鈕 -->
        <div v-if="selectedRows.length > 0" class="mb-4 flex space-x-2">
            <button @click="handleBatchDelete" class="px-2 py-1 bg-red-600 text-sm text-white rounded hover:bg-red-700">
                批量刪除 ({{ selectedRows.length }})
            </button>
            <button @click="clearSelection" class="px-2 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                取消選擇
            </button>
        </div>

        <XTable :rows="filteredData"
            :columns="['checkbox', 'id', 'name', 'code', 'category', 'description', 'is_active', 'actions']"
            :column-descriptions="['', 'ID', '名稱', '代碼', '類別', '描述', '狀態', '操作']" :column-widths="{
                checkbox: '50px',
                name: '100px',
                code: '180px',
                category: '80px',
                description: '200px',
                is_active: '80px',
                actions: '120px'
            }" @row-click="handleRowClick">

            <!-- 自定義 checkbox 欄位渲染 -->
            <template #cell-checkbox="{ row }">
                <input type="checkbox" :checked="isRowSelected(row.id)" @change="toggleRowSelection(row.id)" @click.stop
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
            </template>

            <!-- 自定義狀態欄位渲染 -->
            <template #cell-is_active="{ value }">
                <span :class="value ? 'text-green-500' : 'text-red-500'">
                    {{ value ? '啟用' : '停用' }}
                </span>
            </template>

            <!-- 自定義描述欄位渲染 -->
            <template #cell-description="{ value }">
                <span class="text-gray-600 text-sm" :title="value">
                    {{ value?.length > 30 ? value.substring(0, 30) + '...' : value }}
                </span>
            </template>

            <!-- 自定義操作欄位渲染 -->
            <template #cell-actions="{ row }">
                <div class="flex space-x-2">
                    <button @click.stop="handleEdit(row)"
                        class="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                        修改
                    </button>
                    <button @click.stop="handleDelete(row)"
                        class="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                        刪除
                    </button>
                </div>
            </template>
        </XTable>
    </div>
</template>

<script setup lang="ts">
import XTable from '~/components/Table/XTable.vue'
import type { Code } from '~/types/Code'
import { onMounted, ref, computed } from 'vue'

const data = ref<any[]>([])
const selectedRows = ref<number[]>([]) // 存儲選中的行 ID

// 搜尋篩選條件
const searchFilters = ref({
    code: '',
    category: '',
    name: ''
})

// 計算唯一的類別選項
const uniqueCategories = computed(() => {
    const categories = data.value.map(item => item.category).filter(Boolean)
    return [...new Set(categories)].sort()
})

// 檢查是否有啟用篩選
const isFiltered = computed(() => {
    return searchFilters.value.code.trim() !== '' ||
        searchFilters.value.category !== '' ||
        searchFilters.value.name.trim() !== ''
})

// 過濾後的資料
const filteredData = computed(() => {
    let result = [...data.value]

    // 代碼篩選
    if (searchFilters.value.code.trim()) {
        const codeKeyword = searchFilters.value.code.trim().toLowerCase()
        result = result.filter(item =>
            item.code?.toLowerCase().includes(codeKeyword)
        )
    }

    // 類別篩選
    if (searchFilters.value.category) {
        result = result.filter(item =>
            item.category === searchFilters.value.category
        )
    }

    // 名稱篩選
    if (searchFilters.value.name.trim()) {
        const nameKeyword = searchFilters.value.name.trim().toLowerCase()
        result = result.filter(item =>
            item.name?.toLowerCase().includes(nameKeyword)
        )
    }

    return result
})

onMounted(async () => {
    const result = await useApi('http://localhost:8000/DatabaseOp/code')
    data.value = result.data || []
    console.log(data.value)
})

// 應用篩選
const applyFilters = () => {
    // 篩選會自動透過 computed 屬性生效
    // 清除選擇狀態
    selectedRows.value = []
    console.log('應用篩選條件：', searchFilters.value)
}

// 重置篩選
const resetFilters = () => {
    searchFilters.value = {
        code: '',
        category: '',
        name: ''
    }
    selectedRows.value = []
    console.log('重置篩選條件')
}

const handleRowClick = (row: any) => {
    // 點擊行時不執行任何操作，避免與 checkbox 衝突
    // console.log('點擊的列：', row)
}

// 檢查行是否被選中
const isRowSelected = (id: number) => {
    return selectedRows.value.includes(id)
}

// 切換行選擇狀態
const toggleRowSelection = (id: number) => {
    const index = selectedRows.value.indexOf(id)
    if (index > -1) {
        selectedRows.value.splice(index, 1)
    } else {
        selectedRows.value.push(id)
    }
}

// 清除所有選擇
const clearSelection = () => {
    selectedRows.value = []
}

// 處理編輯
const handleEdit = (row: any) => {
    console.log('編輯行：', row)
    // 這裡可以添加編輯邏輯，例如：
    // - 打開編輯對話框
    // - 導航到編輯頁面
    // - 填充編輯表單等
}

// 處理單個刪除
const handleDelete = async (row: any) => {
    if (confirm(`確定要刪除「${row.name}」嗎？`)) {
        try {
            // 調用刪除 API
            await useApi(`http://localhost:8000/DatabaseOp/code/${row.id}`, {
                method: 'DELETE'
            })

            // 從本地數據中移除
            const index = data.value.findIndex(item => item.id === row.id)
            if (index > -1) {
                data.value.splice(index, 1)
            }

            // 從選中列表中移除
            const selectedIndex = selectedRows.value.indexOf(row.id)
            if (selectedIndex > -1) {
                selectedRows.value.splice(selectedIndex, 1)
            }

            console.log('刪除成功：', row)
        } catch (error) {
            console.error('刪除失敗：', error)
            alert('刪除失敗，請稍後再試')
        }
    }
}

// 處理批量刪除
const handleBatchDelete = async () => {
    if (selectedRows.value.length === 0) return

    if (confirm(`確定要刪除選中的 ${selectedRows.value.length} 筆資料嗎？`)) {
        try {
            // 批量刪除 API 調用
            const deletePromises = selectedRows.value.map(id =>
                useApi(`http://localhost:8000/DatabaseOp/code/${id}`, {
                    method: 'DELETE'
                })
            )

            await Promise.all(deletePromises)

            // 從本地數據中移除已刪除的項目
            data.value = data.value.filter(item => !selectedRows.value.includes(item.id))

            // 清除選擇
            clearSelection()

            console.log('批量刪除成功')
        } catch (error) {
            console.error('批量刪除失敗：', error)
            alert('批量刪除失敗，請稍後再試')
        }
    }
}
</script>