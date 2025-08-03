<template>
  <div class="relative">
    <!-- Desktop 版本 - 原有的橫向滾動 -->
    <div
      v-if="!isMobile"
      ref="scrollContainer"
      class="flex space-x-2 overflow-x-auto py-2 px-4 scrollbar-hide"
      role="tablist">
      <button
        v-for="chip in chips"
        :key="chip"
        role="tab"
        :aria-selected="selected === chip"
        @click="selectChip(chip)"
        class="whitespace-nowrap rounded-full px-4 py-1 hover:cursor-pointer text-sm font-medium border transition-colors duration-200"
        :class="{
          'bg-gray-100 text-gray-800 border-gray-300': selected !== chip,
          'bg-blue-600 text-white border-blue-600': selected === chip,
        }">
        {{ chip }}
      </button>
    </div>

    <!-- Mobile 版本 - Carousel -->
    <div
      v-else
      class="relative overflow-hidden py-2"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd">
      <!-- 左箭頭按鈕 -->
      <button
        v-if="canSlidePrev"
        @click="slidePrev"
        class="absolute left-2 top-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors flex items-center justify-center"
        aria-label="Previous">
        <svg
          class="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Chips 容器 -->
      <div class="px-4" :class="{'pl-12': canSlidePrev, 'pr-12': canSlideNext}">
        <div
          class="flex space-x-2 transition-transform duration-300 ease-in-out">
          <button
            v-for="chip in visibleChips"
            :key="chip"
            role="tab"
            :aria-selected="selected === chip"
            @click="
              selectChip(chip);
              ensureChipVisible(chip);
            "
            class="flex-1 min-w-0 rounded-full px-4 py-2 hover:cursor-pointer text-sm font-medium border transition-colors duration-200"
            :class="{
              'bg-gray-100 text-gray-800 border-gray-300': selected !== chip,
              'bg-blue-600 text-white border-blue-600': selected === chip,
            }">
            <span class="truncate">{{ chip }}</span>
          </button>
        </div>
      </div>

      <!-- 右箭頭按鈕 -->
      <button
        v-if="canSlideNext"
        @click="slideNext"
        class="absolute right-2 top-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors flex items-center justify-center"
        aria-label="Next">
        <svg
          class="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- 指示器 -->
      <div class="flex justify-center mt-2 space-x-1">
        <div
          v-for="(_, index) in Math.ceil(chips.length / 3)"
          :key="index"
          class="w-2 h-2 rounded-full transition-colors duration-200"
          :class="{
            'bg-blue-600': Math.floor(currentIndex / 3) === index,
            'bg-gray-300': Math.floor(currentIndex / 3) !== index,
          }" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref, computed, onMounted, nextTick} from "vue";
// 分類對照表 - 陣列形式（用於選單顯示）
/*
export const CATEGORY_LIST: CategoryTranslation[] = [
  {en: "Music", zh: "音樂"},
  {en: "People & Blogs", zh: "人物與部落格"},
  {en: "Entertainment", zh: "娛樂"},
  {en: "News & Politics", zh: "新聞與政治"},
  {en: "Film & Animation", zh: "電影與動畫"},
  {en: "Education", zh: "教育"},
  {en: "Science & Technology", zh: "科學與技術"},
];
*/
const chips = [
  "全部",
  "音樂",
  "人物與部落格",
  "娛樂",
  "遊戲",
  "新聞與政治",
  "電影與動畫",
  "教育",
  "科學與技術",
  "非營利組織",
];

const selected = ref("全部");
const scrollContainer = ref<HTMLElement>();
const isMobile = ref(false);
const currentIndex = ref(0);

// 檢測是否為移動裝置
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  return () => {
    window.removeEventListener("resize", checkMobile);
  };
});

// 計算在 mobile 時顯示的 chips
const visibleChips = computed(() => {
  if (!isMobile.value) return chips;

  // Mobile 時一次顯示 3-4 個 chips
  const itemsPerView = 3;
  const start = currentIndex.value;
  const end = Math.min(start + itemsPerView, chips.length);

  return chips.slice(start, end);
});

// 檢查是否可以向左/向右滑動
const canSlidePrev = computed(() => currentIndex.value > 0);
const canSlideNext = computed(() => currentIndex.value + 3 < chips.length);
const emit = defineEmits<{
  (e: "update:selected", value: string): void;
}>();

function selectChip(label: string) {
  selected.value = label;
  emit("update:selected", label);
}

function slidePrev() {
  if (canSlidePrev.value) {
    currentIndex.value = Math.max(0, currentIndex.value - 1);
  }
}

function slideNext() {
  if (canSlideNext.value) {
    currentIndex.value = Math.min(chips.length - 3, currentIndex.value + 1);
  }
}

// 當選中的 chip 不在可見範圍時，自動滑動到該位置
function ensureChipVisible(chipLabel: string) {
  if (!isMobile.value) return;

  const chipIndex = chips.findIndex((chip) => chip === chipLabel);
  if (chipIndex === -1) return;

  const itemsPerView = 3;
  if (chipIndex < currentIndex.value) {
    currentIndex.value = chipIndex;
  } else if (chipIndex >= currentIndex.value + itemsPerView) {
    currentIndex.value = Math.max(0, chipIndex - itemsPerView + 1);
  }
}

// 處理觸控滑動
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e: TouchEvent) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // 向左滑動，顯示下一組
      slideNext();
    } else {
      // 向右滑動，顯示上一組
      slidePrev();
    }
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
