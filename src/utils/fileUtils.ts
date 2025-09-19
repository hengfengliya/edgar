/**
 * 文件处理工具函数
 */
export class FileUtils {
  /**
   * 格式化文件大小
   * @param bytes 字节数
   * @returns 格式化的文件大小字符串
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (!bytes || bytes < 0) return '未知大小';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
  }

  /**
   * 根据文件名获取文件图标类名
   * @param filename 文件名
   * @returns Font Awesome图标类名
   */
  static getFileIcon(filename: string): string {
    if (!filename) return 'fas fa-file';

    const extension = filename.split('.').pop()?.toLowerCase() || '';

    const iconMap: Record<string, string> = {
      'pdf': 'fas fa-file-pdf',
      'doc': 'fas fa-file-word',
      'docx': 'fas fa-file-word',
      'xls': 'fas fa-file-excel',
      'xlsx': 'fas fa-file-excel',
      'csv': 'fas fa-file-csv',
      'txt': 'fas fa-file-alt',
      'htm': 'fas fa-file-code',
      'html': 'fas fa-file-code',
      'xml': 'fas fa-file-code',
      'xbrl': 'fas fa-file-code',
      'json': 'fas fa-file-code',
      'zip': 'fas fa-file-archive',
      'rar': 'fas fa-file-archive',
      '7z': 'fas fa-file-archive',
      'jpg': 'fas fa-file-image',
      'jpeg': 'fas fa-file-image',
      'png': 'fas fa-file-image',
      'gif': 'fas fa-file-image',
      'mp4': 'fas fa-file-video',
      'avi': 'fas fa-file-video',
      'mov': 'fas fa-file-video',
      'mp3': 'fas fa-file-audio',
      'wav': 'fas fa-file-audio',
    };

    return iconMap[extension] || 'fas fa-file';
  }

  /**
   * 获取文件类型描述
   * @param filename 文件名
   * @returns 文件类型描述
   */
  static getFileTypeDescription(filename: string): string {
    if (!filename) return '未知文件';

    const extension = filename.split('.').pop()?.toLowerCase() || '';

    const typeMap: Record<string, string> = {
      'pdf': 'PDF文档',
      'doc': 'Word文档',
      'docx': 'Word文档',
      'xls': 'Excel表格',
      'xlsx': 'Excel表格',
      'csv': 'CSV数据文件',
      'txt': '文本文件',
      'htm': 'HTML网页',
      'html': 'HTML网页',
      'xml': 'XML数据文件',
      'xbrl': 'XBRL财务数据',
      'json': 'JSON数据文件',
      'zip': '压缩文件',
      'rar': 'RAR压缩文件',
      '7z': '7Z压缩文件',
      'jpg': 'JPEG图片',
      'jpeg': 'JPEG图片',
      'png': 'PNG图片',
      'gif': 'GIF图片',
      'mp4': 'MP4视频',
      'avi': 'AVI视频',
      'mov': 'MOV视频',
      'mp3': 'MP3音频',
      'wav': 'WAV音频',
    };

    return typeMap[extension] || '其他文件';
  }

  /**
   * 检查文件是否为SEC主要文档类型
   * @param filename 文件名
   * @returns 是否为主要文档
   */
  static isPrimaryDocument(filename: string): boolean {
    if (!filename) return false;

    const extension = filename.split('.').pop()?.toLowerCase() || '';
    const primaryExtensions = ['htm', 'html', 'pdf'];

    return primaryExtensions.includes(extension);
  }

  /**
   * 创建下载链接并触发下载
   * @param data 文件数据（Blob或字符串）
   * @param filename 文件名
   * @param mimeType MIME类型
   */
  static downloadFile(data: Blob | string, filename: string, mimeType: string = 'application/octet-stream'): void {
    try {
      let blob: Blob;

      if (data instanceof Blob) {
        blob = data;
      } else {
        blob = new Blob([data], { type: mimeType });
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // 添加到DOM并触发点击
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`文件下载已触发: ${filename}`);
    } catch (error) {
      console.error('下载文件失败:', error);
      throw new Error('下载文件失败');
    }
  }

  /**
   * 验证文件名的有效性
   * @param filename 文件名
   * @returns 是否有效
   */
  static isValidFilename(filename: string): boolean {
    if (!filename || filename.trim().length === 0) {
      return false;
    }

    // 检查非法字符
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (invalidChars.test(filename)) {
      return false;
    }

    // 检查保留名称（Windows）
    const reservedNames = [
      'CON', 'PRN', 'AUX', 'NUL',
      'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
      'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
    ];
    const nameWithoutExtension = filename.split('.')[0].toUpperCase();
    if (reservedNames.includes(nameWithoutExtension)) {
      return false;
    }

    return true;
  }
}