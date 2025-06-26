<template>
    <div class="relative">
        <img :src="thumbnail" :alt="title" class="w-full h-auto object-cover aspect-video" loading="lazy" />
        <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
            {{ duration }}
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    thumbnail: string
    title: string
    duration: string
}>()
</script>
