<template>
    <NuxtLink :to="`/video/${videoId}`" class="block group">
        <div
            class="relative flex flex-col rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 group-hover:ring-1 group-hover:ring-gray-300">
            <CardHeader />
            <CardThumbnail :thumbnail="thumbnail" :title="title" :duration="duration" />
            <CardContent :title="title" :tags="tags" :language="language" :level="level" />

        </div>
    </NuxtLink>
</template>

<script setup lang="ts">

const props = defineProps<{
    title: string
    videoId: string
    thumbnail: string
    duration: string
    tags: string[]
    language?: string
    level?: string
}>()
</script>
