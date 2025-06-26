<template>

    <div class="flex-1 min-h-0 flex flex-col space-y-4">
        <!-- 播放器與字幕顯示 -->
        <div class="relative aspect-video w-full md:flex-1 md:min-h-0">
            <div v-if="!isPlaying"
                class="absolute inset-0 h-screen bg-gray-950/70 z-8999 flex items-center justify-center">
                <button @click="togglePlay"
                    class="text-white text-xl px-6 py-3 bg-indigo-600 hover:cursor-pointer rounded">▶️ 播放</button>
            </div>

            <div id="youtube-player" class="w-full h-[560px]  lg:h-[560px]  overflow-hidden"></div>
            <!--
            <div class="relative w-full aspect-video h-[280px] lg:h-[560px]">
                <div id="youtube-player" class="absolute inset-0 w-full h-full overflow-hidden"></div>
            </div>
            -->
            <!--字幕顯示 可以 Drag-->
            <transition name="fade">
                <div v-if="activeSubtitle" ref="subtitleBox"
                    class="absolute cursor-move bg-black/70 text-white px-4 py-2 rounded text-center text-lg max-w-xl space-y-1 select-none"
                    :style="{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        zIndex: 1000
                    }" @mousedown="startDrag">
                    <!-- 顯示英文字幕 -->
                    <p v-if="activeSubtitle.en_text" class="text-blue-400 text-2xl font-semibold">
                        {{ activeSubtitle.en_text }}
                    </p>
                    <!-- 顯示中文字幕 -->
                    <p v-if="activeSubtitle.zh_text" class="text-white text-2xl font-semibold">
                        {{ activeSubtitle.zh_text }}
                    </p>
                </div>
            </transition>

        </div>

        <!-- 控制區 -->
        <div class="flex items-center gap-4 flex-wrap">
            <PlayerControls class="hidden lg:block" />
            <!--
            <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                @click="togglePlay">
                {{ isPlaying ? '⏸️ 暫停' : '▶️ 播放' }}
            </button>
            <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition" @click="reset">
                🔄 重置
            </button>
            -->
        </div>


    </div>
</template>

<script setup lang="ts">
// Declare YT as a global variable for TypeScript
declare global {
    interface Window {
        YT: any
        onYouTubeIframeAPIReady: () => void
    }
}
declare var YT: any

import { ref, onMounted, onUnmounted, computed, defineExpose, watch, nextTick } from 'vue'
import type { SubtitleItem } from '~/types/subtitle'


const props = defineProps<{
    videoId: string
    subtitles: SubtitleItem[]
}>()

const emit = defineEmits<{
    (e: 'time-update', time: number): void
    (e: 'duration-update', duration: number): void
}>()

const player = ref<any>(null)
const currentTime = ref(0)
const totalDuration = ref(0)
const isPlaying = ref(false)
const playerReady = ref(false)
let playInterval: ReturnType<typeof setInterval> | null = null

// 字幕拖拽相關
const position = ref({ x: 100, y: 400 })
const subtitleBox = ref<HTMLElement>()
let dragging = false
let offset = { x: 0, y: 0 }

// 時間格式轉換函數：將 "00:00:14,080" 轉換為秒數
const timeStringToSeconds = (timeString: string): number => {
    try {
        const [time, milliseconds] = timeString.split(',')
        const [hours, minutes, seconds] = time.split(':').map(Number)
        const ms = parseInt(milliseconds) / 1000
        return hours * 3600 + minutes * 60 + seconds + ms
    } catch (error) {
        console.error('時間轉換錯誤:', timeString, error)
        return 0
    }
}

// 載入 YouTube IFrame API
const loadYouTubeAPI = () => {
    if (window.YT && window.YT.Player) {
        initPlayer()
        return
    }

    // 檢查是否已經載入 API
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        // API 已載入但可能還沒準備好
        const checkReady = () => {
            if (window.YT && window.YT.Player) {
                initPlayer()
            } else {
                setTimeout(checkReady, 100)
            }
        }
        checkReady()
        return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)

    // 設置全域回調
    window.onYouTubeIframeAPIReady = initPlayer
}

