<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">使用者列表</h1>

        <!-- 使用 XTable 元件 -->
        <XTable :rows="users" :columns="columns" :column-descriptions="columnDescriptions" :column-widths="columnWidths"
            @row-click="handleRowClick">
            <!-- 頭像插槽 -->
            <template #cell-avatar_url="{ value, row }">
                <img :src="value || '/default-avatar.png'" :alt="`${row.name || 'User'} avatar`"
                    class="w-10 h-10 rounded-full object-cover" @error="handleImageError" />
            </template>

            <!-- 建立時間插槽 -->
            <template #cell-created_at="{ value }">
                {{ formatDate(value) }}
            </template>

            <!-- 更新時間插槽 -->
            <template #cell-updated_at="{ value }">
                {{ formatDate(value) }}
            </template>
        </XTable>

        <!-- 載入狀態 -->
        <div v-if="loading" class="text-center py-4">載入中...</div>

        <!-- 錯誤訊息 -->
        <div v-if="errorMessage" class="text-red-500 text-center py-4">{{ errorMessage }}</div>

        <!-- 空狀態 -->
        <div v-if="!loading && users.length === 0 && !errorMessage" class="text-center py-8 text-gray-500">
            <p>目前沒有使用者資料</p>
            <button @click="fetchUsers" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                重新載入
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import XTable from '~/components/Table/XTable.vue' // 根據實際路徑調整
import { useBaseUrl } from '#imports'

const baseUrl = useBaseUrl()

interface User {
    id: number
    email: string
    name: string
    avatar_url: string
    google_id: string
    created_at: string
    updated_at: string
}

// 資料狀態
const users = ref<User[]>([])
const loading = ref(false)
const errorMessage = ref('')

// 欄位設定
const columns = [
    'email',
    'name',
    'avatar_url',
    'google_id',
    'created_at',
    'updated_at',
    'id',
]
const columnDescriptions = [
    '信箱',
    '名稱',
    '頭像',
    'Google ID',
    '建立時間',
    '更新時間',
    'ID',
]
const columnWidths = {
    email: '200px',
    name: '160px',
    avatar_url: '80px',
    google_id: '160px',
    created_at: '160px',
    updated_at: '160px',
    id: '80px',
}

// 資料取得 http://localhost:8000/DBQuery/SELECT_USERS_ALL
const fetchUsers = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        const token = useCookie('auth_token').value
        const { data, error } = await useApi<User[]>(`${baseUrl}/DBQuery/SELECT_USERS_ALL`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache',
            },
        })

        if (!error && Array.isArray(data)) {
            users.value = data
        } else {
            errorMessage.value = error as string
        }
    } catch (err) {
        errorMessage.value = `載入資料失敗: ${err instanceof Error ? err.message : '未知錯誤'
            }`
    } finally {
        loading.value = false
    }
}

onMounted(fetchUsers)

// 處理日期格式
const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleString('zh-TW', {
            timeZone: 'Asia/Taipei',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return '無效日期'
    }
}

// 頭像 fallback
const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.src = '/default-avatar.png'
}

// 點擊列事件
const handleRowClick = (row: User) => {
    console.log('點擊使用者：', row)
}
</script>
