<template>
  <div class="flex items-center gap-2">
    <label
      :for="inputId"
      class="text-sm font-medium text-gray-700 w-24 shrink-0">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxLength"
      v-model="modelValueLocal"
      :disabled="disabled"
      class="flex-1 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" />
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

// 自動生成唯一 ID（避免 label for 無效）
const uniqueId = `forminput-${Math.random().toString(36).substr(2, 8)}`;

interface Props {
  id?: string;
  label: string;
  modelValue: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  maxLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  maxLength: 20,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const modelValueLocal = computed({
  get: () => props.modelValue,
  set: (val: string) => emit("update:modelValue", val),
});

const inputId = computed(() => props.id || uniqueId);
</script>
