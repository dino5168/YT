<template>
    <div class="p-4">
        <h1 class="text-gray-900 font-bold">代碼表</h1>
    </div>

    <XTableV2 :data="tableData" :column-schema="columnSchema" :loading="loading" :error="error"
        :exclude-columns="excludeColumns" @row-click="handleRowClick" @refresh="handleRefresh">
        <!-- 自定義狀態欄位渲染 -->
        <template #cell-is_selected>
            <input type="checkbox">
        </template>
        <template #cell-is_active="{ value }">
            <span :class="value ? 'text-green-500' : 'text-red-500'">
                {{ value ? '啟用' : '停用' }}
            </span>
        </template>
        <template #cell-actions="{ row }">
            <ButtonRed @click="onDelete(row)">
                刪除
            </ButtonRed>
        </template>

    </XTableV2>



</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ButtonRed } from '~/components/Buttons'
import XTableV2 from '~/components/Table/XTableV2.vue'
import { useApi } from '~/composables/useApi'
const baseUrl = useBaseUrl()
const columnUrl = `${baseUrl}/DBQuery/TableSchema/TABLE_SCHEMAT_COMMENT?table_name=code`
const dataUrl = `${baseUrl}/DBQuery/SELECT_CODE_ALL`


const props = defineProps()

const tableData = ref([])
const columnSchema = ref([])
const loading = ref(false)
const error = ref(null)

const excludeColumns = computed(() => props.excludeColumns ?? ['id', 'created_at', 'updated_at'])

const fetchData = async () => {
    loading.value = true

    const [schemaRes, dataRes] = await Promise.all([
        useApi(columnUrl),
        useApi(dataUrl),
    ])

    if (schemaRes.error || dataRes.error) {
        error.value = schemaRes.error || dataRes.error || '載入失敗'
        tableData.value = []
        columnSchema.value = []
    } else {
        error.value = null
        tableData.value = dataRes.data || []
        columnSchema.value = schemaRes.data || []
        columnSchema.value.unshift({
            column_name: 'is_selected',
            comment: '選取'
        })
    }

    loading.value = false
}

const handleRowClick = (row) => {
    console.log('行被點擊:', row)
}

const handleRefresh = () => {
    fetchData()
}

onMounted(fetchData)

const onDelete = async (row) => {
    //alert("onDelete")
    alert(row.id)
}
</script>