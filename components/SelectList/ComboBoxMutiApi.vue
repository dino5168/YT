<template>
    <div class="relative w-full" ref="root">
        <!-- 顯示已選取值 -->
        <button @click="toggleDropdown"
            class="w-full text-left border text-sm rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]">
            <div v-if="selectedLabels.length > 0" class="flex flex-wrap gap-1">
                <span v-for="label in selectedLabels" :key="label"
                    class="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                    {{ label }}
                    <button @click.stop="removeSelection(label)" class="ml-1 hover:text-blue-600 focus:outline-none">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </span>
            </div>
            <span v-else class="text-gray-500">{{ placeholder }}</span>

            <!-- 下拉箭頭 -->
            <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform"
                :class="{ 'rotate-180': isOpen }" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
            </svg>
        </button>

        <!-- 下拉選單 -->
        <div v-if="isOpen"
            class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-80 flex flex-col">
            <!-- 搜尋框 -->
            <div class="p-2 border-b border-gray-200 flex-shrink-0">
                <input v-model="searchTerm" @click.stop
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="搜尋選項..." />
            </div>

            <!-- 全選/取消全選按鈕 -->
            <div class="p-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <button @click="toggleSelectAll" class="text-sm text-blue-600 hover:text-blue-800 focus:outline-none">
                    {{ isAllSelected ? '取消全選' : '全選' }}
                </button>
                <span v-if="selectedValues.length > 0" class="ml-2 text-xs text-gray-500">
                    (已選擇 {{ selectedValues.length }} 項)
                </span>
            </div>

            <!-- 選項列表 -->
            <div class="flex-1 overflow-y-auto">
                <ul>
                    <li v-for="option in filteredOptions" :key="option.value" @click="toggleOption(option)"
                        class="flex items-center px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors">
                        <input type="checkbox" :checked="isSelected(option.value)" @click.stop
                            class="mr-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span class="text-sm">{{ option.label }}</span>
                    </li>

                    <!-- 無搜尋結果 -->
                    <li v-if="filteredOptions.length === 0" class="px-4 py-2 text-sm text-gray-500 text-center">
                        無符合的選項
                    </li>
                </ul>
            </div>

            <!-- 操作按鈕 -->
            <div class="p-2 border-t border-gray-200 bg-gray-50 flex-shrink-0 flex justify-between">
                <button @click="clearAll"
                    class="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 focus:outline-none">
                    清除全部
                </button>
                <button @click="closeDropdown"
                    class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none">
                    確定
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

// 假設這些是你的 composable 函數
const baseUrl = useBaseUrl()

interface Option {
    label: string
    value: string | number
}

const props = defineProps<{
    modelValue: (string | number)[]
    apiUrl: string
    placeholder?: string
    maxDisplayItems?: number // 最多顯示幾個標籤，超過則顯示 "已選擇 X 項"
}>()

const emit = defineEmits<{
    'update:modelValue': [value: (string | number)[]]
}>()

const options = ref<Option[]>([])
const isOpen = ref(false)
const root = ref<HTMLElement | null>(null)
const searchTerm = ref('')

// 計算屬性
const selectedValues = computed(() => props.modelValue || [])

const selectedLabels = computed(() => {
    if (!selectedValues.value.length) return []

    const labels = selectedValues.value
        .map(value => options.value.find(o => o.value === value)?.label)
        .filter(Boolean) as string[]

    // 如果設定了最大顯示數量且超過限制
    if (props.maxDisplayItems && labels.length > props.maxDisplayItems) {
        return [`已選擇 ${labels.length} 項`]
    }

    return labels
})

const filteredOptions = computed(() => {
    if (!searchTerm.value) return options.value
    return options.value.filter(option =>
        option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
})

const isAllSelected = computed(() => {
    return (
        filteredOptions.value.length > 0 &&
        filteredOptions.value.every(option =>
            selectedValues.value.includes(option.value)
        )
    )
})

// 方法
const toggleDropdown = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        searchTerm.value = ''
    }
}

const closeDropdown = () => {
    isOpen.value = false
}

const isSelected = (value: string | number): boolean => {
    return selectedValues.value.includes(value)
}

const toggleOption = (option: Option) => {
    const newValues = [...selectedValues.value]
    const index = newValues.indexOf(option.value)

    if (index > -1) {
        newValues.splice(index, 1)
    } else {
        newValues.push(option.value)
    }

    emit('update:modelValue', newValues)
}

const removeSelection = (label: string) => {
    const option = options.value.find(o => o.label === label)
    if (option) {
        toggleOption(option)
    }
}

const toggleSelectAll = () => {
    if (isAllSelected.value) {
        // 取消選擇所有當前篩選的選項
        const valuesToRemove = filteredOptions.value.map(o => o.value)
        const newValues = selectedValues.value.filter(v => !valuesToRemove.includes(v))
        emit('update:modelValue', newValues)
    } else {
        // 選擇所有當前篩選的選項
        const valuesToAdd = filteredOptions.value.map(o => o.value)
        const newValues = [...new Set([...selectedValues.value, ...valuesToAdd])]
        emit('update:modelValue', newValues)
    }
}

const clearAll = () => {
    emit('update:modelValue', [])
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
        // const response = await fetch(apiUrl)
        // const data = await response.json()
        // options.value = data

        // 方法三：模擬資料（用於測試）
        // options.value = [
        //     { label: '選項 1', value: 1 },
        //     { label: '選項 2', value: 2 },
        //     { label: '選項 3', value: 3 },
        //     { label: '選項 4', value: 4 },
        //     { label: '選項 5', value: 5 }
        // ]
    } catch (error) {
        console.error('載入選項時發生錯誤:', error)
        options.value = []
    }
})

// 監聽 modelValue 變化，確保數據同步
watch(
    () => props.modelValue,
    newValue => {
        if (!newValue) {
            emit('update:modelValue', [])
        }
    },
    { immediate: true }
)
</script>
