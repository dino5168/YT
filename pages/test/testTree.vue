<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">歡迎來到首頁</h1>
    <p>這是主要內容區域，現在左側是 Obsidian 風格的檔案瀏覽器</p>

    <!-- 操作按鈕 -->
    <div class="mt-4 space-x-2">
      <button
        @click="addNewRootProject"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        新增根層資料夾
      </button>
      <button
        @click="addNewRootFile"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        新增根層檔案
      </button>
      <button
        @click="showTreeStructure"
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
        顯示樹狀結構
      </button>
    </div>

    <div class="mt-4 text-sm text-gray-600">
      <p>💡 新功能：</p>
      <ul class="list-disc list-inside space-y-1">
        <li>✅ 無需固定根節點，直接在最上層新增檔案和資料夾</li>
        <li>✅ 標題欄有新增按鈕，可快速添加根層項目</li>
        <li>✅ 更像 Obsidian 的縮排樣式</li>
        <li>✅ 滑鼠懸停顯示操作按鈕</li>
        <li>✅ 支援多層巢狀結構</li>
        <li>✅ 響應式的樹狀選單</li>
      </ul>
    </div>

    <!-- 顯示當前樹狀結構 -->
    <div v-if="showTree" class="mt-6 p-4 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">當前樹狀結構：</h3>
      <pre class="text-sm overflow-auto">{{
        JSON.stringify(treeData, null, 2)
      }}</pre>
    </div>
  </div>
</template>

<script setup>
import {useTree} from "~/composables/useTree";

definePageMeta({
  layout: "sidebar",
});

const {treeData, addProject, addFile} = useTree();
const showTree = ref(false);

const addNewRootProject = () => {
  const name = prompt("請輸入資料夾名稱:");
  if (name && name.trim()) {
    addProject(name.trim());
  }
};

const addNewRootFile = () => {
  const fileName = prompt("請輸入檔案名稱:");
  if (fileName && fileName.trim()) {
    addFile(fileName.trim());
  }
};

const showTreeStructure = () => {
  showTree.value = !showTree.value;
};
</script>
