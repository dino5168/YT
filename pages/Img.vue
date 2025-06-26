<template>
    <div>
        <!-- 顯示錯誤 -->
        <div v-if="error" class="text-red-500">{{ error }}</div>

        <!-- 顯示 loading -->
        <div v-else-if="loading">載入中...</div>

        <!-- 顯示圖片 -->
        <img v-else :src="jpgUrl" @error="handleImgError" alt="縮圖" class="w-full max-w-md rounded-xl shadow" />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

// 狀態
const video = ref<any>(null)
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const isImageError = ref<boolean>(false)

// 載入資料
onMounted(() => {
    loadVideo()
})

// 縮圖 URL
const jpgUrl = computed(() => {
    const id = video.value?.id
    const jpgUrl = `http://127.0.0.1:8000/thumbnails/${id || 'default'}.jpg`
    console.log('生成的 JPG URL:', jpgUrl)
    return jpgUrl
})

// 取得影片資料
async function loadVideo() {
    const id = 'dk9hXhdTkuE'
    loading.value = true
    error.value = null
    isImageError.value = false

    console.log('載入視頻 ID:', id)

    try {
        const res = await fetch(`http://127.0.0.1:8000/videos/${id}`)

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        video.value = data
        console.log('影片資料:', data)
    } catch (err) {
        console.error('載入視頻失敗:', err)
        error.value =
            err instanceof Error ? err.message : '未知錯誤，請稍後重試'
    } finally {
        loading.value = false
    }
}

// 圖片載入錯誤時回退
function handleImgError() {
    console.warn('圖片載入錯誤，使用預設圖')
    isImageError.value = true
}
</script>
