<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        註冊帳號
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >電子郵件</label
          >
          <input
            v-model="form.email"
            type="email"
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            :class="[
              'mt-1 px-2 py-1 block w-full rounded-md border shadow-sm focus:ring-blue-500 focus:border-blue-500',
              emailError ? 'border-red-500' : 'border-gray-300',
            ]"
            @blur="validateEmail"
            @input="clearEmailError" />
          <div v-if="emailError" class="text-red-500 text-xs mt-1">
            {{ emailError }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">密碼</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="8"
            maxlength="20"
            :class="[
              'mt-1 px-2 py-1 block w-full rounded-md border shadow-sm focus:ring-blue-500 focus:border-blue-500',
              passwordError ? 'border-red-500' : 'border-gray-300',
            ]"
            @blur="validatePassword"
            @input="clearPasswordError" />
          <div v-if="passwordError" class="text-red-500 text-xs mt-1">
            {{ passwordError }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            密碼需包含大小寫字母、數字，至少8個字元
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >確認密碼</label
          >
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            :class="[
              'mt-1 px-2 py-1 block w-full rounded-md border shadow-sm focus:ring-blue-500 focus:border-blue-500',
              confirmPasswordError ? 'border-red-500' : 'border-gray-300',
            ]"
            @blur="validateConfirmPassword"
            @input="clearConfirmPasswordError" />
          <div v-if="confirmPasswordError" class="text-red-500 text-xs mt-1">
            {{ confirmPasswordError }}
          </div>
        </div>

        <!-- 圖形驗證碼 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">驗證碼</label>
          <div class="flex items-center space-x-2">
            <input
              v-model="form.captcha"
              type="text"
              required
              maxlength="4"
              class="mt-1 px-2 py-1 flex-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="請輸入驗證碼" />
            <div
              class="bg-gray-200 px-3 py-2 rounded text-lg font-mono select-none cursor-pointer"
              @click="generateCaptcha">
              {{ captchaText }}
            </div>
          </div>
        </div>

        <!-- 同意條款 -->
        <div class="flex items-start">
          <input
            v-model="form.agreeTerms"
            type="checkbox"
            required
            class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label class="ml-2 block text-sm text-gray-900">
            我同意
            <a href="/terms" class="text-blue-500 hover:underline">服務條款</a>
            和
            <a href="/privacy" class="text-blue-500 hover:underline"
              >隱私政策</a
            >
          </label>
        </div>

        <div
          v-if="errorMessage"
          class="text-red-500 text-sm bg-red-50 p-2 rounded">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow">
          {{ loading ? "註冊中..." : "註冊" }}
        </button>
      </form>

      <p class="mt-4 text-sm text-center text-gray-600">
        已有帳號？
        <NuxtLink to="/auth/login" class="text-blue-500 hover:underline">
          登入
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";

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

const form = ref({
  email: "",
  password: "",
  confirmPassword: "",
  captcha: "",
  agreeTerms: false,
});

const errorMessage = ref("");
const loading = ref(false);
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const captchaText = ref("");
const submitAttempts = ref(0);
const lastSubmitTime = ref(0);

// 生成簡單驗證碼
const generateCaptcha = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaText.value = result;
};

// 初始化驗證碼
generateCaptcha();

// 驗證函數
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const disposableEmailDomains = [
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "tempmail.org",
    "throwaway.email",
  ];

  if (!form.value.email) {
    emailError.value = "請輸入電子郵件";
    return false;
  }

  if (!emailRegex.test(form.value.email)) {
    emailError.value = "請輸入有效的電子郵件格式";
    return false;
  }

  const domain = form.value.email.split("@")[1];
  if (disposableEmailDomains.includes(domain)) {
    emailError.value = "不支援臨時郵箱註冊";
    return false;
  }

  emailError.value = "";
  return true;
};

const validatePassword = () => {
  const password = form.value.password;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,20}$/;

  if (!password) {
    passwordError.value = "請輸入密碼";
    return false;
  }

  if (!passwordRegex.test(password)) {
    passwordError.value = "密碼需包含大小寫字母、數字，至少8個字元";
    return false;
  }

  passwordError.value = "";
  return true;
};

const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    confirmPasswordError.value = "請確認密碼";
    return false;
  }

  if (form.value.password !== form.value.confirmPassword) {
    confirmPasswordError.value = "密碼與確認密碼不一致";
    return false;
  }

  confirmPasswordError.value = "";
  return true;
};

// 清除錯誤訊息
const clearEmailError = () => (emailError.value = "");
const clearPasswordError = () => (passwordError.value = "");
const clearConfirmPasswordError = () => (confirmPasswordError.value = "");

// 檢查表單是否有效
const isFormValid = computed(() => {
  return (
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    form.value.captcha &&
    form.value.agreeTerms &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  );
});

const handleSubmit = async () => {
  errorMessage.value = "";

  // 頻率限制檢查
  const now = Date.now();
  if (now - lastSubmitTime.value < 3000) {
    errorMessage.value = "請勿頻繁提交，請等待3秒後重試";
    return;
  }

  // 驗證碼檢查
  if (form.value.captcha.toUpperCase() !== captchaText.value) {
    errorMessage.value = "驗證碼錯誤";
    generateCaptcha();
    form.value.captcha = "";
    return;
  }

  // 重新驗證所有欄位
  if (!validateEmail() || !validatePassword() || !validateConfirmPassword()) {
    return;
  }

  // 檢查是否同意條款
  if (!form.value.agreeTerms) {
    errorMessage.value = "請先同意服務條款和隱私政策";
    return;
  }

  loading.value = true;
  lastSubmitTime.value = now;
  submitAttempts.value++;

  try {
    const {data, error} = await useApi<{success: boolean; message: string}>(
      registerUrl,
      {
        method: "POST",
        body: {
          email: form.value.email,
          password: form.value.password,
          captcha: form.value.captcha,
          fingerprint: await generateFingerprint(),
        },
      }
    );

    if (error) {
      console.error("註冊失敗:", error);
      errorMessage.value = error.data?.message || "註冊失敗，請稍後再試";
      generateCaptcha();
      form.value.captcha = "";
      return;
    }

    if (!data?.success) {
      errorMessage.value = data?.message || "註冊失敗";
      generateCaptcha();
      form.value.captcha = "";
      return;
    }

    // 註冊成功，導向登入頁面
    await navigateTo("/auth/login?registered=true");
  } catch (err) {
    console.error("註冊異常:", err);
    errorMessage.value = "系統錯誤，請稍後再試";
    generateCaptcha();
    form.value.captcha = "";
  } finally {
    loading.value = false;
  }
};

// 生成簡單的瀏覽器指紋
const generateFingerprint = async () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillText("Browser fingerprint", 2, 2);

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
</script>
