<template>
  <div class="min-h-screen p-6 flex flex-col items-center">
    <div class="w-full max-w-4xl">
      <!-- 錯誤訊息 -->
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
        <strong>錯誤：</strong> {{ error }}
      </div>

      <!-- 音訊播放器 -->
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
        <div class="mt-4 text-white text-center">
          <div class="text-sm opacity-90">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>
      </div>

      <!-- 播放控制按鈕 -->
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
        <button
          @click="toggleWordHighlight"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-all duration-200',
            isWordHighlightEnabled
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-600 text-white hover:bg-gray-700',
          ]">
          ✨ {{ isWordHighlightEnabled ? "單字反白中" : "啟用單字反白" }}
        </button>
      </div>

      <!-- 當前字幕顯示區域 -->
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
                <span
                  v-if="isWordHighlightEnabled"
                  v-for="(word, index) in englishWords"
                  :key="index"
                  :class="[
                    'word-highlight transition-all duration-300',
                    index === currentWordIndex
                      ? 'bg-yellow-400 text-black rounded px-1'
                      : '',
                  ]">
                  {{ word }}{{ index < englishWords.length - 1 ? " " : "" }}
                </span>
                <span v-else>{{ displayCaption.english }}</span>
              </div>
              <div
                class="text-base font-bold text-yellow-300 opacity-90 leading-relaxed">
                {{ displayCaption.chinese }}
              </div>
            </div>
            <div
              v-else
              class="text-center text-gray-900 opacity-75 py-4 w-full">
              <!-- 空白內容，避免閃爍 -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed, watch} from "vue";
import {useRoute} from "vue-router";

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

// 新增功能的響應式變數
const isRepeatMode = ref(false);
const isWordHighlightEnabled = ref(false);
const currentWordIndex = ref(-1);
const wordTimingInterval = ref<NodeJS.Timeout | null>(null);
const repeatStartTime = ref(0);
const repeatEndTime = ref(0);

