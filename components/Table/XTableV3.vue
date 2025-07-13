<!--XTable.vue-->
<template>
  <div class="w-full">
    <!-- Table Container with Shadow -->
    <div
      class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mt-4">
      <!-- Table -->
      <table class="table-auto w-full text-sm text-left text-gray-900">
        <thead class="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800">
          <tr>
            <th
              v-for="(desc, index) in columnDescriptions"
              :key="'desc-' + index"
              :class="[
                'px-3 py-2 font-semibold text-gray-700 transition-colors duration-200',
                columns[index] === 'id' ? 'hidden' : '',
                showGridlines ? 'border-r border-gray-200 last:border-r-0' : '',
                'hover:bg-blue-100 cursor-pointer select-none',
              ]"
              @click="handleSort(columns[index])"
              :style="
                columnWidths && columnWidths[columns[index]]
                  ? `width: ${columnWidths[columns[index]]}`
                  : ''
              ">
              <div class="flex items-center justify-between">
                <span
                  :class="[
                    columns[index] !== 'id' && desc
                      ? 'text-blue-800 font-medium'
                      : 'text-gray-600',
                  ]">
                  {{ desc || "（無描述）" }}
                </span>
                <span v-if="columns[index] !== 'id'" class="ml-2 text-gray-500">
                  <span
                    v-if="
                      sortColumn === columns[index] && sortDirection === 'asc'
                    "
                    class="text-blue-600"
                    >▲</span
                  >
                  <span
                    v-else-if="
                      sortColumn === columns[index] && sortDirection === 'desc'
                    "
                    class="text-blue-600"
                    >▼</span
                  >
                  <span v-else class="opacity-40">▼</span>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr
            v-for="(row, rowIndex) in currentPageRows"
            :key="rowIndex"
            class="hover:bg-gray-50 cursor-pointer transition-colors duration-150 ease-in-out group">
            <td
              v-for="(col, colIndex) in columns"
              :key="colIndex"
              :class="[
                'px-6 py-4 text-gray-900 group-hover:text-gray-800',
                col === 'id' ? 'hidden' : '',
                showGridlines ? 'border-r border-gray-200 last:border-r-0' : '',
              ]"
              :style="
                columnWidths && columnWidths[col]
                  ? `width: ${columnWidths[col]}`
                  : ''
              "
              @click="handleClick(row)">
              <slot :name="'cell-' + col" :row="row" :value="row[col]">
                <span class="text-gray-800">{{ row[col] }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state message -->
      <div
        v-if="rows.length === 0"
        class="text-center py-12 text-gray-500 bg-gray-50">
        <div class="text-lg font-medium text-gray-400 mb-2">📋</div>
        <div class="text-gray-600">尚未載入資料或該表無資料</div>
      </div>
    </div>

    <!-- Pagination controls -->
    <div
      v-if="rows.length > 0"
      class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
      <!-- Info Section -->
      <div class="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
        顯示
        <span class="font-semibold text-blue-600"
          >{{ startRow }}-{{ endRow }}</span
        >
        筆， 共
        <span class="font-semibold text-blue-600">{{ rows.length }}</span>
        筆資料
      </div>

      <!-- Page Navigation -->
      <div class="flex items-center space-x-1">
        <button
          @click="goToPage(1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
          &laquo;
        </button>
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
          &lsaquo;
        </button>

        <!-- Page numbers -->
        <div class="flex">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-2 text-sm font-medium border-t border-b border-gray-300 transition-colors duration-200"
            :class="
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ">
            {{ page }}
          </button>
        </div>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
          &rsaquo;
        </button>
        <button
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
          &raquo;
        </button>
      </div>

      <!-- Page size selector -->
      <div class="flex items-center space-x-2 text-sm">
        <span class="text-gray-700 font-medium">每頁顯示:</span>
        <select
          v-model="pageSize"
          class="bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>

    <!-- Grid Toggle Control -->
    <div class="mt-4 flex justify-end">
      <label
        class="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          v-model="showGridlines"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
        <span>顯示格線</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from "vue";

const props = defineProps<{
  rows: any[];
  columns: string[];
  columnDescriptions: string[];
  columnWidths?: Record<string, string>; // 自定義列寬設定
  pageSize?: number;
  gridlines?: boolean; // 新增: 是否顯示格線，預設為 true
}>();

const emit = defineEmits<{
  (e: "row-click", row: any): void;
}>();

// Pagination state
const currentPage = ref(1);
const pageSize = ref(props.pageSize || 10);
const pageSizeOptions = [5, 10, 20, 50, 100];

// Sorting state
const sortColumn = ref("");
const sortDirection = ref<"asc" | "desc">("asc");

// Grid lines control
const showGridlines = ref(
  props.gridlines !== undefined ? props.gridlines : true
);

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

// Watch for gridlines prop changes
watch(
  () => props.gridlines,
  (newVal) => {
    if (newVal !== undefined) {
      showGridlines.value = newVal;
    }
  }
);
</script>
