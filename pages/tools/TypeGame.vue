<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
        <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
            <!-- 標題 -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <Icon name="trophy" class="text-yellow-500" />
                    Vue 3 英文打字練習遊戲
                </h1>
                <p class="text-gray-600">提升你的打字速度和準確率</p>
            </div>

            <!-- 難度選擇 -->
            <div class="flex justify-center mb-6">
                <div class="bg-gray-100 p-1 rounded-lg">
                    <button v-for="level in difficulties" :key="level.key" @click="difficulty = level.key" :class="[
                        'px-4 py-2 rounded-md font-medium transition-all',
                        difficulty === level.key ? 'bg-purple-500 text-white shadow-md' : 'text-gray-600 hover:text-purple-500'
                    ]">
                        {{ level.name }}
                    </button>
                </div>
            </div>

            <!-- 統計面板 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatBox icon="clock" label="剩餘時間" :value="timeLeft" color="blue" />
                <StatBox icon="tachometer-alt" label="WPM" :value="wpm" color="green" />
                <StatBox icon="bullseye" label="準確率" :value="accuracy + '%'" color="yellow" />
                <StatBox icon="times-circle" label="錯誤次數" :value="mistakes" color="red" />
            </div>

            <!-- 遊戲區域 -->
            <div class="bg-gray-50 rounded-lg p-6 mb-6">
                <div v-if="gameState === 'waiting'" class="text-center py-12">
                    <div class="text-6xl mb-4">⌨️</div>
                    <h2 class="text-2xl font-semibold text-gray-700 mb-4">準備開始打字練習</h2>
                    <p class="text-gray-500 mb-6">點擊開始按鈕來開始你的打字挑戰</p>
                </div>

                <div v-else>
                    <div class="bg-white p-6 rounded-lg mb-4 min-h-[120px] flex items-center">
                        <div class="leading-relaxed text-lg font-mono">
                            <span v-for="(char, index) in currentText" :key="index" :class="getCharClass(index)">
                                {{ char }}
                            </span>
                            <span v-if="currentIndex === currentText.length" class="typing-cursor">|</span>
                        </div>
                    </div>
                    <input ref="gameInput" v-model="userInput" @input="handleInput" @keydown="handleKeydown" type="text"
                        class="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                        placeholder="在此輸入文字..." :disabled="gameState === 'finished'" />
                </div>
            </div>

            <!-- 控制按鈕 -->
            <div class="flex justify-center gap-4">
                <button v-if="gameState === 'waiting'" @click="startGame"
                    class="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105">
                    <Icon name="play" /> 開始遊戲
                </button>
                <button v-else @click="resetGame"
                    class="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105">
                    <Icon name="redo" /> 重新開始
                </button>
            </div>

            <!-- 結果面板 -->
            <div v-if="gameState === 'finished'"
                class="mt-8 bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg text-center">
                <h2 class="text-2xl font-bold mb-4">🎉 遊戲結束！</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <div class="text-3xl font-bold">{{ wpm }}</div>
                        <div>每分鐘字數</div>
                    </div>
                    <div>
                        <div class="text-3xl font-bold">{{ accuracy }}%</div>
                        <div>準確率</div>
                    </div>
                    <div>
                        <div class="text-3xl font-bold">{{ mistakes }}</div>
                        <div>錯誤次數</div>
                    </div>
                </div>
                <div class="mt-4 text-lg">
                    <span v-if="wpm >= 60">🏆 優秀！你的打字速度非常快！</span>
                    <span v-else-if="wpm >= 40">👍 不錯！繼續加油！</span>
                    <span v-else-if="wpm >= 20">📈 進步中，多多練習！</span>
                    <span v-else>💪 加油！持續練習會越來越好！</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue'
// 修正組件引用路徑 - 根據你的實際目錄結構調整
import Icon from '~/components/ui/Icon.vue'
import StatBox from '~/components/ui/StatBox.vue'

const gameState = ref<'waiting' | 'playing' | 'finished'>('waiting')
const currentText = ref('')
const userInput = ref('')
const currentIndex = ref(0)
const mistakes = ref(0)
const timeLeft = ref(60)
const difficulty = ref<'easy' | 'medium' | 'hard'>('easy')
const startTime = ref<number | null>(null)
const gameInput = ref<HTMLInputElement | null>(null)
const timer = ref<ReturnType<typeof setInterval> | null>(null)

