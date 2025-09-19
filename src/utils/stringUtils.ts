/**
 * 字符串处理工具函数
 */
export class StringUtils {
  /**
   * 截断文本并添加省略号
   * @param text 原始文本
   * @param maxLength 最大长度
   * @returns 截断后的文本
   */
  static truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.slice(0, maxLength) + '...';
  }

  /**
   * 首字母大写
   * @param text 原始文本
   * @returns 首字母大写的文本
   */
  static capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * 驼峰命名转换为短横线命名
   * @param camelCase 驼峰命名字符串
   * @returns 短横线命名字符串
   */
  static camelToKebab(camelCase: string): string {
    return camelCase.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * 清理和格式化股票代码
   * @param ticker 原始股票代码
   * @returns 清理后的股票代码
   */
  static cleanTicker(ticker: string): string {
    if (!ticker) return '';
    return ticker.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  /**
   * 格式化公司名称
   * @param companyName 原始公司名称
   * @returns 格式化后的公司名称
   */
  static formatCompanyName(companyName: string): string {
    if (!companyName) return '';

    // 移除常见的公司后缀简写
    const cleanName = companyName
      .replace(/\s+(Inc\.?|Corp\.?|Ltd\.?|LLC|Co\.?)\s*$/i, '')
      .trim();

    return cleanName;
  }

  /**
   * 生成安全的文件名
   * @param filename 原始文件名
   * @returns 安全的文件名
   */
  static sanitizeFilename(filename: string): string {
    if (!filename) return 'download';

    return filename
      .replace(/[^\w\s.-]/g, '') // 移除特殊字符
      .replace(/\s+/g, '_')      // 空格替换为下划线
      .toLowerCase();
  }

  /**
   * 高亮搜索关键词
   * @param text 原始文本
   * @param searchTerm 搜索关键词
   * @returns 包含高亮标记的HTML字符串
   */
  static highlightSearch(text: string, searchTerm: string): string {
    if (!text || !searchTerm) return text;

    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

/**
 * 转义正则表达式特殊字符
 * @param string 要转义的字符串
 * @returns 转义后的字符串
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}