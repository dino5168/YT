<template>
    <div class="p-1">
        <h2 class="text-xl font-semibold mb-1">使用者清單</h2>

        <div class="overflow-auto rounded shadow">
            <table class="min-w-full bg-white border">
                <thead class="bg-gray-100 text-left">
                    <tr>
                        <th class="p-3 border">#</th>
                        <th class="p-3 border">Email</th>
                        <th class="p-3 border">名稱</th>
                        <th class="p-3 border">頭像</th>
                        <th class="p-3 border">啟用</th>
                        <th class="p-3 border">選取</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="user.id" class="border-b hover:bg-gray-50">
                        <td class="p-3 border">{{ index + 1 }}</td>
                        <td class="p-3 border">{{ user.email }}</td>
                        <td class="p-3 border">{{ user.name }}</td>
                        <td class="p-3 border">
                            <img :src="user.avatar_url || '/default-avatar.png'"
                                class="w-6 h-6 rounded-full object-cover" :alt="`${user.name || 'User'} avatar`"
                                @error="handleImageError" />
                        </td>
                        <td class="p-3 border">
                            <span class="inline-block px-2 py-1 text-xs rounded" :class="user.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                ">
                                {{ user.is_active ? '啟用' : '停用' }}
                            </span>
                        </td>
                        <td class="p-3 border text-center">
                            <input type="checkbox" :value="user.id" v-model="selectedIdsArray" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 已選取清單 -->
        <div class="mt-4 text-sm text-gray-600">
            已選取 {{ selectedIdsArray.length }} 位使用者：
            <span v-for="id in selectedIdsArray" :key="id" class="mr-2">{{ id }}</span>
        </div>

        <div v-if="loading" class="text-center py-4">載入中...</div>
        <div v-if="errorMessage" class="text-red-500 text-center py-4">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBaseUrl } from '#imports'

interface User {
    id: number
    email: string
    name: string
    avatar_url: string
    is_active: boolean
}

// emit 給父層
const emit = defineEmits<{
    (e: 'update:selectedIds', ids: number[]): void
}>()

// 使用者資料
const users = ref<User[]>([])
const loading = ref(false)
const errorMessage = ref('')
const baseUrl = useBaseUrl()

// 被選取的 user.id（用陣列控制 v-model）
const selectedIdsArray = ref<number[]>([])

// 自動同步給父層
watch(selectedIdsArray, (ids) => {
    emit('update:selectedIds', ids)
})

// 如果你想用 Set 來做內部查詢
const selectedUserIds = computed(() => new Set(selectedIdsArray.value))

// 根據選取 id，取回完整使用者資料
const selectedUsers = computed(() =>
    users.value.filter((u) => selectedUserIds.value.has(u.id))
)

// 圖片錯誤 fallback
const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.src = '/default-avatar.png'
}

// 取得使用者列表
onMounted(async () => {
    await fetchUsers()
})

const fetchUsers = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
        const token = useCookie('auth_token').value

        const { data, error } = await useApi<User[]>(`${baseUrl}/query/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        })

        if (!error && data && Array.isArray(data)) {
            users.value = data
        } else {
            errorMessage.value = '資料讀取失敗'
        }
    } catch (err) {
        errorMessage.value =
            '載入錯誤：' + (err instanceof Error ? err.message : '未知錯誤')
    } finally {
        loading.value = false
    }
}
</script>
