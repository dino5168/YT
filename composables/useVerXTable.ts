import {ref, computed} from "vue";
import {useApi} from "~/composables/useApi";

export function useVerXTable(
  schemaUrl: string,
  dataUrl: string,
  excludeColumns: string[] = [] // 新增排除欄位參數，預設空陣列
) {
  const columns = ref<string[]>([]);
  const columnDescriptions = ref<string[]>([]);
  const tableData = ref<any[]>([]);

  // 原始完整欄位（不過濾）
  const rawColumns = ref<string[]>([]);
  const rawDescriptions = ref<string[]>([]);

  const loadSchema = async () => {
    const result = await useFetchWithAuth<any[]>(schemaUrl);

    const meta = result?.data || [];
    rawColumns.value = meta.map((item: any) => item.column_name);
    rawDescriptions.value = meta.map(
      (item: any) => item.comment || item.column_name
    );

    // 將過濾邏輯放這裡，並可在外部隨時更改 excludeColumns 再呼叫 loadSchema 重新套用
    applyFilter();
  };

  const loadData = async () => {
    const result = await useFetchWithAuth<any[]>(dataUrl);

    tableData.value = result?.data || [];
  };

  // 過濾邏輯抽成函式
  function applyFilter() {
    columns.value = rawColumns.value.filter(
      (col) => !excludeColumns.includes(col)
    );
    columnDescriptions.value = rawColumns.value
      .map((col, i) => ({col, desc: rawDescriptions.value[i]}))
      .filter(({col}) => !excludeColumns.includes(col))
      .map(({desc}) => desc);
  }

  return {
    columns,
    columnDescriptions,
    tableData,
    loadSchema,
    loadData,
    applyFilter,
  };
}
