<template>
  <div class="min-h-screen p-6 flex flex-col items-center">
    <ButtonBlue @click="onTest">測試</ButtonBlue>

    <div class="w-full max-w-4xl">
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
        <strong>錯誤：</strong> {{ error }}
      </div>

      <div class="audio-player mb-2">
        <audio
          ref="audioRef"
          controls
          class="w-full"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @error="onAudioError"
          @ended="onAudioEnded">
          <source :src="audioUrl" type="audio/mpeg" />
          您的瀏覽器不支援音訊播放
        </audio>
        <div class="mt-4 text-white text-center text-sm opacity-90">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
      </div>

      <div class="control-buttons mb-4 flex justify-center gap-4">
        <button
          @click="toggleRepeatMode"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-all duration-200',
            isRepeatMode
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-gray-600 text-white hover:bg-gray-700',
          ]">
          🔁 {{ isRepeatMode ? "重複播放中" : "單句重複" }}
        </button>
      </div>

      <div class="current-subtitle-display mb-6">
        <div
          class="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 rounded-2xl shadow-lg">
          <h3 class="text-lg font-semibold mb-3 flex items-center">
            <span class="mr-2">🎯</span>當前字幕
            <span
              v-if="isRepeatMode"
              class="ml-2 text-sm bg-green-500 px-2 py-1 rounded"
              >重複中</span
            >
          </h3>
          <div class="current-subtitle-content min-h-[80px] flex items-center">
            <div v-if="displayCaption" class="space-y-2 w-full">
              <div class="text-lg font-bold text-gray-200 leading-relaxed">
                {{ displayCaption.english }}
              </div>
              <div
                class="text-base font-bold text-yellow-300 opacity-90 leading-relaxed">
                {{ displayCaption.chinese }}
              </div>
            </div>
            <div
              v-else
              class="text-center text-gray-900 opacity-75 py-4 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {ButtonBlue} from "~/components/Buttons";

const baseUrl = useBaseUrl();
interface Caption {
  start: number;
  end: number;
  english: string;
  chinese: string;
}

const route = useRoute();
const userId = route.params.user_id as string;
const timeStamp = route.params.time_stamp as string;

const audioUrl = `${baseUrl}/note/mp3/${userId}/${timeStamp}`;
const srtUrl = `${baseUrl}/note/srt/${userId}/${timeStamp}`;

const audioRef = ref<HTMLAudioElement | null>(null);
const captions = ref<Caption[]>([]);
const currentIndex = ref(-1);
const displayCaption = ref<Caption | null>(null);
const isLoading = ref(true);
const error = ref("");
const currentTime = ref(0);
const duration = ref(0);

const isRepeatMode = ref(false);
const repeatStartTime = ref(0);
const repeatEndTime = ref(0);

// 新增：避免重複呼叫 setupRepeatMode
const lastRepeatIndex = ref(-1);

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function parseSRTTime(timeStr: string): number {
  const cleanTime = timeStr.replace(",", ".");
  const parts = cleanTime.split(":");
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  const [seconds, milliseconds = "0"] = parts[2].split(".");
  return (
    hours * 3600 +
    minutes * 60 +
    parseInt(seconds) +
    parseInt(milliseconds.padEnd(3, "0")) / 1000
  );
}

function parseSRT(srt: string): Caption[] {
  const blocks = srt.trim().split(/\r?\n\r?\n/);
  return blocks
    .map((block) => {
      const lines = block.split(/\r?\n/);
      if (lines.length < 4) return null;
      const [startStr, endStr] = lines[1].split(" --> ");
      return {
        start: parseSRTTime(startStr),
        end: parseSRTTime(endStr),
        english: lines[2].trim(),
        chinese: lines[3].trim(),
      };
    })
    .filter(Boolean) as Caption[];
}

async function loadSubtitles() {
  try {
    isLoading.value = true;
    error.value = "";
    const response = await $fetch<string>(srtUrl, {
      method: "GET",
      parseResponse: (txt) => txt,
    });
    const parsed = parseSRT(response);
    if (parsed.length === 0) throw new Error("無效的字幕內容");
    captions.value = parsed;
  } catch (e: any) {
    error.value = "字幕載入失敗：" + e.message;
  } finally {
    isLoading.value = false;
  }
}

function toggleRepeatMode() {
  isRepeatMode.value = !isRepeatMode.value;

  if (!isRepeatMode.value && audioRef.value) {
    audioRef.value.loop = false;
  }

  // 立刻對齊當前字幕開始時間
  if (isRepeatMode.value && displayCaption.value && audioRef.value) {
    setupRepeatMode(displayCaption.value);
  }
}

function setupRepeatMode(caption: Caption) {
  if (!audioRef.value) return;

  // 避免同一字幕重複設定
  if (currentIndex.value === lastRepeatIndex.value) return;
  lastRepeatIndex.value = currentIndex.value;

  repeatStartTime.value = caption.start;
  repeatEndTime.value = caption.end;

  // 強制跳轉到字幕開始時間
  audioRef.value.currentTime = caption.start;
}

function onTimeUpdate() {
  const audio = audioRef.value;
  if (!audio) return;

  currentTime.value = audio.currentTime;
  duration.value = audio.duration || 0;

  if (isRepeatMode.value && repeatEndTime.value > 0) {
    if (currentTime.value >= repeatEndTime.value) {
      audio.currentTime = repeatStartTime.value;
      return;
    }
  }

  const newIndex = captions.value.findIndex(
    (c) => currentTime.value >= c.start && currentTime.value <= c.end
  );

  if (newIndex !== currentIndex.value) {
    currentIndex.value = newIndex;
    const newCaption = newIndex >= 0 ? captions.value[newIndex] : null;
    displayCaption.value = newCaption;

    if (newCaption && isRepeatMode.value) {
      setupRepeatMode(newCaption);
    }
  }
}

function onLoadedMetadata() {
  const audio = audioRef.value;
  if (audio) duration.value = audio.duration;
}

function onAudioError() {
  error.value = "音訊檔案載入失敗，請確認檔案是否存在";
}

function onAudioEnded() {
  // 無需特別處理
}

onMounted(() => {
  loadSubtitles();
});

useHead({
  title: "故事播放器",
  meta: [
    {name: "description", content: "一個支援雙語字幕同步顯示的故事播放器"},
  ],
});
const onTest = async () => {
  alert("Test");
};
</script>

<style scoped>
.audio-player {
  background: linear-gradient(to right, #667eea, #764ba2);
  padding: 20px;
  border-radius: 20px;
}
.current-subtitle-display {
  min-height: 120px;
}
.current-subtitle-content {
  transition: opacity 0.2s ease-in-out;
}
.control-buttons button {
  transform: translateY(0);
}
.control-buttons button:hover {
  transform: translateY(-2px);
}
</style>
