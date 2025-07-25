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
      <span class="text-sm text-gray-500">{{ formatTime(recordingTime) }}</span>
    </div>

    <!-- 波形顯示區域 -->
    
    <div v-show="isRecording" class="bg-gray-900 rounded-lg p-4">
      <canvas ref="waveformCanvas" class="w-full h-20 border border-gray-700"></canvas>
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
const recordingTime = ref(0)
const waveformCanvas = ref<HTMLCanvasElement | null>(null)
const apibaseUrl = useBaseUrl()

let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []
let currentAudioBlob: Blob | null = null
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let dataArray: Uint8Array | null = null
let recordingTimer: number | null = null
let animationId: number | null = null

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const setupAudioVisualization = (stream: MediaStream) => {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)
    
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.8
    const bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)
    
    // 等待 canvas 渲染完成
    nextTick(() => {
      if (!waveformCanvas.value) console.warn('❌ waveformCanvas is null')
      if (!analyser) console.warn('❌ analyser is null')
      if (!dataArray) console.warn('❌ dataArray is null')
      setTimeout(() => {
        drawWaveform()
      }, 100)
      //drawWaveform()
    })
  } catch (error) {
    console.error('Error setting up audio visualization:', error)
  }
}

const drawWaveform = () => {
  if (!waveformCanvas.value || !analyser || !dataArray) {
    console.log('Canvas or analyzer not ready')
    return
  }
  
  const canvas = waveformCanvas.value
  const ctx = canvas.getContext('2d')!
  
  // 設置 canvas 實際尺寸
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  
  const draw = () => {
    if (!isRecording.value || !analyser || !dataArray) return
    
    animationId = requestAnimationFrame(draw)
    
    analyser.getByteFrequencyData(dataArray)
    
    // 清除畫布
    ctx.clearRect(0, 0, rect.width, rect.height)
    
    // 繪製背景
    ctx.fillStyle = 'rgba(17, 24, 39, 1)' // bg-gray-900
    ctx.fillRect(0, 0, rect.width, rect.height)
    
    const barWidth = (rect.width / dataArray.length) * 2.5
    let barHeight
    let x = 0
    
    for (let i = 0; i < dataArray.length; i++) {
      barHeight = (dataArray[i] / 255) * rect.height * 0.8
      
      // 創建漸變色
      const gradient = ctx.createLinearGradient(0, rect.height - barHeight, 0, rect.height)
      gradient.addColorStop(0, '#10b981') // 綠色
      gradient.addColorStop(0.5, '#3b82f6') // 藍色
      gradient.addColorStop(1, '#8b5cf6') // 紫色
      
      ctx.fillStyle = gradient
      ctx.fillRect(x, rect.height - barHeight, barWidth, barHeight)
      
      x += barWidth + 1
    }
  }
  
  draw()
}

const startRecording = async () => {
  try {
    // 重置狀態
    uploadSuccess.value = false
    uploadError.value = false
    audioUrl.value = null
    recordingTime.value = 0
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    
    // 設置音頻視覺化
    setupAudioVisualization(stream)
    
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
      
      // 清理音頻上下文
      if (audioContext) {
        audioContext.close()
        audioContext = null
      }
      
      // 停止計時器
      if (recordingTimer) {
        clearInterval(recordingTimer)
        recordingTimer = null
      }
      
      // 停止動畫
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    }
    
    mediaRecorder.start()
    isRecording.value = true
    
    // 開始計時
    recordingTimer = setInterval(() => {
      recordingTime.value += 1
    }, 1000)
    
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
  recordingTime.value = 0
}

// 組件銷毀時清理資源
onUnmounted(() => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
  if (recordingTimer) {
    clearInterval(recordingTimer)
  }
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (audioContext) {
    audioContext.close()
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