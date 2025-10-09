import React from 'react';
import { DataCard } from '../ui/DataCard';
import { StatsGrid } from '../ui/StatsGrid';
import { useTranslation } from '../../hooks/useTranslation';

type CardColor = 'blue' | 'green' | 'orange' | 'purple';

const SEO_TEXTS = {
  en: {
    title: 'Professional US Stocks SEC EDGAR Research Platform',
    intro: 'UsstocksTop delivers a specialist US Stocks SEC EDGAR filings search experience. The platform connects directly to the official SEC database, covers 880,000+ listed companies, and supports 200+ filing types including 10-K annual reports, 10-Q quarterly reports, and 8-K current reports so analysts can access compliant disclosures within seconds.',
    featureTitle: 'Core Capabilities',
    useCasesTitle: 'Use Cases',
    advantagesTitle: 'Why Choose UsstocksTop?',
    cards: [
      {
        title: 'Full Coverage',
        subtitle: 'Complete US Stocks Coverage',
        value: '880,000',
        unit: '+ companies',
        trendValue: 'Comprehensive market scope',
        icon: 'fas fa-database',
        color: 'blue' as CardColor,
        trend: 'up'
      },
      {
        title: 'Intelligent Search',
        subtitle: 'EDGAR Search Engine',
        value: '< 1',
        unit: 'second',
        trendValue: 'Millisecond response',
        icon: 'fas fa-search',
        color: 'green' as CardColor,
        trend: 'stable'
      },
      {
        title: 'Form Library',
        subtitle: 'SEC Form Types',
        value: '200',
        unit: '+ types',
        trendValue: '10-K / 10-Q / 8-K',
        icon: 'fas fa-file-alt',
        color: 'orange' as CardColor,
        trend: 'up'
      },
      {
        title: 'Industry Insights',
        subtitle: 'Industry Coverage',
        value: 'All',
        unit: 'sectors',
        trendValue: 'Technology / Finance / Energy',
        icon: 'fas fa-chart-pie',
        color: 'purple' as CardColor,
        trend: 'up'
      }
    ],
    useCases: [
      {
        title: 'Investment Research',
        description: 'Analyse financial statements, MD&A, and risk disclosures across US Stocks to support equity research and portfolio decisions.'
      },
      {
        title: 'Regulatory Compliance',
        description: 'Track governance updates, compliance filings, and legal disclosures to keep risk assessments up to date.'
      },
      {
        title: 'Academic Projects',
        description: 'Access a structured SEC EDGAR dataset for academic research, classroom teaching, and case study development.'
      },
      {
        title: 'Competitive Intelligence',
        description: 'Compare industry peers, monitor strategic moves, and evaluate market positioning using official filings.'
      }
    ],
    advantages: [
      {
        title: 'Data Integrity Assurance',
        description: 'Direct integration with the SEC EDGAR system guarantees the completeness and accuracy of every filing. Our proprietary compression pipeline reduces 180 MB of raw data to 10.75 MB while preserving original content for SEO-friendly delivery.'
      },
      {
        title: 'Professional-Grade Search Engine',
        description: 'Supports keyword search by company name, ticker, and CIK, offers dynamic suggestions, and covers every major filing type, enabling analysts to find 10-K, 10-Q, 8-K, DEF 14A, and more with minimal clicks.'
      }
    ]
  },
  zh: {
    title: '专业级 US Stocks SEC EDGAR 数据检索平台',
    intro: 'UsstocksTop 专注于 US Stocks SEC EDGAR 申报文件检索，直连 SEC 官方数据库，覆盖 88 万+ 上市公司，支持 200+ 申报类型，包括 10-K 年报、10-Q 季报、8-K 重大事件等，让分析师几秒内即可获取合规披露内容。',
    featureTitle: '核心功能特色',
    useCasesTitle: '适用场景',
    advantagesTitle: '为什么选择 UsstocksTop？',
    cards: [
      {
        title: '完整覆盖',
        subtitle: 'Complete US Stocks Coverage',
        value: '880,000',
        unit: '+ 家公司',
        trendValue: '全市场覆盖',
        icon: 'fas fa-database',
        color: 'blue' as CardColor,
        trend: 'up'
      },
      {
        title: '智能检索',
        subtitle: 'EDGAR Search Engine',
        value: '< 1',
        unit: '秒响应',
        trendValue: '毫秒级搜索',
        icon: 'fas fa-search',
        color: 'green' as CardColor,
        trend: 'stable'
      },
      {
        title: '专业表单库',
        subtitle: 'SEC Form Types',
        value: '200',
        unit: '+ 种类',
        trendValue: '10-K / 10-Q / 8-K',
        icon: 'fas fa-file-alt',
        color: 'orange' as CardColor,
        trend: 'up'
      },
      {
        title: '行业洞察',
        subtitle: 'Industry Coverage',
        value: '全行业',
        unit: '覆盖',
        trendValue: '科技 / 金融 / 能源',
        icon: 'fas fa-chart-pie',
        color: 'purple' as CardColor,
        trend: 'up'
      }
    ],
    useCases: [
      {
        title: '投资研究分析',
        description: '快速获取 US Stocks 财务报表、管理层讨论（MD&A）和风险披露，支持投资研究与资产配置。'
      },
      {
        title: '合规风险评估',
        description: '实时跟踪公司治理、合规申报与法律披露，帮助团队进行风险预警与合规审查。'
      },
      {
        title: '学术研究教学',
        description: '提供结构化 SEC EDGAR 数据，适用于高校课程、案例分析与科研项目。'
      },
      {
        title: '企业竞争分析',
        description: '对比行业同类公司披露内容，洞察战略布局与市场定位，制定精准竞争策略。'
      }
    ],
    advantages: [
      {
        title: '数据完整性保障',
        description: '直连 SEC 官方 EDGAR 数据库，确保每一份文件的完整性和准确性；自研压缩流程将 180MB 原始数据压缩至 10.75MB，同时保持可 SEO 的原生结构。'
      },
      {
        title: '专业级检索能力',
        description: '支持公司名称、股票代码、CIK 多维度搜索，实时联想推荐；覆盖 10-K、10-Q、8-K、DEF 14A 等核心申报类型，极大提升检索效率。'
      }
    ]
  }
} as const;

