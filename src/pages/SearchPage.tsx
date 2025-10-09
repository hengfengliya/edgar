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
import { useTranslation } from '../hooks/useTranslation';

const ITEMS_PER_PAGE = 20;

const SEARCH_META = {
  en: {
    defaultTitle: 'SEC EDGAR Search Results - UsstocksTop',
    defaultDescription: 'Explore US Stocks SEC EDGAR filings, download 10-K, 10-Q, 8-K and more in seconds with UsstocksTop.',
    defaultKeywords: 'SEC filings, SEC EDGAR search, US Stocks filings, 10-K, 10-Q, 8-K, US stock research'
  },
  zh: {
    defaultTitle: 'SEC EDGAR 搜索结果 - UsstocksTop',
    defaultDescription: '在 UsstocksTop 中快速检索 US Stocks SEC EDGAR 申报文件，支持下载 10-K、10-Q、8-K 等核心报表。',
    defaultKeywords: 'SEC EDGAR, 美股申报文件, 10-K, 10-Q, 8-K, 美股研究'
  }
} as const;

const SEARCH_COPY = {
  en: {
    loading: 'Searching the SEC EDGAR database...',
    tableTitle: 'SEC Filings List',
    export: 'Export CSV',
    exportTitle: 'Export filings to CSV',
    emptyTitle: 'No filings available',
    emptyDescription: 'Try adjusting the filters or search for another company.',
    emptyQueryTitle: 'Enter a company or ticker to begin',
    emptyQueryPrefix: '',
    emptyQueryLink: 'Return to Homepage',
    emptyQuerySuffix: 'to start exploring the US Stocks SEC EDGAR database.',
    exportFileSuffix: 'SEC_filings'
  },
  zh: {
    loading: '正在搜索 SEC EDGAR 数据库...',
    tableTitle: '申报文件列表',
    export: '导出 CSV',
    exportTitle: '导出申报文件为 CSV',
    emptyTitle: '暂无申报文件',
    emptyDescription: '请调整筛选条件或尝试其他公司。',
    emptyQueryTitle: '请提供搜索查询',
    emptyQueryPrefix: '',
    emptyQueryLink: '返回首页',
    emptyQuerySuffix: '后即可开始检索 US Stocks SEC EDGAR 数据。',
    exportFileSuffix: '申报文件'
  }
} as const;

/**
 * 搜索结果页组件
 * 展示 SEC EDGAR 检索结果，支持分页、导出与文件详情
 */
