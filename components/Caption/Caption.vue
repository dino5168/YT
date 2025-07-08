<template>
  <h1 :class="['font-bold text-xl', colorClass]">
    <slot />
  </h1>
</template>

<script setup lang="ts">
const props = defineProps<{
  color?: string // ex: 'text-red-500'
}>()

// 預設文字顏色為 text-gray-800
const colorClass = computed(() => props.color || 'text-gray-800')
</script>
