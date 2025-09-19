import { useState, useCallback } from 'react';
import { edgarAPI } from '../services/edgarAPI';
import {
  SearchResult,
  FilingDataResponse,
  FilingDetails,
  FilingFilters
} from '../types/api';

export interface UseEdgarAPIState {
  // 数据状态
  searchResults: SearchResult[];
  filingData: FilingDataResponse | null;
  filingDetails: FilingDetails | null;

  // 加载状态
  isLoading: boolean;
  isSearching: boolean;
  isLoadingDetails: boolean;

  // 错误状态
  error: string | null;
  searchError: string | null;
  detailsError: string | null;
}

export interface UseEdgarAPIActions {
  // API操作
  searchCompany: (query: string) => Promise<SearchResult[]>;
  getCompanyFilings: (cik: string, filters?: FilingFilters) => Promise<FilingDataResponse>;
  getFilingDetails: (cik: string, accessionNumber: string) => Promise<FilingDetails>;
  downloadFile: (url: string, filename: string) => Promise<void>;
  exportToCSV: (filings: any[], companyInfo: any) => string;

  // 状态操作
  clearError: () => void;
  clearSearchResults: () => void;
  clearFilingData: () => void;
  clearFilingDetails: () => void;
  reset: () => void;
}

/**
 * Edgar API操作的自定义Hook
 * 提供统一的API调用、状态管理和错误处理
 */
export function useEdgarAPI(): UseEdgarAPIState & UseEdgarAPIActions {
  // 状态管理
  const [state, setState] = useState<UseEdgarAPIState>({
    searchResults: [],
    filingData: null,
    filingDetails: null,
    isLoading: false,
    isSearching: false,
    isLoadingDetails: false,
    error: null,
    searchError: null,
    detailsError: null,
  });

  // 更新状态的辅助函数
  const updateState = useCallback((updates: Partial<UseEdgarAPIState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // 搜索公司
  const searchCompany = useCallback(async (query: string): Promise<SearchResult[]> => {
    try {
      updateState({
        isSearching: true,
        searchError: null,
        error: null
      });

      const results = await edgarAPI.searchCompany(query);

      updateState({
        searchResults: results,
        isSearching: false
      });

      return results;
    } catch (error: any) {
      const errorMessage = error.message || '搜索公司失败';
      updateState({
        searchError: errorMessage,
        error: errorMessage,
        isSearching: false,
        searchResults: []
      });
      throw error;
    }
  }, [updateState]);

  // 获取公司申报文件
  const getCompanyFilings = useCallback(async (
    cik: string,
    filters?: FilingFilters
  ): Promise<FilingDataResponse> => {
    try {
      updateState({
        isLoading: true,
        error: null
      });

      const data = await edgarAPI.getCompanyFilings(cik, filters);

      updateState({
        filingData: data,
        isLoading: false
      });

      return data;
    } catch (error: any) {
      const errorMessage = error.message || '获取申报文件失败';
      updateState({
        error: errorMessage,
        isLoading: false,
        filingData: null
      });
      throw error;
    }
  }, [updateState]);

  // 获取申报文件详情
  const getFilingDetails = useCallback(async (
    cik: string,
    accessionNumber: string
  ): Promise<FilingDetails> => {
    try {
      updateState({
        isLoadingDetails: true,
        detailsError: null,
        error: null
      });

      const details = await edgarAPI.getFilingDetails(cik, accessionNumber);

      updateState({
        filingDetails: details,
        isLoadingDetails: false
      });

      return details;
    } catch (error: any) {
      const errorMessage = error.message || '获取文件详情失败';
      updateState({
        detailsError: errorMessage,
        error: errorMessage,
        isLoadingDetails: false,
        filingDetails: null
      });
      throw error;
    }
  }, [updateState]);

  // 下载文件
  const downloadFile = useCallback(async (url: string, filename: string): Promise<void> => {
    try {
      updateState({
        isLoading: true,
        error: null
      });

      await edgarAPI.downloadFile(url, filename);

      updateState({
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.message || '下载文件失败';
      updateState({
        error: errorMessage,
        isLoading: false
      });
      throw error;
    }
  }, [updateState]);

  // 导出CSV
  const exportToCSV = useCallback((filings: any[], companyInfo: any): string => {
    try {
      return edgarAPI.exportToCSV(filings, companyInfo);
    } catch (error: any) {
      const errorMessage = error.message || '导出CSV失败';
      updateState({
        error: errorMessage
      });
      throw error;
    }
  }, [updateState]);

  // 清理错误
  const clearError = useCallback(() => {
    updateState({
      error: null,
      searchError: null,
      detailsError: null
    });
  }, [updateState]);

  // 清理搜索结果
  const clearSearchResults = useCallback(() => {
    updateState({
      searchResults: [],
      searchError: null
    });
  }, [updateState]);

  // 清理申报数据
  const clearFilingData = useCallback(() => {
    updateState({
      filingData: null
    });
  }, [updateState]);

  // 清理文件详情
  const clearFilingDetails = useCallback(() => {
    updateState({
      filingDetails: null,
      detailsError: null
    });
  }, [updateState]);

  // 重置所有状态
  const reset = useCallback(() => {
    setState({
      searchResults: [],
      filingData: null,
      filingDetails: null,
      isLoading: false,
      isSearching: false,
      isLoadingDetails: false,
      error: null,
      searchError: null,
      detailsError: null,
    });
  }, []);

  return {
    ...state,
    searchCompany,
    getCompanyFilings,
    getFilingDetails,
    downloadFile,
    exportToCSV,
    clearError,
    clearSearchResults,
    clearFilingData,
    clearFilingDetails,
    reset,
  };
}