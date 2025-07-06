<template>
    <div class="mb-4">
        <label class="text-sm font-medium text-gray-700 mb-1 block">
            {{ label }}
        </label>
        <input v-model="modelValueProxy" type="date" :min="minDate" :max="maxDate" :placeholder="props.placeholder"
            class="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

interface Props {
    modelValue: string
    label: string
    placeholder?: string
    minDate?: string  // 最小日期限制
    maxDate?: string  // 最大日期限制
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// 取得當前日期並格式化為 YYYY-MM-DD 格式
const getCurrentDate = (): string => {
    const now = new Date()
    return now.toISOString().split('T')[0]
}

// 計算最小日期，如果沒有設定則使用預設值（今天）
const minDate = computed(() => {
    return props.minDate || getCurrentDate()
})

// 計算最大日期，如果沒有設定則不限制
const maxDate = computed(() => {
    return props.maxDate
})

const modelValueProxy = computed({
    get: () => props.modelValue || getCurrentDate(),
    set: (val) => emit('update:modelValue', val)
})

// 如果 modelValue 為空，設定預設值為今天
onMounted(() => {
    if (!props.modelValue) {
        emit('update:modelValue', getCurrentDate())
    }
})
</script>