<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">🎬 Video List</h1>
        <div v-if="pending" class="text-gray-500">Loading...</div>
        <div v-else>
            <table class="min-w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden text-sm">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="p-2 text-left">Thumbnail</th>
                        <th class="p-2 text-left">Title</th>
                        <th class="p-2 text-left">Uploader</th>
                        <th class="p-2 text-right">Views</th>
                        <th class="p-2 text-center">Upload Date</th>
                        <th class="p-2 text-center">Duration</th>
                        <th class="p-2 text-center">Link</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="video in videos" :key="video.id" class="hover:bg-gray-50 border-t">
                        <td class="p-2">
                            <img :src="thumbnailSrc(video)" alt="thumb"
                                class="w-16 aspect-video object-cover rounded" />
                        </td>
                        <td class="p-2">{{ video.title }}</td>
                        <td class="p-2">{{ video.uploader }}</td>
                        <td class="p-2 text-right">{{ formatViews(video.view_count) }}</td>
                        <td class="p-2 text-center">{{ formatDate(video.upload_date) }}</td>
                        <td class="p-2 text-center">{{ formatDuration(video.duration) }}</td>
                        <td class="p-2 text-center">
                            <a :href="video.video_url" target="_blank" class="text-blue-600 hover:underline">Watch</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Video {
    id: number;
    title: string;
    uploader: string;
    view_count: number;
    upload_date: string;
    duration: number;
    video_url: string;
    local_thumbnail_path?: string;
    thumbnail_url?: string;
}

const { data: videos, pending } = await useFetch<Video[]>('http://127.0.0.1:8000/videos/list');

// 顯示格式化時間（秒 → mm:ss）
const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

// 格式化日期（yyyymmdd → yyyy-mm-dd）
const formatDate = (raw: string) => {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
};

// 格式化觀看數
const formatViews = (views: number) => {
    return views.toLocaleString();
};

// 優先使用本機縮圖路徑，如果沒有則用 youtube 原始縮圖
const thumbnailSrc = (video: any) => {
    return video.thumbnail_url;
    /*
    return video.local_thumbnail_path?.startsWith('http')
        ? video.local_thumbnail_path
        : video.local_thumbnail_path?.replace('c:/ytdb/thumbnails', 'http://127.0.0.1:8000/thumbnails') ||
        video.thumbnail_url;
        */
};
</script>
