<template>
  <div>
    <audio ref="audioPlayer" controls class="hidden"></audio>
  </div>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">修正語音筆記</h1>

    <!-- 輸入 videoId -->
    <div class="flex gap-2 mb-6">
      <input
        v-model="videoId"
        placeholder="Enter YouTube Video ID"
        class="flex-1 border rounded px-4 py-2"
        @keyup.enter="fetchSRT" />
      <button
        @click="fetchSRT"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:cursor-pointer hover:bg-blue-700 transition">
        載入
      </button>
    </div>

    <!-- 狀態 -->
    <div v-if="loading" class="text-gray-500">Loading subtitles...</div>
    <div v-else-if="error" class="text-red-600">⚠️ {{ error }}</div>

    <!-- 字幕內容 -->
    <div v-else-if="subtitles.length > 0" class="space-y-6">
      <div
        v-for="(item, index) in subtitles"
        :key="item.seq"
        class="border-b pb-4">
        <!-- 若正在編輯 -->
        <div v-if="editingIndex === index" class="space-y-2">
          <div class="flex gap-2">
            <input
              v-model="editForm.start_time"
              placeholder="開始時間"
              class="border px-2 py-1 w-1/3" />
            <input
              v-model="editForm.end_time"
              placeholder="結束時間"
              class="border px-2 py-1 w-1/3" />
            <span class="flex items-center px-2 text-sm text-gray-500"
              >Seq: {{ editForm.seq }}</span
            >
          </div>
          <textarea
            v-model="editForm.en_text"
            placeholder="英文字幕"
            class="w-full border px-2 py-1 h-20 resize-none"></textarea>
          <textarea
            v-model="editForm.zh_text"
            placeholder="中文字幕"
            class="w-full border px-2 py-1 h-20 resize-none"></textarea>
          <textarea
            v-model="editForm.note"
            placeholder="筆記"
            class="w-full border px-2 py-1 h-20 resize-none"></textarea>

          <div class="flex gap-2 mt-2">
            <button
              @click="saveEdit(index)"
              :disabled="saving"
              class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50">
              {{ saving ? "儲存中..." : "儲存" }}
            </button>
            <button
              @click="cancelEdit"
              class="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">
              取消
            </button>
          </div>
        </div>

        <!-- 顯示模式 -->
        <div v-else>
          <div class="text-sm text-gray-400 mb-2">
            <span class="font-mono">{{ item.start_time }}</span> →
            <span class="font-mono">{{ item.end_time }}</span>
            <span class="ml-4 text-blue-500">Seq: {{ item.seq }}</span>
          </div>
          <div class="mt-2 space-y-2">
            <p class="text-lg font-bold text-blue-800">{{ item.en_text }}</p>
            <p class="text-base font-bold text-gray-900">
              {{ item.zh_text }}
            </p>
            <p class="text-base font-bold text-red-500">
              {{ item.note }}
            </p>
          </div>
          <button
            @click="editSubtitle(index, item)"
            class="text-blue-600 text-sm mt-2 hover:text-blue-800">
            ✏️ 編輯
          </button>
          <button
            @click="onPlayAudio(index, item)"
            class="text-blue-600 text-sm mt-2 hover:text-blue-800">
            ✏️ 播放
          </button>
          <button
            @click="onRepeatPlayAudio(index, item)"
            class="text-blue-600 text-sm mt-2 hover:text-blue-800">
            重複播放
          </button>
        </div>
      </div>
    </div>

    <!-- 無字幕 -->
    <div v-else-if="!loading" class="text-gray-500">No subtitles loaded.</div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
const audioPlayer = ref<HTMLAudioElement | null>(null);
// 定義字幕項目的類型
interface SubtitleItem {
  seq: number;
  start_time: string;
  end_time: string;
  en_text: string;
  zh_text: string;
  note: string;
}

// 響應式變數
const subtitles = ref<SubtitleItem[]>([]);
const videoId = ref("20250728_065707");
const loading = ref(false);
const saving = ref(false);
const error = ref("");

