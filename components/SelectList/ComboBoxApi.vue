<template>
    <div class="relative w-full" ref="root">
        <!-- 顯示已選取值 -->
        <button @click="toggleDropdown"
            class="w-full text-left border text-sm rounded-md px-2 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {{ selectedLabel || placeholder }}
        </button>

        <!-- 下拉選單 -->
        <ul v-if="isOpen"
            class="absolute z-10 mt-1 w-full text-sm bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <li v-for="option in options" :key="option.value" @click="selectOption(option)"
                class="px-4 py-2 cursor-pointer hover:bg-blue-100 transition-colors">
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { Option } from '~/types/Option'

// 假設這些是你的 composable 函數
const baseUrl = useBaseUrl()

const props = defineProps<{
    modelValue: string | number | null
    apiUrl: string
    placeholder?: string
}>()
// 更標準的做法是使用 update:label 作為 v-model:label
const emit = defineEmits<{
    'update:modelValue': [value: string | number | null]
    'update:label': [label: string]
}>()
const selectOption = (option: Option) => {
    emit('update:modelValue', option.value)
    emit('update:label', option.label) // 傳 label 給父元件
    isOpen.value = false
}
const options = ref<Option[]>([])
const isOpen = ref(false)
const root = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
    const match = options.value.find(o => o.value === props.modelValue)
    return match?.label ?? ''
})

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}


// 點擊外部時關閉選單
onClickOutside(root, () => {
    isOpen.value = false
})

// 載入選項資料
onMounted(async () => {
    try {
        const apiUrl = `${baseUrl}/DBQuery/${props.apiUrl}`
        // 方法一：如果你有 useApi composable
        const data = await useApi(apiUrl)
        options.value = data.data

        // 方法二：使用 fetch
        // const baseUrl = useBaseUrl() // 確保這個函數存在
        // const response = await fetch(`${baseUrl}/testquery/COMBO_TABLE_LIST`)
        // const data = await response.json()
        // options.value = data

        // 方法三：模擬資料（用於測試）
        // options.value = [
        //   { label: '選項 1', value: 1 },
        // { label: '選項 2', value: 2 },
        // { label: '選項 3', value: 3 }
        //]
    } catch (error) {
        console.error('載入選項時發生錯誤:', error)
        options.value = []
    }
})
</script>