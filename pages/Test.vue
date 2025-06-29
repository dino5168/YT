<!-- 邏輯有問題 需一個角色一個角色 將 選單指定給角色-->
<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <h1 class="text-2xl font-bold mb-4">主選單 - 角色關聯設定</h1>

        <!-- 左側：TreeMenu -->
        <div class="flex space-x-6">
            <div class="w-1/3">
                <TreeMenu :items="treeItems" @select="handleSelect" />
            </div>

            <!-- 右側：角色列表 -->
            <div class="w-2/3 bg-white p-8 rounded shadow">
                <h2 class="text-lg font-semibold mb-2">選擇角色</h2>
                <p class="text-sm text-gray-600 mb-4">為 <span class="text-red-500 font-bold">「{{ selectedItem?.label ||
                    '請選擇選單項目' }}」</span>設定可使用角色：
                </p>

                <div v-if="selectedItem">
                    <div v-for="role in roles" :key="role.id" class="flex items-center mb-2">
                        <input type="checkbox" :value="role.id" v-model="selectedRoleIds" />
                        <label class="px-2">{{ role.name }}</label>
                    </div>

                    <button @click="saveRoles" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        儲存角色設定
                    </button>
                </div>

                <div v-else class="text-gray-500 italic">請先點選左側選單項目</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TreeMenu from '~/components/Tree/TreeMenu.vue'

interface Role {
    id: number
    name: string
    description: string
}

interface NavItem {
    label: string
    href?: string
    id: string
    type: string
    nav_item_id: string
    dropdown?: NavItem[]
}

const baseUrl = useBaseUrl()
const urlNavLinks = `${baseUrl}/nav/links`


const roles = ref<Role[]>([])
const treeItems = ref<NavItem[]>([])

const selectedItem = ref<NavItem | null>(null)
const selectedRoleIds = ref<number[]>([])

const urlQueryRole = `${baseUrl}/query/role`
const fetchRoles = async () => {
    const res = await fetch(urlQueryRole)
    roles.value = await res.json()
}

// ✅ 抽成一個函式
const fetchTreeMenu = async () => {
    const res = await fetch(urlNavLinks)
    treeItems.value = await res.json()
}

const handleSelect = (item: NavItem) => {
    selectedItem.value = item
    // TODO: 取得該項目原有的 role_ids，並設為 selectedRoleIds
    selectedRoleIds.value = []
}

const urlSavRoles = `${baseUrl}/nav/link-navitem-roles`
const saveRoles = async () => {
    if (!selectedItem.value) return

    await fetch(urlSavRoles, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nav_item_id: selectedItem.value.id,
            role_ids: selectedRoleIds.value,
        }),
    })

    alert('角色關聯已儲存')
}

onMounted(() => {
    fetchRoles()
    fetchTreeMenu()
})
</script>
