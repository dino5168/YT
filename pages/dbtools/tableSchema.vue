<template>
    <div class="p-4">
        <div class="flex items-center mb-4 w-96 space-x-2">
            <label class="text-sm font-medium mr-3 whitespace-nowrap">選擇表格：</label>
            <ComboBoxApi v-model="selectedValue" v-model:label="selectedLabel" api-url="COMBO_TABLE_LIST"
                placeholder="請選擇一個表格..." class="flex-1" />
            <!--
            <button @click="onQuery"
                class="px-2 py-1 bg-blue-900 text-sm text-white rounded-sm hover:cursor-pointer hover:bg-blue-700">
                查詢
            </button>
            -->

        </div>
        <!-- 新增的輸入欄位區塊 -->
        <div class="flex items-center space-x-2">
            <label class="text-sm font-medium whitespace-nowrap">欄位名稱:</label>
            <label class="text-sm font-medium whitespace-nowrap">{{ fieldName }}</label>
            <label for="column-description" class="text-sm font-medium whitespace-nowrap">欄位描述：</label>
            <input id="column-description" v-model="comment" type="text" maxlength="50" ref="inputRef"
                class="border border-gray-300 rounded px-2 py-1 text-sm w-80" placeholder="輸入內容" />
            <button @click="onUpdateDesc"
                class="px-2 py-1 bg-blue-900 text-sm text-white rounded-sm hover:cursor-pointer hover:bg-blue-700">
                修改欄位描述
            </button>
        </div>
        <!-- 顯示選中的值 -->
        <!--
        <div class="mt-4 p-3 bg-gray-100 rounded">
            <p class="text-sm text-gray-600">選中的值: {{ selectedLabel || '未選擇' }}</p>
        </div>
        -->
        <div>
            <!-- 修正：columnDescriptions 拼寫錯誤，並且需要傳入正確的描述陣列 -->
            <XTable :rows="filteredData" :columns="columns" :columnDescriptions="columnDescriptions">
                <!-- 自定義操作欄位渲染 -->
                <template #cell-操作="{ row }">
                    <div class="flex space-x-2">
                        <button @click="onSelectDesc(row)"
                            class="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 hover:cursor-pointer">
                            選取
                        </button>
                    </div>
                </template>
            </XTable>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import ComboBoxApi from '~/components/SelectList/ComboBoxApi.vue'
import XTable from '~/components/Table/XTable.vue'
import { useToast } from '@/composables/useToast' // ✅ 確保此檔案存在


const inputRef = ref<HTMLInputElement | null>(null)

const { showToast } = useToast()

const baseUrl = useBaseUrl()

const fieldNameInit = "__"
const comment = ref('')
const fieldName = ref(fieldNameInit)

// 定義 filteredData 以避免錯誤
const filteredData = ref([])
const columns = ref<string[]>([])

// 修正：根據 XTable 組件的需求，columnDescriptions 應該是字符串陣列
const columnDescriptions = ref<string[]>([])

// 保留原本的詳細資訊結構（如果其他地方需要使用）
const columns_desc = ref<{
    name: string
    type: string
    maxLength: number | null
    nullable: boolean
    default: string | null
}[]>([])

// 定義響應式數據來儲存選中的值
const selectedValue = ref<string | number | null>(null)
const selectedLabel = ref<string>('')


const onQuery = async () => {

    if (selectedLabel.value.length == 0) {
        showToast("請選取表單...", "warning")
        return
    }


    const apiUrl = `${baseUrl}/DBQuery/TableSchema/TABLE_META_DATA_V3?table_name=${selectedLabel.value}`
    try {
        console.log('開始查詢...')
        const result = await useApi(apiUrl)
        console.log('API 回應:', result)

        const rows = result.data || []
        console.log('處理的資料行:', rows)

        if (rows.length === 0) {
            console.warn('API 回應中沒有資料')
            return
        }

        // 設定表格的 columns：id, 欄位名稱, 資料型別, 最大長度, 可為NULL, 預設值
        columns.value = ['id', '欄位名稱', '資料型別', '最大長度', '可為NULL', '預設值', '欄位描述', '操作']

        // 設定 column descriptions (表頭顯示的文字)
        columnDescriptions.value = ['ID', '欄位名稱', '資料型別', '最大長度', '可為NULL', '預設值', '欄位描述', '操作']

        // 將 API 資料轉換為表格需要的格式，每一行代表一個欄位的資訊
        filteredData.value = rows.map((item: any, index: number) => ({
            id: index + 1, // 序號
            '欄位名稱': item["欄位名稱"],
            '資料型別': item["資料型別"],
            '最大長度': item["最大長度"] || '無限制',
            '可為NULL': item["可為NULL"],
            '預設值': item["預設值"] || '無',
            '欄位描述': item['欄位描述'] || '無'
        }))

        // 保留原本的詳細資訊結構（如果其他地方需要使用）
        columns_desc.value = rows.map((item: any) => ({
            name: item["欄位名稱"],
            type: item["資料型別"],
            maxLength: item["最大長度"],
            nullable: item["可為NULL"] === "YES",
            default: item["預設值"]
        }))

        console.log('處理完成 - columns:', columns.value)
        console.log('處理完成 - filteredData:', filteredData.value)

    } catch (error) {
        console.error('查詢失敗:', error)
    }
}


// 監聽值的變化（可選）
watch(selectedLabel, (newValue) => {
    //console.log('選中的值已改變:', newValue)
    fieldName.value = fieldNameInit
    comment.value = ""
    onQuery()
})

type JsonObject = {
    tableName: string
    fieldName: string
    comment: string
}
// 選取物件（你想存下最後選取的項目）
const selectedObject = ref<JsonObject | null>(null)

const onSelectDesc = (row: any) => {

    const jsonObject: JsonObject = {
        tableName: selectedLabel.value,
        fieldName: row.欄位名稱,
        comment: row.欄位描述
    }
    fieldName.value = jsonObject.fieldName
    comment.value = jsonObject.comment

    selectedObject.value = jsonObject
    inputRef.value?.focus()


}


async function addColumnComment() {
    const apiUrl = `${baseUrl}/DBCreate/tableComment`;


    const { data, error } = await useApi(
        apiUrl,
        {
            method: "POST",
            body: {
                "table_name": selectedObject.value?.tableName,
                "column_name": selectedObject.value?.fieldName,
                "comment": comment.value,
            },
        }
    );

    if (error) {
        //console.error("錯誤:", error);
        showToast("更新失敗", "error")
        return;
    }

    //console.log("成功:", data);
    showToast("更新成功", "success")
    // 更新成功後重新查詢
    await onQuery()
}

// 呼叫範例

const isPassCheck = (): boolean => {

    if (fieldName.value.trim() === fieldNameInit) // 字串有空白就不會等於 '__'
        return false
    else
        return true
}

const onUpdateDesc = () => {

    if (isPassCheck()) {

        addColumnComment();
    } else {
        showToast("請選取修改欄位", "warning")
    }
    //alert(selectedObject.value?.tableName)


}
</script>