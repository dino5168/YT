<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
      <div v-if="status === 'pending'" class="animate-pulse">
        <p class="text-lg text-gray-700">正在驗證您的電子郵件...</p>
      </div>

      <div v-if="status === 'success'" class="space-y-3">
        <h2 class="text-2xl font-bold text-green-600">✅ 驗證成功</h2>
        <p class="text-gray-700">您的帳號已成功驗證，您現在可以登入。</p>
        <p class="text-sm text-gray-500">
          {{ countdown > 0 ? `${countdown} 秒後自動跳轉` : "正在跳轉..." }}
        </p>
        <NuxtLink to="/auth/login" class="text-blue-600 hover:underline">
          前往登入
        </NuxtLink>
      </div>

      <div v-if="status === 'fail'" class="space-y-3">
        <h2 class="text-2xl font-bold text-red-600">❌ 驗證失敗</h2>
        <p class="text-gray-700">
          {{ errorMessage || "驗證連結無效或已過期。" }}
        </p>
        <NuxtLink to="/auth/register" class="text-blue-600 hover:underline">
          重新註冊
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from "vue";

const baseUrl = useBaseUrl();
const route = useRoute();
const router = useRouter();

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

const status = ref<"pending" | "success" | "fail">("pending");
const errorMessage = ref<string>("");
const countdown = ref<number>(3);
let countdownTimer: NodeJS.Timeout | null = null;

const startCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!);
      router.push("/auth/login");
    }
  }, 1000);
};

onMounted(async () => {
  const token = route.query.token as string;
  console.log("驗證 token:", token);

  if (!token) {
    status.value = "fail";
    errorMessage.value = "缺少驗證令牌";
    return;
  }

  try {
    const {data, error} = await useApi<{payload: any}>(
      `${baseUrl}/auth/email/verify?token=${token}`
    );

    if (error) {
      console.error("驗證失敗:", error);
      status.value = "fail";
      errorMessage.value = "驗證失敗，請稍後再試";
      return;
    }

    console.log("驗證成功:", data);
    status.value = "success";

    // 開始倒數計時並自動跳轉
    startCountdown();
  } catch (err) {
    console.error("驗證過程中發生錯誤:", err);
    status.value = "fail";
    errorMessage.value = "驗證過程中發生錯誤，請稍後再試";
  }
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
