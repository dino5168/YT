<template>
    <button class="group block" @click="togglePlay">
        <div>
            <!-- 頭像與動畫背景 -->
            <div class="relative size-[136px]">
                <span class="absolute inset-[-22px] block rounded-full transition-all" :class="[
                    'bg-[#242424]',
                    isPlaying ? 'animate-pingOnce bg-[#2F48FA]' : '',
                ]" :style="`-webkit-clip-path:url(#${clipId});clip-path:url(#${clipId})`">
                    <img :alt="name" :src="image" class="size-full" style="color: transparent" />
                    <!-- ClipPath SVG -->
                    <svg width="178" height="178" viewBox="0 0 178 178" class="absolute size-0">
                        <clipPath :id="clipId">
                            <path
                                d="M90.8251 21.0135C111.528 21.4169 130.347 30.9991 142.917 47.3074C155.139 63.1633 159.731 85.315 155.41 104.803C151.045 124.495 136.753 141.497 118.499 150.396C100.057 159.387 78.5635 159.014 59.9414 150.396C41.0294 141.644 27.9479 125.634 23.0959 105.515C18.1837 85.1452 21.8144 63.7061 34.9582 47.3074C48.1335 30.8695 68.3068 20.5748 90.8251 21.0135Z" />
                        </clipPath>
                    </svg>
                </span>

                <!-- 播放 icon -->
                <div class="absolute bottom-[2px] right-[2px] z-20 overflow-hidden rounded-full text-[40px] text-white"
                    style="background: radial-gradient(circle, rgb(26, 26, 27) 60%, transparent 60%);">
                    <svg v-if="!isPlaying" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM7.05 10.8579L10.95 8.60622C11.4167 8.33679 11.4167 7.66321 10.95 7.39378L7.05 5.14212C6.58333 4.87269 6 5.20947 6 5.74833V10.2517C6 10.7905 6.58333 11.1273 7.05 10.8579Z" />
                    </svg>
                    <svg v-else width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 4h2v8H5zm4 0h2v8H9z" />
                    </svg>
                </div>
                <!-- 隱藏 audio 元素 -->
                <audio :src="audioUrl" ref="audioRef" preload="auto" />
            </div>

            <!-- 名稱與描述 -->
            <div class="z-10 flex flex-col items-center">
                <div class="mt-4 flex items-center gap-1">
                    <span class="text-glass-400 dark:text-white font-medium text-center text-base ">
                        {{ name }}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="block text-base text-white" viewBox="0 0 16 16">
                        <path fill="currentColor" fill-rule="evenodd"
                            d="M7.466.073C7.07.183 6.714.47 6 1.043l-.448.361c-..." clip-rule="evenodd" />
                    </svg>
                </div>
                <span class="text-[#808080] font-medium text-center text-base leading-[1.42]">
                    {{ description }}
                </span>
            </div>
        </div>

    </button>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AudioBus } from '@/lib/AudioBus' // 引用你上面的 AudioBus
const audioRef = ref<HTMLAudioElement | null>(null)
const props = defineProps<{
    name: string
    description: string
    image: string
    clipId: string
    audioUrl: string
}>()

const isPlaying = ref(false)


function togglePlay() {

    isPlaying.value = !isPlaying.value
    if (!audioRef.value) return

    if (isPlaying.value) {
        // 要播放前，先廣播通知其他元件「停止」
        AudioBus.dispatchEvent(new CustomEvent('stop-all'))
        audioRef.value.muted = false
        audioRef.value.volume = 1.0
        audioRef.value.play()
    } else {
        audioRef.value.pause()
    }

    console.log(`${props.name} is now ${isPlaying.value ? 'playing' : 'paused'}`)
}

</script>

<style scoped>
@keyframes pingOnce {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    30% {
        transform: scale(1.1);
        opacity: 0.7;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes wavePulse {
    0% {
        transform: scale(1);
        opacity: 0.9;
    }

    50% {
        transform: scale(1.15);
        opacity: 0.4;
    }

    100% {
        transform: scale(1);
        opacity: 0.9;
    }
}

@keyframes pulseGradient {
    0% {
        transform: scale(1);
        opacity: 0.5;
    }

    50% {
        transform: scale(1.4);
        opacity: 0.15;
    }

    100% {
        transform: scale(1);
        opacity: 0.5;
    }
}

.animate-gradient-ring {
    animation: pulseGradient 2.5s ease-in-out infinite;
    background: radial-gradient(circle, #2f48fa 0%, transparent 70%);
    filter: blur(12px);
    pointer-events: none;
}

.animate-wave {
    animation: wavePulse 1.6s ease-in-out infinite;
}

.animate-pingOnce {
    animation: pingOnce 1.5s ease-in-out infinite;
}
</style>
