<template>
    <div class="flex items-center w-full max-w-xs p-4 text-sm rounded-lg shadow dark:bg-gray-800 animate-fade-in"
        :class="typeClass" role="alert">
        <div class="inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3" :class="iconBg">
            <component :is="icon" class="w-4 h-4" />
        </div>
        <div class="font-bold">{{ message }}</div>
        <button @click="$emit('close')"
            class="ml-auto text-gray-400 hover:text-black p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close">
            <svg class="w-3 h-3" viewBox="0 0 14 14" fill="none">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Info, CheckCircle2, XCircle, AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{
    type?: 'info' | 'success' | 'error' | 'warning',
    message: string
}>()

const emits = defineEmits(['close'])

const typeClass = computed(() => ({
    info: 'text-blue-500  bg-gray-900 dark:text-blue-200',
    success: 'text-green-500  bg-gray-900 dark:text-green-200',
    error: 'text-red-500 bg-gray-900 dark:text-red-200',
    warning: 'text-yellow-500  bg-gray-900 dark:text-yellow-200',
}[props.type || 'info']))

const iconBg = computed(() => ({
    info: 'bg-blue-100 dark:bg-blue-800',
    success: 'bg-green-100 dark:bg-green-800',
    error: 'bg-red-100 dark:bg-red-800',
    warning: 'bg-yellow-100 dark:bg-yellow-800',
}[props.type || 'info']))

const icon = computed(() => ({
    info: Info,
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
}[props.type || 'info']))
</script>

<style scoped>
@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translateX(50%);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}
</style>
