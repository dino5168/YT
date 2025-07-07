<template>
    <div class="mb-4">
      
        <label class="text-sm font-medium mr-3 whitespace-nowrap">選擇項目：</label>
        <ComboBoxApi
          v-model="selectedValue"
          :api-url="apiUrl"
          placeholder="請選擇一個選項"
          class="flex-1"
        />
      
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, defineProps } from 'vue'
  import ComboBoxApi from '~/components/SelectList/ComboBoxApi.vue'
  
  // 🔧 接收 apiUrl 作為屬性傳入
  const props = defineProps<{
    apiUrl: string
  }>()
  
  // 定義響應式數據來儲存選中的值
  const selectedValue = ref<string | number | null>(null)
  
  // 監聽選取變化
  watch(selectedValue, (newValue) => {
    console.log('選中的值已改變:', newValue)
  })
  </script>
  