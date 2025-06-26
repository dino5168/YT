<template>
    <div class="space-y-2">
      <input
        type="range"
        :min="0"
        :max="duration"
        :step="0.1"
        :value="currentTime"
        @input="onInput"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      <div class="flex justify-between text-sm text-gray-500">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    currentTime: number
    duration: number
  }>()
  
  const emit = defineEmits<{
    (e: 'seek', time: number): void
  }>()
  
  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const time = parseFloat(target.value)
    emit('seek', time)
  }
  
  const formatTime = (s: number): string => {
    const hours = Math.floor(s / 3600)
    const minutes = Math.floor((s % 3600) / 60)
    const seconds = Math.floor(s % 60)
    return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':')
  }
  </script>
  