<template>
    <!---->
    <div class="p-4 flex flex-col space-y-2 bg-gray-900">
        <h3
            class="text-white text-base font-semibold line-clamp-2  group-hover:text-red-400 transition-colors duration-200">
            {{ title }}
        </h3>

        <!---
        <div class="flex flex-wrap gap-2 text-sm">
            <span v-for="tag in tags" :key="tag" class="text-blue-600 hover:underline">
                #{{ tag }}
            </span>
        </div>
-->
        <div class="flex gap-2 text-xs text-gray-600">
            <span v-if="language"
                class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">{{
                    language }}</span>
            <span v-if="level"
                class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">{{
                    level }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string
    tags: string[]
    language?: string
    level?: string
}>()
</script>
