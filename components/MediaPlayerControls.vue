<template>
    <div class="bg-gray-900 p-4 rounded-lg shadow-lg">
        <!-- 控制面板容器 -->
        <div class="flex items-center justify-between gap-4">
            <!-- 左側控制選項 -->
            <div class="flex items-center gap-2">
                <!-- 翻譯按鈕 -->
                <button @click="toggleTranslate" class="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    :class="{ 'bg-blue-600': isTranslating }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-white"
                        fill="currentColor">
                        <path d="M11.8 18.6L14.2 15.2H12V14H16V14.9L13.6 18.3H16V19.5H11.8V18.6Z" />
                        <path d="M16.9 14H18.4V16H19.5V14H21V19.5H19.5V17.3H18.3V19.5H16.8V14H16.9Z" />
                        <path d="M16.5708 8.36035L6.17883 14.3604L6.67883 15.2264L17.0708 9.22635L16.5708 8.36035Z" />
                        <path d="M2.5 4H6.1V5H3.7V6.1H5.7V7.1H3.7V8.4H6.2V9.4H2.5V4Z" />
                        <path
                            d="M7.30005 4H8.60005L9.80005 6.7L10.3 7.9C10.2 7.3 10.1 6.6 10.1 5.9V4H11.3V9.5H10L8.90005 6.8L8.40005 5.6C8.40005 6.2 8.50005 6.9 8.50005 7.5V9.5H7.30005V4Z" />
                    </svg>
                </button>

                <!-- 重複播放按鈕 -->
                <button @click="toggleRepeat" class="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    :class="{ 'bg-blue-600': isRepeating }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-white"
                        fill="currentColor">
                        <g>
                            <path
                                d="m20.5 20.5c.4.4.4 1 0 1.4s-1 .4-1.4 0l-2.9-2.9h-9.2v1.8c0 .4-.5.6-.8.4l-.1-.1-2.8-2.8c-.2-.2-.2-.4-.1-.6l.1-.1 2.8-2.8c.3-.3.8-.1.8.3v.1 1.8h7.2l-7.1-7.2v.2c0 .5-.4.9-.9 1h-.1c-.5 0-.9-.4-1-.9v-.1-2.2l-2.9-2.9c-.4-.4-.4-1 0-1.4s1-.4 1.4 0z" />
                            <path d="m18 13c.5 0 .9.4 1 .9v.1 2.2l-2-2v-.2c0-.5.5-1 1-1z" />
                            <path
                                d="m17.8 2.8 2.9 2.8c.2.2.2.4.1.6l-.1.1-2.8 2.8c-.3.3-.8.1-.8-.3v-.1-1.7h-7.3l-2-2h9.2v-1.8c0-.4.5-.6.8-.4z" />
                        </g>
                    </svg>
                </button>

                <!-- 全屏按鈕 (桌面版隱藏) -->
                <button @click="toggleFullscreen"
                    class="p-2 rounded-lg hover:bg-gray-700 transition-colors hidden md:block">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-white"
                        fill="currentColor">
                        <path
                            d="M6,14c-0.6,0-1,0.4-1,1v3c0,0.5,0.4,1,1,1h3c0.6,0,1-0.5,1-1s-0.4-1-1-1H7v-2C7,14.4,6.6,14,6,14z M6,10c0.6,0,1-0.4,1-1V7h2c0.6,0,1-0.4,1-1S9.6,5,9,5H6C5.4,5,5,5.4,5,6v3C5,9.6,5.4,10,6,10z M17,17h-2c-0.6,0-1,0.5-1,1s0.4,1,1,1h3c0.5,0,1-0.5,1-1v-3c0-0.6-0.5-1-1-1s-1,0.4-1,1V17z M14,6c0,0.6,0.4,1,1,1h2v2c0,0.6,0.5,1,1,1s1-0.4,1-1V6c0-0.6-0.5-1-1-1h-3C14.4,5,14,5.4,14,6z" />
                    </svg>
                </button>
            </div>

            <!-- 中央播放控制 -->
            <div class="flex items-center gap-2">
                <!-- 上一首 -->
                <button @click="previousTrack" class="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-white"
                        fill="currentColor">
                        <path
                            d="M7.6,16.9l5.8-4.1c0.6-0.4,0.6-1.2,0-1.6L7.6,7.1C6.9,6.7,6,7.1,6,7.9v8.1C6,16.9,6.9,17.4,7.6,16.9z M16,7v10c0,0.5,0.5,1,1,1s1-0.5,1-1V7c0-0.6-0.5-1-1-1S16,6.4,16,7z"
                            transform="rotate(-180, 12, 12)" />
                    </svg>
                </button>

                <!-- 播放/暫停按鈕 -->
                <button @click="togglePlay" class="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors">
                    <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        class="w-8 h-8 text-white" fill="currentColor">
                        <path
                            d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zM9.6 8.17v7.544c0 .22.236.357.427.249l6.286-3.587c.187-.106.193-.375.011-.488L10.037 7.93c-.19-.12-.437.017-.437.24z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8 text-white"
                        fill="currentColor">
                        <path
                            d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zM9 8h2v8H9V8zm4 0h2v8h-2V8z" />
                    </svg>
                </button>

                <!-- 下一首 -->
                <button @click="nextTrack" class="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-white"
                        fill="currentColor">
                        <path
                            d="M7.6,16.9l5.8-4.1c0.6-0.4,0.6-1.2,0-1.6L7.6,7.1C6.9,6.7,6,7.1,6,7.9v8.1C6,16.9,6.9,17.4,7.6,16.9z M16,7v10c0,0.5,0.5,1,1,1s1-0.5,1-1V7c0-0.6-0.5-1-1-1S16,6.4,16,7z" />
                    </svg>
                </button>
            </div>

            <!-- 右側設定選項 -->
            <div class="flex items-center gap-2">
                <!-- 播放速度選擇 -->
                <div class="relative" ref="speedMenu">
                    <button @click="toggleSpeedMenu"
                        class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-white"
                            fill="currentColor">
                            <path
                                d="M12,3c5,0,9,4,9,9s-4,9-9,9s-9-4-9-9S7,3,12,3z M12,4.6c-4.1,0-7.4,3.3-7.4,7.4s3.3,7.4,7.4,7.4s7.4-3.3,7.4-7.4S16.1,4.6,12,4.6z M12.8,7.1v3.4h2.1c0.3,0,0.5,0.3,0.4,0.6L12.4,17c-0.2,0.4-0.8,0.3-0.8-0.2v-3.4H9.4c-0.3,0-0.5-0.3-0.4-0.6L12,7C12.2,6.6,12.8,6.7,12.8,7.1z" />
                        </svg>
                        <span class="text-white text-sm hidden sm:inline">x{{ playbackSpeed }}</span>
                    </button>

                    <!-- 速度選擇下拉選單 -->
                    <div v-show="showSpeedMenu"
                        class="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg py-1 min-w-[80px]">
                        <button v-for="speed in speedOptions" :key="speed" @click="setPlaybackSpeed(speed)"
                            class="w-full px-3 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                            :class="{ 'bg-blue-600': playbackSpeed === speed }">
                            x {{ speed }}
                        </button>
                    </div>
                </div>

                <!-- 更多選項 -->
                <div class="relative" ref="moreMenu">
                    <button @click="toggleMoreMenu" class="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-white"
                            fill="currentColor">
                            <path
                                d="M5,10c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S3.9,10,5,10z M12,10c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,10,12,10z M19,10c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S17.9,10,19,10z" />
                        </svg>
                    </button>

                    <!-- 更多選項下拉選單 -->
                    <div v-show="showMoreMenu"
                        class="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg py-1 min-w-[180px]">
                        <!-- 影片重複選項 -->
                        <div class="flex items-center justify-between px-3 py-2 hover:bg-gray-700 transition-colors">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 text-white"
                                    fill="currentColor">
                                    <path
                                        d="M3.61357 3.61343C3.64176 3.65099 3.67294 3.68701 3.7071 3.72118L20.5788 20.5929C20.8728 20.9846 20.8416 21.543 20.4853 21.8993C20.0948 22.2899 19.4616 22.2899 19.0711 21.8993L16.1716 18.9999H5.8C4.28882 18.9999 3.08848 17.7261 3.00467 16.1735L3 15.9999V12.9999H1.96568C1.60932 12.9999 1.43085 12.569 1.68284 12.317L3.71715 10.2827C3.87336 10.1265 4.12663 10.1265 4.28284 10.2827L6.31715 12.317C6.56914 12.569 6.39067 12.9999 6.03431 12.9999H5V15.9999C5 16.529 5.33381 16.9377 5.71205 16.9934L5.8 16.9999H14.1716L2.1005 4.92879C1.70998 4.53826 1.70998 3.9051 2.1005 3.51457C2.49103 3.12405 3.12419 3.12405 3.51472 3.51457L3.61357 3.61343ZM7.81421 4.99985L9.81421 6.99985H19.2L19.2879 7.00633C19.6662 7.06202 20 7.47072 20 7.99985V15.9999L19.9942 16.1197C19.965 16.4194 19.8279 16.6711 19.6419 16.8276L21.0577 18.2433C21.6383 17.6894 22 16.8828 22 15.9999V7.99985L21.9953 7.82624C21.9115 6.27359 20.7112 4.99985 19.2 4.99985H7.81421Z" />
                                </svg>
                                <span class="text-white text-sm">影片重複</span>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="videoRepeat" class="sr-only peer">
                                <div
                                    class="relative w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                </div>
                            </label>
                        </div>

                        <!-- 字級大小選項 -->
                        <button @click="toggleFontSizeMenu"
                            class="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-700 transition-colors">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 text-white"
                                    fill="currentColor">
                                    <path
                                        d="M10.5,5l3.8,10l1.7-4.3h1.3l2.7,7.2h-1.3L18.1,16h-3l-0.2,0.6l0.6,1.5h-2.3L12,14.8H6.5l-1.2,3.3H3L8,5H10.5z M16.6,11.9L16.6,11.9l-1.2,3.1h2.3L16.6,11.9z M9.3,7.3L9.3,7.3l-2.1,5.7h4.2L9.3,7.3z" />
                                </svg>
                                <span class="text-white text-sm">字級大小</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 text-white"
                                fill="currentColor">
                                <polygon points="9.7,5 16.7,12 9.7,19 8,17.3 13.4,12 8,6.7" />
                            </svg>
                        </button>

                        <!-- 快速鍵選項 (桌面版隱藏) -->
                        <button
                            class="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-700 transition-colors hidden md:flex">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 text-white"
                                fill="currentColor">
                                <path
                                    d="M20 7V17H4V7H20ZM20 5H4C2.9 5 2.01 5.9 2.01 7L2 17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V7C22 5.9 21.1 5 20 5ZM11 8H13V10H11V8ZM11 11H13V13H11V11ZM8 8H10V10H8V8ZM8 11H10V13H8V11ZM5 11H7V13H5V11ZM5 8H7V10H5V8ZM8 14H16V16H8V14ZM14 11H16V13H14V11ZM14 8H16V10H14V8ZM17 11H19V13H17V11ZM17 8H19V10H17V8Z" />
                            </svg>
                            <span class="text-white text-sm">快速鍵</span>
                        </button>
                    </div>

                    <!-- 字級大小子選單 -->
                    <div v-show="showFontSizeMenu"
                        class="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg py-1 min-w-[100px]">
                        <button @click="goBackToMainMenu"
                            class="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-700 transition-colors border-b border-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4 text-white"
                                fill="currentColor">
                                <polygon points="9.7,5 16.7,12 9.7,19 8,17.3 13.4,12 8,6.7"
                                    transform="rotate(180, 12, 12)" />
                            </svg>
                            <span class="text-white text-sm">返回</span>
                        </button>
                        <button v-for="size in fontSizes" :key="size" @click="setFontSize(size)"
                            class="w-full px-3 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                            :class="{ 'bg-blue-600': currentFontSize === size }">
                            {{ size }}%
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 響應式數據
const isPlaying = ref(false)
const isTranslating = ref(false)
const isRepeating = ref(false)
const videoRepeat = ref(false)
const playbackSpeed = ref(1.0)
const currentFontSize = ref(100)

