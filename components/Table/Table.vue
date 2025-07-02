<template>
    <div class="w-full bg-blue-300">
        <TablePagination v-if="rows.length > 0" :page="currentPage" :total="rows.length" :size="pageSize"
            :sizes="pageSizeOptions" @change-page="goToPage" @change-size="(val) => pageSize = val" />
        <table class="table">
            <TableHeader :columns="columns" :columnDescriptions="columnDescriptions" :columnWidths="columnWidths"
                :sortColumn="sortColumn" :sortDirection="sortDirection" @sort="handleSort"
                :show-id-column="props.showid" />
            <TableBody :rows="currentPageRows" :columns="columns" :columnWidths="columnWidths" @row-click="handleClick"
                :showid="props.showid">
                <template v-for="col in columns" #[`cell-${col}`]="slotProps">
                    <slot :name="`cell-${col}`" v-bind="slotProps" />
                </template>
            </TableBody>
        </table>

        <div v-if="rows.length === 0" class="text-gray-400 mt-2">
            尚未載入資料或該表無資料
        </div>


    </div>
</template>

<script setup lang="ts">

import TableHeader from './TableHeader.vue'
import TableBody from './TableBody.vue'
import TablePagination from './TablePagination.vue'

const props = defineProps<{
    rows: any[]
    columns: string[]
    columnDescriptions: string[]
    columnWidths?: Record<string, string>
    showid?: boolean
}>()

const emit = defineEmits<{
    (e: 'row-click', row: any): void
}>()

const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 20, 50, 100]

const sortColumn = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

const sortedRows = computed(() => {
    if (!sortColumn.value) return [...props.rows]
    return [...props.rows].sort((a, b) => {
        const aValue = a[sortColumn.value]
        const bValue = b[sortColumn.value]
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection.value === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue)
        } else if (aValue instanceof Date && bValue instanceof Date) {
            return sortDirection.value === 'asc'
                ? aValue.getTime() - bValue.getTime()
                : bValue.getTime() - aValue.getTime()
        } else {
            if (aValue == null) return sortDirection.value === 'asc' ? -1 : 1
            if (bValue == null) return sortDirection.value === 'asc' ? 1 : -1
            return sortDirection.value === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue))
        }
    })
})

const currentPageRows = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return sortedRows.value.slice(start, start + pageSize.value)
})

const goToPage = (page: number) => {
    if (page >= 1 && page <= Math.ceil(sortedRows.value.length / pageSize.value)) {
        currentPage.value = page
    }
}

const handleClick = (row: any) => emit('row-click', row)

const handleSort = (column: string) => {
    if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortColumn.value = column
        sortDirection.value = 'asc'
    }
}

watch(() => props.rows, () => currentPage.value = 1, { deep: true })
watch(pageSize, () => currentPage.value = 1)
</script>
