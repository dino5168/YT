export class TimeUtil {
  /**
   * 將數字補零
   */
  private static pad(num: number, length: number = 2): string {
    return num.toString().padStart(length, "0");
  }

  /**
   * 將秒數轉為格式化時間字串 (hh:mm:ss 或 mm:ss)
   * @param seconds 秒數，可包含小數
   */
  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
    }
    return `${this.pad(minutes)}:${this.pad(secs)}`;
  }

  /**
   * 將 SRT 格式時間字串轉為秒數 (例如 "00:01:05,123")
   */
  static timeStringToSeconds(timeStr: string): number {
    const match = timeStr.match(/(\d+):(\d+):(\d+),(\d+)/);
    if (!match) {
      throw new Error(`無法解析時間字串: ${timeStr}`);
    }

    const [, hhStr, mmStr, ssStr, msStr] = match;
    const hh = parseInt(hhStr, 10);
    const mm = parseInt(mmStr, 10);
    const ss = parseInt(ssStr, 10);
    const ms = parseInt(msStr, 10);

    return hh * 3600 + mm * 60 + ss + ms / 1000;
  }

  /**
   * 將秒數轉為完整時間字串 (hh:mm:ss,SSS)
   */
  static secondsToTimeString(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)},${this.pad(ms, 3)}`;
  }

  /**
   * 將時間字串 (hh:mm:ss,SSS) 拆解為物件
   */
  static timeStringToObject(timeStr: string): {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  } {
    const match = timeStr.match(/(\d+):(\d+):(\d+),(\d+)/);
    if (!match) {
      throw new Error(`無法解析時間字串: ${timeStr}`);
    }

    return {
      hours: parseInt(match[1], 10),
      minutes: parseInt(match[2], 10),
      seconds: parseInt(match[3], 10),
      milliseconds: parseInt(match[4], 10),
    };
  }
  //
  // 時間字串轉秒數 - 適配新格式
  static timeToSeconds(timeStr: string): number {
    try {
      // 移除空格並處理可能的格式問題
      const cleanTimeStr = timeStr.trim();

      // 支援兩種格式: HH:MM:SS,mmm 和 HH:MM:SS.mmm
      const timeRegex = /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/;
      const match = cleanTimeStr.match(timeRegex);

      if (!match) {
        console.error("時間格式錯誤:", timeStr);
        return 0;
      }

      const [, hours, minutes, seconds, milliseconds] = match;
      const totalSeconds =
        parseInt(hours) * 3600 +
        parseInt(minutes) * 60 +
        parseInt(seconds) +
        parseInt(milliseconds) / 1000;

      return totalSeconds;
    } catch (error) {
      console.error("解析時間錯誤:", timeStr, error);
      return 0;
    }
  }
}
