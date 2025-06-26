<template>
    <div class="flex flex-col md:flex-row min-h-[600px] bg-gray-200">
        <!-- 左側播放器 -->
        <div :class="[
            'p-2 md:p-4 flex flex-col transition-all duration-500 ease-in-out',
            // 修復 mobile 高度問題 - 使用 aspect-ratio 確保正確比例
            showSubtitles ?
                'w-full md:w-2/3' :
                'w-full md:w-full'
        ]">
            <!-- 使用 aspect-ratio 容器確保 16:9 比例 -->
            <div class="bg-white shadow-lg overflow-hidden w-full aspect-video">
                <YouTubePlayer ref="playerRef" :video-id="videoId" :subtitles="subtitles"
                    @time-update="handleTimeUpdate" @duration-update="handleDurationUpdate" class="w-full h-full" />
            </div>
        </div>

        <!-- 右側字幕 - 添加 transition 包裹 -->
        <transition name="slide-fade" enter-active-class="transition-all duration-500 ease-out"
            leave-active-class="transition-all duration-300 ease-in"
            enter-from-class="transform translate-x-full opacity-0" enter-to-class="transform translate-x-0 opacity-100"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform translate-x-full opacity-0">
            <div v-if="showSubtitles" class="w-full md:w-1/3 flex flex-col mt-4 md:mt-0 md:py-4">
                <div
                    class="bg-white shadow-lg rounded-sm border border-blue-900 flex flex-col md:ml-0 md:mx-0 md:mr-6 overflow-hidden transform transition-all duration-300 h-[300px] md:h-full">

                    <div class="flex items-center justify-between rounded-sm flex-shrink-0">
                        <!-- 標題 -->
                        <h3 class="font-bold text-lg flex items-center px-4 py-2 gap-2">
                            <svg class="w-5 h-5 transition-transform duration-200 hover:scale-110" fill="currentColor"
                                viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                            </svg>
                            字幕列表
                        </h3>
                        <div class="pr-4">
                            <!-- 工具按鈕 -->
                            <div class="flex items-center gap-1">
                                <IconButton tooltip="列印字幕">
                                    <template #icon>
                                        <svg class="h-5 w-5 md:h-6 md:w-6 text-yellow-400 transition-all duration-200 hover:scale-110 hover:text-yellow-300"
                                            fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M11 5h4l6 6v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6z" />
                                        </svg>
                                    </template>
                                </IconButton>

                                <IconButton tooltip="關閉字幕" @click="hideSubtitles">
                                    <template #icon>
                                        <svg class="h-5 w-5 md:h-6 md:w-6 text-red-500 transition-all duration-200 hover:scale-110 hover:text-red-400 hover:rotate-90"
                                            fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </template>
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 bg-blue-900 min-h-0 overflow-hidden">
                        <div class="h-full">
                            <SubTitleListHref :current-time="currentTime" :video-id="videoId" @seek-to="handleSeekTo"
                                class="h-full" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- 顯示字幕按鈕 - 添加動畫效果 -->
        <!-- 顯示字幕側邊按鈕，只在字幕關閉時出現 -->
        <transition name="slide-in" enter-active-class="transition-all duration-400 ease-out delay-300"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="transform translate-x-full opacity-0" enter-to-class="transform translate-x-0 opacity-100"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform translate-x-full opacity-0">
            <div v-if="!showSubtitles" class="fixed top-1/2 right-0 transform -translate-y-1/2 z-50">
                <button @click="showSubtitlesWithAnimation"
                    class="group flex items-center justify-center bg-blue-900 text-white px-3 py-4 rounded-l-lg shadow-lg hover:cursor-pointer hover:bg-blue-600 transition-all duration-300 hover:px-4 hover:shadow-xl transform hover:scale-105">
                    <!-- 直排文字 -->
                    <span class="text-sm transition-all duration-200 group-hover:text-blue-100"
                        style="writing-mode: vertical-rl; text-orientation: upright;">展開字幕</span>

                    <!-- 添加動畫指示箭頭 -->
                    <div
                        class="absolute -left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                </button>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import YouTubePlayer from './YouTubePlayer.vue'
import SubTitleListHref from './SubTitleListHref.vue'

import IconButton from './Buttons/IconButton.vue'
import type { SubtitleItem } from '~/types/subtitle'

const props = defineProps<{
    videoId: string
}>()

const currentTime = ref(0)
const playerRef = ref<any>()
const subtitles = ref<SubtitleItem[]>([])
const loadStatus = ref('未開始')

const showSubtitles = ref(true)

// 隱藏字幕 - 添加動畫效果
const hideSubtitles = () => {
    console.log('隱藏字幕')
    showSubtitles.value = false
}

// 顯示字幕 - 添加動畫效果
const showSubtitlesWithAnimation = () => {
    console.log('顯示字幕')
    showSubtitles.value = true
}

