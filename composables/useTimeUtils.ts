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
}
