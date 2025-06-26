<template>
    <div>
        <VideoPlayerContainer :video-id="slug" />

    </div>
    <div class="h-[20rem] bg-gray-950">
        <h1 class="text-white font-bold">英文說明</h1>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import YouTubePlayer from '~/components/YouTubePlayer.vue'
import type { SubtitleItem } from '~/types/subtitle'


// 讀取路由參數 slug 作為影片 ID
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const subtitles = ref<SubtitleItem[]>([])
const currentTime = ref(0)
const duration = ref(0)

// 宣告 YouTubePlayer 實例型別
type YouTubePlayerInstance = InstanceType<typeof YouTubePlayer> & {
    player?: any
    seekTo?: (time: number) => void
    playerReady?: boolean
}

const yt = ref<YouTubePlayerInstance>()

const onTimeUpdate = (time: number) => {
    currentTime.value = time
}

const onDurationUpdate = (d: number) => {
    duration.value = d
}

const onJump = (time: number) => {
    console.log('跳轉到時間:', time, 'YouTubePlayer ref:', yt.value)

    if (!yt.value) {
        console.error('YouTubePlayer ref 不存在')
        return
    }

    // 檢查播放器是否準備就緒
    if (!yt.value.playerReady) {
        console.warn('播放器尚未準備就緒，等待中...')
        // 等待播放器準備就緒後再執行跳轉
        const checkReady = setInterval(() => {
            if (yt.value?.playerReady) {
                clearInterval(checkReady)
                performSeek(time)
            }
        }, 100)
        return
    }

    performSeek(time)
}

const performSeek = (time: number) => {
    try {
        if (yt.value?.seekTo) {
            yt.value.seekTo(time)
            console.log('使用 seekTo 方法跳轉成功')
        } else if (yt.value?.player?.seekTo) {
            yt.value.player.seekTo(time, true)
            console.log('使用 player.seekTo 方法跳轉成功')
        } else {
            console.error('找不到可用的跳轉方法')
        }
        currentTime.value = time
    } catch (error) {
        console.error('跳轉時發生錯誤:', error)
    }
}

const onSeek = (time: number) => {
    console.log('時間軸拖動到:', time)
    onJump(time)
}

// 偵測播放器 ref 是否建立
watch(yt, (newVal) => {
    console.log('YouTube Player ref 變化:', newVal)
}, { immediate: true })

// 偵測字幕更新
watch(subtitles, (newVal) => {
    console.log('字幕數量更新:', newVal.length)
}, { deep: true })
</script>