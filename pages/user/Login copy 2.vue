<template>
    <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
        <div class="w-full max-w-md bg-white rounded-xl shadow-md p-8">
            <h2 class="text-3xl font-bold text-center mb-6">登入 多媒體英語教學</h2>

            <form @submit.prevent="handleLogin" class="space-y-6">
                <div>
                    <label for="email" class="block mb-1 font-medium text-gray-700">電子郵件</label>
                    <input id="email" v-model="email" type="email" placeholder="請輸入電子郵件" required
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label for="password" class="block mb-1 font-medium text-gray-700">密碼</label>
                    <input id="password" v-model="password" type="password" placeholder="請輸入密碼" required
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <button type="submit"
                    class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    登入
                </button>
            </form>

            <div class="mt-6 text-center text-sm text-gray-600">
                <a href="#" class="text-blue-600 hover:underline">忘記密碼？</a> |
                <a href="#" class="text-blue-600 hover:underline">註冊新帳號</a>
            </div>

            <div class="mt-8 border-t pt-6">
                <p class="text-center text-gray-500 mb-4">或使用以下帳號登入</p>
                <div class="flex justify-center space-x-4">
                    <button
                        class="flex items-center border hover:cursor-pointer border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition"
                        aria-label="Google 登入">
                        <img src="/assets/icons/google.svg" alt="Google" class="w-5 h-5 mr-2" />
                        Google
                    </button>
                    <button
                        class="flex items-center border hover:cursor-pointer border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition"
                        aria-label="Facebook 登入">
                        <img src="/assets/icons/facebook.svg" alt="Facebook" class="w-5 h-5 mr-2" />
                        Facebook
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
definePageMeta({
    layout: 'auth',
})

const email = ref('')
const password = ref('')

function handleLogin() {
    // 這邊寫你的登入邏輯
    alert(`Email: ${email.value}\nPassword: ${password.value}`)
}
</script>
