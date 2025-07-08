<!-- components/molecules/XPagination.vue -->
<template>
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-900">
        顯示 {{ startRow }}-{{ endRow }} 筆，共 {{ total }} 筆資料
      </div>
      <div class="flex items-center space-x-1">
        <XButton
          variant="ghost"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPage(1)"
        >
          &laquo;
        </XButton>
        <XButton
          variant="ghost"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          &lsaquo;
        </XButton>
        <XButton
          v-for="page in displayedPages"
          :key="page"
          :variant="currentPage === page ? 'primary' : 'ghost'"
          size="sm"
          @click="goToPage(page)"
        >
          {{ page }}
        </XButton>
        <XButton
          variant="ghost"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          &rsaquo;
        </XButton>
        <XButton
          variant="ghost"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToPage(totalPages)"
        >
          &raquo;
        </XButton>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import XButton from '../atoms/XButton.vue'
  
  interface Props {
    currentPage: number
    total: number
    pageSize: number
    maxDisplayedPages?: number
  }
  
  const props = withDefaults(defineProps<Props>(), {
    maxDisplayedPages: 5
  })
  
  const emit = defineEmits<{
    'update:currentPage': [page: number]
  }>()
  
  const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
  
  const startRow = computed(() => {
    return props.total === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1
  })
  
  const endRow = computed(() => {
    return Math.min(props.currentPage * props.pageSize, props.total)
  })
  
  const displayedPages = computed(() => {
    const pages = []
    const halfDisplay = Math.floor(props.maxDisplayedPages / 2)
    
    let start = Math.max(1, props.currentPage - halfDisplay)
    let end = Math.min(totalPages.value, start + props.maxDisplayedPages - 1)
    
    // 調整 start 如果 end 已經到了最後
    if (end - start + 1 < props.maxDisplayedPages) {
      start = Math.max(1, end - props.maxDisplayedPages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  })
  
  function goToPage(page: number) {
    if (page < 1 || page > totalPages.value || page === props.currentPage) return
    emit('update:currentPage', page)
  }
  </script>