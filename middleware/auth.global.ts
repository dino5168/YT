export default defineNuxtRouteMiddleware(async (to, from) => {
  const authToken = useCookie("auth_token");
  const user = useCookie("user");

  // 若已經有 user，就跳過
  if (user.value) return;

  // 如果有 token，但還沒取得 user，試圖自動登入
  const baseUrl = useBaseUrl();
  if (authToken.value) {
    const {data, error} = await useApi<{payload: any}>(
      `${baseUrl}/auth/verify`,
      {
        headers: {
          Authorization: `Bearer ${authToken.value}`,
        },
        method: "POST",
      }
    );

    if (data) {
      user.value = data.payload;
    } else {
      // token 失效，清除
      authToken.value = null;
    }
  }
});
