<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-2xl font-bold text-gray-900">我的英文筆記</h1>
          <div class="flex items-center space-x-4">
            <button
              @click="saveDocument"
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              儲存
            </button>
            <button
              @click="clearContent"
              class="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
              清除內容
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Editor Panel -->
        <div class="space-y-4 lg:col-span-2">
          <!-- Toolbar -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div class="flex items-center space-x-2 overflow-x-auto">
              <!-- Heading Tools -->
              <button
                v-for="level in [1, 2, 3, 4, 5, 6]"
                :key="level"
                @click="insertHeading(level)"
                :title="`標題 ${level}`"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <text
                    x="10"
                    y="15"
                    text-anchor="middle"
                    class="text-xs font-bold">
                    H{{ level }}
                  </text>
                </svg>
              </button>

              <!-- Separator -->
              <div class="w-px h-6 bg-gray-300"></div>

              <!-- Text Formatting -->
              <button
                @click="insertFormat('**', '**', '粗體文字')"
                title="粗體"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M5 4h4.5c1.38 0 2.5 1.12 2.5 2.5S10.88 9 9.5 9H5V4zM5 11h5.5c1.38 0 2.5 1.12 2.5 2.5S11.88 16 10.5 16H5v-5z" />
                </svg>
              </button>
              <button
                @click="insertFormat('*', '*', '斜體文字')"
                title="斜體"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 4h7v2h-2.5l-2 8H13v2H6v-2h2.5l2-8H8V4z" />
                </svg>
              </button>
              <button
                @click="insertFormat('`', '`', '代碼')"
                title="內聯代碼"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M13.5 6L10 18.5l1.5.5L15 7.5 13.5 6zM6 6L2.5 10 6 14l1.5-1.5L4.5 10l3-2.5L6 6z" />
                </svg>
              </button>
              <button
                @click="insertFormat('~~', '~~', '刪除線')"
                title="刪除線"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M3 10h14v2H3v-2zm0-3h6v2H3V7zm8 0h6v2h-6V7zm-8 6h6v2H3v-2zm8 0h6v2h-6v-2z" />
                </svg>
              </button>

              <!-- Separator -->
              <div class="w-px h-6 bg-gray-300"></div>

              <!-- List Tools -->
              <button
                @click="insertList('unordered')"
                title="無序列表"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="4" cy="6" r="1" />
                  <circle cx="4" cy="10" r="1" />
                  <circle cx="4" cy="14" r="1" />
                  <rect x="7" y="5" width="10" height="2" />
                  <rect x="7" y="9" width="10" height="2" />
                  <rect x="7" y="13" width="10" height="2" />
                </svg>
              </button>
              <button
                @click="insertList('ordered')"
                title="有序列表"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <text x="4" y="7" text-anchor="middle" class="text-xs">
                    1
                  </text>
                  <text x="4" y="11" text-anchor="middle" class="text-xs">
                    2
                  </text>
                  <text x="4" y="15" text-anchor="middle" class="text-xs">
                    3
                  </text>
                  <rect x="7" y="5" width="10" height="2" />
                  <rect x="7" y="9" width="10" height="2" />
                  <rect x="7" y="13" width="10" height="2" />
                </svg>
              </button>
              <button
                @click="insertList('task')"
                title="任務列表"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <rect
                    x="2"
                    y="4"
                    width="3"
                    height="3"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1" />
                  <rect
                    x="2"
                    y="8"
                    width="3"
                    height="3"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1" />
                  <rect
                    x="2"
                    y="12"
                    width="3"
                    height="3"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1" />
                  <path
                    d="M3 9l1 1 1-1"
                    stroke="currentColor"
                    stroke-width="1"
                    fill="none" />
                  <rect x="7" y="5" width="10" height="1" />
                  <rect x="7" y="9" width="10" height="1" />
                  <rect x="7" y="13" width="10" height="1" />
                </svg>
              </button>

              <!-- Separator -->
              <div class="w-px h-6 bg-gray-300"></div>

              <!-- Other Tools -->
              <button
                @click="insertLink()"
                title="插入連結"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                </svg>
              </button>
              <button
                @click="insertImage()"
                title="插入圖片"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
              </button>
              <button
                @click="insertCodeBlock()"
                title="代碼塊"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M5 12V7H3v5a2 2 0 002 2h1l3-3h5a2 2 0 002-2V7h-2v5H9l-3 3H5z" />
                  <path d="M13 3H7v2h6V3zM7 17h6v-2H7v2z" />
                </svg>
              </button>
              <button
                @click="insertTable()"
                title="插入表格"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v2h12V5H4zm0 4v2h4V9H4zm6 0v2h6V9h-6zm-6 4v2h4v-2H4zm6 0v2h6v-2h-6z" />
                </svg>
              </button>

              <!-- Separator -->
              <div class="w-px h-6 bg-gray-300"></div>

              <!-- Quote -->
              <button
                @click="insertQuote()"
                title="引用"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  <path d="M2 4h1v12H2V4z" />
                </svg>
              </button>

              <!-- Horizontal Rule -->
              <button
                @click="insertHorizontalRule()"
                title="分隔線"
                class="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 10h14v2H3v-2z" />
                  <circle cx="6" cy="11" r="1" />
                  <circle cx="10" cy="11" r="1" />
                  <circle cx="14" cy="11" r="1" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Editor -->
          <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">編輯器</h3>
            </div>
            <div class="p-4">
              <textarea
                ref="editor"
                v-model="markdownContent"
                placeholder="在此輸入您的 Markdown 內容..."
                class="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="updatePreview"></textarea>
            </div>
          </div>
        </div>

        <!-- Preview Panel -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">預覽</h3>
          </div>
          <div class="p-4">
            <div
              v-if="renderedContent"
              class="prose max-w-none"
              v-html="renderedContent"></div>
            <div v-else class="text-gray-500 italic">預覽將在此顯示...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";

