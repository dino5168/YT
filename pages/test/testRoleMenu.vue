<template>
    <div class="p-4">

        <div class="flex items-center mb-4 w-80">
            <label class="text-sm font-medium mr-3 whitespace-nowrap">選擇角色：</label>
            <ComboBoxApi v-model="selectedValue" api-url="COMBo_ROLE_LIST" placeholder="請選擇一個角色" class="flex-1" />
        </div>
    </div>
    <div class="flex mb-4">
        <div class="w-1/3">
            <TreeMenu :items="navItems" @select="handleSelect" />
        </div>
        <div class="w-2/3">

            <!-- 編輯區 -->
            <div id="menuEdit" class="bg-gray-200 w-2/3 h-auto p-4 overflow-auto">
                <template v-if="selectedItem">

                    <div class="mb-2">
                        <label class="text-red-500 font-semibold block">型態(0:主,1:子) : {{ menuType(editForm.type)
                            }}</label>
                    </div>
                    <div>
                        <label class="text-blue-500 font-semibold block">資料識別子:<span class="text-green-500"> {{
                            editForm.id }}</span></label>
                    </div>
                    <div>
                        <label class="text-blue-500 font-semibold block">選單名稱: <span class="text-green-500"> {{
                            editForm.label
                                }}</span></label>

                    </div>

                    <!--
                    <div>
                        <label class="text-white font-semibold block">父節點ID:{{ editForm.nav_item_id }}
                            <input v-model="editForm.nav_item_id" type="text"
                                class="w-full text-red-500 px-2 py-1 rounded" />
                        </label>
                    </div>

                    <div>
                        <label class="text-white font-semibold block">名稱:</label>
                        <input v-model="editForm.label" type="text" class="w-full px-2 py-1 rounded" />
                    </div>

                    <div>
                        <label class="text-white font-semibold block">連結:</label>
                        <input v-model="editForm.href" type="text" class="w-full px-2 py-1 rounded" />
                    </div>
                    <div>
                        <label class="text-white font-semibold block">次序:</label>
                        <input v-model="editForm.sort_order" type="text" class="w-full px-2 py-1 rounded" />
                    </div>
                    -->
                </template>

                <template v-else>
                    <p class="text-blue-900 font-bold">請點擊左側樹狀選單以編輯</p>
                </template>
            </div>

        </div>
    </div>

</template>
<script lang="ts" setup>

import ComboBoxApi from '~/components/SelectList/ComboBoxApi.vue';
// 定義響應式數據來儲存選中的值
const selectedValue = ref<string | number | null>(null)
const navItems = ref([])
const editForm = ref({ label: '', href: '', id: '', type: '', nav_item_id: '', sort_order: '' })
const selectedItem = ref<{ label: string; href?: string, id: string, type: string, nav_item_id: string, sort_order: string } | null>(null)
const handleSelect = (item: { label: string; href?: string, id: string, type: string, nav_item_id: string, sort_order: string }) => {
    selectedItem.value = item
    editForm.value = {
        id: item.id,
        type: item.type,
        label: item.label,
        nav_item_id: item.nav_item_id,
        sort_order: item.sort_order,
        href: item.href || '',

    }
}
const baseUrl = useBaseUrl()
const urlNavLinks = `${baseUrl}/nav/links`

// ✅ 抽成一個函式
const fetchNavItems = async () => {
    const res = await fetch(urlNavLinks)
    navItems.value = await res.json()
}

const menuType = (mType: string) => mType === "0" ? "主選單" : "子選單"

onMounted(async () => {
    fetchNavItems()
})


</script>