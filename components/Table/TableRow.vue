<template>
    <tr @click="$emit('click', row)">
        <td class="tableRow" v-for="(col, colIndex) in columns" :key="colIndex"
            :class="['', col === 'id' && !showid ? 'hidden' : '']"
            :style="columnWidths?.[col] ? `width: ${columnWidths[col]}` : ''">
            <slot :name="'cell-' + col" :row="row" :value="row[col]">
                {{ row[col] }}
            </slot>
        </td>
    </tr>
</template>

<script setup lang="ts">
defineProps<{
    row: any
    columns: string[]
    columnWidths?: Record<string, string>
    showid?: boolean
}>()

defineEmits<{
    (e: 'click', row: any): void
}>()
</script>
