<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        註冊帳號
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >電子郵件</label
          >
          <input
            v-model="form.email"
            type="email"
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            class="mt-1 px-2 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">密碼</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="6"
            maxlength="10"
            class="mt-1 px-2 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >確認密碼</label
          >
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            class="mt-1 px-2 py-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow">
          註冊
        </button>
      </form>

      <p class="mt-4 text-sm text-center text-gray-600">
        已有帳號？
        <NuxtLink to="/auth/login" class="text-blue-500 hover:underline"
          >登入</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const baseUrl = useBaseUrl();
const registerUrl = `${baseUrl}/auth/register`;

useHead({
  title: "註冊帳號",
  meta: [
    {
      name: "description",
      content: "創建一個新帳號以開始使用我們的服務。",
    },
  ],
});
definePageMeta({layout: "auth"});
import {ref} from "vue";

const form = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

const errorMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";
  if (!form.value.email || !form.value.password) {
    errorMessage.value = "請填寫所有欄位";
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = "密碼與確認密碼不一致";
    return;
  }

  const {result, error} = await useApi(registerUrl, {
    method: "POST",
    body: {
      email: form.value.email,
      password: form.value.password,
    },
  });

  if (error.value) {
    errorMessage.value = error.value.data?.message || "註冊失敗";
    return;
  }

  // 註冊成功轉跳
  await navigateTo("/");
};
</script>
