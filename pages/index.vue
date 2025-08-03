<template>
  <div class="p-4">
    <div class="sticky top-16 z-999 pb-2 bg-gray-200">
      <CategoryChipBar @update:selected="handleCategoryChange" />
    </div>

    <div class="relative min-h-[300px]">
      <!-- Overlay 遮罩層 -->
      <transition name="fade">
        <div
          v-if="isChangingCategory"
          class="absolute inset-0 bg-white bg-opacity-80 z-10 flex items-center justify-center">
          <div class="flex flex-col items-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <div class="text-gray-600 text-sm">切換分類中...</div>
          </div>
        </div>
      </transition>

      <!-- 影片網格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <YTCard
          v-for="video in videos"
          :key="video.id"
          :title="video.title"
          :videoId="video.id"
          :thumbnail="getThumbnailUrl(video)"
          :duration="formatDuration(video.duration)"
          :tags="['影片', video.uploader]"
          language="英文"
          level="B1" />
      </div>
    </div>

    <!-- 載入更多 / 完成狀態 -->
    <div
      v-if="isLoading && !isChangingCategory"
      class="text-center py-4 text-gray-500">
      <div
        class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
      載入中...
    </div>
    <div
      v-else-if="noMore && videos.length > 0"
      class="text-center py-4 text-gray-400">
      已載入全部影片
    </div>
    <div
      v-else-if="!isLoading && !isChangingCategory && videos.length === 0"
      class="text-center py-8 text-gray-500">
      此分類暫無影片
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from "vue";
import YTCard from "~/components/Card/YTCard.vue";
import CategoryChipBar from "~/components/Carousel/CategoryChipBar.vue";
import {useBaseUrl} from "#imports";

import {
  getCategoryZh,
  getCategoryEn,
  translateCategory,
  isValidCategory,
  getAllEnglishCategories,
  getAllChineseCategories,
  getCategoryOptions,
} from "~/utils/useCategoryTranlate";

useHead({
  title: "多媒體英語教學",
});

interface VideoItem {
  id: string;
  title: string;
  uploader: string;
  duration: number;
  local_thumbnail_path: string;
  thumbnail_url: string;
}

const videos = ref<VideoItem[]>([]);
const isLoading = ref(false);
const noMore = ref(false);
const isChangingCategory = ref(false);
const currentCategory = ref("全部");
const hasTriggeredLoad = ref(false);

const limit = 20;
let offset = 0;
let isScrollLoading = false; // 🔥 新增：防止滾動重複觸發

const apibaseUrl = useBaseUrl();

const handleCategoryChange = async (category: string) => {
  if (currentCategory.value === category || isChangingCategory.value) return;

  console.log(`🔄 切換分類: ${currentCategory.value} → ${category}`);

  isChangingCategory.value = true;
  currentCategory.value = category;

  // 🔥 修正：確保完全重置狀態
  videos.value = [];
  offset = 0;
  noMore.value = false;
  isLoading.value = false;
  isScrollLoading = false;
  hasTriggeredLoad.value = false; // 🔥 重置觸發標記

  try {
    await fetchVideos(true);
  } catch (error) {
    console.error("❌ 分類切換失敗:", error);
  } finally {
    isChangingCategory.value = false;
  }
};

const fetchVideos = async (isCategoryChange = false) => {
  if (isLoading.value || noMore.value) return;

  isLoading.value = true;
  if (!isCategoryChange) {
    isScrollLoading = true; // 🔥 標記為滾動觸發的載入
  }

  const translatedToEn = translateCategory(currentCategory.value, "en");

  try {
    const query = new URLSearchParams({
      skip: offset.toString(),
      limit: limit.toString(),
      category: translatedToEn,
    });

    console.log(`📡 API 請求: ${apibaseUrl}/videos/list?${query}`);

    const res = await fetch(`${apibaseUrl}/videos/list?${query}`);
    const data = await res.json();

    if (data.length === 0) {
      noMore.value = true;
      console.log("✅ 已載入所有影片");
      return;
    }

    if (isCategoryChange) {
      videos.value = data;
      console.log(`🔄 分類切換完成，載入 ${data.length} 部影片`);
    } else {
      videos.value.push(...data);
      console.log(
        `➕ 追加載入 ${data.length} 部影片，總計 ${videos.value.length} 部`
      );
    }

    offset += limit;

    // 🔥 關鍵：載入完成後重置觸發標記，允許下次觸發
    if (!isCategoryChange) {
      hasTriggeredLoad.value = false;
    }
  } catch (err) {
    console.error("❌ 無法載入影片清單:", err);
  } finally {
    isLoading.value = false;
    isScrollLoading = false; // 🔥 重置滾動載入標記
  }
};

const getThumbnailUrl = (video: VideoItem): string => {
  const filename = video.local_thumbnail_path?.split("/").pop();
  return filename
    ? `${apibaseUrl}/thumbnails/${filename}`
    : video.thumbnail_url;
};

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

// 🔥 修正：防止重複觸發的關鍵變數
let lastTriggerHeight = 0;
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

const handleScroll = () => {
  // 清除之前的延遲執行
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
    // 檢查是否應該載入更多
    if (isLoading.value || noMore.value || isChangingCategory.value) {
      return;
    }

    const scrollBottom = window.innerHeight + window.scrollY;
    const fullHeight = document.documentElement.offsetHeight;
    const triggerPoint = fullHeight - 200;

    // 🔥 關鍵修正：只有當頁面高度增加時才重新觸發
    if (scrollBottom >= triggerPoint && fullHeight > lastTriggerHeight) {
      console.log("📜 觸發滾動載入");
      lastTriggerHeight = fullHeight; // 記錄當前觸發時的頁面高度
      fetchVideos();
    }
  }, 100);
};

onMounted(() => {
  console.log("🚀 組件載入，開始初始化");
  hasTriggeredLoad.value = false; // 🔥 初始化觸發標記
  fetchVideos();
  window.addEventListener("scroll", handleScroll, {passive: true});
});

onBeforeUnmount(() => {
  console.log("🔚 組件卸載，清理事件監聽器");
  window.removeEventListener("scroll", handleScroll);

  // 🔥 清理 timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
</script>

<style scoped>
/* 確保遮罩層平滑顯示 */
.absolute.inset-0 {
  transition: opacity 0.2s ease-in-out;
}

/* 載入動畫優化 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 避免佈局偏移 */
.grid {
  min-height: 200px;
}

/* 🔥 新增：淡入動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
