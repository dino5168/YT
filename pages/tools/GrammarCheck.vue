<template>
    <div class="min-h-screen bg-gray-100 py-10 px-4">
        <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
            <h1 class="text-2xl font-bold">📝 Grammar Checker</h1>

            <!-- 輸入框 -->
            <textarea v-model="inputText" rows="5"
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your sentence here..." />

            <!-- 提交按鈕 -->
            <button @click="checkGrammar" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                :disabled="loading">
                {{ loading ? 'Checking...' : 'Check Grammar' }}
            </button>

            <!-- 顯示結果 -->
            <div v-if="result" class="space-y-4">
                <h2 class="text-xl font-semibold">✅ Corrected Sentence:</h2>
                <p class="p-3 bg-green-50 border border-green-200 rounded">{{ result.corrected }}</p>

                <h2 class="text-xl font-semibold">❌ Errors Highlighted:</h2>
                <p class="p-3 bg-red-50 border border-red-200 rounded whitespace-pre-line">
                    <span v-html="highlightedText"></span>
                </p>
                <!-- ✅ 若完全正確，顯示 OK -->
                <p v-if="result && result.errors.length === 0"
                    class="mt-2 text-green-700 bg-green-100 border border-green-300 px-3 py-2 rounded text-sm font-medium">
                    ✅ OK! No grammatical errors found. (語法正確)
                </p>
                <div v-if="result.errors.length" class="space-y-2">
                    <h3 class="font-medium">🔍 Error Details:</h3>
                    <ul class="list-disc pl-5 text-sm text-gray-700">
                        <li v-for="(error, index) in result.errors" :key="index">
                            <strong>{{ error.error_text }}</strong>: {{ error.message }}
                            <span v-if="error.suggestions?.length">
                                (Suggestions: {{ error.suggestions.join(', ') }})
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const inputText = ref('')
const loading = ref(false)
const result = ref<null | {
    original: string
    corrected: string
    errors: {
        message: string
        suggestions: string[]
        error_text: string
        start: number
        end: number
    }[]
}>(null)

// 高亮顯示錯誤區段
const highlightedText = computed(() => {
    if (!result.value) return ''
    let text = result.value.original
    const offsets = result.value.errors.sort((a, b) => b.start - a.start)
    for (const error of offsets) {
        const before = text.slice(0, error.start)
        const wrong = text.slice(error.start, error.end)
        const after = text.slice(error.end)
        text = `${before}<span class="bg-red-200 underline decoration-red-600 decoration-2" title="${error.message}">${wrong}</span>${after}`
    }
    return text
})

const checkGrammar = async () => {
    loading.value = true
    result.value = null
    try {
        const res = await fetch('http://127.0.0.1:8000/utils/grammarcheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: inputText.value })
        })
        result.value = await res.json()
    } catch (err) {
        console.error('Grammar check failed:', err)
    } finally {
        loading.value = false
    }
}
</script>
