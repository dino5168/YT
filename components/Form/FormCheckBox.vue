<template>
    <label class="inline-flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="form-checkbox h-5 w-5 text-green-600"
      />
      <span :class="modelValue ? 'text-green-600' : 'text-red-600'">
        {{ modelValue ? activeLabel : inactiveLabel }}
      </span>
    </label>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    modelValue: boolean
    activeLabel?: string
    inactiveLabel?: string
  }>()
  
  defineEmits(['update:modelValue'])
  </script>
  