const difficulties = [
    { key: 'easy' as const, name: '簡單' },
    { key: 'medium' as const, name: '中等' },
    { key: 'hard' as const, name: '困難' }
]

const textLibrary = {
    easy: [
        'The quick brown fox jumps over the lazy dog',
        'Pack my box with five dozen liquor jugs',
        'How vexingly quick daft zebras jump',
        'Bright vixens jump dozy fowl quack',
        'Sphinx of black quartz judge my vow'
    ],
    medium: [
        'JavaScript is a versatile programming language that runs in browsers and servers',
        'Vue.js is a progressive framework for building user interfaces with reactive data binding',
        'Artificial intelligence and machine learning are transforming modern technology',
        'The internet has revolutionized how we communicate and share information globally',
        'Climate change requires immediate action from governments and individuals worldwide'
    ],
    hard: [
        'Pseudopseudohypoparathyroidism is an extremely rare inherited disorder affecting calcium metabolism',
        'The implementation of quantum cryptography protocols requires sophisticated mathematical algorithms',
        'Bioengineering encompasses interdisciplinary approaches combining biology, engineering, and technology',
        'Neuroplasticity demonstrates the brain\'s remarkable ability to reorganize and adapt throughout life',
        'Phenomenological hermeneutics explores the interpretation of lived experiences and consciousness'
    ]
}

const wpm = computed(() => {
    if (!startTime.value || currentIndex.value === 0) return 0
    const timeElapsed = (Date.now() - startTime.value) / 1000 / 60
    const wordsTyped = currentIndex.value / 5
    return Math.round(wordsTyped / timeElapsed)
})

const accuracy = computed(() => {
    if (currentIndex.value === 0) return 100
    return Math.round(((currentIndex.value - mistakes.value) / currentIndex.value) * 100)
})

function getRandomText() {
    const texts = textLibrary[difficulty.value]
    return texts[Math.floor(Math.random() * texts.length)]
}

function startGame() {
    currentText.value = getRandomText()
    userInput.value = ''
    currentIndex.value = 0
    mistakes.value = 0
    timeLeft.value = 60
    gameState.value = 'playing'
    startTime.value = Date.now()

    timer.value = setInterval(() => {
        timeLeft.value--
        if (timeLeft.value <= 0) {
            gameState.value = 'finished'
            if (timer.value) clearInterval(timer.value)
        }
    }, 1000)

    nextTick(() => {
        gameInput.value?.focus()
    })
}

function resetGame() {
    gameState.value = 'waiting'
    userInput.value = ''
    currentIndex.value = 0
    mistakes.value = 0
    if (timer.value) clearInterval(timer.value)
    timer.value = null
}

function getCharClass(index: number) {
    if (index < currentIndex.value) return 'bg-green-200 text-green-800'
    if (index === currentIndex.value) return 'bg-blue-200 text-blue-800 typing-cursor'
    return 'text-gray-600'
}

function handleInput(event: Event) {
    if (gameState.value !== 'playing') return
    const value = (event.target as HTMLInputElement).value

    if (value.length > userInput.value.length) {
        const newChar = value[value.length - 1]
        const expectedChar = currentText.value[currentIndex.value]
        if (newChar === expectedChar) {
            currentIndex.value++
            if (currentIndex.value === currentText.value.length) {
                gameState.value = 'finished'
                if (timer.value) clearInterval(timer.value)
            }
        } else {
            mistakes.value++
            // 修正：防止錯誤輸入
            const input = event.target as HTMLInputElement
            input.value = userInput.value
            return
        }
    }
    userInput.value = value
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Backspace' && userInput.value.length <= currentIndex.value) {
        event.preventDefault()
    }
}

onUnmounted(() => {
    if (timer.value) clearInterval(timer.value)
})
</script>

<style scoped>
.typing-cursor {
    animation: blink 1s infinite;
}

@keyframes blink {

    0%,
    50% {
        opacity: 1;
    }

    51%,
    100% {
        opacity: 0;
    }
}
</style>