<template>
    <div class="p-4">
        <label for="voiceSelect" class="block mb-2 text-sm font-medium text-gray-700">
            選擇語音
        </label>
        <select id="voiceSelect" v-model="selectedVoice"
            class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200">
            <option value="" disabled>請選擇 voice_id</option>
            <option v-for="voice in voices" :key="voice.voice_id" :value="voice.voice_id">
                {{ voice.voice_id }}
            </option>
        </select>

        <div v-if="selectedVoice" class="mt-4 p-4 border rounded text-sm text-gray-600 bg-gray-50">
            ✅ 你選擇的是：<strong>{{ selectedVoice }}</strong>
        </div>
        <div>

            <textarea id="message" rows="10" v-model="messageText"
                class="block w-full px-4 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                placeholder="請輸入您的內容...">

            </textarea>
        </div>
        <div>
            <button class="bg-blue-800 px-2 py-1 text-white hover:cursor-pointer" @click="postMessage">Post
                Data</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Voice {
    voice_id: string
    gender: string
    style: string
    attributes: string[]
}

const voices = ref<Voice[]>([])
const selectedVoice = ref('')
const messageText = ref('This is a book.\nHello.\nWe are the World.')

const postMessage = async () => {
    if (!selectedVoice.value || !messageText.value.trim()) {
        alert('請選擇語音並輸入內容')
        return
    }

    const payload = {
        voice_id: selectedVoice.value,
        text: messageText.value.trim(),
    }

    try {
        const res = await fetch('http://127.0.0.1:8000/voices/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        const result = await res.json()
        console.log('[POST 回應]', result)
        alert('✅ 傳送成功！')
    } catch (error) {
        console.error('❌ 傳送失敗：', error)
        alert('❌ 發送失敗，請檢查伺服器')
    }
}

onMounted(async () => {
    try {
        const res = await fetch('http://127.0.0.1:8000/voices/enlist')
        const json = await res.json()

        console.log('[Fetch 回傳]', json)

        if (Array.isArray(json.voices)) {
            voices.value = json.voices
        } else {
            console.warn('回傳格式錯誤：voices 不是陣列')
        }
    } catch (err) {
        console.error('fetch 失敗:', err)
    }
})
</script>
