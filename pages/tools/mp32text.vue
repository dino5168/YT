<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h1 class="text-2xl font-bold text-center">🎧 Whisper 音訊轉字幕</h1>

            <div>
                <label class="block font-medium">選擇語言</label>
                <select v-model="language" class="mt-1 block w-full rounded border p-2">
                    <option value="en">英文</option>
                    <option value="zh">中文</option>
                    <option value="ja">日文</option>
                    <option value="ko">韓文</option>
                </select>
            </div>

            <div>
                <label class="block font-medium">選擇 MP3 音訊檔</label>
                <input type="file" accept="audio/*" @change="onFileChange"
                    class="mt-1 block w-full border p-2 rounded bg-gray-50" />
            </div>

            <button :disabled="loading || !file" @click="submit"
                class="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">
                {{ loading ? "轉換中..." : "開始轉錄" }}
            </button>

            <div v-if="result" class="mt-4 bg-green-100 border border-green-300 p-4 rounded">
                <h2 class="text-lg font-semibold">✅ 轉錄完成</h2>
                <p>語言：{{ result.language_detected }}</p>
                <p>字幕段落：{{ result.segments.length }} 段</p>
                <details class="mt-2">
                    <summary class="cursor-pointer text-blue-600">查看字幕內容</summary>
                    <ul class="mt-2 text-sm list-disc pl-5 space-y-1">
                        <li v-for="(s, i) in result.segments" :key="i">{{ s.text }}</li>
                    </ul>
                </details>
            </div>

            <div v-if="error" class="mt-4 bg-red-100 border border-red-300 p-4 rounded text-red-700">
                ❌ {{ error }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const language = ref('en')
const result = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        file.value = target.files[0]
    }
}

async function submit() {
    if (!file.value) return
    loading.value = true
    error.value = null
    result.value = null

    const formData = new FormData()
    formData.append('file', file.value)
    formData.append('language', language.value)

    try {
        const res = await fetch('http://localhost:8000/transcribe', {
            method: 'POST',
            body: formData,
        })

        if (!res.ok) {
            const err = await res.json()
            throw new Error(err?.error || '轉錄失敗')
        }

        result.value = await res.json()
    } catch (err: any) {
        error.value = err.message || '未知錯誤'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
details>summary {
    outline: none;
}
</style>
