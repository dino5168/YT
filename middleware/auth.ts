// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // 檢查是否有認證 token
  const token = useCookie("auth_token");

  if (!token.value) {
    // 如果沒有 token，重定向到登入頁面
    return navigateTo("/login");
  }

  // 可選：驗證 token 是否有效
  // 這裡可以添加 token 驗證邏輯
});
