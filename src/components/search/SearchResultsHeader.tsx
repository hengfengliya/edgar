import React from 'react';
import { FilingData } from '../../types/api';

interface SearchResultsHeaderProps {
  query?: string | null;
  results?: FilingData | null;
}

/**
 * 搜索结果页头部组件
 * 显示搜索查询信息和公司基本信息
 */
export function SearchResultsHeader({ query, results }: SearchResultsHeaderProps) {
  return (
    <div className="search-results-header">
      <div className="container">
        {/* 搜索查询显示 */}
        <div className="search-query">
          <h1>搜索结果: {query}</h1>
          {results?.filings && (
            <p>找到 <strong>{results.filings.length}</strong> 条SEC EDGAR申报记录</p>
          )}
        </div>

        {/* 公司信息显示 */}
        {results?.companyInfo && (
          <div className="company-info">
            <h2>{results.companyInfo.name}</h2>
            <div className="company-details">
              <span className="cik">CIK: {results.companyInfo.cik}</span>
              {results.companyInfo.ticker && (
                <span className="ticker">股票代码: {results.companyInfo.ticker}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}