// 取得 baseURL（根據您的環境調整）
const getBaseUrl = () => {
  // 如果有 useBaseUrl composable 就使用，否則使用預設值
  try {
    return useBaseUrl?.() || "http://localhost:8000";
  } catch {
    return "http://localhost:8000";
  }
};
const baseURL = getBaseUrl();
const fetchSRT = async () => {
  if (!videoId.value.trim()) {
    error.value = "請輸入有效的 Video ID";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const srtBaseUrl = `${baseURL}/note/voicesrt/${videoId.value}`;

    const res = await fetch(srtBaseUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: 無法載入字幕資料`);
    }

    const json = await res.json();

    if (
      !json.subtitles ||
      !Array.isArray(json.subtitles) ||
      json.subtitles.length === 0
    ) {
      throw new Error("字幕資料為空或格式錯誤");
    }

    // 使用類型斷言確保資料結構正確
    subtitles.value = json.subtitles as SubtitleItem[];
    console.log("載入的字幕:", subtitles.value);
  } catch (err) {
    error.value =
      err instanceof Error && err.message ? err.message : "載入字幕時發生錯誤";

    console.error("fetchSRT error:", err);
  } finally {
    loading.value = false;
  }
};

// 編輯邏輯
const editingIndex = ref<number | null>(null);
const editForm = ref<SubtitleItem>({
  seq: 1,
  start_time: "",
  end_time: "",
  en_text: "",
  zh_text: "",
  note: "",
});

const editSubtitle = (index: number, item: SubtitleItem) => {
  editingIndex.value = index;
  editForm.value = {
    seq: item.seq,
    start_time: item.start_time,
    end_time: item.end_time,
    en_text: item.en_text,
    zh_text: item.zh_text,
    note: item.note,
  };
};

const cancelEdit = () => {
  editingIndex.value = null;
  editForm.value = {
    seq: 1,
    start_time: "",
    end_time: "",
    en_text: "",
    zh_text: "",
    note: "",
  };
};

const saveEdit = async (index: number) => {
  if (saving.value) return;

  saving.value = true;

  try {
    const putUrl = `http://127.0.0.1:8000/note/subtitles/${videoId.value}/${editForm.value.seq}`;

    // 使用 fetch 而不是 $fetch 以確保相容性
    const response = await fetch(putUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_id: videoId.value,
        seq: editForm.value.seq,
        start_time: editForm.value.start_time,
        end_time: editForm.value.end_time,
        en_text: editForm.value.en_text,
        zh_text: editForm.value.zh_text,
        note: editForm.value.note,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: 更新失敗`);
    }

    // 更新本地字幕陣列內容
    subtitles.value[index] = {
      ...subtitles.value[index],
      seq: editForm.value.seq,
      start_time: editForm.value.start_time,
      end_time: editForm.value.end_time,
      en_text: editForm.value.en_text,
      zh_text: editForm.value.zh_text,
      note: editForm.value.note,
    };

    editingIndex.value = null;
    console.log("字幕更新成功");
  } catch (err) {
    error.value =
      err instanceof Error && err.message ? err.message : "更新字幕時發生錯誤";
    console.error("saveEdit error:", err);
  } finally {
    saving.value = false;
  }
};

// 初始載入
// fetchSRT();
function formatNumberToThreeDigits(num: number): string {
  return (num + 1).toString().padStart(3, "0");
}

const onPlayAudio = async (index: number, item: SubtitleItem) => {
  const seq = formatNumberToThreeDigits(index);
  const url_mp3 = `${baseURL}/mp3/0000000029/${videoId.value}/${seq}`;

  if (audioPlayer.value) {
    // 清除任何現有的事件監聽器
    audioPlayer.value.onended = null;

    audioPlayer.value.src = url_mp3;
    try {
      await audioPlayer.value.play();
    } catch (err) {
      console.error("播放失敗", err);
    }
  }
};

const onRepeatPlayAudio = async (index: number, item: SubtitleItem) => {
  const seq = formatNumberToThreeDigits(index);
  const url_mp3 = `${baseURL}/mp3/0000000029/${videoId.value}/${seq}`;

  if (audioPlayer.value) {
    // 清除舊的事件監聽器
    audioPlayer.value.onended = null;

    // 設定音源
    audioPlayer.value.src = url_mp3;

    // 設定重播邏輯
    audioPlayer.value.onended = () => {
      // 再次播放
      audioPlayer.value?.play().catch((err) => {
        console.error("重播失敗", err);
      });
    };

    // 開始播放
    try {
      await audioPlayer.value.play();
    } catch (err) {
      console.error("播放失敗", err);
    }
  }
};

// 可選：添加停止重播的函數
const stopRepeatAudio = () => {
  if (audioPlayer.value) {
    audioPlayer.value.onended = null;
    audioPlayer.value.pause();
  }
};
</script>
