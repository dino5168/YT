<template>
    <div class="absolute top-2 right-2 flex items-center space-x-2 z-10">
        <button aria-label="收藏" type="button" class="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition">
            <HeartIcon class="w-4 h-4 text-gray-600" />
        </button>
        <!--
        <div class="flex items-center bg-white px-2 py-1 rounded-full text-sm text-green-600 shadow">
            <CheckCircleIcon class="w-4 h-4 mr-1" />
            字幕已審核
        </div>
        -->
    </div>
</template>

<script setup lang="ts">
import { HeartIcon, CheckCircleIcon } from 'lucide-vue-next'

</script>
