<template>
  <div ref="container" class="relative inline-block text-left">
    <button
      @click="toggleDropdown"
      class="w-8 h-8 rounded-full overflow-hidden border-2 hover:cursor-pointer border-gray-300 hover:border-blue-500 transition-all">
      <img
        :src="imageUrl"
        alt="User Avatar"
        class="w-full h-full object-cover" />
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95">
      <div
        v-if="isOpen"
        class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
        <div class="py-1 text-sm text-gray-700 font-bold">
          <a href="/profile" class="block px-4 py-2 hover:bg-gray-100">
            個人資料
          </a>
          <a href="/settings" class="block px-4 py-2 hover:bg-gray-100">
            設定
          </a>
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:cursor-pointer">
            登出
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {onClickOutside} from "@vueuse/core";

defineProps<{
  imageUrl: string;
}>();

const isOpen = ref(false);
const container = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const router = useRouter();
const apibaseUrl = useBaseUrl();
const logout = async () => {
  const authToken = useCookie("auth_token");
  const user = useCookie("user");

  authToken.value = null;
  user.value = null;
  const {data, error} = await useApi<{payload: any}>(
    `${apibaseUrl}/auth/logout`,
    {
      method: "POST",
    }
  );

  // 跳轉到登入頁
  // router.push('/') : 只會部分更新

  //整頁 refresh
  window.location.href = "/";
};

// 點擊外部時自動關閉選單
onClickOutside(container, () => {
  isOpen.value = false;
});
</script>
