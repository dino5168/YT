<template>
  <div class="p-4 space-y-4">
    <h1 class="text-gray-900 font-bold">使用者角色設定</h1>
    <div>
      <FormDate
        class="w-56"
        label="選取日期"
        v-model="searchDate"
        minDate="2025-07-02"
        maxDate="2025-07-08">
      </FormDate>

      <FormEmail
        class="w-96"
        label="電子郵件"
        v-model="searchEmail"
        placeholder="請輸入電子郵件...">
      </FormEmail>
      <ButtonBlue @click="onTest">測試</ButtonBlue>
    </div>

    <XTable
      :columns="columns"
      :columnDescriptions="columnDescriptions"
      :rows="rows"
      @row-click="onRowClick">
      <!-- 自訂 slot：針對 role 欄位放入 ComboBoxSimple -->
      <template #cell-role="{row}">
        <ComboBoxSimple
          v-model="row.role_id"
          :options="items"
          placeholder="請選擇"
          class="w-full" />
      </template>
      <!--操作-->
      <template #cell-actions="{row}">
        <ButtonGreen @click="onUpdated(row)">設定</ButtonGreen>
      </template>
      <!--頭像-->
      <template #cell-avatar_url="{row}">
        <img
          :src="row.avatar_url"
          alt="使用者頭像"
          class="w-10 h-10 rounded-full object-cover border border-gray-300"
          v-if="row.avatar_url" />
        <div
          v-else
          class="w-10 h-10 flex items-center justify-center bg-gray-200 text-sm text-gray-500 rounded-full">
          無
        </div>
      </template>

      <template #cell-is_active="{row}">
        <label class="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="row.is_active"
            class="form-checkbox h-5 w-5 text-green-600" />
          <span :class="row.is_active ? 'text-green-600' : 'text-red-600'">
            {{ row.is_active ? "啟用" : "停用" }}
          </span>
        </label>
      </template>
    </XTable>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted} from "vue";
import {useToast} from "@/composables/useToast";
import ComboBoxSimple from "~/components/SelectList/ComboBoxSimple.vue";
import XTable from "~/components/Table/XTable.vue";
import {ButtonGreen, ButtonBlue} from "~/components/Buttons";
import type {OptionCombox} from "~/types/OptionCombox";
import {FormInput} from "#components";
import {FormEmail, FormDate} from "#components";
//use
import {useColumnMeta} from "~/composables/useColumnMeta";
import type {ColumnMeta} from "~/composables/useColumnMeta";
import {usePayloadBuilder} from "#imports";
const {buildPayload} = usePayloadBuilder();
// api url
const baseUrl = useBaseUrl();
const url_role_list_url = `${baseUrl}/common/roles`;
const user_list_url = `${baseUrl}/DBQuery/SELECT_USERS_ALL`;
const user_list_desc_url = `${baseUrl}/DBQuery/TableSchema/TABLE_META_DATA_V3?table_name=users`;
const update_user_roleid = `${baseUrl}/DBUpdate/TABLE_UPDATE/UPDATE_USER_ROLEID`;

// ✅ 選單項目（從 API 載入）
const items = ref<OptionCombox[]>([]);
// ✅ 新增載入狀態控制
const isRolesLoaded = ref(false);
const isLoadingRoles = ref(false);
const searchEmail = ref("");

const searchDate = ref("");
// ✅ Toast 功能
const {showToast} = useToast();

const rows = ref<any[]>([]);

const onRowClick = () => {
  // 處理行點擊事件
};

// ✅ 方法一：使用狀態控制，確保只調用一次
const fetchRoles = async () => {
  // 如果已經載入過或正在載入中，直接返回
  if (isRolesLoaded.value || isLoadingRoles.value) {
    return items.value;
  }

  try {
    isLoadingRoles.value = true;
    const response = await useApi(url_role_list_url);
    const roles = (response.data ?? []) as OptionCombox[];

    items.value = roles;
    isRolesLoaded.value = true;

    return roles;
  } catch (error) {
    //console.error('載入角色失敗:', error)
    showToast("載入角色失敗", "error");
    return [];
  } finally {
    isLoadingRoles.value = false;
  }
};

// ✅ onMounted 載入下拉選單資料
onMounted(async () => {
  await fetchRoles();
  await get_user_data();
});

const onUpdated = async (row: any) => {
  const payload = buildPayload(row, ["id", "role_id", "is_active"]);

  // 例如你要送到 API:
  const result = await useApi(update_user_roleid, {
    method: "PUT",
    body: payload,
  });

  if (result.error) {
    showToast("設定失敗");
  } else {
    showToast("設定成功");
  }
};

// 宣告為 ref，在 template 中可以綁定
const columns = ref<string[]>([]);
const columnDescriptions = ref<string[]>([]);

type AddField = {[key: string]: string};
const get_user_data = async () => {
  try {
    const {data, error} = await useApi<ColumnMeta[]>(user_list_desc_url);

    if (error) {
      console.error("API 請求錯誤:", error);
      return;
    }

    if (!data) {
      console.warn("無資料");
      return;
    }
    const excludeFields = [
      "google_id",
      "created_at",
      "updated_at",
      "role_id",
      "locked_until",
    ];
    const addFields = [
      {role: "角色"},
      {actions: "操作"},
    ] as const satisfies AddField[];

    const {transform} = useColumnMeta();

    const {columns: cols, columnDescriptions: descs} = transform(
      data,
      excludeFields,
      addFields
    );
    columns.value = cols;
    columnDescriptions.value = descs;
    const user_datas = await useApi(user_list_url);
    rows.value = user_datas.data;
  } catch (err) {
    console.error("例外錯誤:", err);
  }
};

const onTest = async () => {
  alert(searchEmail.value);
};
</script>
