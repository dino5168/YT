<!-- components/atoms/XInput.vue -->
<template>
    <div class="w-full">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full border rounded px-2 py-1 text-sm transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          error ? 'border-red-500 bg-red-50' : 'border-gray-400',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
          $attrs.class
        ]"
        v-bind="$attrs"
      />
      <div v-if="error" class="text-red-600 text-xs mt-1">{{ error }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    modelValue?: string | number
    type?: string
    placeholder?: string
    disabled?: boolean
    error?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    placeholder: '',
    disabled: false,
    error: ''
  })
  
  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()
  </script>