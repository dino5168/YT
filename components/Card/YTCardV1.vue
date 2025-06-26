<template>
    <div
        class="relative flex flex-col rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">

        <!-- 收藏按鈕與狀態 -->
        <div class="absolute top-2 right-2 flex items-center space-x-2 z-10">
            <!-- 收藏按鈕 -->
            <button aria-label="收藏" type="button" class="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition">
                <HeartIcon class="w-4 h-4 text-gray-600" />
            </button>

            <!-- 審核狀態 -->
            <div class="flex items-center bg-white px-2 py-1 rounded-full text-sm text-green-600 shadow">
                <CheckCircleIcon class="w-4 h-4 mr-1" />
                字幕已審核
            </div>
        </div>

        <!-- 縮圖 -->
        <img :src="thumbnail" :alt="title" class="w-full h-auto object-cover aspect-video" loading="lazy" />

        <!-- 時長標籤 -->
        <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
            {{ duration }}
        </div>

        <!-- 內容 -->
        <div class="p-4 flex flex-col space-y-2">
            <h3 class="text-base font-semibold line-clamp-2">
                <NuxtLink :to="`/video/${videoId}`" class="hover:underline">
                    {{ title }}
                </NuxtLink>
            </h3>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 text-sm">
                <a v-for="tag in tags" :key="tag" :href="`/video/${videoId}`" class="text-blue-600 hover:underline">
                    #{{ tag }}
                </a>
            </div>

            <!-- Metadata -->
            <div class="flex gap-2 text-xs text-gray-600">
                <span v-if="language">{{ language }}</span>
                <span v-if="level">{{ level }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { HeartIcon, CheckCircleIcon } from 'lucide-vue-next'

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
