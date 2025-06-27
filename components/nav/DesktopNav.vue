<template>
    <nav class="hidden sm:flex space-x-4 items-center text-gray-700 text-sm" ref="navRef">
        <!-- 主選單項目 -->
        <template v-for="(link, index) in links" :key="index">
            <a :href="link.href" class="hover:text-blue-600 transition-colors" v-if="!link.dropdown">
                {{ link.label }}
            </a>

            <!-- 下拉選單 -->
            <div class="relative" v-else :ref="el => setDropdownRef(el as HTMLElement | null, index)">
                <button class="hover:text-blue-600 transition-colors px-2 py-1 rounded flex items-center"
                    @click="toggleDropdown(index)" @mouseenter="openDropdown(index)"
                    :class="{ 'text-blue-600': openIndex === index }">
                    {{ link.label }}
                    <svg class="ml-1 w-3 h-3 transition-transform duration-200"
                        :class="{ 'rotate-180': openIndex === index }" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <transition name="dropdown">
                    <div v-if="openIndex === index"
                        class="absolute bg-white shadow-lg rounded-md mt-1 py-2 w-40 z-50 border border-gray-200 left-0"
                        @mouseenter="openDropdown(index)" @mouseleave="closeDropdown">
                        <a v-for="(item, subIndex) in link.dropdown" :key="subIndex" :href="item.href"
                            class="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            @click="closeDropdown">
                            {{ item.label }}
                        </a>
                    </div>
                </transition>
            </div>
        </template>
    </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface NavItem {
    label: string
    href?: string
    dropdown?: { label: string; href: string }[]
}

defineProps<{
    links: NavItem[]
}>()

const openIndex = ref<number | null>(null)
const navRef = ref<HTMLElement | null>(null)
const dropdownRefs = ref<Map<number, HTMLElement>>(new Map())

// 設置下拉選單的 ref
const setDropdownRef = (el: HTMLElement | null, index: number) => {
    if (el) {
        dropdownRefs.value.set(index, el)
    } else {
        dropdownRefs.value.delete(index)
    }
}

const toggleDropdown = (index: number) => {
    openIndex.value = openIndex.value === index ? null : index
}

const openDropdown = (index: number) => {
    openIndex.value = index
}

const closeDropdown = () => {
    openIndex.value = null
}

// 處理外部點擊
const handleClickOutside = (event: Event) => {
    const target = event.target as Node

    // 檢查點擊是否在導航區域內
    if (navRef.value && !navRef.value.contains(target)) {
        closeDropdown()
        return
    }

    // 檢查點擊是否在任何下拉選單內
    let isInsideDropdown = false
    dropdownRefs.value.forEach((dropdownEl) => {
        if (dropdownEl && dropdownEl.contains(target)) {
            isInsideDropdown = true
        }
    })

    // 如果不在下拉選單內，關閉選單
    if (!isInsideDropdown) {
        closeDropdown()
    }
}

// 處理 ESC 鍵
const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeDropdown()
    }
}

// 生命週期鉤子
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
/* 下拉選單動畫 */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
}

/* 改善視覺效果 */
.dropdown-enter-to,
.dropdown-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* 確保下拉選單不會被截斷 */
.relative {
    position: relative;
}

/* 添加一些額外的樣式改善 */
button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

a:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
}
</style>