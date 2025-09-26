import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  query?: string;
  companyName?: string;
}

/**
 * 面包屑导航组件
 * 提供清晰的页面层级导航
 */
export function Breadcrumb({ query, companyName }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ol className="breadcrumb-list">
        <li>
          <Link to="/">US Stocks首页</Link>
        </li>
        <li>
          <Link to="/search">SEC EDGAR搜索</Link>
        </li>
        {companyName && (
          <li className="current">{companyName} 申报文件</li>
        )}
        {!companyName && query && (
          <li className="current">搜索结果: {query}</li>
        )}
      </ol>
    </nav>
  );
}