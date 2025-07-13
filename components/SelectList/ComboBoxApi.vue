<template>
  <div class="relative w-full" ref="root">
    <!-- 顯示已選取值 -->
    <button
      @click="toggleDropdown"
      class="w-full text-left border text-sm rounded-md px-2 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
      {{ selectedLabel || placeholder }}
    </button>

    <!-- 下拉選單，使用 Teleport -->
    <Teleport to="body" v-if="isOpen">
      <ul
        :style="dropdownStyle"
        class="absolute z-[9999] w-64 text-sm bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
        <li
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="px-4 py-2 cursor-pointer hover:bg-blue-100 transition-colors">
          {{ option.label }}
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch, nextTick} from "vue";
import {onClickOutside} from "@vueuse/core";
import type {Option} from "~/types/Option";

const props = defineProps<{
  modelValue: string | number | null;
  apiUrl: string;
  placeholder?: string;
}>();
const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
  "update:label": [label: string];
}>();

const options = ref<Option[]>([]);
const isOpen = ref(false);
const root = ref<HTMLElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});

const selectedLabel = computed(() => {
  const match = options.value.find((o) => o.value === props.modelValue);
  return match?.label ?? "";
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: Option) => {
  emit("update:modelValue", option.value);
  emit("update:label", option.label);
  isOpen.value = false;
};

onClickOutside(root, () => {
  isOpen.value = false;
});

// 載入選項資料 (保持你原本邏輯)
onMounted(async () => {
  try {
    const apiUrl = `${useBaseUrl()}/DBQuery/${props.apiUrl}`;
    const data = await useApi(apiUrl);
    options.value = data.data;
  } catch (error) {
    console.error("載入選項時發生錯誤:", error);
    options.value = [];
  }
});

// 監聽 isOpen，開啟時計算下拉位置 (相對於 button)
watch(isOpen, async (open) => {
  if (open && root.value) {
    await nextTick();
    const button = root.value.querySelector("button");
    if (button) {
      const rect = button.getBoundingClientRect();
      dropdownStyle.value = {
        position: "fixed",
        top: `${rect.bottom}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      };
    }
  }
});
</script>
