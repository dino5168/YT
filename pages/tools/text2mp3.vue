<template>
  <div class="p-4">
    <div class="flex items-center space-x-2 mb-2">
      <FormInputHorizontal
        label="筆記標題"
        v-model="voice_title"
        placeholder="請輸入標題"></FormInputHorizontal>
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <!-- Label -->
        <label
          for="voiceSelect"
          class="text-sm font-medium text-gray-700 w-24 shrink-0">
          選擇語音
        </label>

        <!-- ComboBox + 按鈕 -->
        <div class="flex flex-1 gap-2 items-center">
          <ComboBoxApi
            v-model="selectedValue"
            v-model:label="selectedLabel"
            api-url="CODES_SAMPLE_VOICE_LIST"
            placeholder="請選擇聲音..."
            class="min-w-[280px] sm:max-w-xs" />

          <ButtonGreen class="min-w-[80px]" @click="() => onTestListen(row)">
            試聽
          </ButtonGreen>
        </div>
      </div>
      <ButtonBlue
        class="bg-blue-800 px-2 py-1 text-sm text-white hover:cursor-pointer rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        @click="postMessage"
        :disabled="isLoading">
        <!-- Loading 動畫 -->
        <div
          v-if="isLoading"
          class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        <span>{{ isLoading ? "處理中..." : "產製語音" }}</span>
      </ButtonBlue>

      <div
        v-if="selectedLabel"
        class="p-2 border rounded text-sm text-gray-600 bg-gray-50">
        ✅ 你選擇的是：<strong>{{ selectedLabel }}</strong>
      </div>
    </div>

    <!-- 全域 Loading 覆蓋層 -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        class="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
        <div
          class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <span class="text-lg font-medium text-gray-700"
          >正在產製語音，請稍候...</span
        >
      </div>
    </div>

    <div>
      <textarea
        id="message"
        rows="20"
        v-model="messageText"
        :disabled="isLoading"
        class="block w-full px-4 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="請輸入您的內容...">
      </textarea>
    </div>
  </div>
  <!-- 隱藏的 audio 播放器 -->
  <audio ref="audioRef" preload="auto" class="hidden" />
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import ComboBoxApi from "~/components/SelectList/ComboBoxApi.vue";
import {ButtonGreen, ButtonRed, ButtonBlue} from "~/components/Buttons";
import {FormInputHorizontal} from "~/components/Form";
import {useToast} from "~/composables/useToast"; // 假設你把這段放在 composables/useToast.ts

const {showToast} = useToast();
const baseUrl = useBaseUrl();

const selectedValue = ref("");
const selectedLabel = ref("");

const voice_title = ref("語音筆記");

const fetchUrl = `${baseUrl}/voices/tts`;

const audioRef = ref<HTMLAudioElement | null>(null);

interface Voice {
  voice_id: string;
  gender: string;
  style: string;
  attributes: string[];
}

const voices = ref<Voice[]>([]);
const selectedVoice = ref("");
const messageText = ref("Hello.\nI am Dino.\nNice to meet you. How are you?");
const isLoading = ref(false); // 新增 loading 狀態

const postMessage = async () => {
  if (!voice_title.value || !voice_title.value.trim()) {
    alert("請輸入語音標題");
    return;
  }

  if (!selectedValue.value || !messageText.value.trim()) {
    alert("請選擇語音並輸入內容");
    return;
  }
  isLoading.value = true; // 開始 loading
  const payload = {
    voice_id: selectedValue.value,
    text: messageText.value.trim(),
    voice_title: voice_title.value.trim(),
  };

  try {
    const res = await fetch(fetchUrl, {
      method: "POST",
      headers: useHeadersWithAuth(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const result = await res.json();
    showToast(result.message);
    //alert("✅ 傳送成功！");
  } catch (error) {
    console.error("❌ 傳送失敗：", error);
    //alert("❌ 發送失敗，請檢查伺服器");
  } finally {
    isLoading.value = false; // 結束 loading
  }
};

onMounted(async () => {
  try {
    const res = await fetch(`${baseUrl}/voices/enlist`);
    const json = await res.json();

    console.log("[Fetch 回傳]", json);

    if (Array.isArray(json.voices)) {
      voices.value = json.voices;
    } else {
      console.warn("回傳格式錯誤：voices 不是陣列");
    }
  } catch (err) {
    console.error("fetch 失敗:", err);
  }
});
function extractName(label: string): string {
  // 以 "-" 分割，取第一段
  return label.split("-")[0];
}
// 播放試聽音訊
const onTestListen = (row: any) => {
  if (!selectedValue || !selectedLabel) {
    alert("請先選擇聲音");
    return;
  }
  const label_voice = selectedLabel.value.split("-")[0];

  const url = `${baseUrl}/sample_voice/${selectedValue.value}_${label_voice}.mp3`;
  audioRef.value?.pause();
  audioRef.value!.src = url;

  nextTick(() => {
    audioRef.value?.load();
    audioRef.value?.play().catch((err) => {
      console.error("播放失敗：", err);
    });
  });
};
</script>
