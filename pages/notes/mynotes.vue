<template>
  <div class="p-4">
    <h1 class="font-bold text-gray-900">我的筆記</h1>
    <!-- 表格 -->
    <XTable
      :rows="filteredTableData"
      :columns="columns"
      :column-descriptions="columnDescriptions"
      :page-size="15"
      @row-click="onRowClick">
      <!-- 自訂欄位顯示 -->

      <!-- 操作欄位 -->
      <template #cell-actions="{row}">
        <div class="flex gap-2">
          <ButtonYellow @click="onQueryNote(row)">查看</ButtonYellow>
        </div>
      </template>
    </XTable>
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
const router = useRouter();
const {showToast} = useToast();

const baseUrl = useBaseUrl();
const schemaUrl = `${baseUrl}/DBQuery/VerTableSchema/TABLE_SCHEMAT_COMMENT?table_name=user_tts_records`;
const apiUrl = `${baseUrl}/DBQuery/VerTableSchema/TABLE_SCHEMAT_COMMENT?table_name=user_tts_records`;
const dataUrl = `${baseUrl}/DBQuery/ver/SELECT_USER_TTS_RECORDS_ALL_USERID`;

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
} = useVerXTable(schemaUrl, dataUrl, excludeColumns);

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
  columns.value.push("actions");
  columnDescriptions.value.push("操作");
});

// 點擊表格列
const onRowClick = (row: any) => {
  // 可以在這裡添加詳細查看邏輯
  console.log("點擊了行:", row);
};
const onQueryNote = (row: any) => {
  const paddedId = String(row.user_id).padStart(10, "0");

  // /student/story
  router.push({
    path: `/notes/${paddedId}/${row.voice_id}`,
  });
};
</script>
