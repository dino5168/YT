<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
        <div class="max-w-5xl mx-auto">
            <!-- 載入狀態 -->
            <div v-if="loading" class="bg-white rounded-2xl shadow-lg p-8">
                <div class="animate-pulse space-y-6">
                    <div class="h-8 bg-gray-200 rounded-lg w-3/4"></div>
                    <div class="aspect-video bg-gray-200 rounded-xl"></div>
                    <div class="space-y-3">
                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div class="h-4 bg-gray-200 rounded w-2/5"></div>
                    </div>
                </div>
            </div>

            <!-- 錯誤狀態 -->
            <div v-else-if="error" class="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div class="text-red-500 mb-4">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">載入失敗</h2>
                <p class="text-gray-600 mb-6">{{ error }}</p>
                <button @click="loadVideo"
                    class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    重試
                </button>
            </div>

            <!-- 視頻內容 -->
            <div v-else-if="video" class="bg-white rounded-2xl shadow-lg overflow-hidden">
                <!-- 標題區域 -->
                <div class="p-6 md:p-8 border-b border-gray-100">
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                        {{ video.title }}
                    </h1>

                    <!-- 視頻統計信息 -->
                    <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                </path>
                            </svg>
                            <span>{{ formatViewCount(video.view_count) }} 次觀看</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>{{ formatDuration(video.duration) }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                </path>
                            </svg>
                            <span>{{ formatDate(video.upload_date) }}</span>
                        </div>
                    </div>
                </div>


                <!-- 視頻預覽圖 -->
                <div class="relative group">
                    <img :src='jpgUrl' alt="視頻預覽圖" class="w-full aspect-video object-cover bg-gray-100"
                        @error="handleImageError" />

                    <!-- 
                    <div
                        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg class="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                    -->
                </div>

                <!-- 詳細信息 -->
                <div class="p-6 md:p-8 space-y-6">
                    <!-- 上傳者信息 -->
                    <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {{ getInitials(video.uploader) }}
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 mb-1">{{ video.uploader }}</h3>
                            <p class="text-sm text-gray-600">內容創作者</p>
                        </div>
                    </div>

                    <!-- 技術信息 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 border border-gray-200 rounded-xl">
                            <h4 class="font-medium text-gray-900 mb-2">視頻格式</h4>
                            <p class="text-gray-600">{{ video.format || '標準格式' }}</p>
                        </div>
                        <div class="p-4 border border-gray-200 rounded-xl">
                            <h4 class="font-medium text-gray-900 mb-2">視頻時長</h4>
                            <p class="text-gray-600">{{ formatDuration(video.duration) }}</p>
                        </div>
                    </div>

                    <!-- 操作按鈕 -->
                    <div class="flex flex-col sm:flex-row gap-4 pt-4">
                        <a :href="video.video_url" target="_blank" rel="noopener noreferrer"
                            class="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            前往 YouTube 播放
                        </a>

                        <button @click="shareVideo"
                            class="flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-medium">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z">
                                </path>
                            </svg>
                            分享
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useBaseUrl } from '#imports'
const route = useRoute()
const video = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const baseUrl = useBaseUrl()

onMounted(() => {
    loadVideo()
})

async function loadVideo() {
    const id = route.params.id
    loading.value = true
    error.value = null

    try {
        const res = await fetch(`${baseUrl}/videos/${id}`)

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        video.value = data
    } catch (err) {
        console.error('載入視頻失敗:', err)
        error.value = err instanceof Error ? err.message : '未知錯誤，請稍後重試'
    } finally {
        loading.value = false
    }
}

function formatDate(dateStr: string): string {
    if (!dateStr || dateStr.length !== 8) return '未知日期'

    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)

    const date = new Date(`${year}-${month}-${day}`)
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

function formatDuration(seconds: number): string {
    if (!seconds || seconds < 0) return '未知時長'

    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
        return `${hours} 小時 ${mins} 分 ${secs} 秒`
    } else {
        return `${mins} 分 ${secs} 秒`
    }
}

function formatViewCount(count: number): string {
    if (!count || count < 0) return '0'

    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`
    } else {
        return count.toLocaleString()
    }
}

function getInitials(name: string): string {
    if (!name) return '?'

    const words = name.trim().split(' ')
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase()
    } else {
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
    }
}

function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJIMTc2VjEwOEgxNDRWNzJaIiBmaWxsPSIjOUI5QkE0Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjEyIj7niZvnianmsKHlnovlpLHmlYg8L3RleHQ+Cjwvc3ZnPgo='
}

async function shareVideo() {
    if (!video.value) return

    const shareData = {
        title: video.value.title,
        text: `觀看這個視頻: ${video.value.title}`,
        url: video.value.video_url
    }

    try {
        if (navigator.share) {
            await navigator.share(shareData)
        } else {
            // 降級到複製連結
            await navigator.clipboard.writeText(video.value.video_url)
            alert('連結已複製到剪貼板!')
        }
    } catch (err) {
        console.error('分享失敗:', err)
    }
}
// http://127.0.0.1:8000/thumbnails/dk9hXhdTkuE.jpg
//http://127.0.0.1:8000/thumbnails/default.jpg
const jpgUrl = computed(() => {
    const id = video.value?.id
    const jpgUrl = `http://127.0.0.1:8000/thumbnails/${id || 'default'}.jpg`
    console.log('生成的 JPG URL:', jpgUrl)
    return jpgUrl
})


</script>

<style scoped>
/* 自定義滾動條 */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* 載入動畫 */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>