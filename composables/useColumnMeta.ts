export type ColumnMeta = {
  欄位名稱: string;
  資料型別: string;
  最大長度: number | null;
  可為NULL: "YES" | "NO";
  預設值: string | null;
  欄位描述: string;
};

export function useColumnMeta() {
  /**
   * 轉換欄位描述，並過濾 excludeFields，加入帶描述的 addFields
   * @param meta 原始欄位描述陣列
   * @param excludeFields 要排除的欄位名稱陣列，預設空陣列
   * @param addFields 要額外加入的欄位與描述陣列，預設空陣列，格式：[{欄位名稱: 描述}, ...]
   */
  function transform(
    meta: ColumnMeta[],
    excludeFields: string[] = [],
    addFields: Record<string, string>[] = []
  ) {
    const columns: string[] = [];
    const columnDescriptions: string[] = [];

    for (const item of meta) {
      const field = item["欄位名稱"];
      if (excludeFields.includes(field)) continue;

      columns.push(field);
      columnDescriptions.push(item["欄位描述"]);
    }

    for (const addFieldObj of addFields) {
      const [field, desc] = Object.entries(addFieldObj)[0];
      if (!columns.includes(field)) {
        columns.push(field);
        columnDescriptions.push(desc || "");
      }
    }

    return {
      columns,
      columnDescriptions,
    };
  }

  return {
    transform,
  };
}
