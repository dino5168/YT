<template>
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <h3 class="text-lg font-semibold mb-4 text-red-600">
          <slot name="title">確認操作</slot>
        </h3>
        <p class="text-gray-700 mb-6">
          <slot name="message">你確定要執行此操作嗎？此動作無法復原。</slot>
        </p>
        <div class="flex gap-2 justify-end">
          <ButtonGray @click="$emit('cancel')">取消</ButtonGray>
          <ButtonRed @click="$emit('confirm')">確認</ButtonRed>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ButtonGray, ButtonRed } from '~/components/Buttons'
  defineProps<{
    visible: boolean
  }>()
  
  defineEmits(['confirm', 'cancel'])
  </script>
  