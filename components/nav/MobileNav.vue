<template>
    <transition name="fade">
        <nav v-if="menuOpen"  class="sm:hidden mt-2 space-y-2 text-sm text-gray-700 max-h-[80vh] overflow-y-auto">
            <template v-for="(link, index) in links" :key="index">
                <!-- 一般連結 -->
                <a v-if="!link.dropdown" :href="link.href"
                    class="block px-2 py-1 hover:bg-gray-100 rounded transition-colors">
                    {{ link.label }}
                </a>

                <!-- 下拉選單 -->
                <details v-else class="px-2">
                    <summary class="cursor-pointer py-1 hover:bg-gray-100 rounded transition-colors">
                        {{ link.label }} ▾
                    </summary>
                    <div class="ml-4 space-y-1 mt-1">
                        <a v-for="(item, subIndex) in link.dropdown" :key="subIndex" :href="item.href"
                            class="block py-1 hover:text-blue-600 transition-colors">
                            {{ item.label }}
                        </a>
                    </div>
                </details>
            </template>
        </nav>
    </transition>
</template>

<script setup lang="ts">
interface NavItem {
    label: string
    href?: string
    dropdown?: { label: string; href: string }[]
}

defineProps<{
    links: NavItem[]
    menuOpen: boolean
}>()
</script>
