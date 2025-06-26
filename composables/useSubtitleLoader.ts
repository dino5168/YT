import {ref} from "vue";

export const useSubtitleLoader = () => {
  const subtitles = ref<any[]>([]);
  const loadStatus = ref("");
  const error = ref(false);

  const loadSubtitle = async (videoId: string, baseUrl: string) => {
    error.value = false;
    subtitles.value = [];
    loadStatus.value = "載入中...";

    const jsonPath = `${baseUrl}/${videoId}`; // 確保這是回傳 JSON 的 endpoint

    try {
      const res = await fetch(jsonPath);
      if (!res.ok) throw new Error(`主路徑無效，HTTP ${res.status}`);

      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0) {
        throw new Error("字幕資料為空或格式錯誤");
      }

      subtitles.value = json.map((item) => ({
        seq: item.seq,
        start: item.start_time,
        end: item.end_time,
        en: item.en_text?.trim() || "",
        zh: item.zh_text?.trim() || "",
      }));

      loadStatus.value = `成功載入 ${subtitles.value.length} 個字幕`;
    } catch (err) {
      console.error("載入字幕失敗:", err);
      error.value = true;
      loadStatus.value = `載入失敗: ${err}`;

      // 可選：提供測試資料
      subtitles.value = [
        {
          start: "00:00:07,080",
          end: "00:00:19,840",
          en: "[Music]",
          zh: "[音樂]",
        },
        {
          start: "00:00:19,840",
          end: "00:00:22,199",
          en: "the snow glows white on the mountain",
          zh: "雪地上的雪在山上發光",
        },
      ];
      loadStatus.value = `使用測試字幕 (${subtitles.value.length} 個)`;
    }
  };

  return {
    subtitles,
    loadStatus,
    error,
    loadSubtitle,
  };
};
