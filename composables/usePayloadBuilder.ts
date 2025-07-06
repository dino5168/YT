// composables/usePayloadBuilder.ts
export function usePayloadBuilder() {
  /**
   * 從資料列中選取指定欄位作為 payload
   * @param row 資料來源物件（如 table 的 row）
   * @param fields 欲取出的欄位名稱陣列
   * @returns 一個新物件，僅包含指定欄位
   */
  function buildPayload<T extends object>(
    row: T,
    fields: string[]
  ): Partial<T> {
    const payload: Partial<T> = {};
    for (const key of fields) {
      if (key in row) {
        payload[key as keyof T] = row[key as keyof T];
      }
    }
    return payload;
  }

  return {
    buildPayload,
  };
}
