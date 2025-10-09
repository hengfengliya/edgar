import React from 'react';
import { FilingData } from '../../types/api';
import { useTranslation } from '../../hooks/useTranslation';

interface SearchResultsHeaderProps {
  query?: string | null;
  results?: FilingData | null;
}

const HEADER_TEXTS = {
  en: {
    heading: 'Search results',
    countPrefix: 'Found',
    countSuffix: 'SEC EDGAR filings',
    tickerLabel: 'Ticker'
  },
  zh: {
    heading: '搜索结果',
    countPrefix: '找到',
    countSuffix: '条 SEC EDGAR 申报记录',
    tickerLabel: '股票代码'
  }
} as const;

/**
 * 搜索结果页头部组件
 * 显示当前查询与公司基本信息
 */
export function SearchResultsHeader({ query, results }: SearchResultsHeaderProps) {
  const { t } = useTranslation();
  const copy = t(HEADER_TEXTS);

  const headingText = query ? `${copy.heading}: ${query}` : copy.heading;

  return (
    <div className="search-results-header">
      <div className="container">
        <div className="search-query">
          <h1>{headingText}</h1>
          {results?.filings && (
            <p>
              {copy.countPrefix}{' '}
              <strong>{results.filings.length}</strong>{' '}
              {copy.countSuffix}
            </p>
          )}
        </div>

        {results?.companyInfo && (
          <div className="company-info">
            <h2>{results.companyInfo.name}</h2>
            <div className="company-details">
              <span className="cik">CIK: {results.companyInfo.cik}</span>
              {results.companyInfo.ticker && (
                <span className="ticker">
                  {copy.tickerLabel}: {results.companyInfo.ticker}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
