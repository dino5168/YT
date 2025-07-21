<template>
  <label class="inline-flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="onChange"
      class="form-checkbox h-5 w-5 text-green-600" />
    <span :class="modelValue ? 'text-green-600' : 'text-red-600'">
      {{ modelValue ? activeLabel : inactiveLabel }}
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

function onChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
}
</script>
