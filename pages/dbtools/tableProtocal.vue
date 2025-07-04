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
        <div class=" flex">
            <MyTextArea v-model="textarea_content_python" :rows="25" id="my-textarea_python" />
            <MyTextArea v-model="textarea_content_typescript" :rows="25" id="my-textarea_typescript" />
        </div>


    </div>

</template>
<script lang="ts" setup>
// 定義響應式數據來儲存選中的值
import ComboBoxApi from '~/components/SelectList/ComboBoxApi.vue';
import MyTextArea from '~/components/Input/MyTextArea.vue';
import { schemaToModel } from "~/utils/schemaToModel"
import { schemaToInterface } from "~/utils/schemaToInterface"
import type { SchemaField, ModelConfig } from "~/utils/type_schema"

const baseUrl = useBaseUrl()
const selectedValue = ref<string | number | null>(null)
const selectedLabel = ref<string>('')
const textarea_content_python = ref<string>('hello')
const textarea_content_typescript = ref<string>('')


const onQuery = async () => {

    const apiUrl = `${baseUrl}/DBQuery/TableSchema/TABLE_META_DATA_V3?table_name=${selectedLabel.value}`

    const result = await useApi(apiUrl)


    const navItemsSchema: SchemaField[] = result.data
    const paraObject = {
        tableName: selectedLabel.value,
        className: selectedLabel.value,
        addTimestamps: true,
    }

    const pythonModel = schemaToModel(navItemsSchema, paraObject);

    //const rows = result.data || []
    textarea_content_python.value = pythonModel

    const tsInterface = schemaToTypeScript(navItemsSchema, {
        typeName: paraObject.className,
        useInterface: true,
        addTimestamps: paraObject.addTimestamps,
        exportType: true,
        camelCase: false,
    })
    //const tsInterface = schemaToInterface(navItemsSchema, paraObject)

    textarea_content_typescript.value = tsInterface

}

</script>