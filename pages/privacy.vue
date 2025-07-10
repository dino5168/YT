<template>
  <div class="min-h-screen bg-white text-gray-800">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-3xl md:text-4xl font-bold mb-6 text-purple-800">
        隱私權政策
      </h1>

      <p class="mb-4 text-sm text-gray-500">最後更新日期：2025 年 7 月 9 日</p>

      <section class="space-y-8">
        <div>
          <h2 class="text-2xl font-semibold">1. 收集的資訊</h2>
          <p class="mt-2 text-gray-700">
            當您使用本網站時，我們可能會收集您的個人資訊，例如姓名、電子郵件、IP
            位址等，以提供更好的服務。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold">2. 使用方式</h2>
          <p class="mt-2 text-gray-700">
            我們僅將您的個人資料用於提供服務、改善使用者體驗，以及必要的聯繫與行銷用途。我們不會出售或分享您的個資給第三方。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold">3. Cookie 與追蹤技術</h2>
          <p class="mt-2 text-gray-700">
            我們可能使用 Cookie
            或類似技術來提升網站功能及使用體驗。您可透過瀏覽器設定控制或刪除
            Cookie。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold">4. 資料安全</h2>
          <p class="mt-2 text-gray-700">
            我們採取合理的技術措施保護您的資料不被未經授權的存取、變更或刪除。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold">5. 您的權利</h2>
          <p class="mt-2 text-gray-700">
            您有權查閱、更正或刪除我們所保存的個人資料。如有需求，請聯繫我們。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold">6. 政策變更</h2>
          <p class="mt-2 text-gray-700">
            本隱私政策可能不時更新，我們將於本頁公告最新版本。
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-semibold">7. 聯絡我們</h2>
          <p class="mt-2 text-gray-700">
            若您對本隱私權政策有任何疑問，請透過
            <a
              href="mailto:privacy@example.com"
              class="text-purple-600 underline"
              >privacy@example.com</a
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
  title: "隱私權政策 - 多媒體英語教學",
  meta: [
    {
      name: "description",
      content: "了解我們如何收集、使用和保護您的個人資訊。",
    },
  ],
});
// 可選：進入頁面時滾動到頂部
onMounted(() => {
  window.scrollTo({top: 0, behavior: "smooth"});
});
</script>
