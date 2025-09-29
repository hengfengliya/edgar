import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
}

/**
 * SEO Head管理组件
 * 用于统一管理页面的SEO元数据，支持动态设置title、description、keywords等
 */
export function SEOHead({
  title = "US Stocks SEC EDGAR检索 - UsstocksTop专业美股申报文件查询系统",
  description = "专业US Stocks SEC EDGAR数据检索平台，88万+美股公司申报文件查询。支持10-K年报、10-Q季报、8-K重大事件等200+种SEC表单类型，投资研究首选工具。",
  keywords = "US Stocks, SEC EDGAR, 美股申报, 10-K报告, 10-Q季报, EDGAR检索, 投资研究, usstocks",
  canonical,
  ogType = "website"
}: SEOHeadProps) {
  return (
    <Helmet>
      {/* 基础SEO标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph标签 */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="UsstocksTop" />
      <meta property="og:url" content="https://usstocks.top" />

      {/* Twitter Card标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* 结构化数据 - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "UsstocksTop - US Stocks SEC EDGAR检索系统",
          "url": "https://usstocks.top",
          "description": description,
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "provider": {
            "@type": "Organization",
            "name": "UsstocksTop"
          }
        })}
      </script>
    </Helmet>
  );
}