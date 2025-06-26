// composables/useAuth.ts
export const useAuth = () => {
  const user = useCookie<any | null>("user", {default: () => null});
  const token = useCookie<string | null>("auth_token", {default: () => null});

  // 檢查是否已登入
  const isLoggedIn = computed(() => {
    return !!(user.value && token.value);
  });

  // 登入函數
  const login = async (credentials: {email: string; password: string}) => {
    try {
      const response = await $fetch<{access_token: string; user: any}>(
        "/auth/google",
        {
          method: "POST",
          body: credentials,
        }
      );

      // 儲存 token 和用戶資訊
      token.value = response.access_token;
      user.value = response.user;

      return {success: true, data: response};
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.detail || "登入失敗",
      };
    }
  };

  // Google 登入
  const googleLogin = async (idToken: string) => {
    alert("googleLogin");
    try {
      const response = await $fetch<{access_token: string; user: any}>(
        "/auth/google",
        {
          method: "POST",
          body: {id_token: idToken},
        }
      );

      // 儲存 token 和用戶資訊
      token.value = response.access_token;
      user.value = response.user;

      return {success: true, data: response};
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.detail || "Google 登入失敗",
      };
    }
  };

  // 登出函數
  const logout = async () => {
    try {
      // 呼叫後端登出 API（可選）
      if (token.value) {
        await $fetch("/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // 清除本地儲存的資料
      token.value = null;
      user.value = null;

      // 重定向到登入頁面
      await navigateTo("/login");
    }
  };

  // 驗證 token
  const verifyToken = async () => {
    if (!token.value) return false;

    try {
      const response = await $fetch<{valid: boolean}>("/auth/verify", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      return response.valid;
    } catch (error) {
      // Token 無效，清除本地資料
      token.value = null;
      user.value = null;
      return false;
    }
  };

  // 獲取用戶資訊
  const getCurrentUser = () => {
    return user.value;
  };

  // 檢查是否有特定權限
  const hasPermission = (permission: string) => {
    if (!user.value) return false;
    // 根據您的權限系統實作
    return user.value.permissions?.includes(permission) || false;
  };

  // 檢查是否有特定角色
  const hasRole = (role: string) => {
    if (!user.value) return false;
    // 根據您的角色系統實作
    return (
      user.value.role === role || user.value.roles?.includes(role) || false
    );
  };

  return {
    // 狀態
    user: readonly(user),
    token: readonly(token),
    isLoggedIn,

    // 方法
    login,
    googleLogin,
    logout,
    verifyToken,
    getCurrentUser,
    hasPermission,
    hasRole,
  };
};
