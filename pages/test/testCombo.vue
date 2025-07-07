<template>

    <div class="p-4">
        <div class="flex items-center mb-4 w-64">
            <label class="text-sm font-medium mr-3 whitespace-nowrap">選擇項目：</label>
            <ComboBoxApi v-model="selectedValue" api-url="COMBo_ROLE_LIST" placeholder="請選擇一個選項" class="flex-1" />
        </div>

        <!-- 顯示選中的值 -->
        <div class="mt-4 p-3 bg-gray-100 rounded">
            <p class="text-sm text-gray-600">選中的值: {{ selectedValue || '未選擇' }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ComboBoxApi from '~/components/SelectList/ComboBoxApi.vue'
import ComboBoxMutiApi from '~/components/SelectList/ComboBoxMutiApi.vue'
// 定義響應式數據來儲存選中的值
const selectedValue = ref<string | number | null>(null)
const mutiSelectedValues = ref([])
// 監聽值的變化（可選）
watch(selectedValue, (newValue) => {
    console.log('選中的值已改變:', newValue)
})
</script>