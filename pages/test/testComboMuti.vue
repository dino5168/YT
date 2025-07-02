<template>

    <div class="p-4">
        <div class="flex items-center mb-4 w-64">
            <label class="text-sm font-medium mr-3 whitespace-nowrap">選擇項目：</label>
            <ComboBoxMutiApi v-model="mutiSelectedValues" api-url="COMBO_TABLE_LIST" placeholder="請選擇角色..."
                :max-display-items="5" />
        </div>

        <!-- 顯示選中的值 -->
        <div class="mt-4 p-3 bg-gray-100 rounded">
            <p class="text-sm text-gray-600">選中的值: {{ mutiSelectedValues || '未選擇' }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import ComboBoxMutiApi from '~/components/SelectList/ComboBoxMutiApi.vue'
// 定義響應式數據來儲存選中的值

const mutiSelectedValues = ref([])
// 監聽值的變化（可選）
watch(mutiSelectedValues, (newValue) => {
    console.log('選中的值已改變:', newValue)
})
</script>