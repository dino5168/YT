<template>
    <div class="flex flex-col md:flex-row h-[600px] bg-gray-950">
        <!-- 左側播放器 -->
        <!--螢幕上的字幕-->
        <div :class="[
            'p-4 flex flex-col transition-all duration-500 ease-in-out',
            // 修復 mobile 高度問題
            showSubtitles ?
                'w-full md:w-2/3 h-[500px] md:h-full' :
                'w-full md:w-full h-[500px] md:h-full'
        ]">

            <div class="bg-white shadow-lg overflow-hidden flex-1">
                <YouTubePlayer ref="playerRef" :video-id="videoId" :subtitles="subtitles"
                    @time-update="handleTimeUpdate" @duration-update="handleDurationUpdate" class="w-full h-full" />
            </div>
        </div>

        <!-- 右側字幕 -->
        <div v-if="showSubtitles" class="w-full  md:w-1/3 flex flex-col flex-1 h-[650px] md:py-4">
            <div
                class="bg-white shadow-lg rounded-sm border border-blue-900 flex flex-col  md:ml-0 mb-6 md:mx-0 md:mr-6 overflow-hidden">

                <div class="flex items-center justify-between rounded-sm">
                    <!-- 標題 -->
                    <h3 class="font-bold text-lg flex items-center px-4 gap-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                        </svg>
                        字幕列表
                    </h3>
                    <div class="pr-6">
                        <!-- 工具按鈕 -->
                        <div class="flex items-center">
                            <IconButton tooltip="列印字幕">
                                <template #icon>
                                    <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor"
                                        stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M11 5h4l6 6v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6z" />
                                    </svg>
                                </template>
                            </IconButton>

                            <IconButton tooltip="關閉字幕" @click="hideSubtitles">
                                <template #icon>
                                    <svg class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </template>
                            </IconButton>
                        </div>

                    </div>

                </div>


                <div class="flex-1  bg-blue-900 min-h-0">
                    <div class="h-full">
                        <SubTitleListHref :current-time="currentTime" :video-id="videoId" @seek-to="handleSeekTo"
                            class="h-full" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 顯示字幕按鈕 -->
        <!-- 顯示字幕側邊按鈕，只在字幕關閉時出現 -->
        <div v-if="!showSubtitles" class="fixed top-1/2 right-0 transform -translate-y-1/2 z-50">
            <button @click="showSubtitles = true"
                class="group flex items-center justify-center bg-blue-900 text-white px-3 py-4 rounded-l-lg shadow-lg hover:cursor-pointer hover:bg-blue-600 transition-all">
                <!-- 直排文字 -->
                <span class="text-sm" style="writing-mode: vertical-rl; text-orientation: upright;">展開字幕</span>
            </button>
        </div>
        <!-- 調試信息 
        <div class="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded text-xs max-w-xs">
            <p><strong>調試信息:</strong></p>
            <p>字幕數量: {{ subtitles.length }}</p>
            <p>當前時間: {{ currentTime.toFixed(2) }}s</p>
            <p>載入狀態: {{ loadStatus }}</p>
            <div v-if="subtitles.length > 0" class="mt-2 text-green-300">
                <p>第一個字幕: {{ timeToSeconds(subtitles[0].start_time) }}s - {{ timeToSeconds(subtitles[0].end_time)
                    }}s
                </p>
                <p>EN: {{ subtitles[0].en_text.substring(0, 30) }}...</p>
                <p>ZH: {{ subtitles[0].zh_text.substring(0, 30) }}...</p>
            </div>
        </div>
        -->
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
const hideSubtitles = () => {
    console.log('隱藏字幕功能尚未實作')
    showSubtitles.value = false
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

        //console.log('嘗試載入字幕API:', apiUrl)
        //console.log('當前 videoId:', props.videoId)

        const res = await fetch(apiUrl)
        //console.log('Fetch 響應狀態:', res.status, res.statusText)

        if (!res.ok) {
            throw new Error(`找不到字幕資料: ${apiUrl} (HTTP ${res.status})`)
        }

        const jsonData = await res.json()
        //console.log('字幕JSON載入成功，數量:', jsonData.length)
        //console.log('字幕JSON內容:', jsonData)

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