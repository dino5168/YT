<template>
    <thead>
        <tr>
            <th v-for="(desc, index) in columnDescriptions" :key="'desc-' + index" :class="[
                (columns[index].toLowerCase() === 'id' && !showIdColumn) ? 'hidden' : ''
            ]" @click="handleSort(columns[index])"
                :style="columnWidths?.[columns[index]] ? `width: ${columnWidths[columns[index]]}` : ''">
                <div class="flex items-center justify-between">
                    <span class="title">
                        {{ desc || '（無描述）' }}
                    </span>
                    <span v-if="columns[index] !== 'id'" class="ml-1">
                        <span v-if="sortColumn === columns[index] && sortDirection === 'asc'">▲</span>
                        <span v-else-if="sortColumn === columns[index] && sortDirection === 'desc'">▼</span>
                        <span v-else class="text-gray-500">▼</span>
                    </span>
                </div>
            </th>
        </tr>
    </thead>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    columns: string[]
    columnDescriptions: string[]
    columnWidths?: Record<string, string>
    sortColumn: string
    sortDirection: 'asc' | 'desc'
    showIdColumn?: boolean
}>(), {
    showIdColumn: false,
})

const emit = defineEmits<{
    (e: 'sort', column: string): void
}>()

const handleSort = (column: string) => {
    if (column !== 'id') {
        emit('sort', column)
    }
}
</script>
