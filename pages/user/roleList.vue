<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- 頁面標題 -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">角色管理</h1>
                <p class="mt-2 text-gray-600">管理系統中的所有角色權限</p>
            </div>

            <!-- 操作區域 -->
            <div class="bg-white rounded-lg shadow-sm border mb-6">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <!-- 搜尋框 -->
                        <div class="relative flex-1 max-w-md">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input v-model="searchQuery" type="text" placeholder="搜尋角色名稱或描述..."
                                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <!-- 新增按鈕 -->
                        <button @click="openModal('create')"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            新增角色
                        </button>
                    </div>
                </div>
            </div>

            <!-- 角色列表 -->
            <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    角色名稱</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    識別碼</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    描述</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    操作</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="role in filteredRoles" :key="role.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ role.id }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div
                                            class="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span class="text-sm font-medium text-blue-600">{{ role.name.charAt(0)
                                            }}</span>
                                        </div>
                                        <div class="ml-3">
                                            <div class="text-sm font-medium text-gray-900">{{ role.name }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {{ role.key }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {{ role.description }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button @click="viewRole(role)"
                                        class="text-blue-600 hover:text-blue-900 transition-colors">
                                        查看
                                    </button>
                                    <button @click="openModal('edit', role)"
                                        class="text-green-600 hover:text-green-900 transition-colors">
                                        編輯
                                    </button>
                                    <button @click="confirmDelete(role)"
                                        class="text-red-600 hover:text-red-900 transition-colors">
                                        刪除
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- 空狀態 -->
                    <div v-if="filteredRoles.length === 0" class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">沒有找到角色</h3>
                        <p class="mt-1 text-sm text-gray-500">開始建立第一個角色吧！</p>
                    </div>
                </div>
            </div>

            <!-- 詳情/編輯 Modal -->
            <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

                    <div
                        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <form @submit.prevent="submitForm">
                            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div class="mb-4">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                                        {{ modalMode === 'create' ? '新增角色' : modalMode === 'edit' ? '編輯角色' : '角色詳情' }}
                                    </h3>
                                </div>

                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">角色名稱</label>
                                        <input v-model="formData.name" type="text" :disabled="modalMode === 'view'"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            required />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">識別碼</label>
                                        <input v-model="formData.key" type="text" :disabled="modalMode === 'view'"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            required />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
                                        <textarea v-model="formData.description" rows="3"
                                            :disabled="modalMode === 'view'"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            required></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button v-if="modalMode !== 'view'" type="submit" :disabled="loading"
                                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none"
                                        viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    {{ modalMode === 'create' ? '新增' : '更新' }}
                                </button>
                                <button type="button" @click="closeModal"
                                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    {{ modalMode === 'view' ? '關閉' : '取消' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- 刪除確認 Modal -->
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
                <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        @click="showDeleteModal = false"></div>

                    <div
                        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div
                                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900">確認刪除</h3>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-500">
                                            確定要刪除角色「{{ roleToDelete?.name }}」嗎？此操作無法復原。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button @click="deleteRole" :disabled="loading"
                                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                刪除
                            </button>
                            <button @click="showDeleteModal = false"
                                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 通知 Toast -->
            <div v-if="notification.show" class="fixed bottom-4 right-4 z-50">
                <div :class="[
                    'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
                    notification.type === 'success' ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'
                ]">
                    <div class="p-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg v-if="notification.type === 'success'" class="h-6 w-6 text-green-400" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <svg v-else class="h-6 w-6 text-red-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="ml-3 w-0 flex-1 pt-0.5">
                                <p class="text-sm font-medium text-gray-900">{{ notification.message }}</p>
                            </div>
                            <div class="ml-4 flex-shrink-0 flex">
                                <button @click="notification.show = false"
                                    class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// 使用 Nuxt 3 Composition API
const searchQuery = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const modalMode = ref('view') // 'view', 'create', 'edit'
const loading = ref(false)
const roleToDelete = ref(null)
const roles = ref([])
const loadingRoles = ref(false)


const fetchRoles = async () => {
    loadingRoles.value = true
    try {
        const { data, error } = await useFetch('http://localhost:8000/query/role')
        if (error.value) throw new Error()
        roles.value = data.value || []
    } catch (err) {
        showNotification('error', '無法載入角色資料')
    } finally {
        loadingRoles.value = false
    }
}

onMounted(() => {
    fetchRoles()
})


// 表單資料
const formData = ref({
    id: null,
    name: '',
    key: '',
    description: ''
})

// 通知
const notification = ref({
    show: false,
    type: 'success',
    message: ''
})
// 計算屬性：過濾角色
const filteredRoles = computed(() => {
    if (!searchQuery.value) {
        return roles.value
    }

    const query = searchQuery.value.toLowerCase()
    return roles.value.filter(role =>
        role.name.toLowerCase().includes(query) ||
        role.key.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
    )
})

// 顯示通知
const showNotification = (type, message) => {
    notification.value = { show: true, type, message }
    setTimeout(() => {
        notification.value.show = false
    }, 3000)
}

// 打開 Modal
const openModal = (mode, role = null) => {
    modalMode.value = mode

    if (role) {
        formData.value = { ...role }
    } else {
        formData.value = {
            id: null,
            name: '',
            key: '',
            description: ''
        }
    }

    showModal.value = true
}

// 關閉 Modal
const closeModal = () => {
    showModal.value = false
    formData.value = {
        id: null,
        name: '',
        key: '',
        description: ''
    }
}

// 查看角色
const viewRole = (role) => {
    openModal('view', role)
}

// 確認刪除
const confirmDelete = (role) => {
    roleToDelete.value = role
    showDeleteModal.value = true
}

// 提交表單
const submitForm = async () => {
    loading.value = true

    try {
        if (modalMode.value === 'create') {
            // 新增角色
            const newId = Math.max(...roles.value.map(r => r.id)) + 1
            const newRole = {
                ...formData.value,
                id: newId
            }

            // 模擬 API 呼叫
            await new Promise(resolve => setTimeout(resolve, 1000))

            roles.value.push(newRole)
            showNotification('success', '角色新增成功！')

        } else if (modalMode.value === 'edit') {
            // 編輯角色
            const index = roles.value.findIndex(r => r.id === formData.value.id)
            if (index !== -1) {
                // 模擬 API 呼叫
                await new Promise(resolve => setTimeout(resolve, 1000))

                roles.value[index] = { ...formData.value }
                showNotification('success', '角色更新成功！')
            }
        }

        closeModal()
    } catch (error) {
        showNotification('error', '操作失敗，請稍後再試。')
    } finally {
        loading.value = false
    }
}

// 刪除角色
const deleteRole = async () => {
    loading.value = true

    try {
        // 模擬 API 呼叫
        await new Promise(resolve => setTimeout(resolve, 1000))

        const index = roles.value.findIndex(r => r.id === roleToDelete.value.id)
        if (index !== -1) {
            roles.value.splice(index, 1)
            showNotification('success', '角色刪除成功！')
        }

        showDeleteModal.value = false
        roleToDelete.value = null
    } catch (error) {
        showNotification('error', '刪除失敗，請稍後再試。')
    } finally {
        loading.value = false
    }
}

// 頁面標題
useHead({
    title: '角色管理 - 系統管理'
})
</script>

<style scoped>
/* 自定義樣式（如果需要的話） */
</style>