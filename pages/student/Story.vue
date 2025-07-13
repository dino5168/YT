<template>
  <div class="min-h-screen p-6 flex flex-col items-center">
    <div class="w-full max-w-4xl">
      <!-- 標題 -->
      <h1 class="text-2xl font-bold mb-8 text-center title-gradient">
        🎧 故事播放器
      </h1>

      <!-- 錯誤提示 -->
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <strong>錯誤：</strong> {{ error }}
      </div>

      <!-- 音訊播放器 -->
      <div class="audio-player mb-8">
        <audio
          ref="audioRef"
          controls
          class="w-full"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @error="onAudioError">
          <source
            src="http://localhost:8000/story/story.mp3"
            type="audio/mpeg" />
          您的瀏覽器不支援音訊播放
        </audio>

        <!-- 播放進度資訊 -->
        <div class="mt-4 text-white text-center">
          <div class="text-sm opacity-90">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>
      </div>

      <!-- 字幕區域 -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div
          class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
          <h2 class="text-xl font-semibold">字幕內容</h2>
          <p class="text-sm opacity-90 mt-1">點擊字幕可跳轉到對應時間</p>
        </div>

        <div class="subtitle-container p-6">
          <!-- 載入中 -->
          <div v-if="isLoading" class="text-center py-8">
            <div
              class="inline-block loading w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p class="mt-4 text-gray-600">載入字幕中...</p>
          </div>

          <!-- 字幕列表 -->
          <div v-else-if="captions.length > 0" class="space-y-2">
            <div
              v-for="(caption, index) in captions"
              :key="index"
              :class="[
                'subtitle-item cursor-pointer',
                currentIndex === index
                  ? 'active'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
              @click="jumpToTime(caption)">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 text-xs text-gray-500 mt-1 font-mono">
                  {{ formatTime(caption.start) }}
                </div>
                <div class="flex-1">
                  {{ caption.text }}
                </div>
              </div>
            </div>
          </div>

          <!-- 無字幕 -->
          <div v-else class="text-center py-8 text-gray-500">
            <p>沒有找到字幕內容</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, nextTick} from "vue";

// 定義介面
interface Caption {
  start: number;
  end: number;
  text: string;
}

// 響應式變數
const audioRef = ref<HTMLAudioElement | null>(null);
const subtitleContainer = ref<HTMLElement | null>(null);
const subtitleRefs = ref<(HTMLElement | null)[]>([]);
const captions = ref<Caption[]>([]);
const currentIndex = ref(-1);
const isLoading = ref(true);
const error = ref("");
const currentTime = ref(0);
const duration = ref(0);
const isScrolling = ref(false);

// 解析 SRT 時間格式
function parseSRTTime(timeStr: string): number {
  try {
    // 處理格式：HH:MM:SS,mmm 或 HH:MM:SS.mmm
    const cleanTime = timeStr.replace(",", ".");
    const parts = cleanTime.split(":");

    if (parts.length !== 3) {
      throw new Error("Invalid time format");
    }

    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const secondsParts = parts[2].split(".");
    const seconds = parseInt(secondsParts[0], 10) || 0;
    const milliseconds = parseInt(secondsParts[1]?.padEnd(3, "0") || "0", 10);

    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  } catch (e) {
    console.error("Error parsing time:", timeStr, e);
    return 0;
  }
}

// 解析 SRT 字幕檔案
function parseSRT(srtContent: string): Caption[] {
  try {
    const entries = srtContent.trim().split(/\r?\n\r?\n/);
    const parsed: Caption[] = [];

    for (const entry of entries) {
      const lines = entry.trim().split(/\r?\n/);
      if (lines.length < 3) continue;

      const indexLine = lines[0];
      const timeLine = lines[1];
      const textLines = lines.slice(2);

      if (!timeLine.includes(" --> ")) continue;

      const [startStr, endStr] = timeLine.split(" --> ");
      const start = parseSRTTime(startStr.trim());
      const end = parseSRTTime(endStr.trim());
      const text = textLines.join(" ").trim();

      if (text && start >= 0 && end > start) {
        parsed.push({start, end, text});
      }
    }

    return parsed.sort((a, b) => a.start - b.start);
  } catch (e) {
    console.error("Error parsing SRT:", e);
    return [];
  }
}

