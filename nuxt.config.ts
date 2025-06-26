// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: {enabled: true},
  css: ["@/assets/css/main.css"],
  runtimeConfig: {
    public: {
      srtBaseUrl:
        process.env.NUXT_PUBLIC_SRT_BASE_URL || "http://localhost:8000/srt/",
      ApiBaseUrl: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:8000",
    },
  },
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
  ],
});
