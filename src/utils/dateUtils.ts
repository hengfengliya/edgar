/**
 * 日期处理工具函数
 */
export class DateUtils {
  /**
   * 格式化日期为YYYY-MM-DD格式
   * @param date 日期对象或字符串
   * @returns 格式化的日期字符串
   */
  static formatDate(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;

      if (isNaN(dateObj.getTime())) {
        return '无效日期';
      }

      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error('日期格式化失败:', error);
      return '无效日期';
    }
  }

  /**
   * 格式化日期为中文显示格式
   * @param date 日期对象或字符串
   * @returns 中文格式的日期字符串
   */
  static formatDateChinese(date: Date | string): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;

      if (isNaN(dateObj.getTime())) {
        return '无效日期';
      }

      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');

      return `${year}年${month}月${day}日`;
    } catch (error) {
      console.error('日期格式化失败:', error);
      return '无效日期';
    }
  }

  /**
   * 计算日期差
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 天数差
   */
  static daysBetween(startDate: Date | string, endDate: Date | string): number {
    try {
      const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

      const timeDiff = end.getTime() - start.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    } catch (error) {
      console.error('计算日期差失败:', error);
      return 0;
    }
  }

  /**
   * 判断日期是否在指定范围内
   * @param date 要检查的日期
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @returns 是否在范围内
   */
  static isDateInRange(date: Date | string, startDate: Date | string, endDate: Date | string): boolean {
    try {
      const checkDate = typeof date === 'string' ? new Date(date) : date;
      const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

      return checkDate >= start && checkDate <= end;
    } catch (error) {
      console.error('日期范围检查失败:', error);
      return false;
    }
  }
}