<!-- components/molecules/XTableHeader.vue -->
<template>
    <th
      :class="[
        'px-4 py-2 border border-gray-600 bg-gray-200 text-gray-950',
        isHidden ? 'hidden' : '',
        sortable ? 'select-none cursor-pointer hover:bg-gray-300' : '',
        $attrs.class
      ]"
      :style="width ? `width: ${width}` : ''"
      @click="sortable && !isIdColumn ? handleSort() : null"
    >
      <div class="flex items-center justify-between">
        <span :class="!isIdColumn && description ? 'italic text-blue-800' : ''">
          {{ description || '（無描述）' }}
        </span>
        <span v-if="sortable && !isIdColumn">
          <span v-if="sortColumn === columnName && sortDirection === 'asc'" class="text-blue-600">▲</span>
          <span v-else-if="sortColumn === columnName && sortDirection === 'desc'" class="text-blue-600">▼</span>
          <span v-else class="text-gray-400">▼</span>
        </span>
      </div>
    </th>
  </template>
  
  <script setup lang="ts">
  interface Props {
    columnName: string
    description?: string
    width?: string
    isHidden?: boolean
    sortable?: boolean
    sortColumn?: string
    sortDirection?: 'asc' | 'desc'
    isIdColumn?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    description: '',
    width: '',
    isHidden: false,
    sortable: true,
    sortColumn: '',
    sortDirection: 'asc',
    isIdColumn: false
  })
  
  const emit = defineEmits<{
    sort: [columnName: string, direction: 'asc' | 'desc']
  }>()
  
  function handleSort() {
    const newDirection = props.sortColumn === props.columnName && props.sortDirection === 'asc' ? 'desc' : 'asc'
    emit('sort', props.columnName, newDirection)
  }
  </script>