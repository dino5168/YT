<template>
    <div class="flex p-8">
        <button class="bg-blue-800 text-white text-sm font-bold px-2 py-1 hover:cursor-pointer rounded-sm"
            @click="onCreateData">新增</button>
    </div>

    <div class="flex space-x-4">
        <div class="w-3/4 flex items-center space-x-2">
            <UserListSimple @update:selectedIds="handleSelectedIds"></UserListSimple>
        </div>

        <div class="w-1/4 flex items-center space-x-2">
            <label class="whitespace-nowrap">角色名稱:</label>
            <ComboBoxSimple v-model="selected" :options="items" placeholder="請選擇角色" class="flex-1" />
        </div>


    </div>

</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast' // ✅ 確保此檔案存在
import ComboBoxSimple from '~/components/SelectList/ComboBoxSimple.vue'
import UserListSimple from '~/components/Admin/UserListSimple.vue'
import type { OptionCombox } from '~/types/OptionCombox'
// ✅ 選單項目（從 API 載入）
const items = ref<OptionCombox[]>([])
// ✅ v-model 綁定值
const selected = ref<string | number | null>(null)
// ✅ Toast 功能
const { showToast } = useToast()

// ✅ API 載入資料
const baseUrl = useBaseUrl()
const fetchUrl = `${baseUrl}/common/roles`
const postUrl = `${baseUrl}/Create/UserRole`

const fetchRoles = async () => {
    const response = await useApi(fetchUrl)
    // 假設 API 回傳格式為 { data: Option[], error: string | null }
    return (response.data ?? []) as OptionCombox[]
}

// ✅ onMounted 載入下拉選單資料
onMounted(async () => {
    items.value = await fetchRoles()
})

const onCreateData = () => {
    //console.log(selectedIds.value)
    const selectedOption = items.value.find(option => option.value === selected.value)
    if (!selectedOption?.value) {
        showToast("請選取角色", "warning")
        return
    }
    if (selectedIds.value.length == 0) {
        showToast("請選取使用者", "error")
        return
    }
    const payload = selectedIds.value.map(userId => ({
        user_id: userId,
        role_id: selectedOption.value
    }))

    const data = useApi(postUrl, { method: "POST", body: payload })

}


const selectedIds = ref<number[]>([])

const handleSelectedIds = (ids: number[]) => {
    console.log('✅ 選到的使用者:', ids)
    selectedIds.value = ids
}
</script>
