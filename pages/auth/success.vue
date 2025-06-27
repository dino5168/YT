<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div class="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
            <!-- Success Icon -->
            <div class="mb-6">
                <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            </div>

            <h1 class="text-2xl font-bold text-gray-800 mb-2">登入成功！</h1>
            <p class="text-gray-600 mb-6">歡迎來到多媒體英語教學平台</p>

            <!-- Loading indicator -->
            <div class="flex items-center justify-center space-x-2 text-blue-600">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span class="text-sm">正在跳轉到首頁...</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { useBaseUrl } from '#imports'
const baseUrl = useBaseUrl()

definePageMeta({
    layout: 'auth'
})


const route = useRoute()
const router = useRouter()

onMounted(async () => {
    const token = route.query.token as string
    if (token) {
        // 儲存 token
        const authToken = useCookie('auth_token', {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            httpOnly: false,
            secure: true,
            sameSite: 'lax'
        })
        authToken.value = token


        // 使用 useApi 取得使用者資訊
        const { data, error } = await useApi<{ payload: any }>(`${baseUrl}/auth/verify`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: "POST"
        })

        if (error) {
            console.error('驗證失敗:', error)
        } else if (data) {
            const user = useCookie('user', {
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: false,
                secure: true,
                sameSite: 'lax'
            })
            user.value = data.payload
        }
    }

    // 延遲跳轉
    setTimeout(() => {
        router.push('/')
    }, 1000)
})
</script>
