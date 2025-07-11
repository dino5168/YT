// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: {enabled: true},
  ssr: false,
  css: ["@/assets/css/main.css"],
  runtimeConfig: {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    API_BASE_URL: process.env.API_BASE_URL,

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
  plugins: ["~/plugins/test.server.ts"],
});
