<template>
  <div class="p-4">
    <h1 class="text-gray-900 font-bold">代碼表維護</h1>
  </div>
  <div class="px-4 flex space-x-4 items-center">
    <FormCombox
      label="目錄"
      class="w-64"
      api-url="COMBo_ROLE_LIST"
      placeholder="請選擇目錄..." />
    <ButtonGreen class="px-2 py-1 h-10"> 查詢 </ButtonGreen>
  </div>

  <div id="editForm" class="flex space-x-4 px-4 py-1">
    <FormInput
      label="目錄"
      class="w-64"
      placeholder="目錄..."
      labelcolor="text-red-600"></FormInput>
    <FormInput
      label="代碼"
      class="w-64"
      placeholder="代碼..."
      labelcolor="text-red-600"></FormInput>
    <FormInput
      label="名稱"
      class="w-64"
      placeholder="名稱..."
      labelcolor="text-red-600">
    </FormInput>
    <FormInput
      label="描述"
      class="w-64"
      placeholder="描述..."
      labelcolor="text-red-600"></FormInput>
  </div>

  <XTableV2
    :data="tableData"
    :column-schema="columnSchema"
    :loading="loading"
    :error="error"
    :exclude-columns="excludeColumns"
    @row-click="handleRowClick"
    @refresh="handleRefresh">
    <template #cell-is_active="{value}">
      <span :class="value ? 'text-green-500' : 'text-red-500'">
        {{ value ? "啟用" : "停用" }}
      </span>
    </template>
    <template #cell-actions="{row}">
      <div class="flex space-x-2">
        <ButtonGreen @click="onAppend(row)">新增</ButtonGreen>
        <ButtonRed @click="onDelete(row)"> 刪除 </ButtonRed>
        <ButtonGray @click="onUpdate(row)">修改</ButtonGray>
      </div>
    </template>
  </XTableV2>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {ButtonRed, ButtonGray, ButtonGreen} from "~/components/Buttons";
import FormInput from "~/components/Form/FormInput";
import FormCombox from "~/components/Form/FormCombox";
import {useBaseUrl} from "~/composables/useBaseUrl";
import XTableV2 from "~/components/Table/XTableV2.vue";
import {useApi} from "~/composables/useApi";
const baseUrl = useBaseUrl();
const columnUrl = `${baseUrl}/DBQuery/TableSchema/TABLE_SCHEMAT_COMMENT?table_name=code`;
const dataUrl = `${baseUrl}/DBQuery/SELECT_CODE_ALL`;
// 頁面標題
useHead({
  title: "代碼檔",
});

const props = defineProps();

const tableData = ref([]);
const columnSchema = ref([]);
const loading = ref(false);
const error = ref(null);

const excludeColumns = computed(
  () => props.excludeColumns ?? ["id", "created_at", "updated_at"]
);

const fetchData = async () => {
  loading.value = true;

  const [schemaRes, dataRes] = await Promise.all([
    useApi(columnUrl),
    useApi(dataUrl),
  ]);

  if (schemaRes.error || dataRes.error) {
    error.value = schemaRes.error || dataRes.error || "載入失敗";
    tableData.value = [];
    columnSchema.value = [];
  } else {
    error.value = null;
    tableData.value = dataRes.data || [];
    columnSchema.value = schemaRes.data || [];
  }

  loading.value = false;
};

const handleRowClick = (row) => {
  console.log("行被點擊:", row);
};

const handleRefresh = () => {
  fetchData();
};

onMounted(fetchData);

const onDelete = async (row) => {
  //alert("onDelete")
  alert(row.id);
};
const onUpdate = async (row) => {
  //alert("onUpdate")
  alert(row.id);
};
const onAppend = async (row) => {
  //alert("onAppend")
  alert(row.id);
};
</script>
