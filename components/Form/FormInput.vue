<template>
    <div class="mb-4">
      <label :for="inputId" :class="`text-sm font-medium ${props.labelcolor} mb-1 block`">
        {{ label }}
      </label>
      <input
        :id="inputId"
        v-model="modelValueProxy"
        :placeholder="props.placeholder"
        class="px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    modelValue: string
    label: string
    placeholder?: string
    labelcolor?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    labelcolor: 'text-gray-700'
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const inputId = `input-${Math.random().toString(36).slice(2, 9)}`
  
  const modelValueProxy = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })
  </script>
  