<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
    <div class="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
      <div
        class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      <span class="text-lg font-medium text-gray-700">
        {{ message || "處理中，請稍候..." }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
  message?: string;
}>();
</script>
