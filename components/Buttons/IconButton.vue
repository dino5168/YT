<template>
    <div class="relative group inline-block">
        <!-- Icon Button -->
        <button class="p-2 rounded-full hover:cursor-pointer hover:bg-gray-100 transition-colors"
            @click="$emit('click')">
            <slot name="icon">
                <!-- 預設 icon（可透過 slot 替換） -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
            </slot>
        </button>

        <!-- Tooltip 顯示在下方 -->
        <div class="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded text-xs
               bg-black text-white whitespace-nowrap z-10 shadow-lg
               opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
            {{ tooltip }}
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    tooltip: string
}>()
</script>
