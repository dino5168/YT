<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
      <div v-if="status === 'pending'" class="animate-pulse">
        <p class="text-lg text-gray-700">正在驗證您的電子郵件...</p>
      </div>

      <div v-if="status === 'success'" class="space-y-3">
        <h2 class="text-2xl font-bold text-green-600">✅ 驗證成功</h2>
        <p class="text-gray-700">您的帳號已成功驗證，您現在可以登入。</p>
        <NuxtLink to="/auth/login" class="text-blue-600 hover:underline">
          前往登入
        </NuxtLink>
      </div>

      <div v-if="status === 'fail'" class="space-y-3">
        <h2 class="text-2xl font-bold text-red-600">❌ 驗證失敗</h2>
        <p class="text-gray-700">驗證連結無效或已過期。</p>
        <NuxtLink to="/auth/register" class="text-blue-600 hover:underline">
          重新註冊
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";

const baseUrl = useBaseUrl();
const route = useRoute();
const router = useRouter();

const status = ref<"pending" | "success" | "fail">("pending");

definePageMeta({layout: "auth"});
useHead({
  title: "驗證電子郵件 - 多媒體英語教學",
  meta: [
    {
      name: "description",
      content: "請點擊驗證連結以完成您的帳號註冊。",
    },
  ],
});

onMounted(async () => {
  const token = route.query.token as string;
  console.log("驗證頁面 token:", token);

  if (!token) {
    status.value = "fail";
    return;
  }

  const {data, error} = await useApi<{payload: any}>(
    `${baseUrl}/auth/email/verify?token=${token}`
  );

  if (error) {
    console.error("驗證失敗:", error);
    status.value = "fail";
    return;
  }

  console.log("驗證成功:", data);
  status.value = "success";

  // 1 秒後跳轉
  setTimeout(() => {
    router.push("/auth/login");
  }, 1000);
});
</script>
