<template>
    <client-only>
        <GoogleLogin :callback="handleSuccess" :onError="handleError" :auto-login="false" prompt />
    </client-only>
</template>

<script setup lang="ts">
import { GoogleLogin } from 'vue3-google-login'
import { useRouter, useRuntimeConfig } from '#imports'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    layout: 'auth',
})

const router = useRouter()
const config = useRuntimeConfig()
const baseUrl = config.public.BaseUrl

const { isLoggedIn, user } = useAuth()

interface GoogleResponse {
    credential: string
    select_by: string
}

const handleSuccess = async (response: GoogleResponse) => {
    console.log('✅ Google 登入回應:', response)

    const idToken = response.credential
    if (!idToken) {
        alert('❗️無法取得登入憑證')
        return
    }

    try {
        const res = await fetch(`${baseUrl}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_token: idToken }),
        })

        if (!res.ok) {
            const err = await res.json()
            console.error('🚫 後端錯誤:', err)
            alert('登入失敗：' + err.detail)
            return
        }

        const data = await res.json()
        //user.value = data
        //isLoggedIn.value = true

        alert('🎉 登入成功，歡迎 ' + data.name)

        // ✅ 成功登入後導向首頁或 dashboard
        router.push('/')
    } catch (error) {
        console.error('⚠️ Fetch 發生錯誤:', error)
        alert('登入失敗：請稍後再試')
    }
}

const handleError = (error: unknown) => {
    console.error('❌ Google 登入錯誤:', error)
    alert('Google 登入失敗')
}
</script>
