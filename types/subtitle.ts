export interface SubtitleItem {
  seq: number;
  start_time: string; // 格式: "00:00:14,080"
  end_time: string; // 格式: "00:00:15,759"
  en_text: string;
  zh_text: string;
}
// 畫面用的顯示格式
export interface DisplaySubtitleItem {
  start: number;
  end: number;
  zh: string;
  en: string;
}