onMounted(() => {
    console.log('Component mounted, loading YouTube API...')
    loadYouTubeAPI()
})

onUnmounted(() => {
    // 清理拖拽事件監聽器
    if (dragging) {
        document.removeEventListener('mousemove', onDrag)
        document.removeEventListener('mouseup', stopDrag)
        document.body.style.userSelect = ''
    }
    // 清理播放時間追蹤
    if (playInterval) clearInterval(playInterval)
})

// 初始化播放器
const initPlayer = () => {
    console.log('Initializing player...')
    nextTick(() => {
        if (!window.YT || !window.YT.Player) {
            console.log('YouTube API not ready, retrying...')
            setTimeout(initPlayer, 100)
            return
        }

        const playerElement = document.getElementById('youtube-player')
        if (!playerElement) {
            console.error('YouTube player element not found')
            setTimeout(initPlayer, 100)
            return
        }

        console.log('Creating YouTube player with videoId:', props.videoId)
        player.value = new window.YT.Player('youtube-player', {
            height: '480',
            width: '800',
            videoId: props.videoId,
            playerVars: {
                // 關閉 YouTube 內建字幕避免衝突
                cc_load_policy: 0,
                // 自動播放設為 0，需要用戶互動
                autoplay: 0,
                // 其他參數
                modestbranding: 1,
                rel: 0
            },
            events: {
                onReady: (event: any) => {
                    console.log('Player Ready')
                    playerReady.value = true
                    const duration = event.target.getDuration()
                    totalDuration.value = duration
                    emit('duration-update', duration)
                },
                onStateChange: handleStateChange,
                onError: (event: any) => {
                    console.error('YouTube Player Error:', event.data)
                }
            },
        })
    })
}

// 監聽 videoId 變化
watch(() => props.videoId, (newVideoId) => {
    console.log('VideoId changed to:', newVideoId)
    if (newVideoId && player.value && playerReady.value) {
        player.value.cueVideoById(newVideoId)
        currentTime.value = 0
    }
}, { immediate: true })

// 監聽 subtitles 變化
watch(() => props.subtitles, (newSubtitles) => {
    console.log('Subtitles updated, count:', newSubtitles.length)
    if (newSubtitles.length > 0) {
        console.log('First subtitle:', {
            seq: newSubtitles[0].seq,
            start: newSubtitles[0].start_time,
            end: newSubtitles[0].end_time,
            en: newSubtitles[0].en_text,
            zh: newSubtitles[0].zh_text
        })
    }
}, { immediate: true, deep: true })

// 處理播放狀態變更
const handleStateChange = (event: any) => {
    const state = event.data

    if (state === window.YT.PlayerState.PLAYING) {
        isPlaying.value = true
        startTrackingTime()
    } else {
        isPlaying.value = false
        if (state === window.YT.PlayerState.PAUSED) {
            stopTrackingTime()
        } else if (state === window.YT.PlayerState.ENDED) {
            alert("Player End")
        }
    }
}

// 播放中定時更新時間
const startTrackingTime = () => {
    stopTrackingTime()

    playInterval = setInterval(() => {
        if (player.value && player.value.getCurrentTime) {
            const time = player.value.getCurrentTime()
            currentTime.value = time
            emit('time-update', time)

            const duration = player.value.getDuration()
            if (duration !== totalDuration.value) {
                totalDuration.value = duration
                emit('duration-update', duration)
            }
        }
    }, 100)
}

const stopTrackingTime = () => {
    if (playInterval) {
        clearInterval(playInterval)
        playInterval = null
    }
}

// 播放／暫停
const togglePlay = () => {
    if (!player.value || !playerReady.value) {
        return
    }
    if (isPlaying.value) {
        player.value.pauseVideo()
    } else {
        player.value.playVideo()
    }
}

// 重置播放
const reset = () => {
    if (player.value && playerReady.value) {
        player.value.seekTo(0)
        player.value.pauseVideo()
        currentTime.value = 0
    }
}

