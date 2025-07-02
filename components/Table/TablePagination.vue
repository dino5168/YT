<template>
    <div v-if="total > 0" class="table_pagination">
        <div class="page_info">
            顯示 {{ start }}-{{ end }} 筆，共 {{ total }} 筆資料
        </div>
        <div class="flex space-x-2">
            <button @click="$emit('change-page', 1)" :disabled="page === 1" class="btn">&laquo;</button>
            <button @click="$emit('change-page', page - 1)" :disabled="page === 1" class="btn">&lsaquo;</button>

            <div class="flex space-x-2">
                <button v-for="p in pages" :key="p" @click="$emit('change-page', p)" :class="['btn']">
                    {{ p }}
                </button>
            </div>

            <button @click="$emit('change-page', page + 1)" :disabled="page === totalPages"
                class="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">&rsaquo;</button>
            <button @click="$emit('change-page', totalPages)" :disabled="page === totalPages"
                class="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">&raquo;</button>
        </div>

        <div class="flex items-center space-x-2 text-sm">
            <span>每頁顯示:</span>
            <select v-model="internalSize" @change="changePageSize" class="select">
                <option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
    page: number
    total: number
    size: number
    sizes: number[]
}>()

const emit = defineEmits<{
    (e: 'change-page', page: number): void
    (e: 'change-size', size: number): void
}>()

const internalSize = ref(props.size)
watch(() => props.size, (val) => internalSize.value = val)

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / internalSize.value)))

const start = computed(() => props.total === 0 ? 0 : (props.page - 1) * internalSize.value + 1)
const end = computed(() => Math.min(props.page * internalSize.value, props.total))

const pages = computed(() => {
    const range = []
    const totalToShow = 5
    let start = Math.max(1, props.page - 2)
    let end = Math.min(totalPages.value, start + totalToShow - 1)
    if (end === totalPages.value) {
        start = Math.max(1, end - totalToShow + 1)
    }
    for (let i = start; i <= end; i++) {
        range.push(i)
    }
    return range
})

const changePageSize = () => {
    emit('change-size', Number(internalSize.value))
}
</script>

<style scoped></style>
