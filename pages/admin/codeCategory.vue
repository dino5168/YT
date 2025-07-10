<template>
  <div class="p-4">
    <Caption color="text-gray-900">代碼目錄檔-管理</Caption>
    <!-- 資料操作區塊-->
    <div v-show="isShow" class="mb-4 p-4 bg-gray-50 rounded-sm">
      <Caption color="text-blue-600"
        >代碼目錄檔-<span :class="operationColor">{{
          operationState
        }}</span></Caption
      >
      <div class="mb-4 bg-gray-50 rounded-sm">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
          <FormInput
            labelcolor="text-blue-800"
            :placeholder="`輸入${getColumnDescription(col)}...`"
            v-for="col in editColumns"
            :key="col"
            v-model="editForm[col]"
            :label="getColumnDescription(col)" />
        </div>
        <div class="mt-1 flex gap-2">
          <ButtonGreen @click="onOperationDb">確定</ButtonGreen>
          <ButtonRed @click="onToggleShow">取消</ButtonRed>
        </div>
      </div>
    </div>
    <!--資料查詢區塊-->
    <div class="mb-4 p-4 bg-gray-50 rounded-sm">
      <!--
        <Caption color="text-blue-600">代碼目錄檔-<span class="text-blue-900">搜尋</span></Caption>               
        -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
        <FormInput
          labelcolor="text-red-800"
          :placeholder="`輸入${getColumnDescription(col)}搜尋...`"
          v-for="col in searchableColumns"
          :key="col"
          v-model="searchForm[col]"
          :label="getColumnDescription(col)" />
      </div>
    </div>
    <!-- 資料表格 -->
    <XTable
      :rows="filteredTableData"
      :columns="columns"
      :columnDescriptions="columnDescriptions"
      @row-click="onRowClick">
      <!-- 操作欄位 -->
      <template #cell-is_active="{row}">
        <FormCheckBox
          v-model="row.is_active"
          activeLabel="啟用"
          inactiveLabel="停用" />
      </template>
      <template #cell-actions="{row}">
        <div class="flex gap-2">
          <ButtonBlue @click.stop="appendRow(row)">新增</ButtonBlue>
          <ButtonYellow @click.stop="editRow(row)">修改</ButtonYellow>
          <ButtonRed @click.stop="deleteRow(row)">刪除</ButtonRed>
        </div>
      </template>
    </XTable>
  </div>
</template>

<script setup lang="ts">
import XTable from "~/components/Table/XTable.vue";
import {useApi} from "~/composables/useApi";
import Caption from "~/components/Caption/Caption.vue";
import {ref, onMounted} from "vue";
import {useXTable} from "~/composables/useXTable";
import {
  ButtonBlue,
  ButtonGray,
  ButtonGreen,
  ButtonYellow,
  ButtonRed,
} from "~/components/Buttons";
import {FormInput, FormCheckBox} from "~/components/Form";
import {useToast} from "~/composables/useToast";

// 頁面標題
useHead({
  title: "代碼目錄檔",
});

const {showToast} = useToast();

const baseUrl = useBaseUrl();
const search = ref("");
// 定義 API URL
// 查詢欄位描述的 API URL
const schemaUrl = `${baseUrl}/DBQuery/TableSchema/TABLE_SCHEMAT_COMMENT?table_name=code_categories`;

//查詢、 新增、修改、刪除的 API URL
const dataUrl = `${baseUrl}/DBQuery/SELECT_CODE_CATEGORIES_ALL`;
const appendUrl = `${baseUrl}/DBCreate/TABLE_INSERT/INSERT_CODE_CATEGORIES`;
const updateUrl = `${baseUrl}/DBUpdate/TABLE_UPDATE/UPDATE_CODE_CATEGORIES`;
const deleteUrl = `${baseUrl}/DBDelete/TABLE_DELETE/DELETE_CODE_CATEGORIES`;

// 定義是否顯示操作表單

