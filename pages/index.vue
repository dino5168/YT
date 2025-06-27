<template>
    <div class="p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <YTCard v-for="video in videos" :key="video.id" :title="video.title" :videoId="video.id"
                :thumbnail="getThumbnailUrl(video)" :duration="formatDuration(video.duration)"
                :tags="['影片', video.uploader]" language="英文" level="B1" />
        </div>

        <!-- 👇 loading 狀態 -->
        <div v-if="isLoading" class="text-center py-4 text-gray-500">載入中...</div>
        <div v-else-if="noMore" class="text-center py-4 text-gray-400">已載入全部影片</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import YTCard from '~/components/Card/YTCard.vue'
import { useBaseUrl } from '#imports'
// 頁面標題
useHead({
    title: '多媒體英語教學'
})

interface VideoItem {
    id: string
    title: string
    uploader: string
    duration: number
    local_thumbnail_path: string
    thumbnail_url: string
}

const videos = ref<VideoItem[]>([])
const isLoading = ref(false)
const noMore = ref(false)

const limit = 10
let offset = 0

const apibaseUrl = useBaseUrl()
const user = useCookie('user')

const isLogin = computed(() => !!user.value)
const router = useRouter()


const fetchVideos = async () => {
    if (isLoading.value || noMore.value) return
    isLoading.value = true

    try {
        const res = await fetch(`${apibaseUrl}/videos/list`)
        const data = await res.json()
        if (data.length === 0 || offset >= data.length) {
            noMore.value = true
            return
        }
        // 模擬分頁（實際應從 API 取得分頁）
        const nextPage = data.slice(offset, offset + limit)
        videos.value.push(...nextPage)
        offset += limit
    } catch (err) {
        console.error('❌ 無法載入影片清單:', err)
    } finally {
        isLoading.value = false
    }
}

const getThumbnailUrl = (video: VideoItem): string => {
    const filename = video.local_thumbnail_path?.split('/').pop()
    return filename ? `${apibaseUrl}/thumbnails/${filename}` : video.thumbnail_url
}

const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const handleScroll = () => {
    const scrollBottom = window.innerHeight + window.scrollY
    const fullHeight = document.documentElement.offsetHeight
    if (scrollBottom >= fullHeight - 50) {
        fetchVideos()
    }
}

onMounted(() => {

    fetchVideos()
    window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>
