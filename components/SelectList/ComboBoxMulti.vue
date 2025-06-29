<template>
    <div class="relative w-full" ref="root">
        <!-- 已選取項目顯示 -->
        <div @click="toggleDropdown"
            class="flex flex-wrap items-center min-h-[2.5rem] border rounded-md px-2 py-1 cursor-text focus-within:ring-2 focus-within:ring-blue-500">
            <template v-for="(item, index) in selectedOptions" :key="item.value">
                <span class="bg-blue-100 text-blue-800 text-sm px-2 py-1 mr-1 mb-1 rounded flex items-center">
                    {{ item.label }}
                    <button @click.stop="removeOption(item)" class="ml-1 text-blue-600 hover:text-red-600">
                        &times;
                    </button>
                </span>
            </template>

            <input v-model="query" @focus="openDropdown" @input="onQueryChange" type="text"
                class="flex-1 outline-none text-sm min-w-[60px] bg-transparent"
                :placeholder="selectedOptions.length ? '' : placeholder" />
        </div>

        <!-- 下拉選單 -->
        <ul v-if="isOpen && filteredOptions.length"
            class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <li v-for="option in filteredOptions" :key="option.value" @click="toggleOption(option)"
                class="px-4 py-2 cursor-pointer hover:bg-blue-100 flex items-center">
                <input type="checkbox" class="mr-2" :checked="isSelected(option)" readonly />
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { onClickOutside, useDebounceFn } from '@vueuse/core'

interface Option {
    label: string
    value: string | number
}

// Props
const props = defineProps<{
    modelValue: (string | number)[]
    loadOptions: (query: string) => Promise<Option[]>
    placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const query = ref('')
const isOpen = ref(false)
const allOptions = ref<Option[]>([])
const root = ref(null)

const selectedOptions = computed(() =>
    props.modelValue.map(val => allOptions.value.find(opt => opt.value === val)).filter(Boolean) as Option[]
)

// 是否為已選取
const isSelected = (option: Option) => props.modelValue.includes(option.value)

// 選取或取消
const toggleOption = (option: Option) => {
    const newValues = [...props.modelValue]
    const index = newValues.indexOf(option.value)

    if (index >= 0) newValues.splice(index, 1)
    else newValues.push(option.value)

    emit('update:modelValue', newValues)
    query.value = ''
}

// 刪除選項
const removeOption = (option: Option) => {
    const newValues = props.modelValue.filter(val => val !== option.value)
    emit('update:modelValue', newValues)
}

// 下拉選單顯示
const openDropdown = () => (isOpen.value = true)
const toggleDropdown = () => (isOpen.value = !isOpen.value)

onClickOutside(root, () => (isOpen.value = false))

// 過濾選項
const filteredOptions = computed(() =>
    allOptions.value.filter(
        option =>
            option.label.toLowerCase().includes(query.value.toLowerCase()) &&
            !props.modelValue.includes(option.value)
    )
)

// 輸入查詢：Debounce 載入資料
const load = async () => {
    allOptions.value = await props.loadOptions(query.value)
}
const onQueryChange = useDebounceFn(load, 300)

// 初始載入
watch(() => props.modelValue, load, { immediate: true })
</script>