// 下拉選單狀態
const showSpeedMenu = ref(false)
const showMoreMenu = ref(false)
const showFontSizeMenu = ref(false)

// 選項數據
const speedOptions = [0.5, 0.75, 1.0, 1.5]
const fontSizes = [175, 150, 125, 100, 90]

// 模板引用
const speedMenu = ref(null)
const moreMenu = ref(null)

// 播放控制方法
const togglePlay = () => {
    isPlaying.value = !isPlaying.value
    // 這裡可以觸發實際的播放/暫停邏輯
}

const previousTrack = () => {
    // 上一首邏輯
    console.log('Previous track')
}

const nextTrack = () => {
    // 下一首邏輯
    console.log('Next track')
}

// 功能切換方法
const toggleTranslate = () => {
    isTranslating.value = !isTranslating.value
}

const toggleRepeat = () => {
    isRepeating.value = !isRepeating.value
}

const toggleFullscreen = () => {
    // 全屏邏輯
    console.log('Toggle fullscreen')
}

// 選單控制方法
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

// 設定方法
const setPlaybackSpeed = (speed) => {
    playbackSpeed.value = speed
    showSpeedMenu.value = false
}

const setFontSize = (size) => {
    currentFontSize.value = size
    showFontSizeMenu.value = false
    showMoreMenu.value = false
}

// 點擊外部關閉選單
const handleClickOutside = (event) => {
    if (speedMenu.value && !speedMenu.value.contains(event.target)) {
        showSpeedMenu.value = false
    }
    if (moreMenu.value && !moreMenu.value.contains(event.target)) {
        showMoreMenu.value = false
        showFontSizeMenu.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// 定義 emits 用於與父組件通信
const emit = defineEmits([
    'play',
    'pause',
    'previous',
    'next',
    'toggleTranslate',
    'toggleRepeat',
    'toggleFullscreen',
    'speedChange',
    'fontSizeChange'
])

// 監聽變化並發出事件
watch(isPlaying, (newValue) => {
    emit(newValue ? 'play' : 'pause')
})

watch(playbackSpeed, (newValue) => {
    emit('speedChange', newValue)
})

watch(currentFontSize, (newValue) => {
    emit('fontSizeChange', newValue)
})
</script>

<style scoped>
/* 可以在這裡添加自定義樣式 */
</style>