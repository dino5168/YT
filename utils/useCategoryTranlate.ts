// YouTube 分類中英文對照表
export interface CategoryTranslation {
  en: string;
  zh: string;
  description?: string;
}

// 分類對照表 - 物件形式
export const CATEGORY_TRANSLATIONS: Record<string, CategoryTranslation> = {
  Music: {
    en: "Music",
    zh: "音樂",
    description: "音樂影片、MV、現場演出等",
  },
  "People & Blogs": {
    en: "People & Blogs",
    zh: "人物與部落格",
    description: "個人頻道、生活分享、Vlog等",
  },
  Entertainment: {
    en: "Entertainment",
    zh: "娛樂",
    description: "綜藝、娛樂節目、搞笑內容等",
  },
  "News & Politics": {
    en: "News & Politics",
    zh: "新聞與政治",
    description: "時事新聞、政治評論、社會議題等",
  },
  "Film & Animation": {
    en: "Film & Animation",
    zh: "電影與動畫",
    description: "電影預告、動畫作品、短片等",
  },
  Education: {
    en: "Education",
    zh: "教育",
    description: "教學影片、知識分享、學習資源等",
  },
  "Science & Technology": {
    en: "Science & Technology",
    zh: "科學與技術",
    description: "科技新知、程式教學、科學實驗等",
  },
  "Nonprofits & Activism": {
    en: "Nonprofits & Activism",
    zh: "非營利組織",
    description: "非營利組織",
  },
  Gaming: {
    en: "Gaming",
    zh: "遊戲",
    description: "遊戲",
  },
} as const;
// 分類對照表 - 陣列形式（用於選單顯示）
export const CATEGORY_LIST: CategoryTranslation[] = [
  {en: "Music", zh: "音樂"},
  {en: "People & Blogs", zh: "人物與部落格"},
  {en: "Entertainment", zh: "娛樂"},
  {en: "News & Politics", zh: "新聞與政治"},
  {en: "Gaming", zh: "遊戲"},
  {en: "Nonprofits & Activism", zh: "非營利組織"},
  {en: "Film & Animation", zh: "電影與動畫"},
  {en: "Education", zh: "教育"},
  {en: "Science & Technology", zh: "科學與技術"},
];

// 工具函數類型定義
export type CategoryKey = keyof typeof CATEGORY_TRANSLATIONS;
export type LanguageCode = "en" | "zh";

// 工具函數：根據英文取得中文
export function getCategoryZh(englishCategory: string): string {
  return CATEGORY_TRANSLATIONS[englishCategory]?.zh || englishCategory;
}

// 工具函數：根據中文取得英文
export function getCategoryEn(chineseCategory: string): string {
  const entry = Object.entries(CATEGORY_TRANSLATIONS).find(
    ([_, translation]) => translation.zh === chineseCategory
  );
  return entry?.[0] || chineseCategory;
}

// 工具函數：取得翻譯（支援雙向）
export function translateCategory(
  category: string,
  targetLang: LanguageCode
): string {
  // 先嘗試當作英文查詢
  const byEnglish = CATEGORY_TRANSLATIONS[category];
  if (byEnglish) {
    return byEnglish[targetLang];
  }

  // 再嘗試當作中文查詢
  const entry = Object.entries(CATEGORY_TRANSLATIONS).find(
    ([_, translation]) => translation.zh === category
  );

  if (entry) {
    return targetLang === "en" ? entry[0] : entry[1].zh;
  }

  return category; // 找不到就回傳原值
}

// 工具函數：檢查分類是否存在
export function isValidCategory(category: string): boolean {
  return (
    category in CATEGORY_TRANSLATIONS ||
    Object.values(CATEGORY_TRANSLATIONS).some((t) => t.zh === category)
  );
}

// 工具函數：取得所有英文分類
export function getAllEnglishCategories(): string[] {
  return Object.keys(CATEGORY_TRANSLATIONS);
}

// 工具函數：取得所有中文分類
export function getAllChineseCategories(): string[] {
  return Object.values(CATEGORY_TRANSLATIONS).map((t) => t.zh);
}

// 工具函數：取得分類選項（用於下拉選單）
export function getCategoryOptions(
  language: LanguageCode = "zh"
): Array<{value: string; label: string}> {
  return Object.entries(CATEGORY_TRANSLATIONS).map(([en, translation]) => ({
    value: en,
    label: language === "zh" ? translation.zh : en,
  }));
}

// 使用範例
export const USAGE_EXAMPLES = {
  // 基本使用
  basic: () => {
    console.log(getCategoryZh("Music")); // 輸出: 音樂
    console.log(getCategoryEn("音樂")); // 輸出: Music
  },

  // 雙向翻譯
  bidirectional: () => {
    console.log(translateCategory("Music", "zh")); // 輸出: 音樂
    console.log(translateCategory("音樂", "en")); // 輸出: Music
  },

  // 驗證分類
  validation: () => {
    console.log(isValidCategory("Music")); // 輸出: true
    console.log(isValidCategory("音樂")); // 輸出: true
    console.log(isValidCategory("Unknown")); // 輸出: false
  },

  // 取得選項列表
  options: () => {
    const zhOptions = getCategoryOptions("zh");
    const enOptions = getCategoryOptions("en");
    console.log("中文選項:", zhOptions);
    console.log("英文選項:", enOptions);
  },
};

// 預設匯出
export default {
  CATEGORY_TRANSLATIONS,
  CATEGORY_LIST,
  getCategoryZh,
  getCategoryEn,
  translateCategory,
  isValidCategory,
  getAllEnglishCategories,
  getAllChineseCategories,
  getCategoryOptions,
};
