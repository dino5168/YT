<template>
    <div class="p-4">
        <div class="flex items-center mb-4 w-96 space-x-2">
            <label class="text-sm font-medium mr-3 whitespace-nowrap">選擇表格：</label>
            <ComboBoxApi v-model="selectedValue" v-model:label="selectedLabel" api-url="COMBO_TABLE_LIST"
                placeholder="請選擇一個表格..." class="flex-1" />

            <button @click="onQuery"
                class="px-2 py-1 bg-blue-900 text-sm text-white rounded-sm hover:cursor-pointer hover:bg-blue-700">
                產製
            </button>
        </div>
        <div class="grid  grid-cols-1 md:grid-cols-2">
            <MyTextArea v-model="textarea_content_select" :rows="10" id="my-textarea_python" />
            <MyTextArea v-model="textarea_content_insert" :rows="10" id="my-textarea_typescript" />

            <MyTextArea v-model="textarea_content_update" :rows="10" id="my-textarea_python" />
            <MyTextArea v-model="textarea_content_delete" :rows="10" id="my-textarea_typescript" />
        </div>


    </div>

</template>
<script lang="ts" setup>
// 定義響應式數據來儲存選中的值
import ComboBoxApi from '~/components/SelectList/ComboBoxApi.vue';
import MyTextArea from '~/components/Input/MyTextArea.vue';

const baseUrl = useBaseUrl()
const selectedValue = ref<string | number | null>(null)
const selectedLabel = ref<string>('')
const textarea_content_insert = ref<string>('insert')
const textarea_content_select = ref<string>('select')
const textarea_content_update = ref<string>('update')
const textarea_content_delete = ref<string>('delete')

// 定義資料結構介面
// 定義資料結構介面
interface ColumnInfo {
    欄位名稱: string
    資料型別: string
    最大長度: number | null
    可為NULL: string
    預設值: string | null
    欄位描述: string
}

const onQuery = async () => {
    const apiUrl = `${baseUrl}/DBQuery/TableSchema/TABLE_META_DATA_V3?table_name=${selectedLabel.value}`
    const result = await useApi(apiUrl)

    const select_prefix = `SELECT_${selectedLabel.value.toUpperCase()}: |`
    const insert_prefix = `INSERT_${selectedLabel.value.toUpperCase()}: |`
    const update_prefix = `UPDATE_${selectedLabel.value.toUpperCase()}: |`
    const delete_prefix = `DELETE_${selectedLabel.value.toUpperCase()}: |`

    if (result.data && result.data.length > 0) {
        const tableName = selectedLabel.value
        const columns: ColumnInfo[] = result.data

        // 生成 SELECT 語句
        const selectColumns = columns.map((col: ColumnInfo) => col.欄位名稱).join(', ')
        //const selectSQL = `${prefix} SELECT ${selectColumns} FROM ${tableName};`
        const selectSQL = [
            `${select_prefix}`,
            `  SELECT ${selectColumns} FROM ${tableName};`
        ].join('\n')

        // 生成 INSERT 語句
        const insertColumns = columns.map((col: ColumnInfo) => col.欄位名稱).join(', ')
        const insertValues = columns.map((col: ColumnInfo) => `:${col.欄位名稱}`).join(', ')
        //const insertSQL = `INSERT INTO ${tableName} (${insertColumns}) VALUES (${insertValues});`
        const insertSQL = [
            `${insert_prefix}`,
            `  INSERT INTO ${tableName} (${insertColumns}) VALUES (${insertValues});`
        ].join('\n')

        // 生成 UPDATE 語句
        const updateSetClause = columns
            .filter((col: ColumnInfo) => col.欄位名稱 !== 'id')
            .map((col: ColumnInfo) => `${col.欄位名稱} = :${col.欄位名稱}`)
            .join(', ')


        //const updateSQL = `UPDATE ${tableName} SET ${updateSetClause} WHERE id = :id;`
        const updateSQL = [
            `${update_prefix}`,
            `  UPDATE ${tableName} SET ${updateSetClause} WHERE id = :id;`
        ].join('\n')

        // 生成 DELETE 語句
        //const deleteSQL = `DELETE FROM ${tableName} WHERE id = :id;`
        const deleteSQL = [
            `${delete_prefix}`,
            `  DELETE FROM ${tableName} WHERE id = :id;`
        ].join('\n')

        // 將生成的 SQL 語句設定到對應的文本區域
        textarea_content_select.value = selectSQL
        textarea_content_insert.value = insertSQL
        textarea_content_update.value = updateSQL
        textarea_content_delete.value = deleteSQL
    }
}
</script>