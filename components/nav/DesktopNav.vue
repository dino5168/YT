<template>
    <nav class="hidden sm:flex space-x-4 items-center text-gray-700 text-sm">
        <!-- 主選單項目 -->
        <template v-for="(link, index) in links" :key="index">
            <a :href="link.href" class="hover:text-blue-600 transition-colors" v-if="!link.dropdown">
                {{ link.label }}
            </a>

            <!-- 下拉選單 -->
            <div class="relative" v-else>
                <button class="hover:text-blue-600 transition-colors px-2 py-1 rounded" @click="toggleDropdown(index)"
                    @mouseenter="openDropdown(index)">
                    {{ link.label }} ▾
                </button>

                <transition name="dropdown">
                    <div v-if="openIndex === index"
                        class="absolute bg-white shadow-lg rounded mt-1 py-2 w-40 z-50 border"
                        @mouseenter="openDropdown(index)" @mouseleave="closeDropdown">
                        <a v-for="(item, subIndex) in link.dropdown" :key="subIndex" :href="item.href"
                            class="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            {{ item.label }}
                        </a>
                    </div>
                </transition>
            </div>
        </template>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface NavItem {
    label: string
    href?: string
    dropdown?: { label: string; href: string }[]
}

defineProps<{
    links: NavItem[]
}>()

const openIndex = ref<number | null>(null)

const toggleDropdown = (index: number) => {
    openIndex.value = openIndex.value === index ? null : index
}

const openDropdown = (index: number) => {
    openIndex.value = index
}

const closeDropdown = () => {
    openIndex.value = null
}
</script>
