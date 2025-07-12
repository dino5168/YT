<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">
        🔐 重設密碼
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">新密碼</label>
          <input
            v-model="password"
            type="password"
            placeholder="輸入新密碼 (6-10 字母或數字)"
            class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            :class="{'border-red-400': passwordError}"
            required />
          <div v-if="passwordError" class="text-red-500 text-xs mt-1">
            {{ passwordError }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            密碼長度需為 6-10 個字母或數字
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >確認新密碼</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="再次輸入新密碼"
            class="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            :class="{'border-red-400': confirmPasswordError}"
            required />
          <div v-if="confirmPasswordError" class="text-red-500 text-xs mt-1">
            {{ confirmPasswordError }}
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-600 text-sm">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="text-green-600 text-sm">
          {{ successMessage }}
        </div>

        <button
          type="submit"
          :disabled="!isFormValid"
          class="w-full py-2 px-4 rounded-lg transition"
          :class="
            isFormValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ">
          送出重設
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

useHead({
  title: "重設密碼-多媒體英文學習",
  meta: [
    {
      name: "description",
      content: "輸入註冊信箱以重新設定密碼",
    },
  ],
});

const baseUrl = useBaseUrl();
const apiUrl = `${baseUrl}/auth/resetPassword`;

definePageMeta({layout: "auth"});

const route = useRoute();
const router = useRouter();
const token = route.query.token as string;

const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");

// 密碼驗證
const passwordError = computed(() => {
  if (!password.value) return "";

  // 檢查是否只包含字母和數字
  if (!/^[a-zA-Z0-9]+$/.test(password.value)) {
    return "密碼只能包含字母和數字";
  }

  // 檢查長度
  if (password.value.length < 6 || password.value.length > 10) {
    return "密碼長度需為 6-10 個字母或數字";
  }

  return "";
});

// 確認密碼驗證
const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return "";

  if (password.value !== confirmPassword.value) {
    return "兩次輸入的密碼不一致";
  }

  return "";
});

// 表單是否有效
const isFormValid = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  );
});

// 監聽密碼變化，清除錯誤訊息
watch([password, confirmPassword], () => {
  errorMessage.value = "";
  successMessage.value = "";
});

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!token) {
    errorMessage.value = "驗證 token 不存在，請重新申請重設連結。";
    return;
  }

  // 再次驗證密碼
  if (passwordError.value) {
    errorMessage.value = passwordError.value;
    return;
  }

  if (confirmPasswordError.value) {
    errorMessage.value = confirmPasswordError.value;
    return;
  }

  const {data, error} = await useApi(apiUrl, {
    method: "POST",
    body: {
      token,
      newPassword: password.value,
    },
  });

  if (error) {
    errorMessage.value = error.message || "重設失敗，請稍後再試";
  } else if (data.success) {
    successMessage.value = data.message || "密碼已重設成功";
    setTimeout(() => router.push("/auth/login"), 2000);
  } else {
    errorMessage.value = "重設失敗，請稍後再試";
  }
};
</script>
