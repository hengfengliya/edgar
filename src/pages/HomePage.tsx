import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead';
import { Header } from '../components/layout';
import { HeroSection } from '../components/homepage/HeroSection';
import { PopularStocks } from '../components/homepage/PopularStocks';
import { SEOContent } from '../components/homepage/SEOContent';
import { SearchFormData } from '../types/api';

/**
 * 首页组件
 * 包含英雄区块、热门股票、SEO内容等模块，提供完整的首页体验
 */
export default function HomePage() {
  const navigate = useNavigate();

  // 处理搜索，跳转到搜索结果页
  const handleSearch = async (formData: SearchFormData) => {
    try {
      // 构建查询参数
      const searchParams = new URLSearchParams({
        q: formData.companyInput,
      });

      // 添加可选参数
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

      // 跳转到搜索结果页
      navigate(`/search?${searchParams.toString()}`);
    } catch (error) {
      console.error('搜索跳转失败:', error);
    }
  };

  return (
    <>
      {/* SEO Meta标签 */}
      <SEOHead
        title="US Stocks SEC EDGAR检索 - UsstocksTop专业美股申报文件查询系统"
        description="专业US Stocks SEC EDGAR数据检索平台，88万+美股公司申报文件查询。支持10-K年报、10-Q季报、8-K重大事件等200+种SEC表单类型，投资研究首选工具。"
        keywords="US Stocks, SEC EDGAR, 美股申报, 10-K报告, 10-Q季报, EDGAR检索, 投资研究, usstocks.top"
        canonical="https://usstocks.top"
      />

      <div className="App">
        <Header />
        <div className="page-container">
          {/* 首页内容 */}
          <div className="homepage">
            {/* 英雄区块 - 搜索功能 */}
            <HeroSection onSearch={handleSearch} />

            {/* 热门股票快捷入口 */}
            <PopularStocks />

            {/* SEO优化内容 */}
            <SEOContent />
          </div>
        </div>
      </div>
    </>
  );
}