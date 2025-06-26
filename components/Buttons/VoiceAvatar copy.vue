<template>
    <button class="group block" @click="togglePlay">
        <div>
            <div class="relative size-[136px]">
                <!-- 🔊 播放圈動畫 -->
                <span v-if="isPlaying"
                    class="absolute inset-0 z-0 rounded-full bg-[#2F48FA]/30 animate-spotifyRing"></span>

                <!-- 🎧 頭像 + 背景 clip -->
                <span class="absolute inset-[-22px] block rounded-full transition-all" :class="[
                    'bg-[#242424]',
                    isPlaying ? 'bg-[#2F48FA]' : '',
                ]" :style="`-webkit-clip-path:url(#${clipId});clip-path:url(#${clipId})`">
                    <img :alt="name" :src="image" class="size-full" style="color: transparent" />
                    <svg width="178" height="178" viewBox="0 0 178 178" class="absolute size-0">
                        <clipPath :id="clipId">
                            <path
                                d="M90.8251 21.0135C111.528 21.4169 130.347 30.9991 142.917 47.3074C155.139 63.1633 159.731 85.315 155.41 104.803C151.045 124.495 136.753 141.497 118.499 150.396C100.057 159.387 78.5635 159.014 59.9414 150.396C41.0294 141.644 27.9479 125.634 23.0959 105.515C18.1837 85.1452 21.8144 63.7061 34.9582 47.3074C48.1335 30.8695 68.3068 20.5748 90.8251 21.0135Z" />
                        </clipPath>
                    </svg>
                </span>

                <!-- ▶️ / ⏸ icon -->
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
            </div>

            <!-- 名稱 + 標籤 -->
            <div class="z-10 flex flex-col items-center">
                <div class="mt-4 flex items-center gap-1">
                    <span class="text-glass-400 dark:text-white font-medium text-center text-base ">
                        {{ name }}
                    </span>
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

const props = defineProps<{
    name: string
    description: string
    image: string
    clipId: string
}>()

const isPlaying = ref(false)

function togglePlay() {
    isPlaying.value = !isPlaying.value
    console.log(`${props.name} is now ${isPlaying.value ? 'playing' : 'paused'}`)
}
</script>

<style scoped>
@keyframes spotifyRing {
    0% {
        transform: scale(1);
        opacity: 0.6;
    }

    50% {
        transform: scale(1.3);
        opacity: 0.2;
    }

    100% {
        transform: scale(1);
        opacity: 0.6;
    }
}

.animate-spotifyRing {
    animation: spotifyRing 2.4s ease-in-out infinite;
    pointer-events: none;
}
</style>
