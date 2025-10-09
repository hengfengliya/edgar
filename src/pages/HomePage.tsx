import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead';
import { Header } from '../components/layout';
import { HeroSection } from '../components/homepage/HeroSection';
import { PopularStocks } from '../components/homepage/PopularStocks';
import { SEOContent } from '../components/homepage/SEOContent';
import { SearchFormData } from '../types/api';
import { useTranslation } from '../hooks/useTranslation';

const HOME_META = {
  en: {
    title: 'US Stocks SEC EDGAR Search - UsstocksTop Filing Intelligence',
    description: 'UsstocksTop is a professional US Stocks SEC EDGAR filings search engine. Discover 880,000+ company disclosures, download 10-K, 10-Q, and 8-K reports, and streamline US stock market research.',
    keywords: 'US Stocks, SEC filings, SEC EDGAR search, 10-K report, 10-Q filing, 8-K disclosure, US stock reports, SEC filings download'
  },
  zh: {
    title: 'US Stocks SEC EDGAR 检索 - UsstocksTop 专业美股申报文件查询系统',
    description: 'UsstocksTop 提供 88 万+ 美股上市公司的 SEC EDGAR 申报文件，支持 10-K、10-Q、8-K 下载，一站式完成美股研究。',
    keywords: 'US Stocks, SEC EDGAR, 美股申报文件, 10-K 报告, 10-Q 季报, 8-K 重大事件, 美股研究工具'
  }
} as const;

/**
 * 首页组件
 * 包含英雄区块、热门股票、SEO 内容等模块
 */
export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const meta = t(HOME_META);

  // 处理搜索，完成首页到搜索结果页的跳转
  const handleSearch = async (formData: SearchFormData) => {
    try {
      const searchParams = new URLSearchParams({
        q: formData.companyInput
      });

      if (formData.formType) {
        searchParams.set('formType', formData.formType);
      }
      if (formData.dateRange) {
        searchParams.set('dateRange', formData.dateRange);
      }
      if (formData.dateRange === 'custom') {
        if (formData.startDate) searchParams.set('startDate', formData.startDate);
        if (formData.endDate) searchParams.set('endDate', formData.endDate);
      }

      navigate(`/search?${searchParams.toString()}`);
    } catch (error) {
      console.error('搜索跳转失败:', error);
    }
  };

  return (
    <>
      <SEOHead
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonical="https://usstocks.top"
      />

      <div className="App">
        <Header />
        <div className="page-container">
          <div className="homepage">
            <HeroSection onSearch={handleSearch} />
            <PopularStocks />
            <SEOContent />
          </div>
        </div>
      </div>
    </>
  );
}