const isShow = ref(false);

const appendOrEdit = ref(0); // 0:新增, 1:修改 2:刪除
// 定義選中的行
const selectRow = ref<any>(null);
// 定義操作狀態的計算屬性
const operationState = computed(() => {
  if (appendOrEdit.value === 0) return "新增";
  else if (appendOrEdit.value === 1) return "修改";
  else return "刪除";
});

const operationColor = computed(() => {
  if (appendOrEdit.value === 0) return "text-green-600";
  else if (appendOrEdit.value === 1) return "text-yellow-600";
  else return "text-red-600";
});

//設定要排除的欄位名稱（可自訂）
const excludeColumns = ["created_at", "updated_at"];

const {
  columns,
  columnDescriptions,
  tableData,
  loadSchema,
  loadData,
  applyFilter,
} = useXTable(schemaUrl, dataUrl, excludeColumns);

const onRowClick = (row: any) => {
  //console.log('點擊 row：', row)
};

const searchForm = ref<Record<string, string>>({});
const searchableColumns = computed(() => {
  // 設定可以搜尋的欄位
  return ["category_code", "category_name", "description"];
});

const editForm = ref<Record<string, any>>({});
//設定可以編輯的欄位
const editColumns = computed(() => {
  return ["category_code", "category_name", "description"];
});

//搜尋欄位 : 搜尋功能 使用 computed 屬性來過濾資料
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

onMounted(async () => {
  await loadSchema();
  // ✅ 自訂欄位插入
  columns.value.push("actions");
  columnDescriptions.value.push("操作");

  await loadData();
});

const fillEditForm = (row: any) => {
  selectRow.value = row; // 儲存選中的行
  // 根據 row 填充 editForm
  editColumns.value.forEach((col) => {
    editForm.value[col] = row[col] || "";
  });
};

//修改資料
const editRow = (row: any) => {
  appendOrEdit.value = 1; // 設定為修改模式
  isShow.value = true;
  fillEditForm(row);
};

//修改資料
const appendRow = (row: any) => {
  appendOrEdit.value = 0; // 設定為新增模式
  isShow.value = true;
  //這裡可以根據需要填充表單數據
  fillEditForm(row);
};

const deleteRow = (row: any) => {
  appendOrEdit.value = 2; // 設定為刪除模式
  isShow.value = true;
  fillEditForm(row);
};

const onToggleShow = () => {
  isShow.value = !isShow.value;
};
// 新增操作
const eventAppend = async () => {
  const payload = {
    ...editForm.value,
  };

  const {data, error} = await useApi(appendUrl, {
    method: "POST",
    body: payload,
  });
  if (error) {
    showToast("新增失敗");
  } else {
    loadData(); // 重新載入資料
    showToast("新增成功");
  }
};
// 修改操作
const eventUpdate = async () => {
  const payload = {
    category_id: selectRow.value.category_id,
    ...editForm.value,
  };
  const {data, error} = await useApi(updateUrl, {
    method: "PUT",
    body: payload,
  });
  if (error) {
    showToast("更新失敗");
  } else {
    loadData(); // 重新載入資料
    showToast("更新成功");
  }
};
// 刪除操作
const enentDelete = async () => {
  const payload = {
    category_id: selectRow.value.category_id,
  };
  const {data, error} = await useApi(deleteUrl, {
    method: "DELETE",
    body: payload,
  });

  if (error) {
    showToast("刪除失敗");
  } else {
    loadData(); // 重新載入資料

    showToast("刪除成功");
  }
};

const onOperationDb = async () => {
  //showDeleteModal.value = true
  if (appendOrEdit.value === 0) {
    //新增操作
    await eventAppend();
  } else if (appendOrEdit.value === 1) {
    //修改操作
    eventUpdate();
  } else if (appendOrEdit.value === 2) {
    //刪除操作
    enentDelete();
  }

  isShow.value = !isShow.value;
};
</script>
