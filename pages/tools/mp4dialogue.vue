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
        image: '200px',
        text: '400px',
        actions: '250px',
      }"
      :page-size="20">
      <!-- 編號 -->
      <template #cell-id="{row}">
        {{ row.id }}
      </template>

      <!-- 影像選取欄 -->
      <template #cell-image="{row}">
        <div class="flex flex-col items-center space-y-2">
          <!-- 影像預覽 -->
          <div
            class="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              v-if="row.imagePreview"
              :src="row.imagePreview"
              :alt="`預覽-${row.id}`"
              class="max-w-full max-h-full object-contain" />
            <span v-else class="text-gray-400 text-sm">無影像</span>
          </div>

          <!-- 檔案選擇按鈕 -->
          <div class="flex space-x-1">
            <input
              :id="`fileInput-${row.id}`"
              type="file"
              accept="image/*"
              @change="onImageSelect($event, row)"
              class="hidden" />
            <button
              type="button"
              @click="triggerFileInput(row.id)"
              class="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded">
              選擇圖片
            </button>

            <!-- 清除按鈕 -->
            <button
              v-if="row.imageFile || row.imagePreview"
              type="button"
              @click="clearImage(row)"
              class="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded">
              清除
            </button>
          </div>

          <!-- 檔案名稱顯示 -->
          <div
            v-if="row.imageFile"
            class="text-xs text-gray-600 max-w-[120px] truncate">
            {{ row.imageFile.name }}
          </div>
        </div>
      </template>

      <!-- 支援 inline 編輯的文字欄 -->
      <template #cell-text="{row}">
        <div v-if="row.isEditing" :key="`edit-${row.id}`">
          <textarea
            v-model="row.text"
            rows="3"
            class="border px-2 py-1 rounded w-full resize-y leading-snug"
            placeholder="輸入文字..."></textarea>
        </div>
        <div v-else :key="`view-${row.id}`">
          <span class="text-gray-800 whitespace-pre-line">{{ row.text }}</span>
        </div>
      </template>

      <!-- 操作欄：ComboBox + 試聽 + 編輯 / 確定 + 刪除 -->
      <template #cell-actions="{row}">
        <div class="flex items-center space-x-2">
          <label class="w-30">選取聲音</label>
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
            <ButtonRed class="min-w-[60px]" @click="() => saveEdit(row)">
              確定
            </ButtonRed>
          </template>
          <template v-else>
            <ButtonBlue class="min-w-[80px]" @click="() => startEdit(row)">
              編輯資料
            </ButtonBlue>
          </template>

          <ButtonRed class="min-w-[60px]" @click="() => onDeleteRow(row)">
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

const columns = ["id", "image", "text", "actions"];
const columnDescriptions = ["編號", "影像", "文字", "操作"];

const voiceData = ref([
  {
    id: 1,
    text: "Natasha",
    selectedValue: null,
    selectedLabel: "",
    isEditing: false,
    imageFile: null as File | null,
    imagePreview: null as string | null,
  },
  {
    id: 2,
    text: "William",
    selectedValue: null,
    selectedLabel: "",
    isEditing: false,
    imageFile: null as File | null,
    imagePreview: null as string | null,
  },
  {
    id: 3,
    text: "Clara",
    selectedValue: null,
    selectedLabel: "",
    isEditing: false,
    imageFile: null as File | null,
    imagePreview: null as string | null,
  },
]);

// 觸發檔案選擇
const triggerFileInput = (rowId: number) => {
  const fileInput = document.getElementById(
    `fileInput-${rowId}`
  ) as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
};

// 影像選取處理
const onImageSelect = (event: Event, row: any) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // 驗證檔案類型
    if (!file.type.startsWith("image/")) {
      alert("請選擇圖片檔案");
      target.value = ""; // 清空 input
      return;
    }

    // 驗證檔案大小 (例如：限制 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("圖片檔案大小不能超過 5MB");
      target.value = ""; // 清空 input
      return;
    }

    row.imageFile = file;

    // 創建預覽圖片
    const reader = new FileReader();
    reader.onload = (e) => {
      row.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// 清除影像
const clearImage = (row: any) => {
  row.imageFile = null;
  row.imagePreview = null;
};

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
    imageFile: null,
    imagePreview: null,
  });
};

// 刪除一列
const onDeleteRow = (row: any) => {
  const index = voiceData.value.findIndex((item) => item.id === row.id);
  if (index !== -1) {
    voiceData.value.splice(index, 1);
  }
};

// 確定送出整張表的資料（包含影像）
///mp4/voice-data

const onPostApi = async () => {
  try {
    const formData = new FormData();

    // 建立 JSON payload 並同步圖片名稱
    const payload = voiceData.value.map((row) => {
      const imageFile = row.imageFile;
      const imageName = imageFile ? `row_${row.id}_${imageFile.name}` : null;

      // 記錄 imageName（後端要對應）
      row.imageName = imageName;

      return {
        id: row.id,
        text: row.text || "", // 確保文字存在
        selectedValue: row.selectedValue,
        selectedLabel: row.selectedLabel,
        hasImage: !!imageFile,
        imageName,
      };
    });

    // 1. 加入 JSON
    formData.append("data", JSON.stringify(payload));

    // 2. 加入圖片檔案（使用 imageName 作為 key）
    voiceData.value.forEach((row) => {
      if (row.imageFile && row.imageName) {
        formData.append(row.imageName, row.imageFile);
      }
    });

    // Debug print
    console.log("✅ Payload JSON：", JSON.stringify(payload, null, 2));
    console.log(
      "✅ 上傳圖片：",
      voiceData.value.filter((r) => r.imageFile).map((r) => r.imageName)
    );

    // 3. 送出 API
    const response = await fetch(`${baseUrl}/mp4/voice-data`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("✅ 資料上傳成功！");
    } else {
      alert("❌ 資料上傳失敗！");
    }
  } catch (error) {
    console.error("❌ 上傳失敗：", error);
    alert("❌ 資料上傳失敗！");
  }
};
</script>
