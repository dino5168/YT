<template>
  <div class="p-4 bg-white rounded-xl shadow space-y-4">
    <h2 class="text-xl font-bold">🎙️ Voice Recorder</h2>

    <div class="flex space-x-4">
      <button @click="startRecording" :disabled="isRecording"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50">
        Start
      </button>
      <button @click="stopRecording" :disabled="!isRecording"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50">
        Stop
      </button>
    </div>

    <div v-if="audioUrl" class="pt-4">
      <p class="text-sm text-gray-600">Preview:</p>
      <audio :src="audioUrl" controls class="w-full" />
    </div>

    <div v-if="uploading" class="text-blue-500">Uploading...</div>
    <div v-if="uploadSuccess" class="text-green-500">Upload Successful ✅</div>
    <div v-if="uploadError" class="text-red-500">Upload Failed ❌</div>
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

const startRecording = async () => {
  try {
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
      audioUrl.value = URL.createObjectURL(audioBlob)

      // 上傳檔案
      await uploadAudio(audioBlob)
    }

    mediaRecorder.start()
    isRecording.value = true
  } catch (error) {
    console.error('Error starting recording:', error)
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    isRecording.value = false
  }
}

const uploadAudio = async (blob: Blob) => {
  uploadSuccess.value = false
  uploadError.value = false
  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', blob, 'recording.webm')

    const response = await fetch(`${apibaseUrl}/voices/recorder`, {
      method: 'POST',
      body: formData,
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
</script>

<style scoped>
audio {
  outline: none;
}
</style>