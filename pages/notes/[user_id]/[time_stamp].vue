<template>
  <div class="min-h-screen p-6 flex flex-col items-center">
    <div class="w-full max-w-4xl">
      <!--
      <h1 class="text-2xl font-bold mb-8 text-center title-gradient">
        🎧 故事播放器
      </h1>
-->
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
          @error="onAudioError">
          <source :src="audioUrl" type="audio/mpeg" />
          您的瀏覽器不支援音訊播放
        </audio>
        <div class="mt-4 text-white text-center">
          <div class="text-sm opacity-90">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>
      </div>

      <!-- 當前字幕顯示區域 -->
      <div class="current-subtitle-display mb-6">
        <div
          class="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 rounded-2xl shadow-lg">
          <h3 class="text-lg font-semibold mb-3 flex items-center">
            <span class="mr-2">🎯</span>
            當前字幕
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
              <button
                @click="toggleRepeat"
                :class="[
                  'py-1 px-3 rounded shadow font-semibold transition',
                  isRepeating
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'bg-gray-300 text-gray-800 hover:bg-gray-200',
                ]">
                🔁 {{ isRepeating ? "重複播放中" : "啟用重複播放" }}
              </button>
            </div>

            <div
              v-else
              class="text-center text-gray-900 opacity-75 py-4 w-full">
              <!-- 空白內容，避免閃爍 -->
            </div>
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

        <div ref="subtitleContainer" class="subtitle-container p-6">
          <div v-if="isLoading" class="text-center py-8">
            <div
              class="inline-block loading w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p class="mt-4 text-gray-600">載入字幕中...</p>
          </div>

          <div v-else-if="captions.length > 0" class="space-y-4">
            <div
              v-for="(caption, index) in captions"
              :key="index"
              ref="subtitleRefs"
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
                <div class="flex-1 space-y-1">
                  <div class="text-base font-medium leading-relaxed">
                    {{ caption.english }}
                  </div>
                  <div class="text-sm text-gray-600 leading-relaxed">
                    {{ caption.chinese }}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
const subtitleContainer = ref<HTMLElement | null>(null);
const subtitleRefs = ref<(HTMLElement | null)[]>([]);
const captions = ref<Caption[]>([]);
const currentIndex = ref(-1);
const displayCaption = ref<Caption | null>(null);
const isLoading = ref(true);
const error = ref("");
const currentTime = ref(0);
const duration = ref(0);
const isScrolling = ref(false);
const scrollTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Parse SRT time
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
  } catch (e) {
    return 0;
  }
}

// Parse bilingual SRT
function parseSRT(srt: string): Caption[] {
  const blocks = srt.trim().split(/\r?\n\r?\n/);
  return blocks
    .map((block) => {
      const lines = block.split(/\r?\n/);
      if (lines.length < 4) return null; // 至少需要4行：序號、時間、英文、中文

      const [startStr, endStr] = lines[1].split(" --> ");
      const english = lines[2].trim();
      const chinese = lines[3].trim();

      return {
        start: parseSRTTime(startStr),
        end: parseSRTTime(endStr),
        english,
        chinese,
      };
    })
    .filter(Boolean) as Caption[];
}

// Load subtitles
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

// Audio time update
function onTimeUpdate() {
  const audio = audioRef.value;
  if (!audio) return;
  currentTime.value = audio.currentTime;
  duration.value = audio.duration || 0;

  const newIndex = captions.value.findIndex(
    (c) => currentTime.value >= c.start && currentTime.value <= c.end
  );

  if (newIndex !== currentIndex.value) {
    currentIndex.value = newIndex;

    // 更新顯示字幕，使用延遲和保持邏輯避免閃爍
    if (newIndex >= 0) {
      displayCaption.value = captions.value[newIndex];
    } else {
      // 延遲清除，避免字幕間隙造成的閃爍
      setTimeout(() => {
        if (currentIndex.value === -1) {
          displayCaption.value = null;
        }
      }, 100);
    }

    if (newIndex >= 0 && !isScrolling.value) {
      scrollToSubtitle(newIndex);
    }
  }
}

function jumpToTime(caption: Caption) {
  const audio = audioRef.value;
  if (audio) {
    audio.currentTime = caption.start;
    audio.play();
  }
}

function scrollToSubtitle(index: number) {
  nextTick(() => {
    const container = subtitleContainer.value;
    const el = subtitleRefs.value[index];
    if (container && el) {
      isScrolling.value = true;
      container.scrollTo({top: el.offsetTop - 20, behavior: "smooth"});
      setTimeout(() => {
        isScrolling.value = false;
      }, 500);
    }
  });
}

function onManualScroll() {
  isScrolling.value = true;
  clearTimeout(scrollTimeout.value!);
  scrollTimeout.value = setTimeout(() => {
    isScrolling.value = false;
  }, 100);
}

function onLoadedMetadata() {
  const audio = audioRef.value;
  if (audio) duration.value = audio.duration;
}

function onAudioError() {
  error.value = "音訊檔案載入失敗，請確認檔案是否存在";
}

onMounted(() => {
  loadSubtitles();
  subtitleContainer.value?.addEventListener("scroll", onManualScroll);
});

onUnmounted(() => {
  subtitleContainer.value?.removeEventListener("scroll", onManualScroll);
  if (scrollTimeout.value) clearTimeout(scrollTimeout.value);
});

useHead({
  title: "故事播放器",
  meta: [
    {name: "description", content: "一個支援雙語字幕同步顯示的故事播放器"},
  ],
});
</script>

<style scoped>
.subtitle-container {
  max-height: 400px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.subtitle-item {
  padding: 16px 20px;
  border-left: 4px solid transparent;
  border-radius: 12px;
  transition: all 0.3s;
}

.subtitle-item.active {
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
  color: white;
  border-left-color: #fbbf24;
  transform: translateX(8px);
}

.subtitle-item.active .text-gray-600 {
  color: rgba(255, 255, 255, 0.8);
}

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

.loading {
  animation: spin 1s linear infinite;
  border-top-color: transparent;
  border-radius: 9999px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.title-gradient {
  background: linear-gradient(to right, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
