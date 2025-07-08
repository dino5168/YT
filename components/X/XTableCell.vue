<!-- components/molecules/XTableCell.vue -->
<template>
    <td
      :class="[
        'px-4 py-2 border border-gray-600',
        isHidden ? 'hidden' : '',
        $attrs.class
      ]"
    >
      <template v-if="editing && !isIdColumn">
        <XInput
          v-model="editValue"
          :placeholder="placeholder"
          :error="error"
          @update:modelValue="updateValue"
        />
      </template>
      <template v-else>
        {{ displayValue }}
      </template>
    </td>
  </template>
  
  <script setup lang="ts">
  import XInput from '../atoms/XInput.vue'
  
  interface Props {
    value?: any
    editing?: boolean
    isHidden?: boolean
    isIdColumn?: boolean
    placeholder?: string
    error?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    value: '',
    editing: false,
    isHidden: false,
    isIdColumn: false,
    placeholder: '請輸入',
    error: ''
  })
  
  const emit = defineEmits<{
    'update:value': [value: any]
  }>()
  
  const editValue = ref(props.value)
  const displayValue = computed(() => {
    if (props.isIdColumn && props.editing) {
      return '&nbsp;'
    }
    return props.value || ''
  })
  
  function updateValue(newValue: any) {
    editValue.value = newValue
    emit('update:value', newValue)
  }
  
  // 監聽外部 value 變化
  watch(() => props.value, (newValue) => {
    editValue.value = newValue
  })
  </script>