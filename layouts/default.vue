<template>
    <div class="min-h-screen flex flex-col bg-gray-100 text-gray-900">
        <!-- 導覽列 -->
        <header class="fixed top-0 left-0 right-0 z-9999 bg-white shadow px-6 py-4">
            <div class="flex items-center justify-between">
                <!-- 網站名稱，可切換手機選單 -->
                <div class="text-xl font-bold cursor-pointer select-none" @click="menuOpen = !menuOpen">
                    🎬 多媒體英語教學
                </div>
                <DesktopNav :links="navLinks" />

                <!-- 手機版漢堡選單按鈕 -->
                <button class="sm:hidden text-gray-700" @click="menuOpen = !menuOpen">
                    <svg v-if="!menuOpen" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- 手機選單 -->
            <MobileNav :links="navLinks" :menuOpen="menuOpen" />
        </header>

        <!-- 點擊外部關閉下拉選單 -->
        <div v-if="dropdownOpen" class="fixed inset-0 z-40" @click="dropdownOpen = false"></div>

        <!-- 主要內容 -->
        <main class="flex-1 pt-16 px-4 sm:px-6 lg:px-8 bg-gray-200">
            <slot />
        </main>

        <!-- 頁尾 -->
        <FooterSection :navLinks="navLinks" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DesktopNav from '~/components/nav/DesktopNav.vue'
import MobileNav from '~/components/nav/MobileNav.vue'
import FooterSection from '~/components/Footer/FooterSection.vue'
import { useNavLinks } from '#imports'

const menuOpen = ref(false)
const dropdownOpen = ref(false)

// 備用的導航連結（如果 API 失敗時使用）
/*
const fallbackNavLinks = [
    { label: '首頁', href: '/' },
    {
        label: '如何學習',
        dropdown: [
            { label: '初學者的提示', href: '/html/Learn50tips' },
            { label: '有效學習', href: '/html/learningtw' },
            { label: '高效學習-6個月', href: '/html/LearnSixMonth.html' },
            { label: '不要害羞恐懼', href: '/html/Learninglanguage' },
        ]
    },
    {
        label: '學習',
        dropdown: [
            { label: '字典查詢', href: '/dict/hello' },
            { label: '文法訓練', href: '/tools/GrammarCheck' },
            { label: '英文打字練習', href: '/tools/typegame' },
            { label: '錄音練習', href: '/voices/VoiceRecorder' },
        ]
    },
    {
        label: '老師',
        dropout: [
            { label: '影片匯入', href: '/admin/download' },
            { label: '字幕修正', href: '/admin/manageSrt' },
            { label: '影片列表', href: '/admin/videoList' },
            { label: '音訊轉文字', href: '/tools/mp32text' },
            { label: '文字轉音訊', href: '/tools/text2mp3' }
        ]
    },
    {
        label: '家長',
        dropdown: [
            { label: '影片匯入', href: '/admin/download' },
            { label: '字幕修正', href: '/admin/manageSrt' },
            { label: '影片列表', href: '/admin/videoList' },
            { label: '音訊轉文字', href: '/tools/mp32text' },
            { label: '文字轉音訊', href: '/tools/text2mp3' }
        ]
    },
    {
        label: '系統管理',
        dropdown: [
            { label: '帳號管理', href: '/user/UserList' },
            { label: '角色管理', href: '/user/RoleList' },
        ]
    },
    { label: '關於我們', href: '/aboutus' },
    { label: '聯絡我們', href: '/contact' }
]
*/
// 使用 useNavLinks 來獲取導航連結
const { data: navLinksData, pending, error } = await useNavLinks()

// 創建一個 computed 屬性來確保總是返回正確的陣列類型
const navLinks = computed(() => {
    if (navLinksData.value && Array.isArray(navLinksData.value)) {
        return navLinksData.value
    }
    return []
})

// 如果需要處理錯誤，可以使用以下方式：
if (error.value) {
    console.error('Failed to load navigation links:', error.value)
}
import { useAuth } from '~/composables/useAuth'

const { isLoggedIn, user } = useAuth()

const logout = () => {
    isLoggedIn.value = false
    user.value = null
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 下拉選單動畫 */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>