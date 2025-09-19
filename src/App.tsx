import { useState, useCallback } from 'react';
import { Header, Layout } from './components/layout';
import { SearchForm } from './components/search';
import { FilingTable, Pagination, FilingDetailsModal } from './components/results';
import { EmptyState, InfoBanner } from './components/common';
import { Card, Button, LoadingSpinner, Alert } from './components/ui';
import { useEdgarAPI } from './hooks/useEdgarAPI';
import { SearchFormData } from './types/api';
import { DateUtils } from './utils/dateUtils';
import { FileUtils } from './utils/fileUtils';

// 分页配置
const ITEMS_PER_PAGE = 20;

/**
 * 主应用组件
 * 整合所有功能模块，提供完整的SEC EDGAR数据检索体验
 */
function App() {
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
    exportToCSV,
    clearError,
    reset
  } = useEdgarAPI();

  // 本地状态
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  // 计算分页数据
  const totalItems = filingData?.filings?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFilings = filingData?.filings?.slice(startIndex, endIndex) || [];

  // 处理搜索
  const handleSearch = useCallback(async (formData: SearchFormData) => {
    try {
      clearError();
      setCurrentPage(1);
      setLastSearchQuery(formData.companyInput);

      // 搜索公司
      const companies = await searchCompany(formData.companyInput);
      if (companies.length === 0) {
        return;
      }

      // 使用第一个匹配的公司
      const selectedCompany = companies[0];

      // 构建筛选条件
      const filters: any = {};
      if (formData.formType) {
        filters.formType = formData.formType;
      }
      if (formData.dateRange === 'custom') {
        if (formData.startDate) filters.startDate = formData.startDate;
        if (formData.endDate) filters.endDate = formData.endDate;
      } else if (formData.dateRange) {
        filters.dateRange = formData.dateRange;
      }

      // 获取申报文件
      await getCompanyFilings(selectedCompany.cik, filters);

    } catch (error) {
      console.error('搜索失败:', error);
    }
  }, [searchCompany, getCompanyFilings, clearError]);

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

  // 清理所有状态
  const handleClear = useCallback(() => {
    reset();
    setCurrentPage(1);
    setIsModalOpen(false);
    setLastSearchQuery('');
  }, [reset]);

  return (
    <div className="App">
      <Header />
      <Layout>
        {/* 使用说明 */}
        <div className="row mb-3">
          <div className="col-12">
            <InfoBanner title="使用说明">
              请先运行后端服务器（<code>npm start</code>），然后搜索美股公司。<br />
              <strong>支持的公司</strong>：AAPL, MSFT, GOOGL, AMZN, META, TSLA, NVDA, NFLX, BABA, JD, BIDU, PDD, JPM, BAC, WMT, DIS等知名公司
            </InfoBanner>
          </div>
        </div>

        {/* 搜索表单 */}
        <div className="row mb-4">
          <div className="col-12">
            <SearchForm
              onSearch={handleSearch}
              loading={isSearching}
            />
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="row mb-3">
            <div className="col-12">
              <Alert
                type="error"
                message={error}
                dismissible
                onClose={clearError}
              />
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {(isLoading || isSearching) && (
          <div className="row mb-4">
            <div className="col-12">
              <LoadingSpinner
                text="正在搜索SEC EDGAR数据库..."
                className="my-5"
              />
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        {filingData && !isLoading && !isSearching && (
          <div id="results-section">
            {/* 结果统计 */}
            <div className="row mb-3">
              <div className="col-12">
                <InfoBanner type="success">
                  找到 <strong>{totalItems}</strong> 条申报记录
                  {lastSearchQuery && ` (搜索: ${lastSearchQuery})`}
                </InfoBanner>
              </div>
            </div>

            {/* 结果表格 */}
            <div className="row">
              <div className="col-12">
                <Card
                  title="申报文件列表"
                  headerActions={
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleExport}
                      icon="fas fa-download"
                      disabled={!filingData?.filings?.length}
                    >
                      导出CSV
                    </Button>
                  }
                >
                  {currentFilings.length > 0 ? (
                    <FilingTable
                      filings={currentFilings}
                      companyInfo={filingData.companyInfo}
                      onViewDetails={handleViewDetails}
                      onDownload={handleDownload}
                      loading={isLoadingDetails}
                    />
                  ) : (
                    <EmptyState
                      title="暂无申报文件"
                      description="请尝试调整搜索条件"
                    />
                  )}
                </Card>
              </div>
            </div>

            {/* 分页器 */}
            {totalPages > 1 && (
              <div className="row mt-3">
                <div className="col-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 空状态 */}
        {!filingData && !isLoading && !isSearching && !error && (
          <EmptyState
            title="请输入公司名称或股票代码开始搜索"
            description="支持搜索美股上市公司的各类SEC申报文件"
            action={
              <Button
                variant="primary"
                onClick={handleClear}
                icon="fas fa-refresh"
              >
                重新开始
              </Button>
            }
          />
        )}

        {/* 文件详情模态框 */}
        <FilingDetailsModal
          details={filingDetails}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDownloadFile={handleDownloadFile}
          loading={isLoadingDetails}
        />
      </Layout>
    </div>
  );
}

export default App;