export interface Role {
  id: number;
  name: string; // 中文名稱，例如「老師」
  key: string; // 程式用英文 key，例如 "teacher"
  description?: string;
}
