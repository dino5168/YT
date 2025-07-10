<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-3xl md:text-4xl font-bold mb-6 text-blue-800">
        服務條款
      </h1>

      <p class="mb-4 text-sm text-gray-500">最後更新時間：2025 年 7 月 9 日</p>

      <section class="space-y-6">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">1. 接受條款</h2>
          <p class="mt-2 text-gray-700">
            當您使用本網站，即表示您已閱讀、了解並同意受本服務條款之約束。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold text-gray-900">2. 使用限制</h2>
          <p class="mt-2 text-gray-700">
            您同意不會將本網站用於任何非法或未經授權之目的。您不得擅自修改、逆向工程、或干擾網站功能。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold text-gray-900">3. 智慧財產權</h2>
          <p class="mt-2 text-gray-700">
            除非另有說明，網站上所有內容皆屬本站或其授權人之智慧財產，受法律保護，未經允許不得複製或使用。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold text-gray-900">4. 第三方連結</h2>
          <p class="mt-2 text-gray-700">
            本網站可能包含指向第三方網站的連結，這些網站的內容與行為與我們無關，請自行斟酌使用。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold text-gray-900">5. 條款變更</h2>
          <p class="mt-2 text-gray-700">
            我們有權隨時修改本服務條款。修改後的內容將於網站上公告並立即生效。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold text-gray-900">6. 聯絡我們</h2>
          <p class="mt-2 text-gray-700">
            若您對本條款有任何疑問，請透過
            <a href="mailto:support@example.com" class="text-blue-600 underline"
              >support@example.com</a
            >
            聯絡我們。
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({layout: "auth"});
useHead({
  title: "服務條款 - 多媒體英語教學",
  meta: [
    {
      name: "description",
      content: "了解我們的服務條款和使用規範。",
    },
  ],
});
// 可選：載入時自動捲動到頁面頂部

onMounted(() => {
  window.scrollTo({top: 0, behavior: "smooth"});
});
</script>