// 時間字串轉秒數 - 適配新格式
function timeToSeconds(timeStr: string): number {
    try {
        // 移除空格並處理可能的格式問題
        const cleanTimeStr = timeStr.trim()

        // 支援兩種格式: HH:MM:SS,mmm 和 HH:MM:SS.mmm
        const timeRegex = /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/
        const match = cleanTimeStr.match(timeRegex)

        if (!match) {
            console.error('時間格式錯誤:', timeStr)
            return 0
        }

        const [, hours, minutes, seconds, milliseconds] = match
        const totalSeconds =
            parseInt(hours) * 3600 +
            parseInt(minutes) * 60 +
            parseInt(seconds) +
            parseInt(milliseconds) / 1000

        return totalSeconds
    } catch (error) {
        console.error('解析時間錯誤:', timeStr, error)
        return 0
    }
}

// 載入字幕檔 - 改為載入JSON格式
onMounted(async () => {
    try {
        loadStatus.value = '載入中...'
        const config = useRuntimeConfig()
        const srtBaseUrl = config.public.srtBaseUrl

        // API端點 - 假設您的API返回JSON格式
        const apiUrl = `${srtBaseUrl}/${props.videoId}`

        const res = await fetch(apiUrl)

        if (!res.ok) {
            throw new Error(`找不到字幕資料: ${apiUrl} (HTTP ${res.status})`)
        }

        const jsonData = await res.json()

        // 驗證JSON格式
        if (!Array.isArray(jsonData)) {
            throw new Error('字幕資料格式錯誤：不是陣列格式')
        }

        // 驗證每個字幕項目的格式
        const validSubtitles = jsonData.filter((item, index) => {
            const isValid = (
                typeof item.seq === 'number' &&
                typeof item.start_time === 'string' &&
                typeof item.end_time === 'string' &&
                typeof item.en_text === 'string' &&
                typeof item.zh_text === 'string'
            )

            if (!isValid) {
                console.warn(`字幕項目 ${index} 格式錯誤:`, item)
            }

            return isValid
        })

        subtitles.value = validSubtitles
        loadStatus.value = `成功載入 ${validSubtitles.length} 個字幕`

        if (validSubtitles.length === 0) {
            console.warn('警告: 沒有有效的字幕資料')
        } else {
            console.log('第一個字幕:', validSubtitles[0])
        }

    } catch (err) {
        console.error('字幕載入失敗：', err)
        loadStatus.value = `載入失敗: ${err || '未知錯誤'}`

        // 提供測試資料
        console.log('=== 使用測試字幕資料 ===')
        const testSubtitles: SubtitleItem[] = [
            {
                seq: 1,
                start_time: "00:00:07,080",
                end_time: "00:00:10,840",
                en_text: "Hello world",
                zh_text: "你好世界"
            },
            {
                seq: 2,
                start_time: "00:00:10,840",
                end_time: "00:00:15,199",
                en_text: "This is a test subtitle",
                zh_text: "這是一個測試字幕"
            }
        ]

        subtitles.value = testSubtitles
        loadStatus.value = `使用測試字幕 (${testSubtitles.length} 個)`
    }
})

// 播放器回傳的時間更新
function handleTimeUpdate(time: number) {
    currentTime.value = time
}

function handleDurationUpdate(duration: number) {
    console.log('影片長度:', duration)
}

// 點選字幕跳轉
function handleSeekTo(time: number) {
    console.log('VideoPlayerContainer: 收到跳轉請求，時間:', time)

    if (!playerRef.value) {
        console.warn('VideoPlayerContainer: playerRef 未定義')
        return
    }

    if (!playerRef.value.playerReady) {
        console.warn('VideoPlayerContainer: 播放器未準備好')
        return
    }

    // 嘗試不同的跳轉方法
    if (typeof playerRef.value.seekTo === 'function') {
        console.log('VideoPlayerContainer: 使用 playerRef.seekTo')
        playerRef.value.seekTo(time)
    } else if (playerRef.value.player && typeof playerRef.value.player.seekTo === 'function') {
        console.log('VideoPlayerContainer: 使用 playerRef.player.seekTo')
        playerRef.value.player.seekTo(time, true)
    } else {
        console.warn('VideoPlayerContainer: 找不到可用的 seekTo 方法')
        console.log('VideoPlayerContainer: playerRef 內容:', playerRef.value)
    }
}
</script>

<style scoped>
/* 額外的自定義動畫樣式 */
@keyframes slideInFromRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutToRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }

    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

/* 響應式動畫調整 */
@media (max-width: 768px) {

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: translateY(100%) !important;
    }

    .slide-in-enter-from,
    .slide-in-leave-to {
        transform: translateY(100%) !important;
    }
}

/* 按鈕脈衝動畫 */
@keyframes pulse-subtle {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

.animate-pulse-subtle {
    animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>