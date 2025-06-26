// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // 檢查是否已登入
  const token = useCookie("auth_token");

  if (token.value) {
    // 如果已登入，重定向到儀表板
    return navigateTo("/dashboard");
  }
});
