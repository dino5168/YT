<template>
  <div class="p-4">
    <div class="sticky top-16 z-999 pb-2 bg-gray-200">
      <CategoryChipBar @update:selected="handleCategoryChange" />
    </div>
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

    <!-- 👇 loading 狀態 -->
    <div v-if="isLoading" class="text-center py-4 text-gray-500">載入中...</div>
    <div v-else-if="noMore" class="text-center py-4 text-gray-400">
      已載入全部影片
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from "vue";
import YTCard from "~/components/Card/YTCard.vue";
import CategoryChipBar from "~/components/Carousel/CategoryChipBar.vue";
import {useBaseUrl} from "#imports";
// 頁面標題
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

const limit = 10;
let offset = 0;

const apibaseUrl = useBaseUrl();
//const user = useCookie("user");

//const isLogin = computed(() => !!user.value);
//const router = useRouter();

const currentCategory = ref("全部");

const handleCategoryChange = async (category: string) => {
  currentCategory.value = category;
  videos.value = [];
  offset = 0;
  noMore.value = false;
  await fetchVideos();
};

//取得videos 列表
const fetchVideos = async () => {
  if (isLoading.value || noMore.value) return;
  isLoading.value = true;
  currentCategory.value = "People & Blogs";

  try {
    const query = new URLSearchParams({
      skip: offset.toString(),
      limit: limit.toString(),
      category: currentCategory.value,
    });

    const res = await fetch(`${apibaseUrl}/videos/list?${query}`);
    const data = await res.json();

    if (data.length === 0) {
      noMore.value = true;
      return;
    }

    videos.value.push(...data);
    offset += limit;
  } catch (err) {
    console.error("❌ 無法載入影片清單:", err);
  } finally {
    isLoading.value = false;
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

const handleScroll = () => {
  if (isLoading.value || noMore.value) return;

  const scrollBottom = window.innerHeight + window.scrollY;
  const fullHeight = document.documentElement.offsetHeight;

  if (scrollBottom >= fullHeight - 100) {
    fetchVideos();
  }
};

onMounted(() => {
  fetchVideos();
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
