在 Nuxt 3 中，middleware 與 plugins 是兩個功能不同但都非常重要的機制。以下是它們的差異與使用時機說明：

✅ Middleware
📌 作用：
Middleware 是在「頁面導航前」執行的邏輯，用來攔截、驗證、轉向等。例如：

驗證使用者是否登入

根據使用者角色導向不同頁面

阻止未授權存取某些路由

📁 放置位置：
middleware/ 資料夾（自動註冊）

支援 .ts 或 .js，並可加上 .global.ts 做全域註冊

🧠 使用方式：

```ts
// middleware/auth.global.ts - 全域 middleware
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user");
  if (!user.value && to.path !== "/login") {
    return navigateTo("/login");
  }
});
```

或者指定某頁使用：

```ts
// pages/admin.vue
definePageMeta({
  middleware: "auth",
});
```

✅ Plugins
📌 作用：
Plugins 用來「在應用初始化時」注入第三方函式庫或設定共享資源。常見用途：

初始化 Firebase、Axios、Pinia

自訂 global properties（如 $api）

註冊 Vue plugin（如 vue-i18n）

📁 放置位置：
plugins/ 資料夾

檔案需用 defineNuxtPlugin() 包起來

🧠 使用方式：

```ts
// plugins/axios.ts
export default defineNuxtPlugin((nuxtApp) => {
  const instance = $fetch.create({baseURL: "/api"});
  nuxtApp.provide("api", instance);
});
```

在組件中使用：

```ts
const {$api} = useNuxtApp();
```

🚀 差異比較表：
功能 middleware plugins
執行時機 頁面導航前 Nuxt app 初始化階段
常見用途 權限驗證、路由轉向 注入套件、初始化設定
執行範圍 每次切換頁面 整個 Nuxt lifecycle
能否依頁面使用 ✅ 可用 definePageMeta 指定 ❌ 一旦註冊即套用
執行環境 client & server (depends on需求) 可設定 client 或 server 限定

🧭 使用時機建議：
需求說明 應使用
導覽時要檢查登入狀態、角色轉向 ✅ middleware
初始化 Firebase、i18n、axios ✅ plugin
在 Nuxt 全域注入功能 ✅ plugin
某頁不能讓未登入使用者進入 ✅ middleware（頁面指定）
建立全域 $api 工具函式 ✅ plugin
