export interface Code {
  id: number;
  category: string; // 代碼類別
  code: string; // 代碼值
  name: string; // 顯示名稱
  sort_order: number; // 排序用
  is_active: number; // 是否啟用（0 或 1）
  description?: string | null; // 備註，可選或 null
  created_at: string; // ISO 格式日期字串（DateTime）
  updated_at: string; // ISO 格式日期字串（DateTime）
}
