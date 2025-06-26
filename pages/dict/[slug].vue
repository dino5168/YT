<template>
    <div class="p-6 max-w-3xl mx-auto space-y-6">
        <!-- 搜尋欄 -->
        <form @submit.prevent="goSearch" class="flex gap-2 items-center">
            <input v-model="searchInput" type="text" placeholder="Search a word..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Search
            </button>
        </form>

        <!-- 單字標題 -->
        <h1 class="text-3xl font-bold text-blue-700">
            Word: {{ wordData?.word ?? slug }}
        </h1>

        <!-- 狀態 -->
        <div v-if="pending" class="text-gray-500">Loading...</div>
        <div v-if="error" class="text-red-600">Error: {{ error }}</div>

        <!-- 結果 -->
        <template v-if="wordData && !pending && !error">
            <!-- 音標與音訊 -->
            <div class="space-y-2">
                <h2 class="text-xl font-semibold text-gray-800">Pronunciations</h2>
                <div class="grid gap-2">
                    <div v-for="(p, i) in wordData.phonetics" :key="i" class="flex items-center gap-4">
                        <span v-if="p.text" class="text-gray-600 text-lg">{{ p.text }}</span>
                        <audio v-if="p.audio" :src="p.audio" controls class="h-8" />
                    </div>
                </div>
            </div>

            <!-- 詞性與定義 -->
            <div class="space-y-4">
                <div v-for="(meaning, index) in wordData.meanings" :key="index"
                    class="border border-gray-300 rounded-lg p-4">
                    <h3 class="text-lg font-medium capitalize text-purple-600">
                        {{ meaning.partOfSpeech }}
                    </h3>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li v-for="(def, i) in meaning.definitions" :key="i">
                            <p class="text-gray-800">{{ def.definition }}</p>
                            <p v-if="def.example" class="text-gray-500 italic">Example: "{{ def.example }}"</p>
                        </li>
                    </ul>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
// 頁面標題
useHead({
    title: '英語字典'
})

const route = useRoute()
const router = useRouter()

const slug = ref(route.params.slug as string)
const wordData = ref<any | null>(null)
const pending = ref(true)
const error = ref<string | null>(null)

const searchInput = ref(slug.value) // 初始化搜尋欄內容

const fetchWord = async () => {
    pending.value = true
    error.value = null
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${slug.value}`)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const json = await res.json()
        wordData.value = json[0]
    } catch (err: any) {
        error.value = err.message || 'Fetch failed'
        wordData.value = null
    } finally {
        pending.value = false
    }
}

// 執行搜尋
const goSearch = () => {
    const newWord = searchInput.value.trim()
    if (newWord) router.push(`/dict/${encodeURIComponent(newWord)}`)
}

// 初次載入
onMounted(fetchWord)

// 當路由參數變更，重新抓資料
watch(() => route.params.slug, (newSlug) => {
    slug.value = newSlug as string
    searchInput.value = slug.value
    fetchWord()
})
</script>
