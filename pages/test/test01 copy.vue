<template>
    <div class="p-6 space-y-6">
        <h1 class="text-xl font-bold">主選單列表</h1>
        <div class="grid grid-cols-2 space-x-2">
            <!-- 主選單 XTable -->
            <XTable :rows="mainMenus" :columns="mainColumns" :column-descriptions="mainColumnDescriptions"
                @row-click="onRowClick">
                <template #cell-dropdown_label="{ value }">
                    <span class="text-sm italic text-blue-700">{{ value }}</span>
                </template>
            </XTable>

            <!-- 子選單 -->
            <div v-if="selectedDropdown.length" class="mt-8">
                <h2 class="text-lg font-semibold">子選單</h2>
                <XTable :rows="selectedDropdown" :columns="dropdownColumns"
                    :column-descriptions="dropdownDescriptions" />
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import XTable from '~/components/Table/XTable.vue'

// 主選單資料
const mainMenus = ref<any[]>([])
const selectedDropdown = ref<any[]>([])

const mainColumns = ['id', 'label', 'href', 'type', 'sort_order', 'dropdown_label']
const mainColumnDescriptions = ['ID', '標籤', '連結', '型態', '排序', '子選單名稱']

const dropdownColumns = ['id', 'label', 'href', 'sort_order']
const dropdownDescriptions = ['ID', '標籤', '連結', '排序']

// 點選主選單行
const onRowClick = (row: any) => {
    selectedDropdown.value = row.dropdown || []
}
const baseUrl = useBaseUrl()
const urlNavLinks = `${baseUrl}/nav/links`

// 載入資料
onMounted(async () => {
    const res = await fetch(urlNavLinks) // ✅ 這裡改為實際 API
    const data = await res.json()

    mainMenus.value = data.map((item: any) => ({
        ...item,
        dropdown_label: item.dropdown ? item.dropdown.map((d: any) => d.label).join('、') : ''
    }))
})
</script>