// 計算當前字幕的英文單字陣列
const englishWords = computed(() => {
  if (!displayCaption.value || !isWordHighlightEnabled.value) return [];
  return displayCaption.value.english
    .split(/\s+/)
    .filter((word) => word.length > 0);
});

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function parseSRTTime(timeStr: string): number {
  try {
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
  } catch {
    return 0;
  }
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

function startWordHighlighting() {
  if (!isWordHighlightEnabled.value || !displayCaption.value) return;

  clearWordHighlighting();

  const words = englishWords.value;
  if (words.length === 0) return;

  // 如果是重複模式，使用即時更新方式
  if (isRepeatMode.value) {
    updateCurrentWordIndex();
    return;
  }

  const captionDuration = displayCaption.value.end - displayCaption.value.start;
  const timePerWord = captionDuration / words.length;

  // 計算當前音訊時間在字幕中的相對位置
  const audio = audioRef.value;
  if (!audio) return;

  const relativeTime = audio.currentTime - displayCaption.value.start;
  const initialWordIndex = Math.floor(relativeTime / timePerWord);

  // 設定初始單字索引
  currentWordIndex.value = Math.max(0, initialWordIndex);

  // 計算下一個單字切換的時間
  const nextWordTime = (currentWordIndex.value + 1) * timePerWord;
  const remainingTime = nextWordTime - relativeTime;

  // 如果還有剩餘時間，等待到下一個單字
  if (remainingTime > 0) {
    setTimeout(() => {
      if (
        isWordHighlightEnabled.value &&
        displayCaption.value &&
        !isRepeatMode.value
      ) {
        startWordInterval(timePerWord);
      }
    }, remainingTime * 1000);
  } else {
    // 立即開始間隔計時器
    startWordInterval(timePerWord);
  }
}

function updateCurrentWordIndex() {
  if (!isWordHighlightEnabled.value || !displayCaption.value) return;

  const audio = audioRef.value;
  if (!audio) return;

  const words = englishWords.value;
  if (words.length === 0) return;

  const captionDuration = displayCaption.value.end - displayCaption.value.start;
  const timePerWord = captionDuration / words.length;
  const relativeTime = audio.currentTime - displayCaption.value.start;

  // 確保時間在有效範圍內
  if (relativeTime >= 0 && relativeTime <= captionDuration) {
    const wordIndex = Math.floor(relativeTime / timePerWord);
    currentWordIndex.value = Math.min(wordIndex, words.length - 1);
  }
}

function startWordInterval(timePerWord: number) {
  // 重複模式下不使用間隔計時器
  if (isRepeatMode.value) return;

  wordTimingInterval.value = setInterval(() => {
    currentWordIndex.value++;
    if (currentWordIndex.value >= englishWords.value.length) {
      clearWordHighlighting();
    }
  }, timePerWord * 1000);
}

function clearWordHighlighting() {
  if (wordTimingInterval.value) {
    clearInterval(wordTimingInterval.value);
    wordTimingInterval.value = null;
  }
  currentWordIndex.value = -1;
}

function toggleRepeatMode() {
  isRepeatMode.value = !isRepeatMode.value;
  if (!isRepeatMode.value && audioRef.value) {
    // 關閉重複模式時，讓音訊正常播放
    audioRef.value.loop = false;
  }
}

function toggleWordHighlight() {
  isWordHighlightEnabled.value = !isWordHighlightEnabled.value;
  if (!isWordHighlightEnabled.value) {
    clearWordHighlighting();
  } else if (displayCaption.value) {
    startWordHighlighting();
  }
}

function setupRepeatMode(caption: Caption) {
  if (!isRepeatMode.value || !audioRef.value) return;

  repeatStartTime.value = caption.start;
  repeatEndTime.value = caption.end;

  // 設定音訊從字幕開始時間播放
  audioRef.value.currentTime = caption.start;
}

function onTimeUpdate() {
  const audio = audioRef.value;
  if (!audio) return;

  currentTime.value = audio.currentTime;
  duration.value = audio.duration || 0;

  // 處理重複播放邏輯
  if (isRepeatMode.value && repeatEndTime.value > 0) {
    if (currentTime.value >= repeatEndTime.value) {
      audio.currentTime = repeatStartTime.value;
      // 重複播放跳轉時，重新啟動單字反白
      if (isWordHighlightEnabled.value && displayCaption.value) {
        clearWordHighlighting();
        setTimeout(() => startWordHighlighting(), 50);
      }
      return;
    }
  }

  const newIndex = captions.value.findIndex(
    (c) => currentTime.value >= c.start && currentTime.value <= c.end
  );

  if (newIndex !== currentIndex.value) {
    currentIndex.value = newIndex;
    const newCaption = newIndex >= 0 ? captions.value[newIndex] : null;

    // 當字幕變更時
    if (newCaption !== displayCaption.value) {
      clearWordHighlighting();
      displayCaption.value = newCaption;

      if (newCaption) {
        // 如果開啟重複模式，設定重複範圍
        if (isRepeatMode.value) {
          setupRepeatMode(newCaption);
        }

        // 如果開啟單字反白，開始反白動畫
        if (isWordHighlightEnabled.value) {
          setTimeout(() => startWordHighlighting(), 50);
        }
      }
    }
  }

  // 即時更新單字反白（處理重複播放中的同步）
  if (
    isWordHighlightEnabled.value &&
    displayCaption.value &&
    isRepeatMode.value
  ) {
    updateCurrentWordIndex();
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
  clearWordHighlighting();
  currentWordIndex.value = -1;
}

// 監聽字幕變化，重新開始單字反白
watch(displayCaption, (newCaption) => {
  if (newCaption && isWordHighlightEnabled.value) {
    clearWordHighlighting();
    // 減少延遲時間
    setTimeout(() => startWordHighlighting(), 50);
  }
});

onMounted(() => {
  loadSubtitles();
});

useHead({
  title: "故事播放器",
  meta: [
    {name: "description", content: "一個支援雙語字幕同步顯示的故事播放器"},
  ],
});
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

.title-gradient {
  background: linear-gradient(to right, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.control-buttons button {
  transform: translateY(0);
}

.control-buttons button:hover {
  transform: translateY(-2px);
}

.word-highlight {
  display: inline;
}
</style>
