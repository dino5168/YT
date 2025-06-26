<template>
    <div class="relative w-full aspect-video">
        <div ref="playerEl" class="w-full h-full"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { SubtitleItem } from '~/types/subtitle'

const props = defineProps<{
    videoId: string
    subtitles: SubtitleItem[]
}>()

const emit = defineEmits<{
    (e: 'time-update', time: number): void
    (e: 'duration-update', duration: number): void
}>()

const playerEl = ref<HTMLDivElement | null>(null)
const player = ref<any>(null)
const timeUpdateInterval = ref<number | null>(null)

// 載入 YouTube Iframe API
function loadYouTubeAPI(): Promise<void> {
    return new Promise((resolve) => {
        if ((window as any).YT && (window as any).YT.Player) {
            resolve()
        } else {
            const tag = document.createElement('script')
            tag.src = 'https://www.youtube.com/iframe_api'
            const firstScriptTag = document.getElementsByTagName('script')[0]
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

                ; (window as any).onYouTubeIframeAPIReady = () => {
                    resolve()
                }
        }
    })
}

const createPlayer = () => {
    if (!playerEl.value || !props.videoId) return

    player.value = new (window as any).YT.Player(playerEl.value, {
        videoId: props.videoId,
        playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
        },
        events: {
            onReady: (event: any) => {
                emit('duration-update', event.target.getDuration())
                startTimeUpdates()
            },
        },
    })
}

// 每秒傳播當前播放時間
function startTimeUpdates() {
    if (timeUpdateInterval.value) return

    timeUpdateInterval.value = window.setInterval(() => {
        if (player.value && player.value.getCurrentTime) {
            emit('time-update', player.value.getCurrentTime())
        }
    }, 500)
}

function stopTimeUpdates() {
    if (timeUpdateInterval.value) {
        clearInterval(timeUpdateInterval.value)
        timeUpdateInterval.value = null
    }
}

// 外部呼叫跳轉時間
function seekTo(time: number) {
    if (player.value?.seekTo) {
        player.value.seekTo(time, true)
    }
}

onMounted(async () => {
    await loadYouTubeAPI()
    createPlayer()
})

onUnmounted(() => {
    stopTimeUpdates()
    if (player.value?.destroy) {
        player.value.destroy()
    }
})

// 動態切換影片
watch(() => props.videoId, (newId) => {
    if (player.value?.loadVideoById) {
        player.value.loadVideoById(newId)
    } else {
        createPlayer()
    }
})
</script>
