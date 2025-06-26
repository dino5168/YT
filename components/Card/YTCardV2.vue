<template>
    <div
        class="relative flex flex-col rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
        <CardHeader />
        <CardThumbnail :thumbnail="thumbnail" :title="title" :duration="duration" />
        <CardContent :video-id="videoId" :title="title" :tags="tags" :language="language" :level="level" />
    </div>
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
