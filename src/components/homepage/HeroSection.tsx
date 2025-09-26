import React from 'react';
import { SimpleSearchForm } from '../search/SimpleSearchForm';
import { SearchFormData } from '../../types/api';

interface HeroSectionProps {
  onSearch: (formData: SearchFormData) => Promise<void>;
}

/**
 * 首页英雄区块组件
 * 简洁布局：主标题 + 副标题 + 辅助说明 + 搜索框
 */
export function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* 主标题 */}
        <h1 className="main-title">US Stocks SEC EDGAR检索系统</h1>

        {/* 副标题 */}
        <h2 className="subtitle">免费、专业美股市场报告查看下载</h2>

        {/* 辅助说明 */}
        <div className="hero-description">
          <span className="stat-highlight">覆盖 880,000+ 公司</span>
          <span className="separator">|</span>
          <span className="form-types">10-K / 10-Q / 8-K 等全类型申报文件</span>
        </div>

        {/* 搜索组件 */}
        <div className="search-container">
          <SimpleSearchForm onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}