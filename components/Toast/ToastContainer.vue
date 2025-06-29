<template>
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Toast v-for="toast in toasts" :key="toast.id" :type="toast.type" :message="toast.message"
            @close="removeToast(toast.id)" />
    </div>
</template>

<script setup lang="ts">
import { toasts, removeToast } from "../../composables/useToast"
import Toast from './Toast.vue'
</script>
