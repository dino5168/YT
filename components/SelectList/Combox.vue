<template>
    <div class="relative w-full">
      <!-- 輸入框 -->
      <input
        v-model="query"
        @focus="isOpen = true"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
        type="text"
        class="w-full border rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        :placeholder="placeholder"
      />
  
      <!-- 下拉選單 -->
      <ul
        v-if="isOpen && filteredOptions.length"
        class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
      >
        <li
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          class="px-4 py-2 cursor-pointer hover:bg-blue-100"
          :class="{ 'bg-blue-100': index === highlightedIndex }"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
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
  
  const query = ref('')
  const isOpen = ref(false)
  const highlightedIndex = ref(0)
  
  const filteredOptions = computed(() =>
    props.options.filter(option =>
      option.label.toLowerCase().includes(query.value.toLowerCase())
    )
  )
  
  watch(() => props.modelValue, val => {
    const match = props.options.find(o => o.value === val)
    query.value = match?.label ?? ''
  })
  
  const selectOption = (option: Option) => {
    query.value = option.label
    isOpen.value = false
    emit('update:modelValue', option.value)
  }
  
  const highlightNext = () => {
    if (highlightedIndex.value < filteredOptions.value.length - 1) {
      highlightedIndex.value++
    }
  }
  
  const highlightPrev = () => {
    if (highlightedIndex.value > 0) {
      highlightedIndex.value--
    }
  }
  
  const selectHighlighted = () => {
    const option = filteredOptions.value[highlightedIndex.value]
    if (option) selectOption(option)
  }
  
  // 點擊外部關閉下拉
  const root = ref(null)
  onClickOutside(root, () => (isOpen.value = false))
  </script>
  
  <style scoped>
  </style>
  