import axios, { AxiosResponse } from 'axios';
import {
  CompanyInfo,
  Filing,
  FilingDetails,
  SearchResult,
  APIResponse,
  FilingDataResponse,
  FilingFilters
} from '../types/api';

// API基础URL
const API_BASE_URL = '/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API请求: ${config.method?.toUpperCase()} ${config.url}`, config.params);
    return config;
  },
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API响应: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('API响应错误:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class EdgarAPIService {

  /**
   * 搜索公司
   * @param query 搜索查询词
   * @returns 公司搜索结果
   */
  async searchCompany(query: string): Promise<SearchResult[]> {
    try {
      const response = await apiClient.get<APIResponse<SearchResult[]>>('/companies/search', {
        params: { q: query }
      });

      if (!response.data.success) {
        throw new Error(response.data.error || '搜索公司失败');
      }

      return response.data.data || [];
    } catch (error: any) {
      console.error('搜索公司失败:', error);
      throw new Error(error.response?.data?.error || error.message || '搜索公司失败');
    }
  }

  /**
   * 获取公司申报文件
   * @param cik 公司CIK
   * @param filters 筛选条件
   * @returns 申报文件数据
   */
  async getCompanyFilings(cik: string, filters?: FilingFilters): Promise<FilingDataResponse> {
    try {
      console.log('📡 API调用 - 获取公司申报文件:', { cik, filters });
      const response = await apiClient.get<APIResponse<FilingDataResponse>>(`/companies/${cik}/filings`, {
        params: filters
      });

      if (!response.data.success) {
        throw new Error(response.data.error || '获取申报文件失败');
      }

      if (!response.data.data) {
        throw new Error('未获取到申报文件数据');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('获取申报文件失败:', error);
      throw new Error(error.response?.data?.error || error.message || '获取申报文件失败');
    }
  }

  /**
   * 获取申报文件详情
   * @param cik 公司CIK
   * @param accessionNumber 接收号
   * @returns 文件详情
   */
  async getFilingDetails(cik: string, accessionNumber: string): Promise<FilingDetails> {
    try {
      const response = await apiClient.get<APIResponse<FilingDetails>>(`/filings/${cik}/${accessionNumber}`);

      if (!response.data.success) {
        throw new Error(response.data.error || '获取文件详情失败');
      }

      if (!response.data.data) {
        throw new Error('未获取到文件详情数据');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('获取文件详情失败:', error);
      throw new Error(error.response?.data?.error || error.message || '获取文件详情失败');
    }
  }

  /**
   * 下载文件到本地
   * @param url 文件URL
   * @param filename 文件名
   */
  async downloadFile(url: string, filename: string): Promise<void> {
    try {
      console.log(`开始下载文件: ${filename}`);
      console.log(`原始URL: ${url}`);

      // 构建代理下载URL - 通过我们的服务器代理来确保正确的下载响应头
      let proxyUrl: string;
      
      if (url.startsWith('https://www.sec.gov/')) {
        // 移除SEC域名，只保留路径部分
        const path = url.replace('https://www.sec.gov/', '');
        proxyUrl = `/api/download/${path}`;
      } else if (url.startsWith('https://data.sec.gov/')) {
        // 移除data.sec.gov域名，只保留路径部分
        const path = url.replace('https://data.sec.gov/', '');
        proxyUrl = `/api/download/data/${path}`;
      } else {
        // 如果URL格式不符合预期，直接使用原URL
        console.warn('URL格式不符合预期，直接使用原URL:', url);
        proxyUrl = url;
      }

      console.log(`代理下载URL: ${proxyUrl}`);

      // 创建下载链接并触发下载
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // 设置下载属性，强制下载到本地
      link.download = filename;

      // 添加到DOM并点击
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`文件下载已开始: ${filename}`);

    } catch (error: any) {
      console.error('下载文件失败:', error);
      throw new Error(error.message || '下载文件失败');
    }
  }

  /**
   * 打开文件 - 在新窗口中直接查看SEC报告
   * @param url 文件URL
   * @param filename 文件名
   */
  async openFile(url: string, filename: string): Promise<void> {
    try {
      // 解码URL中的编码字符
      const decodedUrl = decodeURIComponent(url);

      console.log(`开始打开文件: ${filename}`);
      console.log(`原始URL: ${url}`);
      console.log(`解码后URL: ${decodedUrl}`);

      // 直接在新窗口打开SEC原始URL进行查看
      const newWindow = window.open(decodedUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        // 如果弹窗被阻止，提示用户
        alert('请允许弹窗以打开SEC报告，或者将以下链接复制到新标签页中打开：\n' + decodedUrl);
        
        // 备用方案：使用link点击但不设置download属性
        const link = document.createElement('a');
        link.href = decodedUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        // 不设置download属性，这样就会在浏览器中打开而不是下载
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      console.log(`文件已在新窗口打开: ${filename}`);
      
    } catch (error: any) {
      console.error('打开文件失败:', error);
      throw new Error(error.message || '打开文件失败');
    }
  }

  /**
   * 导出数据为CSV
   * @param filings 申报文件列表
   * @param companyInfo 公司信息
   * @returns CSV字符串
   */
  exportToCSV(filings: Filing[], companyInfo: CompanyInfo): string {
    try {
      // CSV头部
      const headers = [
        '公司名称',
        'CIK',
        '股票代码',
        '表单类型',
        '提交日期',
        '报告期末',
        '接收号',
        '文件号',
        '影片号',
        '项目',
        '文件大小',
        'XBRL',
        'Inline XBRL'
      ];

      // CSV行数据
      const rows = filings.map(filing => [
        companyInfo.name || '',
        companyInfo.cik || '',
        companyInfo.ticker || '',
        filing.form || '',
        filing.filingDate || '',
        filing.reportDate || '',
        filing.accessionNumber || '',
        filing.fileNumber || '',
        filing.filmNumber || '',
        filing.items || '',
        filing.size?.toString() || '0',
        filing.isXBRL ? '是' : '否',
        filing.isInlineXBRL ? '是' : '否'
      ]);

      // 组合CSV内容
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
        .join('\n');

      // 添加BOM以支持中文
      return '\uFEFF' + csvContent;
    } catch (error: any) {
      console.error('导出CSV失败:', error);
      throw new Error('导出CSV失败');
    }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.data.success;
    } catch (error) {
      console.error('健康检查失败:', error);
      return false;
    }
  }
}

// 导出单例实例
export const edgarAPI = new EdgarAPIService();