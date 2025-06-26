<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isPlaying = ref(false)
const isTranslating = ref(false)
const isRepeating = ref(false)
const videoRepeat = ref(false)
const playbackSpeed = ref(1.0)
const currentFontSize = ref(100)
const isFullscreen = ref(false)

const showSpeedMenu = ref(false)
const showMoreMenu = ref(false)
const showFontSizeMenu = ref(false)
const isMobileMenuOpen = ref(false)

const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
const fontSizes = [200, 175, 150, 125, 100, 90, 75]

const speedMenuRef = ref<HTMLElement | null>(null)
const moreMenuRef = ref<HTMLElement | null>(null)
const mobileMenuRef = ref<HTMLElement | null>(null)

const togglePlay = () => (isPlaying.value = !isPlaying.value)
const previousTrack = () => console.log('Previous track')
const nextTrack = () => console.log('Next track')
const toggleTranslate = () => (isTranslating.value = !isTranslating.value)
const toggleRepeat = () => (isRepeating.value = !isRepeating.value)
const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    console.log('Toggle fullscreen')
}

const toggleSpeedMenu = () => {
    showSpeedMenu.value = !showSpeedMenu.value
    showMoreMenu.value = false
    showFontSizeMenu.value = false
}

const toggleMoreMenu = () => {
    showMoreMenu.value = !showMoreMenu.value
    showSpeedMenu.value = false
    showFontSizeMenu.value = false
}

const toggleFontSizeMenu = () => {
    showFontSizeMenu.value = true
    showMoreMenu.value = false
}

const goBackToMainMenu = () => {
    showFontSizeMenu.value = false
    showMoreMenu.value = true
}

const handleSpeedChange = (speed: number) => {
    playbackSpeed.value = speed
    showSpeedMenu.value = false
}

const handleFontSizeChange = (size: number) => {
    currentFontSize.value = size
    showFontSizeMenu.value = false
    showMoreMenu.value = false
}

const handleClickOutside = (event: MouseEvent) => {
    if (speedMenuRef.value && !speedMenuRef.value.contains(event.target as Node)) {
        showSpeedMenu.value = false
    }
    if (moreMenuRef.value && !moreMenuRef.value.contains(event.target as Node)) {
        showMoreMenu.value = false
        showFontSizeMenu.value = false
    }
    if (mobileMenuRef.value && !mobileMenuRef.value.contains(event.target as Node)) {
        isMobileMenuOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
    <div class="bg-gray-900 text-white shadow-2xl w-full z-500">
        <div class="hidden md:block p-4 rounded-lg">
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <button @click="toggleTranslate"
                        :class="['p-2 rounded-lg hover:bg-gray-700 transition-all duration-200', isTranslating ? 'bg-blue-600 shadow-lg' : '']">
                        <!-- TranslateIcon -->🔤
                    </button>
                    <button @click="toggleRepeat"
                        :class="['p-2 rounded-lg hover:bg-gray-700 transition-all duration-200', isRepeating ? 'bg-blue-600 shadow-lg' : '']">
                        🔁
                    </button>
                    <button @click="toggleFullscreen"
                        class="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
                        ⛶
                    </button>
                </div>

                <div class="flex items-center gap-3">
                    <button @click="previousTrack" class="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
                        ⏮️
                    </button>
                    <button @click="togglePlay"
                        class="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                        {{ isPlaying ? '⏸️' : '▶️' }}
                    </button>
                    <button @click="nextTrack" class="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
                        ⏭️
                    </button>
                </div>

                <div class="flex items-center gap-2">
                    <div class="relative" ref="speedMenuRef">
                        <button @click="toggleSpeedMenu"
                            class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
                            ⏩ <span class="text-sm font-medium">×{{ playbackSpeed }}</span>
                        </button>
                        <div v-if="showSpeedMenu"
                            class="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl py-1 min-w-[100px] z-50 border border-gray-700">
                            <button v-for="speed in speedOptions" :key="speed" @click="handleSpeedChange(speed)"
                                :class="['w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors', playbackSpeed === speed ? 'bg-blue-600 font-semibold' : '']">
                                ×{{ speed }}
                            </button>
                        </div>
                    </div>

                    <div class="relative" ref="moreMenuRef">
                        <button @click="toggleMoreMenu"
                            class="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200">
                            ⋮
                        </button>
                        <div v-if="showMoreMenu && !showFontSizeMenu"
                            class="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl py-1 min-w-[200px] z-50 border border-gray-700">
                            <div
                                class="flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors">
                                <span class="text-sm">影片重複</span>
                                <input type="checkbox" v-model="videoRepeat" class="form-checkbox" />
                            </div>
                            <button @click="toggleFontSizeMenu"
                                class="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-700 transition-colors">
                                <span class="text-sm">字級大小</span>
                                ➤
                            </button>
                        </div>
                        <div v-if="showFontSizeMenu"
                            class="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl py-1 min-w-[120px] z-50 border border-gray-700">
                            <button @click="goBackToMainMenu"
                                class="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-700 transition-colors border-b border-gray-600">
                                ← <span class="text-sm">返回</span>
                            </button>
                            <button v-for="size in fontSizes" :key="size" @click="handleFontSizeChange(size)"
                                :class="['w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors', currentFontSize === size ? 'bg-blue-600 font-semibold' : '']">
                                {{ size }}%
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
