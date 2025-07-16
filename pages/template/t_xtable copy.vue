<template>
  <div class="p-4">
    <!-- 表格 -->
    <XTable
      :rows="filteredTableData"
      :columns="columns"
      :column-descriptions="columnDescriptions"
      @row-click="onRowClick">
      <!-- 自訂欄位顯示 -->

      <!-- 操作欄位 -->
      <template #cell-actions="{row}">
        <div class="flex gap-2">
          <ButtonYellow @click.stop="editRow(row)">修改</ButtonYellow>
          <ButtonRed @click.stop="deleteRow(row)">刪除</ButtonRed>
        </div>
      </template>
    </XTable>

    <!-- 新增/修改 Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ isEditing ? "修改資料" : "新增資料" }}
        </h3>
        <div class="space-y-4">
          <FormInput
            v-for="col in editableColumns"
            :key="col"
            v-model="formData[col]"
            :label="getColumnDescription(col)" />
        </div>
        <div class="mt-6 flex gap-2 justify-end">
          <ButtonGray @click="closeModal"> 取消</ButtonGray>
          <ButtonBlue @click="submitForm">{{
            isEditing ? "更新" : "新增"
          }}</ButtonBlue>
        </div>
      </div>
    </div>

    <!-- 刪除確認 Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <h3 class="text-lg font-semibold mb-4 text-red-600">確認刪除</h3>
        <p class="text-gray-700 mb-6">確定要刪除這筆資料嗎？此操作無法復原。</p>
        <div class="flex gap-2 justify-end">
          <ButtonGray @click="closeDeleteModal">取消</ButtonGray>
          <ButtonRed @click="confirmDelete">確認刪除</ButtonRed>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import XTable from "~/components/Table/XTable.vue";
import {useToast} from "@/composables/useToast"; // ✅ 確保此檔案存在
import FormInput from "~/components/Form/FormInput.vue";
import {
  ButtonBlue,
  ButtonGray,
  ButtonGreen,
  ButtonYellow,
  ButtonRed,
} from "~/components/Buttons";
import {useXTable} from "~/composables/useXTable";
const {showToast} = useToast();

const baseUrl = useBaseUrl();
const schemaUrl = `${baseUrl}/DBQuery/TableSchema/TABLE_SCHEMAT_COMMENT?table_name=user_tts_records`;
const apiUrl = `${baseUrl}/DBQuery/TableSchema/TABLE_SCHEMAT_COMMENT?table_name=user_tts_records`;
const dataUrl = `${baseUrl}/DBQuery/SELECT_USER_TTS_RECORDS_ALL`;
const insertUrl = `${baseUrl}/DBCreate/TABLE_INSERT/INSERT_DIC_SQL`;
const updateUrl = `${baseUrl}/DBUpdate/TABLE_UPDATE/UPDATE_DIC_SQL`; // 假設更新 API URL
const deleteUrl = `${baseUrl}/DBDelete/TABLE_DELETE/DELETE_DIC_SQL`; // 假設刪除 API URL

//設定要排除的欄位名稱（可自訂）

const searchForm = ref<Record<string, string>>({});
const formData = ref<Record<string, string>>({});
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const editingRow = ref<any>(null);
const deleteTarget = ref<any>(null);

//設定要排除的欄位名稱（可自訂） srt_path, zh_srt_path, created_at
const excludeColumns = [
  "id",
  "file_name",
  "file_path",
  "srt_path",
  "zh_srt_path",
  "created_at",
];

const {
  columns,
  columnDescriptions,
  tableData,
  loadSchema,
  loadData,
  applyFilter,
} = useXTable(schemaUrl, dataUrl, excludeColumns);

// 計算屬性
const editableColumns = computed(() => {
  // 排除操作欄位和可能的 ID 欄位 category_id is_active actions
  return columns.value.filter((col) => col !== "actions" && col !== "id");
});

const searchableColumns = computed(() => {
  // 可搜尋的欄位（排除操作欄位）
  return columns.value.filter((col) => col !== "actions");
});

const filteredTableData = computed(() => {
  let filtered = tableData.value;
  // 根據搜尋條件過濾資料
  Object.keys(searchForm.value).forEach((key) => {
    const searchValue = searchForm.value[key]?.trim();
    if (searchValue) {
      filtered = filtered.filter((row) =>
        String(row[key] || "")
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
    }
  });

  return filtered;
});

// 取得欄位描述
const getColumnDescription = (columnName: string) => {
  const index = columns.value.indexOf(columnName);
  return columnDescriptions.value[index] || columnName;
};

// 初始化
onMounted(async () => {
  await loadSchema();
  await loadData();
});

// 點擊表格列
const onRowClick = (row: any) => {
  // 可以在這裡添加詳細查看邏輯
  console.log("點擊了行:", row);
};
</script>
