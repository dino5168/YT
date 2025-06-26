<template>
    <footer class="bg-gray-800 shadow text-sm text-gray-200">
        <div class="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <!-- 網站地圖區 -->
            <div v-for="(link, index) in navLinks" :key="index">
                <div class="font-semibold mb-2 text-gray-800">{{ link.label }}</div>
                <ul v-if="link.dropdown" class="space-y-1">
                    <li v-for="(sub, i) in link.dropdown" :key="i">
                        <NuxtLink :to="sub.href" class="hover:underline text-white">
                            {{ sub.label }}
                        </NuxtLink>
                    </li>
                </ul>
                <div v-else>
                    <NuxtLink :to="link.href" class="text-white hover:underline">
                        {{ link.label }}
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- 底部資訊 -->
        <div class="border-t py-4 text-center text-gray-500">
            © 2025 由 <span class="font-semibold text-blue-600">Dino</span> 製作 ✨
        </div>
    </footer>
</template>

<script setup lang="ts">
defineProps<{
    navLinks: {
        label: string
        href?: string
        dropdown?: { label: string; href: string }[]
    }[]
}>()
</script>
