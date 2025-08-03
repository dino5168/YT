<!--XTable.vue-->
<template>
  <div class="w-full">
    <!-- Table -->
    <table
      class="table-auto w-full text-sm text-left text-gray-900 font-bold border border-gray-600 mt-4">
      <thead class="bg-gray-200 text-gray-950">
        <tr>
          <th
            v-for="(desc, index) in columnDescriptions"
            :key="'desc-' + index"
            :class="[
              'px-4 py-2 border border-gray-600',
              columns[index] === 'id' ? 'hidden' : '',
            ]"
            @click="handleSort(columns[index])"
            class="cursor-pointer hover:bg-gray-500 select-none"
            :style="
              columnWidths && columnWidths[columns[index]]
                ? `width: ${columnWidths[columns[index]]}`
                : ''
            ">
            <div class="flex items-center justify-between">
              <span
                :class="[
                  columns[index] !== 'id' && desc ? 'italic text-blue-800' : '',
                ]">
                {{ desc || "（無描述）" }}
              </span>
              <span v-if="columns[index] !== 'id'" class="ml-1">
                <span
                  v-if="
                    sortColumn === columns[index] && sortDirection === 'asc'
                  "
                  >▲</span
                >
                <span
                  v-else-if="
                    sortColumn === columns[index] && sortDirection === 'desc'
                  "
                  >▼</span
                >
                <span v-else class="text-gray-500">▼</span>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in currentPageRows"
          :key="rowIndex"
          class="border-t border-gray-700 hover:bg-gray-500 cursor-pointer"
          @click="handleClick(row)">
          <!-- XTable.vue (修改這段) -->
          <td
            v-for="(col, colIndex) in columns"
            :key="colIndex"
            :class="[
              'px-4 py-2 border border-gray-600',
              col === 'id' ? 'hidden' : '',
            ]"
            :style="
              columnWidths && columnWidths[col]
                ? `width: ${columnWidths[col]}`
                : ''
            ">
            <slot :name="'cell-' + col" :row="row" :value="row[col]">
              {{ row[col] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty state message -->
    <div v-if="rows.length === 0" class="text-gray-400 mt-2">
      尚未載入資料或該表無資料
    </div>

    <!-- Pagination controls -->
    <div
      v-if="rows.length > 0"
      class="flex justify-between items-center mt-4 text-white">
      <div class="text-sm text-gray-900">
        顯示 {{ startRow }}-{{ endRow }} 筆，共 {{ rows.length }} 筆資料
      </div>
      <div class="flex space-x-2">
        <button
          @click="goToPage(1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
          &laquo;
        </button>
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
          &lsaquo;
        </button>

        <!-- Page numbers -->
        <div class="flex space-x-1">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700 text-gray-900"
            :class="{'bg-blue-600': currentPage === page}">
            {{ page }}
          </button>
        </div>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-gray-900 rounded border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
          &rsaquo;
        </button>
        <button
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
          &raquo;
        </button>
      </div>

      <!-- Page size selector -->
      <div class="flex items-center space-x-2 text-sm">
        <span class="text-gray-900">每頁顯示:</span>
        <select
          v-model="pageSize"
          class="bg-gray-700 border border-gray-600 rounded px-2 py-1">
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from "vue";

const props = defineProps<{
  rows: any[];
  columns: string[];
  columnDescriptions: string[];
  columnWidths?: Record<string, string>; // 新增: 自定義列寬設定
  pageSize?: number;
}>();

const emit = defineEmits<{
  (e: "row-click", row: any): void;
}>();

// Pagination state
const currentPage = ref(1);
const pageSize = ref(props.pageSize || 10);
const pageSizeOptions = [5, 10, 15, 20, 50, 100];

// Sorting state
const sortColumn = ref("");
const sortDirection = ref<"asc" | "desc">("asc");

// 排序資料的方法
const sortedRows = computed(() => {
  if (!sortColumn.value) {
    return [...props.rows];
  }

  return [...props.rows].sort((a, b) => {
    const aValue = a[sortColumn.value];
    const bValue = b[sortColumn.value];

    // 判斷資料類型並進行適當的比較
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection.value === "asc" ? aValue - bValue : bValue - aValue;
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection.value === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection.value === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    } else {
      // 處理空值或其他類型
      if (aValue === undefined || aValue === null)
        return sortDirection.value === "asc" ? -1 : 1;
      if (bValue === undefined || bValue === null)
        return sortDirection.value === "asc" ? 1 : -1;
      return sortDirection.value === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }
  });
});

// Computed properties for pagination
const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value))
);

const startRow = computed(() =>
  sortedRows.value.length === 0
    ? 0
    : (currentPage.value - 1) * pageSize.value + 1
);

const endRow = computed(() =>
  Math.min(currentPage.value * pageSize.value, sortedRows.value.length)
);

const currentPageRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedRows.value.slice(start, end);
});

// Logic to display a reasonable number of page buttons
const displayedPages = computed(() => {
  const totalPagesToShow = 5; // Adjust as needed

  if (totalPages.value <= totalPagesToShow) {
    // If we have fewer pages than our limit, show all pages
    return Array.from({length: totalPages.value}, (_, i) => i + 1);
  }

  // Otherwise, create a window around the current page
  const halfWindow = Math.floor(totalPagesToShow / 2);
  let startPage = Math.max(1, currentPage.value - halfWindow);
  let endPage = Math.min(totalPages.value, startPage + totalPagesToShow - 1);

  // Adjust if we're near the end
  if (endPage === totalPages.value) {
    startPage = Math.max(1, endPage - totalPagesToShow + 1);
  }

  return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
});

// Methods
const handleClick = (row: any) => {
  emit("row-click", row);
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// 處理排序
const handleSort = (column: string) => {
  if (column === "id") return; // 不對 id 欄位進行排序

  // 如果點擊的是當前排序欄位，則切換排序方向
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // 否則設定新的排序欄位，並默認為升序
    sortColumn.value = column;
    sortDirection.value = "asc";
  }
};

// Reset to page 1 when rows change or page size changes
watch(
  () => props.rows,
  () => {
    currentPage.value = 1;
  },
  {deep: true}
);

watch(pageSize, () => {
  currentPage.value = 1;
});
</script>
