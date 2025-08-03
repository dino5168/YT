<template>
  <div class="flex">
    <!-- 側邊欄 -->
    <aside class="w-64 bg-gray-100 h-screen border-r">
      <!-- 標題欄 -->
      <div class="p-4 border-b bg-gray-50">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-gray-800">Files</h2>
          <div class="flex space-x-1">
            <button
              @click="showAddRootMenu = !showAddRootMenu"
              class="text-gray-500 hover:text-blue-500 p-1 rounded hover:bg-gray-200"
              title="新增檔案/資料夾">
              ➕
            </button>
          </div>
        </div>

        <!-- 根層新增選單 -->
        <div
          v-if="showAddRootMenu"
          class="mt-2 bg-white border rounded shadow-lg p-2 space-y-2 z-10">
          <button
            @click="addRootProject"
            class="block w-full text-left px-2 py-1 text-sm hover:bg-blue-50 rounded">
            📁 新增資料夾
          </button>
          <button
            @click="addRootFile"
            class="block w-full text-left px-2 py-1 text-sm hover:bg-blue-50 rounded">
            📄 新增檔案
          </button>
        </div>
      </div>

      <!-- 檔案樹 -->
      <div class="p-2 overflow-y-auto h-full">
        <TreeItem
          v-for="node in treeData"
          :key="node.id"
          :node="node"
          :level="0" />
      </div>
    </aside>
    <!-- 主內容 -->
    <main class="flex-1 p-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import TreeItem from "~/components/Tree/TreeItem.vue";

const {treeData, addProject, addFile} = useTree();
const showAddRootMenu = ref(false);

const addRootProject = () => {
  const name = prompt("請輸入資料夾名稱:");
  if (name && name.trim()) {
    addProject(name.trim());
  }
  showAddRootMenu.value = false;
};

const addRootFile = () => {
  const name = prompt("請輸入檔案名稱:");
  if (name && name.trim()) {
    addFile(name.trim());
  }
  showAddRootMenu.value = false;
};

// 點擊外部關閉選單
const handleClickOutside = () => {
  showAddRootMenu.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
