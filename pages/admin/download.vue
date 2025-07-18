<template>
  <div class="p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">YouTube 影片下載器</h1>
    <input
      v-model="videoId"
      type="text"
      class="border p-2 w-full mb-4 rounded"
      placeholder="輸入 YouTube Video ID（例如：dQw4w9WgXcQ）" />
    <button
      @click="submit"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
      開始下載
    </button>

    <div v-if="message" class="mt-4 text-green-600">{{ message }}</div>
    <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
    <GlobalLoading :visible="isLoading" message="正在產製字幕，請稍候..." />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

import {useBaseUrl} from "#imports";

import GlobalLoading from "~/components/Loading/GlobalLoading.vue";
const apibaseUrl = useBaseUrl();

const isLoading = ref(false); // 新增 loading 狀態

const videoId = ref("");
const message = ref("");
const error = ref("");
function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}
const submit = async () => {
  message.value = "";
  error.value = "";
  isLoading.value = true; //
  const video_id = extractYouTubeVideoId(videoId.value);
  try {
    const res = await fetch(`${apibaseUrl}/admin/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({video_id: video_id}),
    });
    const data = await res.json();
    if (res.ok) {
      message.value = `下載成功！影片 ID: ${data.video_id}`;
    } else {
      error.value = `錯誤：${data.detail}`;
    }
  } catch (err) {
    error.value = `連線失敗：${err}`;
  }
  isLoading.value = false; // 結束 loading
};
</script>
