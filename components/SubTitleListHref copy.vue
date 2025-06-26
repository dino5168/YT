<template>
    <!-- 選項 1: 如果父容器沒有滾動，組件自己處理滾動 -->
    <div class="subtitle-list h-full overflow-y-auto">
        <div class="space-y-2">
            <div v-for="(subtitle, index) in subtitles" :key="index" :data-index="index"
                class="p-2 cursor-pointer transition-colors rounded" :class="{
                    'bg-gray-900 border-l-4 border-yellow-500': index === activeIndex,
                    'hover:bg-gray-100': index !== activeIndex
                }" @click="handleSeekTo(subtitle.start_time, index)">
                <p class="text-blue-200 text-md">{{ subtitle.en_text }}</p>
                <p class="text-gray-200 text-md">{{ subtitle.zh_text }}</p>
            </div>
        </div>

        <!-- 調試信息 -->
        <div class="mt-4 p-2 bg-gray-800 text-white text-xs rounded">
            <p>字幕數量: {{ subtitles.length }}</p>
            <p>當前時間: {{ currentTime.toFixed(2) }}s</p>
            <p>活躍字幕: {{ activeIndex >= 0 ? activeIndex + 1 : '無' }}</p>
        </div>
    </div>

    <!-- 選項 2: 如果父容器處理滾動，組件只負責內容 -->
    <!-- 
    <div class="subtitle-list">
        <div class="space-y-2">
            <div v-for="(subtitle, index) in subtitles" :key="index" :data-index="index"
                class="p-2 cursor-pointer transition-colors rounded" :class="{
                    'bg-gray-900 border-l-4 border-yellow-500': index === activeIndex,
                    'hover:bg-gray-100': index !== activeIndex
                }" @click="handleSeekTo(subtitle.start_time, index)">
                <p class="text-blue-200 text-md">{{ subtitle.en_text }}</p>
                <p class="text-gray-200 text-md">{{ subtitle.zh_text }}</p>
            </div>
        </div>
    </div>
    -->
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import type { SubtitleItem } from '~/types/subtitle'
import { TimeUtil } from '#imports';

const props = defineProps<{
    currentTime: number
    videoId: string
}>()

const emit = defineEmits<{
    (e: 'seek-to', time: number): void
}>()

const subtitles = ref<SubtitleItem[]>([])
const config = useRuntimeConfig()
const srtBaseUrl = config.public.srtBaseUrl

const srtUrl = computed(() => `${srtBaseUrl}/${props.videoId}`)

const activeIndex = computed(() => {
    const index = subtitles.value.findIndex(sub =>
        props.currentTime >= TimeUtil.timeStringToSeconds(sub.start_time) &&
        props.currentTime < TimeUtil.timeStringToSeconds(sub.end_time)
    )
    return index
})

const handleSeekTo = (time: string, index: number) => {
    const seconds = TimeUtil.timeStringToSeconds(time)

    if (isNaN(seconds) || seconds < 0) {
        console.error('無效的跳轉時間:', time)
        return
    }

    emit('seek-to', seconds)
}

// 🔧 修正後的滾動邏輯
const scrollToActiveSubtitle = () => {
    if (activeIndex.value >= 0) {
        nextTick(() => {
            // 尋找正確的滾動容器
            const subtitleListEl = document.querySelector('.subtitle-list')
            const scrollContainer = subtitleListEl ||
                (subtitleListEl && (subtitleListEl as Element).closest('[class*="overflow-y-auto"]'))
            const targetElement = document.querySelector(`[data-index="${activeIndex.value}"]`)

            if (targetElement && scrollContainer) {
                const containerRect = scrollContainer.getBoundingClientRect()
                const elementRect = targetElement.getBoundingClientRect()

                // 檢查是否需要滾動
                const isVisible = elementRect.top >= containerRect.top + 50 &&
                    elementRect.bottom <= containerRect.bottom - 50

                if (!isVisible) {
                    // 計算滾動位置
                    const scrollTop = (targetElement as HTMLElement).offsetTop - (scrollContainer as HTMLElement).offsetTop -
                        ((scrollContainer as HTMLElement).clientHeight / 2) + ((targetElement as HTMLElement).clientHeight / 2)

                    scrollContainer.scrollTo({
                        top: scrollTop,
                        behavior: 'smooth'
                    })
                }
            }
        })
    }
}

watch(activeIndex, (newIndex, oldIndex) => {
    if (newIndex !== oldIndex && newIndex >= 0) {
        scrollToActiveSubtitle()
    }
})

onMounted(async () => {
    try {
        const response = await fetch(srtUrl.value)
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        subtitles.value = await response.json()
    } catch (err) {
        console.error('SubTitleListHref: 字幕載入失敗：', err)
    }
})
</script>

<style scoped>
.subtitle-list {
    scroll-behavior: smooth;
    scrollbar-width: thin;
}

.subtitle-list::-webkit-scrollbar {
    width: 6px;
}

.subtitle-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

.subtitle-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}

.subtitle-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}
</style>