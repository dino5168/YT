<template>
  <div class="p-4 bg-white rounded-xl shadow space-y-4">
    <h2 class="text-xl font-bold">🎙️ 錄音作業-練習</h2>
    
    <div class="flex space-x-4">
      <button @click="startRecording" :disabled="isRecording"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50">
        開始錄音
      </button>
      <button @click="stopRecording" :disabled="!isRecording"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50">
        結束錄音
      </button>
    </div>

    <!-- 錄音狀態顯示 -->
    <div v-if="isRecording" class="text-red-500 flex items-center space-x-2">
      <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      <span>錄音中...</span>
    </div>

    <!-- 試聽區域 -->
    <div v-if="audioUrl && !isRecording" class="pt-4 border-t">
      <p class="text-sm text-gray-600 mb-2">試聽錄音:</p>
      <audio :src="audioUrl" controls class="w-full mb-4" />
      
      <div class="flex space-x-4">
        <button @click="uploadAudio" :disabled="uploading"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
          {{ uploading ? '上傳中...' : '上傳錄音' }}
        </button>
        
        <button @click="discardRecording"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          重新錄音
        </button>
      </div>
    </div>

    <!-- 上傳狀態顯示 -->
    <div v-if="uploading" class="text-blue-500 flex items-center space-x-2">
      <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span>資料上傳中...</span>
    </div>
    
    <div v-if="uploadSuccess" class="text-green-500 flex items-center space-x-2">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <span>上傳成功！</span>
    </div>
    
    <div v-if="uploadError" class="text-red-500 flex items-center space-x-2">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>上傳失敗，請重試</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBaseUrl } from '#imports'

const isRecording = ref(false)
const audioUrl = ref<string | null>(null)
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref(false)
const apibaseUrl = useBaseUrl()

let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []
let currentAudioBlob: Blob | null = null

const startRecording = async () => {
  try {
    // 重置狀態
    uploadSuccess.value = false
    uploadError.value = false
    audioUrl.value = null
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    
    audioChunks = []
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }
    
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      currentAudioBlob = audioBlob
      audioUrl.value = URL.createObjectURL(audioBlob)
      
      // 停止所有音軌
      stream.getTracks().forEach(track => track.stop())
    }
    
    mediaRecorder.start()
    isRecording.value = true
  } catch (error) {
    console.error('Error starting recording:', error)
    alert('無法開始錄音，請確認麥克風權限')
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    isRecording.value = false
  }
}

const uploadAudio = async () => {
  if (!currentAudioBlob) return
  
  uploadSuccess.value = false
  uploadError.value = false
  uploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', currentAudioBlob, 'recording.webm')
    
    // 從 cookie 中取得 token
    const token = useCookie("auth_token").value
    
    const response = await fetch(`${apibaseUrl}/voices/recorder`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    })
    
    uploading.value = false
    
    if (response.ok) {
      uploadSuccess.value = true
      // 可以選擇在成功後清除錄音
      // setTimeout(() => {
      //   discardRecording()
      // }, 2000)
    } else {
      uploadError.value = true
    }
  } catch (error) {
    console.error('Upload error:', error)
    uploadError.value = true
    uploading.value = false
  }
}

const discardRecording = () => {
  // 清除錄音相關資料
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
  audioUrl.value = null
  currentAudioBlob = null
  uploadSuccess.value = false
  uploadError.value = false
  uploading.value = false
}

// 組件銷毀時清理資源
onUnmounted(() => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
})
</script>

<style scoped>
audio {
  outline: none;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>