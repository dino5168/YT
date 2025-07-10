<template>
  <div
    class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-center mb-6">登入 多媒體英語教學</h2>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-2 text-gray-600">處理中...</span>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-600 text-sm">{{ successMessage }}</p>
      </div>

      <div v-if="!loading">
        <!-- Email Login Form -->
        <form @submit.prevent="handleEmailLogin" class="space-y-6">
          <div>
            <label for="email" class="block mb-2 font-medium text-gray-700"
              >電子郵件</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="請輸入電子郵件"
              required
              :disabled="loading"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>

          <div>
            <label for="password" class="block mb-2 font-medium text-gray-700"
              >密碼</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="請輸入密碼"
              required
              :disabled="loading"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!loading">登入</span>
            <span v-else>處理中...</span>
          </button>
        </form>

        <!-- Forgot Password & Register Links -->
        <div class="mt-6 text-center text-sm text-gray-600">
          <NuxtLink
            to="/auth/forgotPassword"
            class="text-blue-600 hover:underline"
            >忘記密碼？</NuxtLink
          >
          <span class="mx-2">|</span>
          <NuxtLink to="/auth/register" class="text-blue-600 hover:underline"
            >註冊新帳號</NuxtLink
          >
        </div>

        <!-- Social Login -->

        <div class="mt-8 border-t pt-6">
          <p class="text-center text-gray-500 mb-4">或使用以下帳號登入</p>
          <div class="flex justify-center space-x-4">
            <!-- 原本的 Google 登入按鈕 -->
            <ClientOnly>
              <button
                @click="handleGoogleOAuthRedirect"
                class="flex items-center border hover:cursor-pointer border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition"
                aria-label="google 登入">
                <img
                  src="/assets/icons/google.svg"
                  alt="Facebook"
                  class="w-5 h-5 mr-2" />
                Google
              </button>
              <button
                class="flex items-center border hover:cursor-pointer border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition"
                aria-label="Facebook 登入">
                <img
                  src="/assets/icons/facebook.svg"
                  alt="Facebook"
                  class="w-5 h-5 mr-2" />
                Facebook
              </button>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <div class="mt-8 text-center text-sm text-gray-500">
      <p>
        登入即表示您同意我們的
        <NuxtLink to="/terms" class="text-blue-600 hover:underline"
          >使用條款</NuxtLink
        >
        和
        <NuxtLink to="/privacy" class="text-blue-600 hover:underline"
          >隱私政策</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useGoogleAuth} from "~/composables/useGoogleAuth";
import {useApi} from "~/composables/useApi";

const baseUrl = useBaseUrl();
const loginUrl = `${baseUrl}/auth/login`;

definePageMeta({layout: "auth"});
useHead({
  title: "登入 - 多媒體英語教學",
  meta: [
    {
      name: "description",
      content: "使用電子郵件或社交帳號登入多媒體英語教學平台。",
    },
  ],
});

const email = ref("");
const password = ref("");
const router = useRouter();
const route = useRoute();

const {
  loading,
  errorMessage,
  successMessage,
  handleGoogleOAuthRedirect,
  initGoogleOneTap,
} = useGoogleAuth();

onMounted(() => {
  const error = route.query.error as string;
  const success = route.query.success as string;

  if (error) {
    errorMessage.value =
      error === "auth_failed"
        ? "第三方登入失敗，請重試"
        : error === "access_denied"
          ? "您拒絕了授權請求"
          : "登入過程中發生錯誤";
  }

  if (success) {
    successMessage.value = "登入成功！正在跳轉...";
  }

  initGoogleOneTap();
});

const handleEmailLogin = async () => {
  loading.value = true;
  errorMessage.value = "";

  const {data, error} = await useApi(loginUrl, {
    method: "POST",
    body: {
      email: email.value,
      password: password.value,
    },
  });

  console.log("Login response:", data, error);

  if (error) {
    errorMessage.value = error;
    loading.value = false;
    return;
  }

  const token = useCookie("auth_token", {path: "/"});
  const user = useCookie("user", {path: "/"});

  token.value = data.access_token;
  user.value = data.user;

  successMessage.value = "登入成功！正在跳轉...";
  setTimeout(() => router.push("/"), 1000);
};

watch([email, password], () => {
  if (errorMessage.value) {
    errorMessage.value = "";
    successMessage.value = "";
  }
});
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
