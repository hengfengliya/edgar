import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useTranslation } from '../../hooks/useTranslation';

const DEFAULT_META = {
  en: {
    title: 'US Stocks SEC EDGAR Search - UsstocksTop Filing Intelligence',
    description: 'UsstocksTop provides a complete US Stocks SEC EDGAR filings database with instant access to 10-K, 10-Q, 8-K, and more. Optimised for analysts, compliance teams, and investors.',
    keywords: 'US Stocks, SEC filings, SEC EDGAR search, US stock research, 10-K annual report, 10-Q filing, 8-K disclosure'
  },
  zh: {
    title: 'US Stocks SEC EDGAR 检索 - UsstocksTop 专业申报文件平台',
    description: 'UsstocksTop 提供完整的 US Stocks SEC EDGAR 数据库，快速查找 10-K、10-Q、8-K 等申报文件，服务投资研究与合规团队。',
    keywords: 'US Stocks, SEC EDGAR, 美股申报文件, 10-K 报告, 10-Q 季报, 8-K 重大事件'
  }
} as const;

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
}

/**
 * SEO Head 管理组件
 * 统一维护页面的标题、描述、关键词和结构化数据
 */
export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website'
}: SEOHeadProps) {
  const { t, language } = useTranslation();
  const defaults = t(DEFAULT_META);

  const resolvedTitle = title || defaults.title;
  const resolvedDescription = description || defaults.description;
  const resolvedKeywords = keywords || defaults.keywords;
  const langCode = language === 'en' ? 'en' : 'zh-CN';

  return (
    <Helmet>
      {/* 基础 SEO 标签 */}
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="keywords" content={resolvedKeywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="language" content={langCode} />

      {/* Open Graph 标签 */}
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="UsstocksTop" />
      <meta property="og:url" content="https://usstocks.top" />

      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />

      {/* 结构化数据 - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'UsstocksTop - US Stocks SEC EDGAR Search',
          url: 'https://usstocks.top',
          description: resolvedDescription,
          applicationCategory: 'FinanceApplication',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          provider: {
            '@type': 'Organization',
            name: 'UsstocksTop'
          }
        })}
      </script>
    </Helmet>
  );
}
