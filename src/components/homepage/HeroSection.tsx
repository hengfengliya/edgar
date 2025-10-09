import React from 'react';
import { SimpleSearchForm } from '../search/SimpleSearchForm';
import { SearchFormData } from '../../types/api';
import { useTranslation } from '../../hooks/useTranslation';

// 首页英雄区块文案，包含中英文版本
const HERO_TEXTS = {
  en: {
    title: 'US Stocks SEC EDGAR Search Platform',
    subtitle: 'Free and professional access to US stock filings',
    coverage: 'Covering 880,000+ companies',
    formTypes: '10-K / 10-Q / 8-K and the full SEC filing library'
  },
  zh: {
    title: 'US Stocks SEC EDGAR检索系统',
    subtitle: '免费、专业的美股申报文件查询入口',
    coverage: '覆盖 880,000+ 公司',
    formTypes: '支持 10-K / 10-Q / 8-K 等全类型申报文件'
  }
} as const;

interface HeroSectionProps {
  onSearch: (formData: SearchFormData) => Promise<void>;
}

/**
 * 首页英雄区块组件
 * 提供核心卖点与搜索入口，帮助用户快速开始检索
 */
export function HeroSection({ onSearch }: HeroSectionProps) {
  const { t } = useTranslation();
  const copy = t(HERO_TEXTS);

  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* 主标题 */}
        <h1 className="main-title">{copy.title}</h1>

        {/* 副标题 */}
        <h2 className="subtitle">{copy.subtitle}</h2>

        {/* 辅助说明 */}
        <div className="hero-description">
          <span className="stat-highlight">{copy.coverage}</span>
          <span className="separator">|</span>
          <span className="form-types">{copy.formTypes}</span>
        </div>

        {/* 搜索组件 */}
        <div className="search-container">
          <SimpleSearchForm onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}
