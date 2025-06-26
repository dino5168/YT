<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">使用者列表</h1>
        <div class="overflow-auto rounded shadow">
            <table class="min-w-full bg-white border">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="p-3 border">#</th>
                        <th class="p-3 border">Email</th>
                        <th class="p-3 border">Name</th>
                        <th class="p-3 border">Avatar</th>
                        <th class="p-3 border">Google ID</th>
                        <th class="p-3 border">Created</th>
                        <th class="p-3 border">Updated</th>
                        <th class="p-3 border">ID</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="user.id" class="border-b hover:bg-gray-50">
                        <td class="p-3 border">{{ index + 1 }}</td>

                        <!-- Email -->
                        <td class="p-3 border">
                            {{ user.email }}
                        </td>

                        <!-- Name -->
                        <td class="p-3 border">
                            {{ user.name }}
                        </td>

                        <!-- Avatar -->
                        <td class="p-3 border">
                            <img :src="user.avatar_url || '/default-avatar.png'" :alt="`${user.name || 'User'} avatar`"
                                class="w-10 h-10 rounded-full object-cover" @error="handleImageError" />
                        </td>

                        <!-- Google ID -->
                        <td class="p-3 border text-sm text-gray-600">{{ user.google_id }}</td>

                        <!-- Created -->
                        <td class="p-3 border text-sm">{{ formatDate(user.created_at) }}</td>

                        <!-- Updated -->
                        <td class="p-3 border text-sm">{{ formatDate(user.updated_at) }}</td>

                        <!-- ID -->
                        <td class="p-3 border text-sm text-gray-500">{{ user.id }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 載入狀態 -->
        <div v-if="loading" class="text-center py-4">
            載入中...
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="errorMessage" class="text-red-500 text-center py-4">
            {{ errorMessage }}
        </div>

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
import { useBaseUrl } from '#imports'
const baseUrl = useBaseUrl()
// 定義 User 型別以符合 API 資料結構
interface User {
    id: number
    email: string
    name: string
    avatar_url: string
    google_id: string
    created_at: string
    updated_at: string
}

interface EditableFieldProps {
    value: string
    onSave: (val: string) => void
}

const users = ref<User[]>([])
const loading = ref(false)
const errorMessage = ref('')

onMounted(async () => {
    await fetchUsers()
})

const fetchUsers = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        // 使用 $fetch 而不是 useFetch，並強制重新獲取
        const data = await $fetch<User[]>(`${baseUrl}/query/users`, {
            // 防止快取問題
            headers: {
                'Cache-Control': 'no-cache'
            }
        })

        if (data && Array.isArray(data)) {
            users.value = data
            console.log('成功載入使用者資料:', data.length, '筆')
        } else {
            console.warn('API 回傳資料格式不正確:', data)
            errorMessage.value = 'API 回傳資料格式錯誤'
        }
    } catch (err) {
        console.error('取得使用者發生錯誤', err)
        errorMessage.value = `載入資料時發生錯誤: ${err instanceof Error ? err.message : '未知錯誤'}`
    } finally {
        loading.value = false
    }
}

const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleString('zh-TW', {
            timeZone: 'Asia/Taipei',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (err) {
        console.error('日期格式化錯誤', err)
        return '無效日期'
    }
}

const updateUserField = async (
    id: number,
    field: keyof Pick<User, 'email' | 'name'>,
    value: string
) => {
    const user = users.value.find((u) => u.id === id)
    if (!user) {
        console.error('找不到指定的使用者')
        return
    }

    // 保存原始值以便回復
    const originalValue = user[field]

    // 先更新前端值
    user[field] = value as never

    try {
        await $fetch(`{baseUrl}/auth/users/${id}`, {
            method: 'PATCH',
            body: { [field]: value },
            headers: { 'Content-Type': 'application/json' },
        })

        console.log(`成功更新使用者 ${id} 的 ${field}`)
    } catch (err) {
        console.error('更新失敗', err)

        // 回復原始值
        user[field] = originalValue as never

        // 顯示錯誤訊息給使用者
        errorMessage.value = `更新 ${field} 失敗，請稍後再試`

        // 3秒後清除錯誤訊息
        setTimeout(() => {
            errorMessage.value = ''
        }, 3000)
    }
}

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.src = '/default-avatar.png' // 設定預設頭像
}
</script>