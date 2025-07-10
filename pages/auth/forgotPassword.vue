<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        忘記密碼
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >電子郵件</label
          >
          <input
            v-model="email"
            type="email"
            required
            placeholder="請輸入註冊信箱"
            class="mt-1 px-3 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="text-green-600 text-sm">
          {{ successMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow disabled:opacity-50">
          {{ loading ? "發送中..." : "發送重設密碼信" }}
        </button>
      </form>

      <p class="mt-4 text-sm text-center text-gray-600">
        已記得密碼？
        <NuxtLink to="/auth/login" class="text-blue-500 hover:underline"
          >返回登入</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

useHead({
  title: "忘記密碼",
  meta: [
    {
      name: "description",
      content: "輸入註冊信箱以重新設定密碼",
    },
  ],
});

definePageMeta({layout: "auth"});

const email = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  // 呼叫後端 API 發送重設信
  const {data, error} = await useFetch("/api/auth/forgot-password", {
    method: "POST",
    body: {email: email.value},
  });

  loading.value = false;

  if (error.value) {
    errorMessage.value = error.value.data?.message || "發送失敗，請稍後再試";
  } else {
    successMessage.value = "重設密碼信已發送，請檢查您的信箱";
  }
};
</script>
