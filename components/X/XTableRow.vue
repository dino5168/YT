<!-- components/molecules/XTableRow.vue -->
<template>
    <tr
      :class="[
        'border-t border-gray-700',
        isEditing ? 'bg-yellow-100' : isNew ? 'bg-green-50' : 'hover:bg-gray-200',
        $attrs.class
      ]"
    >
      <XTableCell
        v-for="(column, index) in columns"
        :key="index"
        :value="rowData[column]"
        :editing="isEditing || isNew"
        :is-hidden="isHiddenColumn(column)"
        :is-id-column="isIdColumn(column)"
        :placeholder="getPlaceholder(column)"
        :error="errors[column]"
        @update:value="updateCell(column, $event)"
      />
      
      <td class="px-4 py-2 border border-gray-600 whitespace-nowrap">
        <template v-if="isEditing">
          <XButton
            variant="success"
            size="sm"
            class="mr-2"
            @click="$emit('save')"
          >
            儲存
          </XButton>
          <XButton
            variant="secondary"
            size="sm"
            @click="$emit('cancel')"
          >
            取消
          </XButton>
        </template>
        <template v-else-if="isNew">
          <XButton
            variant="success"
            size="sm"
            class="mr-2"
            @click="$emit('add')"
          >
            新增
          </XButton>
          <XButton
            variant="secondary"
            size="sm"
            @click="$emit('cancel')"
          >
            取消
          </XButton>
        </template>
        <template v-else>
          <XButton
            variant="warning"
            size="sm"
            class="mr-2"
            :disabled="disabled"
            @click="$emit('edit')"
          >
            編輯
          </XButton>
          <XButton
            variant="danger"
            size="sm"
            :disabled="disabled"
            @click="$emit('delete')"
          >
            刪除
          </XButton>
        </template>
      </td>
    </tr>
  </template>
  
  <script setup lang="ts">
  import XButton from '../atoms/XButton.vue'
  import XTableCell from './XTableCell.vue'
  
  interface Props {
    rowData: Record<string, any>
    columns: string[]
    isEditing?: boolean
    isNew?: boolean
    disabled?: boolean
    hiddenColumns?: string[]
    errors?: Record<string, string>
  }
  
  const props = withDefaults(defineProps<Props>(), {
    isEditing: false,
    isNew: false,
    disabled: false,
    hiddenColumns: () => ['id', '_id'],
    errors: () => ({})
  })
  
  const emit = defineEmits<{
    'update:rowData': [data: Record<string, any>]
    save: []
    cancel: []
    add: []
    edit: []
    delete: []
  }>()
  
  function isHiddenColumn(column: string) {
    return props.hiddenColumns.includes(column)
  }
  
  function isIdColumn(column: string) {
    return column === 'id' || column === '_id'
  }
  
  function getPlaceholder(column: string) {
    return isIdColumn(column) ? '' : '請輸入'
  }
  
  function updateCell(column: string, value: any) {
    const newData = { ...props.rowData, [column]: value }
    emit('update:rowData', newData)
  }
  </script>