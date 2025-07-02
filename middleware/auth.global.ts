export default defineNuxtRouteMiddleware(async (to, from) => {
  const authToken = useCookie("auth_token");
  const user = useCookie("user");

  // 加入更詳細的 debug 資訊
  console.log("Raw user cookie value:", user.value);
  console.log("Raw auth token:", authToken.value);

  let userObj: any = null;

  if (user.value) {
    // 檢查 user.value 是否已經是物件
    if (typeof user.value === "object") {
      userObj = user.value;
      console.log("User cookie is already an object:", userObj);
    } else if (typeof user.value === "string") {
      // 如果是字串，才需要 JSON.parse
      try {
        userObj = JSON.parse(user.value);
        console.log("Parsed user object from string:", userObj);
      } catch (e) {
        console.error("Failed to parse user cookie:", e);
        console.log("Invalid user cookie content:", user.value);
        userObj = null;
      }
    }
  } else {
    console.log("User cookie is empty or undefined");
  }

  const email = userObj?.email;
  console.log("目前 user email:", email);

  // 檢查特定 email 並轉向
  // 檢查特定 email 並轉向（但要避免在首頁時重複轉向）
  // 鎖定使用者。
  /*
  if (email === "dino5168@gmail.com" && to.path !== "/aboutus") {
    console.log("Redirecting to home page for dino5168@gmail.com");
    return navigateTo("/aboutus");
  }
*/
  if (to.path === "/admin/ManagerMenu" && email !== "dino5168@gmail.com") {
    console.warn("⛔️ 非授權使用者，導向首頁");
    return navigateTo("/");
  }
  // 若已經有 user，就跳過
  if (userObj) {
    console.log("User already exists, skipping auto-login");
    return;
  }

  // 如果有 token，但還沒取得 user，試圖自動登入
  const baseUrl = useBaseUrl();
  if (authToken.value) {
    console.log("Attempting auto-login with token");

    try {
      const {data, error} = await useApi<{payload: any}>(
        `${baseUrl}/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${authToken.value}`,
          },
          method: "POST",
        }
      );

      if (error) {
        console.error("API verification error:", error);
      }

      if (data && data.payload) {
        console.log("Auto-login successful, user data:", data.payload);
        user.value = JSON.stringify(data.payload);
      } else {
        console.log("Auto-login failed, clearing tokens");
        // token 失效，清除
        authToken.value = null;
        user.value = null;
      }
    } catch (apiError) {
      console.error("Auto-login API call failed:", apiError);
      // 清除無效的 token
      authToken.value = null;
      user.value = null;
    }
  } else {
    console.log("No auth token available");
  }
});