/**
 * 首页 SEO 内容区块组件
 * 提供关键词密度友好的介绍文案，强化 SEO 排名
 */
export function SEOContent() {
  const { t } = useTranslation();
  const copy = t(SEO_TEXTS);

  return (
    <section className="seo-content">
      <div className="container">
        <h2>{copy.title}</h2>
        <p>{copy.intro}</p>

        <h3 style={{ textAlign: 'center' }}>{copy.featureTitle}</h3>
        <StatsGrid title="" subtitle="">
          {copy.cards.map((card) => (
            <DataCard
              key={card.title}
              title={card.title}
              subtitle={card.subtitle}
              value={card.value}
              unit={card.unit}
              trend={card.trend}
              trendValue={card.trendValue}
              icon={card.icon}
              color={card.color}
              size="medium"
            />
          ))}
        </StatsGrid>

        <h3 style={{ textAlign: 'center' }}>{copy.useCasesTitle}</h3>
        <div className="use-cases-grid">
          {copy.useCases.map((useCase) => (
            <div key={useCase.title} className="use-case-card">
              <div className="use-case-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="use-case-content">
                <h4>{useCase.title}</h4>
                <p>{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ textAlign: 'center' }}>{copy.advantagesTitle}</h3>
        <div className="advantages">
          {copy.advantages.map((advantage) => (
            <div key={advantage.title} className="advantage-item">
              <div className="advantage-header">
                <i className="fas fa-star"></i>
                <h4>{advantage.title}</h4>
              </div>
              <p>{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
