import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead';
import { Header, Layout } from '../components/layout';
import { FilingTable, FilingDetailsModal } from '../components/results';
import { SearchResultsHeader } from '../components/search/SearchResultsHeader';
import { Breadcrumb } from '../components/search/Breadcrumb';
import { useEdgarAPI } from '../hooks/useEdgarAPI';
import { FilingFilters } from '../types/api';
import { DateUtils } from '../utils/dateUtils';
import { FileUtils } from '../utils/fileUtils';

// 分页配置
const ITEMS_PER_PAGE = 20;

/**
 * 搜索结果页组件
 * 显示SEC EDGAR搜索结果，包含筛选、分页、详情查看等功能
 */
export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  // API Hook
  const {
    filingData,
    filingDetails,
    isLoading,
    isSearching,
    isLoadingDetails,
    error,
    searchCompany,
    getCompanyFilings,
    getFilingDetails,
    downloadFile,
    openFile,
    exportToCSV,
    clearError,
  } = useEdgarAPI();

  // 获取URL参数
  const query = searchParams.get('q');
  const formType = searchParams.get('formType');
  const dateRange = searchParams.get('dateRange');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // 计算分页数据
  const totalItems = filingData?.filings?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFilings = filingData?.filings?.slice(startIndex, endIndex) || [];

  // 执行搜索
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery) return;

    try {
      clearError();
      setCurrentPage(1);
      setLastSearchQuery(searchQuery);

      // 搜索公司
      const companies = await searchCompany(searchQuery);
      if (companies.length === 0) {
        return;
      }

      // 使用第一个匹配的公司
      const selectedCompany = companies[0];

      // 构建筛选条件
      const filters: FilingFilters = {};
      if (formType) {
        filters.formType = formType;
      }
      if (dateRange === 'custom') {
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
      } else if (dateRange) {
        filters.dateRange = dateRange;
      }

      // 获取申报文件
      await getCompanyFilings(selectedCompany.cik, filters);

    } catch (error) {
      console.error('搜索失败:', error);
    }
  }, [searchCompany, getCompanyFilings, clearError, formType, dateRange, startDate, endDate]);

  // URL参数变化时执行搜索
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  // 处理查看详情
  const handleViewDetails = useCallback(async (cik: string, accessionNumber: string) => {
    try {
      clearError();
      await getFilingDetails(cik, accessionNumber);
      setIsModalOpen(true);
    } catch (error) {
      console.error('获取详情失败:', error);
    }
  }, [getFilingDetails, clearError]);

  // 处理下载
  const handleDownload = useCallback(async (cik: string, accessionNumber: string) => {
    try {
      clearError();
      const details = await getFilingDetails(cik, accessionNumber);

      if (details.primaryDocument) {
        await downloadFile(details.primaryDocument.downloadUrl, details.primaryDocument.name);
      } else {
        throw new Error('未找到可下载的主要文档');
      }
    } catch (error) {
      console.error('下载失败:', error);
    }
  }, [getFilingDetails, downloadFile, clearError]);

  // 处理文件下载
  const handleDownloadFile = useCallback(async (url: string, filename: string) => {
    try {
      await downloadFile(url, filename);
    } catch (error) {
      console.error('下载文件失败:', error);
    }
  }, [downloadFile]);

  // 处理文件打开查看
  const handleOpenFile = useCallback(async (url: string, filename: string) => {
    try {
      await openFile(url, filename);
    } catch (error) {
      console.error('打开文件失败:', error);
    }
  }, [openFile]);

  // 处理导出
  const handleExport = useCallback(() => {
    if (!filingData?.filings || !filingData?.companyInfo) {
      return;
    }

    try {
      const csvData = exportToCSV(filingData.filings, filingData.companyInfo);
      const filename = `${filingData.companyInfo.name || 'SEC_EDGAR'}_申报文件_${DateUtils.formatDate(new Date())}.csv`;

      FileUtils.downloadFile(csvData, filename, 'text/csv;charset=utf-8;');
    } catch (error) {
      console.error('导出失败:', error);
    }
  }, [filingData, exportToCSV]);

  // 处理分页
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // 滚动到结果区域顶部
    const resultsElement = document.getElementById('results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // 关闭模态框
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // 动态SEO设置
  const dynamicTitle = filingData?.companyInfo?.name
    ? `${filingData.companyInfo.name} SEC EDGAR申报文件 - US Stocks数据库 | UsstocksTop`
    : `${query} SEC EDGAR搜索结果 - US Stocks数据库 | UsstocksTop`;

  const dynamicDescription = filingData?.companyInfo?.name
    ? `查询${filingData.companyInfo.name}完整SEC申报文件，包括10-K年报、10-Q季报、8-K重大事件。UsstocksTop提供专业US Stocks EDGAR数据检索服务。`
    : `查询${query}相关的US Stocks SEC EDGAR申报文件，专业的美股数据检索平台。`;

  return (
    <>
      {/* 动态SEO Meta标签 */}
      <SEOHead
        title={dynamicTitle}
        description={dynamicDescription}
        keywords={`${query}, SEC EDGAR, US Stocks, 申报文件, 10-K, 10-Q, 8-K, 投资研究`}
        canonical={`https://usstocks.top/search?q=${encodeURIComponent(query || '')}`}
      />

      <div className="App">
        <Header />
        <Layout>
          {/* 面包屑导航 */}
          <Breadcrumb
            query={query || undefined}
            companyName={filingData?.companyInfo?.name}
          />

          {/* 搜索结果页内容 */}
          <div className="search-page">
            {/* 搜索结果头部 */}
            <SearchResultsHeader query={query} results={filingData} />

            {/* 错误提示 */}
            {error && (
              <div className="mb-6">
                <div className="alert alert-error">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>{error}</span>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={clearError}
                    style={{ marginLeft: 'auto' }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            )}

            {/* 加载状态 */}
            {(isLoading || isSearching) && (
              <div className="loading-container">
                <div className="spinner"></div>
                <div className="loading-text">正在搜索SEC EDGAR数据库...</div>
              </div>
            )}

            {/* 搜索结果 */}
            {filingData && !isLoading && !isSearching && (
              <div id="results-section" className="fade-in">
                {/* 结果表格 */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">申报文件列表</h3>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={handleExport}
                      disabled={!filingData?.filings?.length}
                    >
                      <i className="fas fa-download"></i>
                      导出CSV
                    </button>
                  </div>
                  <div className="card-body no-padding">
                    {currentFilings.length > 0 ? (
                      <div className="table-container">
                        <FilingTable
                          filings={currentFilings}
                          companyInfo={filingData.companyInfo}
                          onViewDetails={handleViewDetails}
                          onDownload={handleDownload}
                          loading={isLoadingDetails}
                        />
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="empty-icon">
                          <i className="fas fa-file-alt"></i>
                        </div>
                        <h3 className="empty-title">暂无申报文件</h3>
                        <p className="empty-description">请尝试调整搜索条件</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 分页器 */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 2
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="page-btn disabled">...</span>
                          )}
                          <button
                            className={`page-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))
                    }

                    <button
                      className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 无搜索查询时的提示 */}
            {!query && !isLoading && !isSearching && (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h3 className="empty-title">请提供搜索查询</h3>
                <p className="empty-description">
                  <Link to="/">返回首页</Link> 开始搜索US Stocks SEC EDGAR数据
                </p>
              </div>
            )}

            {/* 文件详情模态框 */}
            <FilingDetailsModal
              details={filingDetails}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onDownloadFile={handleDownloadFile}
              onOpenFile={handleOpenFile}
              loading={isLoadingDetails}
            />
          </div>
        </Layout>
      </div>
    </>
  );
}