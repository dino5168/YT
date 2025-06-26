<template>
    <div class="p-6 max-w-3xl mx-auto space-y-6">
        <h1 class="text-3xl font-bold text-blue-700">Word: {{ wordData?.word ?? 'Loading...' }}</h1>

        <div v-if="loading" class="text-gray-500">Loading...</div>
        <div v-if="error" class="text-red-600">Error: {{ error }}</div>

        <template v-if="wordData && !loading && !error">
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
                    <h3 class="text-lg font-medium capitalize text-purple-600">{{ meaning.partOfSpeech }}</h3>
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
import { ref, onMounted } from 'vue'

const wordData = ref<any | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const word = 'hello' // 可改成參數 props、route query、input 綁定

onMounted(async () => {
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const json = await res.json()
        wordData.value = json[0] // API 是 array，取第一筆
    } catch (err: any) {
        error.value = err.message || 'Fetch failed'
    } finally {
        loading.value = false
    }
})
</script>
