<template>
  <div class="relative">
    <div
      class="flex text-sm items-center cursor-pointer hover:bg-gray-200 px-2 py-1 rounded group"
      :style="{paddingLeft: `${level * 12 + 8}px`}"
      @click="toggle"
      @contextmenu.prevent="showContextMenu = !showContextMenu">
      <!-- 展開/收合箭頭 -->
      <span v-if="node.isFolder" class="w-4 mr-1 text-gray-400">
        <span v-if="isOpen">▼</span>
        <span v-else>▶</span>
      </span>
      <span v-else class="w-4 mr-1"></span>

      <!-- 檔案/資料夾名稱 -->
      <span class="truncate flex-1 select-none">{{ node.name }}</span>

      <!-- 右側操作按鈕 -->
      <div
        class="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <button
          v-if="node.isFolder"
          @click.stop="showAddMenu = !showAddMenu"
          class="text-gray-400 hover:text-blue-500 text-xs p-1 rounded hover:bg-gray-300"
          title="新增項目">
          ➕
        </button>
        <button
          @click.stop="deleteItem"
          class="text-gray-400 hover:text-red-500 text-xs p-1 rounded hover:bg-gray-300"
          title="刪除">
          🗑️
        </button>
      </div>
    </div>

    <!-- 新增選單 -->
    <div
      v-if="showAddMenu"
      class="absolute left-6 top-8 bg-white border rounded shadow-lg p-2 space-y-2 z-20 min-w-32"
      :style="{marginLeft: `${level * 12}px`}">
      <button
        @click="addNewProject"
        class="block w-full text-left px-2 py-1 text-sm hover:bg-blue-50 rounded">
        📁 新增資料夾
      </button>
      <button
        @click="addNewFile"
        class="block w-full text-left px-2 py-1 text-sm hover:bg-blue-50 rounded">
        📄 新增檔案
      </button>
    </div>

    <!-- 子節點 -->
    <div v-show="isOpen" v-if="node.children && node.children.length > 0">
      <TreeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from "vue";
import type {TreeNode} from "~/types/TreeNode";

const props = defineProps<{
  node: TreeNode;
  level: number;
}>();

const isOpen = ref(false);
const showContextMenu = ref(false);
const showAddMenu = ref(false);

const {addProject, addFile, deleteNode} = useTree();

const toggle = () => {
  if (props.node.isFolder) {
    isOpen.value = !isOpen.value;
  }
};

const addNewProject = () => {
  const name = prompt("請輸入資料夾名稱:");
  if (name && name.trim()) {
    addProject(name.trim(), props.node.id);
    isOpen.value = true; // 展開父節點以顯示新項目
  }
  showAddMenu.value = false;
};

const addNewFile = () => {
  const name = prompt("請輸入檔案名稱:");
  if (name && name.trim()) {
    addFile(name.trim(), props.node.id);
    isOpen.value = true; // 展開父節點以顯示新項目
  }
  showAddMenu.value = false;
};

const deleteItem = () => {
  if (confirm(`確定要刪除 "${props.node.name}" 嗎？`)) {
    deleteNode(props.node.id);
  }
};

// 點擊外部關閉選單
const handleClickOutside = (event: MouseEvent) => {
  if (showAddMenu.value) {
    showAddMenu.value = false;
  }
  if (showContextMenu.value) {
    showContextMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
