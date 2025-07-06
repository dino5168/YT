<template>
    <div class="relative w-full" ref="root">
        <!-- 顯示已選取值 -->
        <button @click="toggleDropdown"
            class="w-full text-left border text-sm rounded-md px-2 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {{ selectedLabel || placeholder }}
        </button>

        <!-- 下拉選單 -->
        <ul v-if="isOpen" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <li v-for="option in options" :key="option.value" @click="selectOption(option)"
                class="px-2 py-1 text-sm cursor-pointer hover:bg-blue-100">
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

interface Option {
    label: string
    value: string | number
}

const props = defineProps<{
    modelValue: string | number | null
    options: Option[]
    placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const root = ref(null)

const selectedLabel = computed(() => {
    const match = props.options.find(o => o.value === props.modelValue)
    return match?.label ?? ''
})

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const selectOption = (option: Option) => {
    emit('update:modelValue', option.value)
    isOpen.value = false
}

// 點擊外部時關閉選單
onClickOutside(root, () => {
    isOpen.value = false
})
</script>
