<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
      <!-- 成功發送後的狀態 -->
      <div v-if="emailSent" class="text-center">
        <div
          class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            class="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>

        <h2 class="text-2xl font-bold text-gray-800 mb-2">重設密碼信已發送</h2>

        <p class="text-gray-600 mb-4">
          如果
          <span class="font-semibold text-blue-600">{{ maskedEmail }}</span>
          是我們系統中的註冊信箱，您將會收到重設密碼的信件。
        </p>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3 text-sm text-blue-800">
              <p class="font-medium">請注意：</p>
              <ul class="mt-1 list-disc list-inside space-y-1">
                <li>重設連結將在 1 小時後失效</li>
                <li>請檢查垃圾郵件資料夾</li>
                <li>每個信箱每小時最多發送 3 次</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            @click="resendEmail"
            :disabled="resendLoading || resendCooldown > 0"
            class="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-lg border">
            <span v-if="resendLoading">重新發送中...</span>
            <span v-else-if="resendCooldown > 0"
              >{{ resendCooldown }} 秒後可重新發送</span
            >
            <span v-else>沒收到信？重新發送</span>
          </button>

          <button
            @click="goBack"
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
            返回登入
          </button>
        </div>
      </div>

      <!-- 忘記密碼表單 -->
      <div v-else>
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
          忘記密碼
        </h2>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div class="ml-3 text-sm text-yellow-800">
              <p class="font-medium">安全提醒：</p>
              <p>
                基於安全考量，無論輸入的信箱是否存在，我們都會顯示相同的成功訊息。
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              電子郵件
            </label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="請輸入註冊信箱"
              :class="[
                'mt-1 px-3 py-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500',
                emailError ? 'border-red-500' : 'border-gray-300',
              ]"
              @blur="validateEmail"
              @input="clearEmailError" />
            <div v-if="emailError" class="text-red-500 text-xs mt-1">
              {{ emailError }}
            </div>
          </div>

          <!-- 圖形驗證碼 -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >驗證碼</label
            >
            <div class="flex items-center space-x-2">
              <input
                v-model="captcha"
                type="text"
                required
                maxlength="4"
                placeholder="請輸入驗證碼"
                class="mt-1 px-3 py-2 flex-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              <div
                class="bg-gray-200 px-3 py-2 rounded text-lg font-mono select-none cursor-pointer hover:bg-gray-300 transition-colors"
                @click="generateCaptcha"
                title="點擊刷新驗證碼">
                {{ captchaText }}
              </div>
            </div>
          </div>

          <!-- 頻率限制警告 -->
          <div
            v-if="rateLimitWarning"
            class="text-orange-600 text-sm bg-orange-50 p-2 rounded">
            {{ rateLimitWarning }}
          </div>

          <div
            v-if="errorMessage"
            class="text-red-500 text-sm bg-red-50 p-2 rounded">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? "發送中..." : "發送重設密碼信" }}
          </button>
        </form>

        <p class="mt-4 text-sm text-center text-gray-600">
          已記得密碼？
          <NuxtLink to="/auth/login" class="text-blue-500 hover:underline">
            返回登入
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from "vue";

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
const baseUrl = useBaseUrl();
const apiUrl = `${baseUrl}/auth/forgotPassword`;
// 狀態管理
const email = ref("");
const captcha = ref("");
const captchaText = ref("");
const errorMessage = ref("");
const emailError = ref("");
const loading = ref(false);
const emailSent = ref(false);
const resendLoading = ref(false);
const resendCooldown = ref(0);
const rateLimitWarning = ref("");

// 防範機制相關
const submitAttempts = ref(0);
const lastSubmitTime = ref(0);
const maxAttemptsPerHour = 3;
const minSubmitInterval = 30000; // 30秒最小間隔

let countdownInterval: NodeJS.Timeout | null = null;

// 生成驗證碼
const generateCaptcha = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaText.value = result;
};

// 初始化驗證碼
onMounted(() => {
  generateCaptcha();
  loadStoredData();
});

// 載入儲存的資料（防範刷新頁面繞過限制）
const loadStoredData = () => {
  const stored = sessionStorage.getItem("forgot_password_attempts");
  if (stored) {
    const data = JSON.parse(stored);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // 如果在一小時內，恢復嘗試次數
    if (now - data.timestamp < oneHour) {
      submitAttempts.value = data.attempts || 0;
      lastSubmitTime.value = data.lastSubmit || 0;

      // 如果達到次數限制，顯示警告
      if (submitAttempts.value >= maxAttemptsPerHour) {
        const remainingTime = Math.ceil(
          (oneHour - (now - data.timestamp)) / 1000 / 60
        );
        rateLimitWarning.value = `您已達到每小時發送上限，請 ${remainingTime} 分鐘後再試`;
      }
    } else {
      // 超過一小時，清除限制
      sessionStorage.removeItem("forgot_password_attempts");
      submitAttempts.value = 0;
    }
  }
};

