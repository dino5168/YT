<template>
    <transition name="fade">
        <div v-if="show" class="fixed bottom-4 right-4 z-50">
            <div :class="[
                'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
                type === 'success' ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'
            ]">
                <div class="p-4">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg v-if="type === 'success'" class="h-6 w-6 text-green-400" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <svg v-else class="h-6 w-6 text-red-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="ml-3 w-0 flex-1 pt-0.5">
                            <p class="text-sm font-medium text-gray-900">{{ message }}</p>
                        </div>
                        <div class="ml-4 flex-shrink-0 flex">
                            <button @click="close"
                                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                aria-label="Close notification">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
    type: { type: String, default: 'success' },
    message: { type: String, required: true },
    duration: { type: Number, default: 3000 },
    show: { type: Boolean, default: false },
})

const emit = defineEmits(['update:show'])

const close = () => {
    emit('update:show', false)
}

let timer = null

watch(
    () => props.show,
    (val) => {
        if (val) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                close()
            }, props.duration)
        }
    }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
