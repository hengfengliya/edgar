/**
 * 表单验证工具函数
 */
export class ValidationUtils {
  /**
   * 验证搜索表单数据
   * @param formData 表单数据
   * @returns 验证结果
   */
  static validateSearchForm(formData: {
    companyInput: string;
    formType: string;
    dateRange: string;
    startDate: string;
    endDate: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 验证公司输入
    if (!formData.companyInput || formData.companyInput.trim().length === 0) {
      errors.push('请输入公司名称或股票代码');
    } else if (formData.companyInput.trim().length < 2) {
      errors.push('公司名称或股票代码至少需要2个字符');
    }

    // 验证自定义日期范围
    if (formData.dateRange === 'custom') {
      if (!formData.startDate && !formData.endDate) {
        errors.push('自定义日期范围至少需要设置开始日期或结束日期');
      }

      if (formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        if (startDate > endDate) {
          errors.push('开始日期不能晚于结束日期');
        }

        // 检查日期是否过于久远
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

        if (endDate < twoYearsAgo) {
          errors.push('建议选择最近2年内的日期范围以获得更好的搜索结果');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证CIK格式
   * @param cik CIK字符串
   * @returns 是否有效
   */
  static validateCIK(cik: string): boolean {
    if (!cik) return false;

    // CIK应该是1-10位数字
    const cikRegex = /^\d{1,10}$/;
    return cikRegex.test(cik.trim());
  }

  /**
   * 验证股票代码格式
   * @param ticker 股票代码
   * @returns 是否有效
   */
  static validateTicker(ticker: string): boolean {
    if (!ticker) return false;

    // 股票代码通常是1-5个字母
    const tickerRegex = /^[A-Z]{1,5}$/;
    return tickerRegex.test(ticker.trim().toUpperCase());
  }

  /**
   * 验证日期格式
   * @param dateString 日期字符串
   * @returns 是否有效
   */
  static validateDate(dateString: string): boolean {
    if (!dateString) return false;

    const date = new Date(dateString);
    return !isNaN(date.getTime()) && Boolean(dateString.match(/^\d{4}-\d{2}-\d{2}$/));
  }

  /**
   * 验证邮箱格式
   * @param email 邮箱地址
   * @returns 是否有效
   */
  static validateEmail(email: string): boolean {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * 清理和验证输入字符串
   * @param input 输入字符串
   * @param maxLength 最大长度
   * @returns 清理后的字符串
   */
  static sanitizeInput(input: string, maxLength: number = 100): string {
    if (!input) return '';

    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, ''); // 移除可能的HTML标签字符
  }
}

/**
 * 防抖函数工具
 */
export class DebounceUtils {
  /**
   * 创建防抖函数
   * @param func 要防抖的函数
   * @param delay 延迟时间（毫秒）
   * @returns 防抖后的函数
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  /**
   * 创建节流函数
   * @param func 要节流的函数
   * @param delay 延迟时间（毫秒）
   * @returns 节流后的函数
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }
}