// 跳轉到指定時間
const seekTo = (time: number) => {
    console.log('YouTubePlayer: 收到跳轉請求，時間:', time, '播放器準備狀態:', playerReady.value)

    if (!player.value) {
        console.warn('YouTubePlayer: player 未初始化')
        return
    }

    if (!playerReady.value) {
        console.warn('YouTubePlayer: 播放器未準備好')
        return
    }

    try {
        // 確保播放器有 seekTo 方法
        if (typeof player.value.seekTo !== 'function') {
            console.error('YouTubePlayer: seekTo 方法不存在')
            return
        }

        console.log('YouTubePlayer: 執行跳轉...')
        player.value.seekTo(time, true) // 第二個參數 true 表示允許在緩衝時跳轉
        player.value.playVideo() // 自動播放
        // 手動更新當前時間
        currentTime.value = time
        emit('time-update', time)

        console.log('YouTubePlayer: 跳轉完成')

    } catch (error) {
        console.error('YouTubePlayer: 跳轉時發生錯誤:', error)
    }
}

// 字幕拖拽功能
// 獲取播放器容器邊界
const getPlayerBounds = () => {
    const playerElement = document.getElementById('youtube-player')
    return playerElement?.getBoundingClientRect() || { width: 800, height: 480, left: 0, top: 0 }
}

// 限制字幕在播放器範圍內
const constrainPosition = (x: number, y: number) => {
    const playerBounds = getPlayerBounds()
    const subtitleWidth = subtitleBox.value?.offsetWidth || 200
    const subtitleHeight = subtitleBox.value?.offsetHeight || 60

    return {
        x: Math.min(Math.max(x, 0), playerBounds.width - subtitleWidth),
        y: Math.min(Math.max(y, 0), playerBounds.height - subtitleHeight)
    }
}

// 開始拖拽
const startDrag = (e: MouseEvent) => {
    e.preventDefault() // 防止默認行為
    dragging = true

    // 計算滑鼠相對於字幕框的偏移
    offset = {
        x: e.clientX - position.value.x,
        y: e.clientY - position.value.y,
    }

    // 添加全局事件監聽器
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)

    // 防止文字選擇
    document.body.style.userSelect = 'none'

    console.log('開始拖拽字幕，初始位置:', position.value)
}

// 拖拽中
const onDrag = (e: MouseEvent) => {
    if (!dragging) return

    // 計算新位置
    const newX = e.clientX - offset.x
    const newY = e.clientY - offset.y

    // 應用邊界限制
    const constrainedPosition = constrainPosition(newX, newY)
    position.value = constrainedPosition
}

// 停止拖拽
const stopDrag = () => {
    if (!dragging) return

    dragging = false

    // 移除事件監聽器
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)

    // 恢復文字選擇
    document.body.style.userSelect = ''

    console.log('停止拖拽字幕，最終位置:', position.value)
}


// 顯示當前字幕 - 適配新的JSON格式
const activeSubtitle = computed(() => {
    const subtitle = props.subtitles.find((s) => {
        const startTime = timeStringToSeconds(s.start_time)
        const endTime = timeStringToSeconds(s.end_time)
        return currentTime.value >= startTime && currentTime.value < endTime
    })

    // 調試日誌
    if (subtitle && Math.floor(currentTime.value * 10) % 10 === 0) {
        console.log(`Active subtitle at ${currentTime.value.toFixed(2)}s:`, {
            seq: subtitle.seq,
            en: subtitle.en_text.substring(0, 30) + '...',
            zh: subtitle.zh_text.substring(0, 30) + '...'
        })
    }

    return subtitle
})

// 暴露方法給父組件
defineExpose({
    player: computed(() => player.value),
    seekTo,
    playerReady: computed(() => playerReady.value)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 拖拽時的游標樣式 */
.cursor-move:active {
    cursor: grabbing;
}

/* 防止拖拽時選擇文字 */
.select-none {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
</style>