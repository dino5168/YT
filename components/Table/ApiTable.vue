<template>
    <div class="p-4">
        <div v-if="loading" class="text-blue-600 flex items-center space-x-2 mb-4">
            <svg class="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span>載入中，請稍候...</span>
        </div>

        <div v-if="error" class="text-red-600 mb-4">⚠️ {{ error }}</div>

        <XTable v-else :rows="tableData" :columns="columnsWithActions"
            :column-descriptions="columnDescriptionsWithActions" :column-widths="columnWidthsWithActions"
            @row-click="onRowClick">
            <!-- 透傳所有 slot 到 XTable -->
            <template v-for="(_, name) in $slots" #[name]="slotProps">
                <slot :name="name" v-bind="slotProps" />
            </template>
        </XTable>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import XTable from '~/components/Table/XTable.vue'
import { useApi } from '~/composables/useApi'

const props = defineProps<{
    columnUrl: string
    dataUrl: string
}>()

// 狀態
const rawData = ref<any[]>([])
const columnSchema = ref<{ column_name: string; comment?: string }[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// 排除欄位（可修改）
const excludeColumns = ['id']

// 過濾後的欄位
const filteredColumns = computed(() =>
    columnSchema.value
        .map(col => col.column_name)
        .filter(col => !excludeColumns.includes(col))
)

const filteredDescriptions = computed(() =>
    columnSchema.value
        .filter(col => !excludeColumns.includes(col.column_name))
        .map(col => col.comment || col.column_name)
)

// 自動加上 actions 欄位
const columnsWithActions = computed(() => [...filteredColumns.value, 'actions'])
const columnDescriptionsWithActions = computed(() => [...filteredDescriptions.value, '操作'])
const columnWidthsWithActions = computed(() => {
    const base: Record<string, string> = {}
    filteredColumns.value.forEach(col => {
        if (col.includes('name')) base[col] = '150px'
        else if (col.includes('key')) base[col] = '120px'
        else if (col.includes('value')) base[col] = '250px'
        else base[col] = '100px'
    })
    base['actions'] = '120px'
    return base
})

// 表格資料
const tableData = computed(() => rawData.value)

// 事件
const onRowClick = (row: any) => {
    console.log('點擊資料列:', row)
}

// 載入資料
const fetchData = async () => {
    loading.value = true

    const [schemaRes, dataRes] = await Promise.all([
        useApi(props.columnUrl),
        useApi(props.dataUrl),
    ])

    if (schemaRes.error || dataRes.error) {
        error.value = schemaRes.error || dataRes.error || '載入失敗'
        rawData.value = []
        columnSchema.value = []
    } else {
        error.value = null
        rawData.value = dataRes.data || []
        columnSchema.value = schemaRes.data || []
    }

    loading.value = false
}

// 初始載入
onMounted(fetchData)

// 監聽 props 更新自動重新 fetch
watch(() => [props.columnUrl, props.dataUrl], fetchData)
</script>
