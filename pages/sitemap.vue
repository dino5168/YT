<template>
    <div class="min-h-screen bg-gray-50 py-10 px-4">
        <div class="max-w-4xl mx-auto space-y-8">
            <h1 class="text-3xl font-bold text-gray-800">🗺️ 網站地圖</h1>

            <ul class="space-y-6">
                <li v-for="(item, index) in navLinks" :key="index">
                    <!-- 無 dropdown -->
                    <div v-if="!item.dropdown">
                        <NuxtLink :to="item.href" class="text-blue-600 hover:underline text-lg font-medium">
                            {{ item.label }}
                        </NuxtLink>
                    </div>

                    <!-- 有 dropdown -->
                    <div v-else>
                        <div class="text-lg font-semibold text-gray-700 mb-2">{{ item.label }}</div>
                        <ul class="ml-4 list-disc space-y-1">
                            <li v-for="(sub, i) in item.dropdown" :key="i">
                                <NuxtLink :to="sub.href" class="text-blue-600 hover:underline">
                                    {{ sub.label }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const navLinks = [
    { label: '首頁', href: '/' },
    {
        label: '管理者工具',
        dropdown: [
            { label: '字典查詢', href: '/dict/hello' },
            { label: '影片匯入', href: '/admin/download' },
            { label: '字幕修正', href: '/admin/manageSrt' },
            { label: '影片列表', href: '/admin/videoList' },
            { label: '音訊轉文字', href: '/tools/mp32text' },
            { label: '文字轉音訊', href: '/tools/text2mp3' }
        ]
    },
    {
        label: '如何學習',
        dropdown: [
            { label: '有效學習', href: '/html/learningtw' },
            { label: '影片匯入', href: '/admin/download' },
            { label: '字幕修正', href: '/admin/manageSrt' },
            { label: '影片列表', href: '/admin/videoList' },
            { label: '音訊轉文字', href: '/tools/mp32text' },
            { label: '文字轉音訊', href: '/tools/text2mp3' }
        ]
    },
    { label: '關於本站', href: '/about' },
    { label: '聯絡我們', href: '/contact' }
]
</script>
