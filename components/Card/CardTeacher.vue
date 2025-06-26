<template>
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center p-6">
        <img :src="photo" :alt="name" :class="[
            'rounded-full object-cover md:mr-6',
            imageSizeClass
        ]" />
        <div class="mt-4 md:mt-0 text-center md:text-left">
            <h3 class="text-xl font-semibold text-gray-900">{{ name }}</h3>
            <p class="text-gray-600 mt-2">{{ description }}</p>
            <p class="text-sm text-gray-400 mt-2">{{ title }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    name: string
    photo: string
    description: string
    title: string
    imageSize?: 'sm' | 'md' | 'lg' | 'xl' | string // 支援自訂類別
}>()

const sizeMap: Record<string, string> = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
}

const imageSizeClass = computed(() => {
    return sizeMap[props.imageSize ?? 'md'] ?? props.imageSize
})
</script>
