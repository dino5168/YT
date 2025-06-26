<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 class="mt-4 text-xl font-semibold text-gray-700">處理登入中...</h2>
            <p class="mt-2 text-gray-500">請稍候，我們正在完成您的登入流程</p>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

const route = useRoute()
const router = useRouter()

onMounted(async () => {
    const token = route.query.token as string
    const error = route.query.error as string

    if (error) {
        // 有錯誤，重定向到登入頁面並顯示錯誤
        await router.push(`/login?error=${error}`)
        return
    }

    if (token) {
        try {
            // 儲存 token
            const authToken = useCookie('auth_token', {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                httpOnly: false,
                secure: true,
                sameSite: 'lax'
            })
            authToken.value = token

            // 獲取用戶資訊
            const userInfo = await $fetch('/api/auth/verify', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // 儲存用戶資訊
            const user = useCookie('user', {
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: false,
                secure: true,
                sameSite: 'lax'
            })
            // 斷言 userInfo 為具有 payload 屬性的物件
            user.value = (userInfo as { payload: any }).payload

            // 重定向到儀表板
            await router.push('/dashboard')

        } catch (error) {
            console.error('Token verification failed:', error)
            await router.push('/login?error=token_invalid')
        }
    } else {
        // 沒有 token，重定向到登入頁面
        await router.push('/login?error=no_token')
    }
})
</script>