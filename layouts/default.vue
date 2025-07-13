<template>
  <div class="min-h-screen flex flex-col bg-gray-100 text-gray-900">
    <!-- 導覽列 -->

    <header class="fixed top-0 left-0 right-0 z-9999 bg-white shadow px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- 網站名稱，可切換手機選單 -->
        <!-- 手機版漢堡選單按鈕 -->
        <button class="sm:hidden text-gray-700" @click="menuOpen = !menuOpen">
          <svg
            v-if="!menuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div
          class="text-xl font-bold cursor-pointer select-none"
          @click="menuOpen = !menuOpen">
          🎬 多媒體英語學習
        </div>
        <DesktopNav :links="navLinks" />

        <div v-if="isLogin">
          <ButtonImageCircle :image-url="userData"> </ButtonImageCircle>
        </div>
        <div v-else>
          <NuxtLink to="/auth/Login">登入</NuxtLink>
        </div>
      </div>
      <!-- 手機選單 -->
      <MobileNav :links="navLinks" :menuOpen="menuOpen" />
    </header>

    <!-- 點擊外部關閉下拉選單 -->
    <div
      v-if="dropdownOpen"
      class="fixed inset-0 z-40"
      @click="dropdownOpen = false"></div>

    <!-- 主要內容 -->
    <main class="flex-1 pt-16 px-4 sm:px-6 lg:px-8 bg-gray-200 p-4">
      <slot />
    </main>

    <!-- 頁尾 -->
    <FooterSection :navLinks="navLinks" />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import DesktopNav from "~/components/nav/DesktopNav.vue";
import MobileNav from "~/components/nav/MobileNav.vue";
import FooterSection from "~/components/Footer/FooterSection.vue";
import ButtonImageCircle from "~/components/Buttons/ButtonImageCircle.vue";
import {useNavLinks} from "#imports";

const menuOpen = ref(false);
const dropdownOpen = ref(false);

// 使用 useNavLinks 來獲取導航連結
const {data: navLinksData, pending, error} = await useNavLinks();

// 創建一個 computed 屬性來確保總是返回正確的陣列類型
const navLinks = computed(() => {
  if (navLinksData.value && Array.isArray(navLinksData.value)) {
    return navLinksData.value;
  }
  return [];
});

// 如果需要處理錯誤，可以使用以下方式：
if (error.value) {
  console.error("Failed to load navigation links:", error.value);
}

const user = useCookie("user");
const authToken = useCookie("auth_token");

const isLogin = computed(() => !!authToken.value && !!user.value);
// 創建一個 computed 來正確解析用戶數據
const userData = computed(() => {
  if (!user.value) return null;

  let parsedUser;
  try {
    parsedUser =
      typeof user.value === "string" ? JSON.parse(user.value) : user.value;
  } catch (e) {
    return null;
  }

  if (!parsedUser || !parsedUser.avatar_url) {
    return "/default-avatar.png"; // 如果沒有 avatar_url，返回 null
  }
  return parsedUser?.avatar_url;
});
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
