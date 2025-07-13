<template>
  <div class="p-4">
    <div class="mb-4 space-x-2">
      <ButtonBlue @click="onAppendRow">新增</ButtonBlue>
      <ButtonBlue @click="onPostApi">確定</ButtonBlue>
    </div>
    <XTable_S
      :rows="voiceData"
      :columns="columns"
      :column-descriptions="columnDescriptions"
      :column-widths="{
        id: '80px',
        text: '350px',
        actions: '350px',
      }"
      :page-size="20">
      <!-- 編號 -->
      <template #cell-id="{row}">
        {{ row.id }}
      </template>

      <!-- 支援 inline 編輯的文字欄 -->
      <template #cell-text="{row}">
        <div v-if="row.isEditing">
          <textarea
            v-model="row.text"
            rows="3"
            class="border px-2 py-1 rounded w-full resize-y leading-snug"
            placeholder="輸入文字..."></textarea>
        </div>
        <div v-else>
          <span class="text-gray-800 whitespace-pre-line">{{ row.text }}</span>
        </div>
      </template>

      <!-- 操作欄：ComboBox + 試聽 + 編輯 / 確定 + 刪除 -->
      <template #cell-actions="{row}">
        <div class="flex items-center space-x-2">
          <ComboBoxApi
            v-model="row.selectedValue"
            v-model:label="row.selectedLabel"
            api-url="CODES_SAMPLE_VOICE_LIST"
            placeholder="請選擇聲音..."
            class="w-40 max-w-full" />
          <ButtonGreen class="min-w-[80px]" @click="() => onTestListen(row)">
            試聽
          </ButtonGreen>

          <template v-if="row.isEditing">
            <ButtonRed class="min-w-[80px]" @click="() => saveEdit(row)">
              確定
            </ButtonRed>
          </template>
          <template v-else>
            <ButtonBlue class="min-w-[80px]" @click="() => startEdit(row)">
              編輯資料
            </ButtonBlue>
          </template>

          <ButtonRed class="min-w-[80px]" @click="() => onDeleteRow(row)">
            刪除
          </ButtonRed>
        </div>
      </template>
    </XTable_S>

    <!-- 隱藏的 audio 播放器 -->
    <audio ref="audioRef" preload="auto" class="hidden" />
  </div>
</template>

<script setup lang="ts">
import {ref, nextTick} from "vue";
import ComboBoxApi from "~/components/SelectList/ComboBoxApi.vue";
import {ButtonGreen, ButtonRed, ButtonBlue} from "~/components/Buttons";
import XTable_S from "~/components/table/XTable_S";

const baseUrl = useBaseUrl();
const audioRef = ref<HTMLAudioElement | null>(null);

const columns = ["id", "text", "actions"];
const columnDescriptions = ["編號", "文字", "操作"];

const voiceData = ref([
  {
    id: 1,
    text: "Natasha",
    selectedValue: null,
    selectedLabel: "",
    isEditing: false,
  },
  {
    id: 2,
    text: "William",
    selectedValue: null,
    selectedLabel: "",
    isEditing: false,
  },
  {
    id: 3,
    text: "Clara",
    selectedValue: null,
    selectedLabel: "",
    isEditing: false,
  },
]);

// 播放試聽音訊
const onTestListen = (row: any) => {
  if (!row.selectedValue || !row.selectedLabel) {
    alert("請先選擇聲音");
    return;
  }
  const url = `${baseUrl}/sample_voice/${row.selectedValue}_${row.selectedLabel}.mp3`;
  audioRef.value?.pause();
  audioRef.value!.src = url;

  nextTick(() => {
    audioRef.value?.load();
    audioRef.value?.play().catch((err) => {
      console.error("播放失敗：", err);
    });
  });
};

// 進入編輯模式
const startEdit = (row: any) => {
  row.isEditing = true;
};

// 儲存修改並退出編輯模式
const saveEdit = (row: any) => {
  row.isEditing = false;
  // 這裡可以呼叫 API 更新資料
};

// 新增一列
const onAppendRow = () => {
  // 找最大 id，避免重複
  const maxId = voiceData.value.reduce(
    (max, item) => Math.max(max, item.id),
    0
  );
  voiceData.value.push({
    id: maxId + 1,
    text: "",
    selectedValue: null,
    selectedLabel: "",
    isEditing: true, // 新增後直接開啟編輯模式
  });
};

// 刪除一列
const onDeleteRow = (row: any) => {
  const index = voiceData.value.findIndex((item) => item.id === row.id);
  if (index !== -1) {
    voiceData.value.splice(index, 1);
  }
};

// 確定送出整張表的 JSON
const onPostApi = () => {
  // 篩選掉不必要屬性，或直接送整個 voiceData.value
  const payload = voiceData.value.map(
    ({id, text, selectedValue, selectedLabel}) => ({
      id,
      text,
      selectedValue,
      selectedLabel,
    })
  );

  // 這裡示範 console 輸出
  console.log("送出資料：", JSON.stringify(payload, null, 2));

  // TODO: 這裡可以呼叫真正的 API，例如：
  // await api.post('/your-endpoint', payload)
};
</script>
