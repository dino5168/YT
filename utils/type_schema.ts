export interface SchemaField {
  欄位名稱: string;
  資料型別: string;
  最大長度: number | null;
  可為NULL: "YES" | "NO";
  預設值: string | null;
  欄位描述: string;
}

export interface ModelConfig {
  tableName?: string;
  className?: string;
  addTimestamps?: boolean;
  primaryKeyField?: string;
}