export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const { t, language } = useTranslation();
  const metaCopy = t(SEARCH_META);
  const copy = t(SEARCH_COPY);
  const exportSuffix = copy.exportFileSuffix;

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
    clearError
  } = useEdgarAPI();

  const query = searchParams.get('q');
  const formType = searchParams.get('formType');
  const dateRange = searchParams.get('dateRange');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const totalItems = filingData?.filings?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFilings = filingData?.filings?.slice(startIndex, endIndex) || [];

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      return;
    }

    try {
      clearError();
      setCurrentPage(1);
      setLastSearchQuery(searchQuery);

      const companies = await searchCompany(searchQuery);
      if (companies.length === 0) {
        return;
      }

      const selectedCompany = companies[0];
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

      await getCompanyFilings(selectedCompany.cik, filters);
    } catch (err) {
      console.error('搜索失败:', err);
    }
  }, [clearError, searchCompany, getCompanyFilings, formType, dateRange, startDate, endDate]);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const handleViewDetails = useCallback(async (cik: string, accessionNumber: string) => {
    try {
      clearError();
      await getFilingDetails(cik, accessionNumber);
      setIsModalOpen(true);
    } catch (err) {
      console.error('获取详情失败:', err);
    }
  }, [getFilingDetails, clearError]);

  const handleDownload = useCallback(async (cik: string, accessionNumber: string) => {
    try {
      clearError();
      const details = await getFilingDetails(cik, accessionNumber);

      if (details.primaryDocument) {
        await downloadFile(details.primaryDocument.downloadUrl, details.primaryDocument.name);
      } else {
        const message = language === 'en' ? 'Primary document not found.' : '未找到可下载的主要文档。';
        throw new Error(message);
      }
    } catch (err) {
      console.error('下载失败:', err);
    }
  }, [getFilingDetails, downloadFile, clearError, language]);

  const handleDownloadFile = useCallback(async (url: string, filename: string) => {
    try {
      await downloadFile(url, filename);
    } catch (err) {
      console.error('下载文件失败:', err);
    }
  }, [downloadFile]);

  const handleOpenFile = useCallback(async (url: string, filename: string) => {
    try {
      await openFile(url, filename);
    } catch (err) {
      console.error('打开文件失败:', err);
    }
  }, [openFile]);

  const handleExport = useCallback(() => {
    if (!filingData?.filings || !filingData?.companyInfo) {
      return;
    }

    try {
      const csvContent = exportToCSV(filingData.filings, filingData.companyInfo);
      const companyName = filingData.companyInfo.name || 'SEC_EDGAR';
      const filename = `${companyName}_${exportSuffix}_${DateUtils.formatDate(new Date())}.csv`;

      FileUtils.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
    } catch (err) {
      console.error('导出失败:', err);
    }
  }, [filingData, exportToCSV, exportSuffix]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    const resultsElement = document.getElementById('results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const resolvedTitle = filingData?.companyInfo?.name
    ? `${filingData.companyInfo.name} SEC EDGAR ${language === 'en' ? 'Filings' : '申报文件'} - UsstocksTop`
    : query
    ? `${query} SEC EDGAR ${language === 'en' ? 'Search Results' : '搜索结果'} - UsstocksTop`
    : metaCopy.defaultTitle;

  const resolvedDescription = filingData?.companyInfo?.name
    ? (language === 'en'
        ? `Download ${filingData.companyInfo.name} SEC EDGAR filings including 10-K, 10-Q, 8-K, and proxy statements on UsstocksTop.`
        : `查询 ${filingData.companyInfo.name} 的 SEC 申报文件，覆盖 10-K、10-Q、8-K 等核心类型。`)
    : query
    ? (language === 'en'
        ? `Search SEC EDGAR filings related to ${query} on UsstocksTop and access official US stock disclosures instantly.`
        : `在 UsstocksTop 中检索 ${query} 相关的 SEC EDGAR 申报文件，快速获取官方披露。`)
    : metaCopy.defaultDescription;

  const resolvedKeywords = query
    ? `${query}, ${metaCopy.defaultKeywords}`
    : metaCopy.defaultKeywords;

  return (
    <>
      <SEOHead
        title={resolvedTitle}
        description={resolvedDescription}
        keywords={resolvedKeywords}
        canonical={`https://usstocks.top/search?q=${encodeURIComponent(query || '')}`}
      />

      <div className="App">
        <Header />
        <Layout>
          <div className="search-page">
            <Breadcrumb
              query={query || undefined}
              companyName={filingData?.companyInfo?.name}
            />

            <SearchResultsHeader
              query={query}
              results={filingData || undefined}
            />

            {error && (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <div>{error}</div>
                <button
                  type="button"
                  className="btn btn-link ms-auto"
                  onClick={clearError}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}

            {(isLoading || isSearching) && (
              <div className="loading-container">
                <div className="spinner"></div>
                <div className="loading-text">{copy.loading}</div>
              </div>
            )}

            {filingData && !isLoading && !isSearching && (
              <div id="results-section" className="fade-in">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">{copy.tableTitle}</h3>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={handleExport}
                      disabled={!filingData?.filings?.length}
                      title={copy.exportTitle}
                    >
                      <i className="fas fa-download"></i>
                      {copy.export}
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
                        <h3 className="empty-title">{copy.emptyTitle}</h3>
                        <p className="empty-description">{copy.emptyDescription}</p>
                      </div>
                    )}
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter((page) => (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 2
                      ))
                      .map((page, idx, arr) => (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className="page-btn disabled">...</span>
                          )}
                          <button
                            className={`page-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}

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

            {!query && !isLoading && !isSearching && (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h3 className="empty-title">{copy.emptyQueryTitle}</h3>
                <p className="empty-description">
                  {copy.emptyQueryPrefix}
                  <Link to="/">{copy.emptyQueryLink}</Link>
                  {copy.emptyQuerySuffix}
                </p>
              </div>
            )}

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