// 載入字幕檔案
async function loadSubtitles() {
  try {
    isLoading.value = true;
    error.value = "";

    const response = await $fetch<string>(
      "http://localhost:8000/story/story.srt",
      {
        method: "GET",
        parseResponse: (txt) => txt,
      }
    );

    const parsed = parseSRT(response);

    if (parsed.length === 0) {
      throw new Error("No valid subtitles found");
    }

    captions.value = parsed;
    console.log("Loaded subtitles:", parsed.length);
  } catch (e: any) {
    console.error("Error loading subtitles:", e);
    error.value = "載入字幕檔案失敗: " + e.message;

    // 提供測試數據
    captions.value = [
      {start: 0, end: 5, text: "歡迎來到故事播放器"},
      {start: 5, end: 10, text: "這裡是測試字幕內容"},
      {start: 10, end: 15, text: "請檢查字幕檔案路徑是否正確"},
    ];
  } finally {
    isLoading.value = false;
  }
}

// 音訊時間更新處理
function onTimeUpdate() {
  const audio = audioRef.value;
  if (!audio) return;

  currentTime.value = audio.currentTime;
  duration.value = audio.duration || 0;

  // 找到當前時間對應的字幕
  const newIndex = captions.value.findIndex(
    (caption) =>
      currentTime.value >= caption.start && currentTime.value <= caption.end
  );

  if (newIndex !== currentIndex.value) {
    currentIndex.value = newIndex;

    // 自動滾動到當前字幕 (移動到頂部)
    if (newIndex >= 0 && !isScrolling.value) {
      scrollToSubtitle(newIndex);
    }
  }
}

// 滾動到指定字幕
function scrollToSubtitle(index: number) {
  nextTick(() => {
    const container = subtitleContainer.value;
    const targetElement = subtitleRefs.value[index];

    if (container && targetElement) {
      isScrolling.value = true;

      // 計算目標元素在容器中的偏移位置
      const targetOffsetTop = targetElement.offsetTop;

      // 添加一些頂部邊距，讓字幕不會緊貼頂部
      const topPadding = 20;

      // 滾動到目標位置
      container.scrollTo({
        top: targetOffsetTop - topPadding,
        behavior: "smooth",
      });

      // 滾動完成後重置標記
      setTimeout(() => {
        isScrolling.value = false;
      }, 500);
    }
  });
}

// 點擊字幕跳轉
function jumpToTime(caption: Caption) {
  const audio = audioRef.value;
  if (audio) {
    audio.currentTime = caption.start;
    audio.play();
  }
}

// 手動滾動處理
function onManualScroll() {
  isScrolling.value = true;
  clearTimeout(scrollTimeout.value);
  scrollTimeout.value = setTimeout(() => {
    isScrolling.value = false;
  }, 100);
}

// 滾動超時處理
const scrollTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

// 格式化時間顯示
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// 音訊載入完成
function onLoadedMetadata() {
  const audio = audioRef.value;
  if (audio) {
    duration.value = audio.duration;
  }
}

// 錯誤處理
function onAudioError() {
  error.value = "音訊檔案載入失敗，請檢查檔案路徑";
}

// 生命週期
onMounted(() => {
  loadSubtitles();

  // 監聽手動滾動
  const container = subtitleContainer.value;
  if (container) {
    container.addEventListener("scroll", onManualScroll);
  }
});

onUnmounted(() => {
  // 清理事件監聽
  const container = subtitleContainer.value;
  if (container) {
    container.removeEventListener("scroll", onManualScroll);
  }

  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value);
  }
});

// SEO 設定
useHead({
  title: "故事播放器",
  meta: [{name: "description", content: "一個支援字幕同步顯示的故事播放器"}],
});
</script>

<style scoped>
.subtitle-wrapper {
  position: relative;
  isolation: isolate;
}

.subtitle-container {
  max-height: 400px;
  overflow-y: auto;
  scroll-behavior: smooth;
  position: relative;
}

.subtitle-container::-webkit-scrollbar {
  width: 8px;
}

.subtitle-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.subtitle-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.subtitle-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.current-subtitle {
  animation: highlight 0.3s ease-in-out;
}

@keyframes highlight {
  0% {
    transform: translateX(-10px);
    opacity: 0.5;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.audio-player {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.audio-player audio {
  width: 100%;
  border-radius: 10px;
  outline: none;
}

.subtitle-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  padding: 12px 16px;
  margin: 4px 0;
  border-left: 4px solid transparent;
  will-change: transform;
}

.subtitle-item:hover {
  background-color: #f8fafc;
  transform: translateX(4px);
}

.subtitle-item.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-left-color: #fbbf24;
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.title-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

<style>
body {
  font-family: "Noto Sans TC", system-ui, sans-serif;
  background: linear-gradient(135deg, #e0f2fe 0%, #f3e5f5 100%);
}
</style>
