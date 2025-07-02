<template>
    <tbody>
        <TableRow v-for="(row, index) in rows" :key="index" :row="row" :columns="columns" :columnWidths="columnWidths"
            :showid="showid" @click="$emit('row-click', row)">
            <template v-for="col in columns" #[`cell-${col}`]="slotProps">
                <slot :name="`cell-${col}`" v-bind="slotProps" />
            </template>
        </TableRow>
    </tbody>
</template>

<script setup lang="ts">
import TableRow from './TableRow.vue'

defineProps<{
    rows: any[]
    columns: string[]
    columnWidths?: Record<string, string>
    showid?: boolean
}>()

defineEmits<{
    (e: 'row-click', row: any): void
}>()
</script>