// 使用 Nuxt3 的 head 管理
useHead({
  title: "Markdown Editor",
  meta: [
    {
      name: "description",
      content: "A powerful Markdown editor built with Nuxt3 and Tailwind CSS",
    },
  ],
});

// 響應式變數
const markdownContent = ref("");
const renderedContent = ref("");
const editor = ref(null);

// 簡單的 Markdown 渲染器
const renderMarkdown = (markdown) => {
  if (!markdown) return "";

  return (
    markdown
      // 標題
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>'
      )
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(
        /^#### (.*$)/gm,
        '<h4 class="text-base font-semibold mt-3 mb-2">$1</h4>'
      )
      .replace(
        /^##### (.*$)/gm,
        '<h5 class="text-sm font-semibold mt-2 mb-1">$1</h5>'
      )
      .replace(
        /^###### (.*$)/gm,
        '<h6 class="text-xs font-semibold mt-2 mb-1">$1</h6>'
      )
      // 粗體和斜體
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // 刪除線
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      // 內聯代碼
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      // 連結
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
      )
      // 圖片
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-sm">'
      )
      // 引用
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">$1</blockquote>'
      )
      // 水平分隔線
      .replace(/^---$/gm, '<hr class="border-gray-300 my-6">')
      // 代碼塊
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code class="font-mono text-sm">$1</code></pre>'
      )
      // 無序列表
      .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(
        /(<li.*<\/li>)/s,
        '<ul class="list-disc list-inside space-y-1 my-2">$1</ul>'
      )
      // 有序列表
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      // 任務列表
      .replace(
        /^\- \[ \] (.*$)/gm,
        '<li class="ml-4"><input type="checkbox" class="mr-2" disabled> $1</li>'
      )
      .replace(
        /^\- \[x\] (.*$)/gm,
        '<li class="ml-4"><input type="checkbox" class="mr-2" checked disabled> $1</li>'
      )
      // 段落
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|u|o|l|p|d])(.+)$/gm, '<p class="mb-4">$1</p>')
  );
};

// 更新預覽
const updatePreview = () => {
  renderedContent.value = renderMarkdown(markdownContent.value);
};

// 工具箱功能
const insertHeading = (level) => {
  const heading = "#".repeat(level) + " 標題 " + level;
  insertAtCursor(heading + "\n\n");
};

const insertFormat = (before, after, placeholder) => {
  insertAtCursor(before + placeholder + after);
};

const insertList = (type) => {
  let listText = "";
  switch (type) {
    case "unordered":
      listText = "- 項目 1\n- 項目 2\n- 項目 3\n\n";
      break;
    case "ordered":
      listText = "1. 項目 1\n2. 項目 2\n3. 項目 3\n\n";
      break;
    case "task":
      listText = "- [ ] 待辦事項 1\n- [x] 已完成事項\n- [ ] 待辦事項 2\n\n";
      break;
  }
  insertAtCursor(listText);
};

const insertLink = () => {
  insertAtCursor("[連結文字](https://example.com)");
};

const insertImage = () => {
  insertAtCursor("![圖片描述](https://example.com/image.jpg)");
};

const insertCodeBlock = () => {
  insertAtCursor(
    '```javascript\n// 您的代碼\nconsole.log("Hello World!");\n```\n\n'
  );
};

const insertTable = () => {
  const table = `| 標題1 | 標題2 | 標題3 |
|-------|-------|-------|
| 內容1 | 內容2 | 內容3 |
| 內容4 | 內容5 | 內容6 |

`;
  insertAtCursor(table);
};

const insertQuote = () => {
  insertAtCursor("> 引用內容\n\n");
};

const insertHorizontalRule = () => {
  insertAtCursor("---\n\n");
};

const insertAtCursor = (text) => {
  const textarea = editor.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  markdownContent.value =
    markdownContent.value.substring(0, start) +
    text +
    markdownContent.value.substring(end);

  nextTick(() => {
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    updatePreview();
  });
};

// 其他功能
const saveDocument = () => {
  // 這裡可以實現保存功能
  alert("文檔已保存！");
};

const clearContent = () => {
  if (confirm("確定要清除所有內容嗎？")) {
    markdownContent.value = "";
    updatePreview();
  }
};

// 初始化
onMounted(() => {
  markdownContent.value = `# 歡迎使用 Markdown 編輯器

這是一個使用 **Nuxt3** 和 **Tailwind CSS** 構建的 Markdown 編輯器。

## 功能特點

- 實時預覽
- 豐富的工具箱
- 響應式設計
- 易於使用

### 使用方法

1. 使用上方工具箱快速插入 Markdown 元素
2. 在左側編輯器中輸入內容
3. 右側即時顯示預覽效果

\`\`\`javascript
// 示例代碼
console.log("開始編輯您的 Markdown 文檔！");
\`\`\`

> 提示：您可以使用工具箱快速插入各種 Markdown 元素。

**祝您使用愉快！**`;

  updatePreview();
});
</script>

<style scoped></style>
