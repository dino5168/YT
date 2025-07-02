export default defineNuxtPlugin((nuxtApp) => {
  console.log("✅ Nuxt Plugin 啟動！可初始化設定");

  // 也可以這樣驗證 plugin 是否能操作 Nuxt context
  nuxtApp.hook("app:mounted", () => {
    console.log("🔄 Nuxt 應用已掛載！");
  });
});
