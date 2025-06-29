<template>

    <div class="flex p-8 space-x-4">
        <div class="w-1/3 flex items-center space-x-2">
            <label class="whitespace-nowrap">角色名稱:</label>
            <ComboBoxSimple v-model="selected" :options="items" placeholder="請選擇項目" class="flex-1" />
        </div>

        <div class="w-2/3">
            <h1>Hello Lab01</h1>
            <button @click="onClick" class="bg-gray-950 px-2 py-1 font-bold text-white rounded-sm hover:cursor-pointer">
                Test
            </button>
        </div>

    </div>

</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast' // ✅ 確保此檔案存在
import ComboBoxSimple from '~/components/SelectList/ComboBoxSimple.vue'
import type { OptionCombox } from '~/types/OptionCombox'
// ✅ 選單項目（從 API 載入）
const items = ref<OptionCombox[]>([])
// ✅ v-model 綁定值
const selected = ref<string | number | null>(null)
// ✅ Toast 功能
const { showToast } = useToast()
const onClick = () => {

    const selectedOption = items.value.find(option => option.value === selected.value)
    const msg = selectedOption?.value as string ?? '請先選擇一個項目'
    showToast(msg, 'error')
}

// ✅ API 載入資料
const baseUrl = useBaseUrl()
const fetchUrl = `${baseUrl}/common/roles`

const fetchRoles = async () => {
    const response = await useApi(fetchUrl)
    // 假設 API 回傳格式為 { data: Option[], error: string | null }
    return (response.data ?? []) as OptionCombox[]
}

// ✅ onMounted 載入下拉選單資料
onMounted(async () => {
    items.value = await fetchRoles()
})
</script>
