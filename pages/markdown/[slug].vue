<template>
  <div class="min-h-screen px-4 py-8 max-w-4xl mx-auto text-red-700">
    <!-- 不列印：操作區 -->
    <div class="flex justify-end mb-4">
      <button
        @click="printPage"
        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
        列印
      </button>
    </div>

    <!-- 不列印：錯誤提示 -->
    <div v-if="error" class="text-red-500 text-center">
      ⚠️ 載入錯誤：{{ error.message }}
    </div>

    <!-- 不列印：載入提示 -->
    <div v-else-if="!data" class="text-gray-500 text-center">載入中...</div>

    <!-- ✅ 只有這個會被列印 -->
    <div class="need_print prose prose-lg max-w-none" v-html="html" />
  </div>
</template>

<script setup lang="ts">
import {onMounted, computed} from "vue";
import {useRoute} from "vue-router";
import mermaid from "mermaid";
import MarkdownIt from "markdown-it";
definePageMeta({layout: "auth"});
useHead({
  title: "英文文法 S+V  - 多媒體英語教學",
  meta: [
    {
      name: "description",
      content: "英文文法五大句型。",
    },
  ],
});

// 取得路由參數中的 markdown 檔名
const route = useRoute();
const slug = route.params.slug as string;
const file = `${slug}.md`;

// 從 FastAPI 取得 markdown 原始內容
const {data, error} = await useFetch<{markdown: string}>(
  "http://localhost:8000/markdown/",
  {
    query: {file},
    headers: {
      accept: "application/json",
    },
  }
);

// 建立 markdown-it 實例，支援 ```mermaid
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const defaultRender = md.renderer.rules.fence!;
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  if (token.info.trim() === "mermaid") {
    return `<div class="mermaid">${token.content}</div>`;
  }
  return defaultRender(tokens, idx, options, env, self);
};

// 將 markdown 轉為 HTML
const html = computed(() =>
  data.value?.markdown ? md.render(data.value.markdown) : ""
);

// 初始化 mermaid
onMounted(() => {
  mermaid.initialize({startOnLoad: false});
  mermaid.init(undefined, ".mermaid");
});

// 列印功能
const printPage = () => {
  window.print();
};
</script>

<style scoped>
/* ✅ 只列印 need_print 區塊 */
@media print {
  /* 隱藏所有元素 */
  body * {
    visibility: hidden !important;
  }

  /* 只顯示 need_print 及其子元素 */
  .need_print,
  .need_print * {
    visibility: visible !important;
  }

  /* 讓 need_print 佔滿整個列印頁面 */
  .need_print {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: auto !important;
    margin: 0 !important;
    padding: 20px !important;
    color: black !important;
    background: white !important;
  }

  /* 設定頁面邊距 */
  @page {
    margin: 1cm;
  }

  /* 避免內容被切斷 */
  .mermaid,
  pre,
  table {
    page-break-inside: avoid;
  }

  /* 標題避免在頁面底部單獨出現 */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    page-break-after: avoid;
  }
}
</style>