// 儲存嘗試資料
const saveAttemptData = () => {
  const data = {
    attempts: submitAttempts.value,
    lastSubmit: lastSubmitTime.value,
    timestamp: Date.now(),
  };
  sessionStorage.setItem("forgot_password_attempts", JSON.stringify(data));
};

// 郵箱驗證
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const disposableEmailDomains = [
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "tempmail.org",
    "throwaway.email",
    "temp-mail.org",
  ];

  if (!email.value) {
    emailError.value = "請輸入電子郵件";
    return false;
  }

  if (!emailRegex.test(email.value)) {
    emailError.value = "請輸入有效的電子郵件格式";
    return false;
  }

  const domain = email.value.split("@")[1];
  if (disposableEmailDomains.includes(domain)) {
    emailError.value = "不支援臨時郵箱";
    return false;
  }

  emailError.value = "";
  return true;
};

const clearEmailError = () => {
  emailError.value = "";
};

// 表單驗證
const isFormValid = computed(() => {
  return (
    email.value &&
    captcha.value &&
    !emailError.value &&
    submitAttempts.value < maxAttemptsPerHour
  );
});

// 遮罩郵箱
const maskedEmail = computed(() => {
  if (!email.value) return "";

  const [localPart, domain] = email.value.split("@");
  if (localPart.length <= 2) return email.value;

  const masked =
    localPart.substring(0, 2) + "*".repeat(Math.min(localPart.length - 2, 6));
  return `${masked}@${domain}`;
});

// 開始倒數計時
const startCooldown = (seconds: number) => {
  resendCooldown.value = seconds;
  countdownInterval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(countdownInterval!);
      countdownInterval = null;
    }
  }, 1000);
};

// 主要提交處理
const handleSubmit = async () => {
  errorMessage.value = "";
  rateLimitWarning.value = "";

  // 頻率限制檢查
  const now = Date.now();

  // 檢查最小間隔
  if (now - lastSubmitTime.value < minSubmitInterval) {
    const remainingSeconds = Math.ceil(
      (minSubmitInterval - (now - lastSubmitTime.value)) / 1000
    );
    errorMessage.value = `請等待 ${remainingSeconds} 秒後再試`;
    return;
  }

  // 檢查每小時限制
  if (submitAttempts.value >= maxAttemptsPerHour) {
    errorMessage.value = "您已達到每小時發送上限，請稍後再試";
    return;
  }

  // 驗證碼檢查
  if (captcha.value.toUpperCase() !== captchaText.value) {
    errorMessage.value = "驗證碼錯誤";
    generateCaptcha();
    captcha.value = "";
    return;
  }

  // 重新驗證郵箱
  if (!validateEmail()) {
    return;
  }

  loading.value = true;
  lastSubmitTime.value = now;
  submitAttempts.value++;

  try {
    const {data, error} = await useFetch(apiUrl, {
      method: "POST",
      body: {
        email: email.value,
        captcha: captcha.value,
        fingerprint: await generateFingerprint(),
        timestamp: now,
      },
    });

    // 儲存嘗試資料
    saveAttemptData();

    if (error.value) {
      console.error("發送失敗:", error.value);
      errorMessage.value = error.value.data?.message || "發送失敗，請稍後再試";
      generateCaptcha();
      captcha.value = "";
    } else {
      // 無論成功與否，都顯示成功訊息（安全考量）
      emailSent.value = true;
      startCooldown(60); // 60秒後可重新發送
    }
  } catch (err) {
    console.error("發送異常:", err);
    errorMessage.value = "系統錯誤，請稍後再試";
    generateCaptcha();
    captcha.value = "";
  } finally {
    loading.value = false;
  }
};

// 重新發送
const resendEmail = async () => {
  if (resendCooldown.value > 0 || submitAttempts.value >= maxAttemptsPerHour) {
    return;
  }

  resendLoading.value = true;

  try {
    const {data, error} = await useFetch(apiUrl, {
      method: "POST",
      body: {
        email: email.value,
        resend: true,
        fingerprint: await generateFingerprint(),
      },
    });

    submitAttempts.value++;
    saveAttemptData();

    if (!error.value) {
      showNotification("重設密碼信已重新發送", "success");
      startCooldown(60);
    } else {
      showNotification("重新發送失敗，請稍後再試", "error");
    }
  } catch (err) {
    showNotification("系統錯誤，請稍後再試", "error");
  } finally {
    resendLoading.value = false;
  }
};

// 返回登入
const goBack = () => {
  navigateTo("/auth/login");
};

// 生成瀏覽器指紋
const generateFingerprint = async () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("Fingerprint", 2, 2);
  }

  const fingerprint = {
    canvas: canvas.toDataURL(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${screen.width}x${screen.height}`,
    timestamp: Date.now(),
  };

  return btoa(JSON.stringify(fingerprint));
};

// 通知系統
const showNotification = (message: string, type: "success" | "error") => {
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
    type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
  }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 3000);
};

// 清理定時器
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>
