export const splitChineseEnglish = (
  text: string
): {zh: string[]; en: string[]} => {
  const lines = text.split(/\r?\n/);
  const zh: string[] = [];
  const en: string[] = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    const isZh = /[\u4e00-\u9fa5]/.test(trimmedLine);
    if (isZh) {
      zh.push(trimmedLine);
    } else {
      en.push(trimmedLine);
    }
  });

  return {zh, en};
};
