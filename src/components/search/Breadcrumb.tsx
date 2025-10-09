import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

interface BreadcrumbProps {
  query?: string;
  companyName?: string;
}

const BREADCRUMB_TEXTS = {
  en: {
    home: 'Home',
    search: 'SEC EDGAR Search',
    filingsSuffix: 'SEC filings',
    searchPrefix: 'Search results:'
  },
  zh: {
    home: '首页',
    search: 'SEC EDGAR 搜索',
    filingsSuffix: '申报文件',
    searchPrefix: '搜索结果：'
  }
} as const;

/**
 * 面包屑导航组件
 * 提供清晰的页面路径，方便用户返回上一级
 */
export function Breadcrumb({ query, companyName }: BreadcrumbProps) {
  const { t } = useTranslation();
  const copy = t(BREADCRUMB_TEXTS);

  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ol className="breadcrumb-list">
        <li>
          <Link to="/">{copy.home}</Link>
        </li>
        <li>
          <Link to="/search">{copy.search}</Link>
        </li>
        {companyName && (
          <li className="current">
            {companyName} {copy.filingsSuffix}
          </li>
        )}
        {!companyName && query && (
          <li className="current">
            {copy.searchPrefix} {query}
          </li>
        )}
      </ol>
    </nav>
  );
}
