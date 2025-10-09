import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Header, Layout } from '../components/layout';
import { DataCard } from '../components/ui/DataCard';
import { StatsGrid } from '../components/ui/StatsGrid';
import { useTranslation } from '../hooks/useTranslation';

const ABOUT_META = {
  en: {
    title: 'About UsstocksTop - Professional US Stocks SEC EDGAR Platform',
    description: 'Learn how UsstocksTop delivers fast, reliable access to US Stocks SEC EDGAR filings with 880,000+ companies, 200+ form types, and analyst-ready workflows.',
    keywords: 'UsstocksTop, SEC EDGAR platform, US Stocks data, 10-K research, compliance analytics'
  },
  zh: {
    title: '关于 UsstocksTop - 专业 US Stocks SEC EDGAR 平台',
    description: '了解 UsstocksTop 如何以 88 万+ 公司、200+ 申报类型和专业流程支持美股投资研究与合规审查。',
    keywords: 'UsstocksTop, SEC EDGAR 平台, 美股数据, 10-K 研究, 合规分析'
  }
} as const;

const ABOUT_COPY = {
  en: {
    hero: {
      title: 'About UsstocksTop',
      subtitle: 'Professional US Stocks SEC EDGAR intelligence for analysts, investors, and compliance teams.',
      description: 'UsstocksTop connects directly to the SEC EDGAR system, compresses massive disclosure datasets, and delivers an intuitive experience that keeps complex filings accessible to every researcher.'
    },
    mission: {
      title: 'Our Mission',
      paragraphs: [
        'Turn raw SEC EDGAR disclosures into actionable insights so that investors, risk managers, and educators can make informed decisions without wrestling with legacy workflows.',
        'By pairing modern infrastructure with a bilingual interface, we bridge the gap between US stock disclosure standards and the expectations of multilingual teams across Asia.'
      ]
    },
    stats: [
      { title: 'US Stocks Coverage', subtitle: 'Listed Companies', value: '880,000', unit: '+', trendValue: 'Daily updates', icon: 'fas fa-building', color: 'blue' },
      { title: 'SEC Form Types', subtitle: '10-K / 10-Q / 8-K', value: '200', unit: '+', trendValue: 'Complete library', icon: 'fas fa-file-alt', color: 'green' },
      { title: 'Historical Archive', subtitle: 'Filing History', value: '15', unit: '+ years', trendValue: 'Back to 2009', icon: 'fas fa-history', color: 'orange' }
    ],
    pillars: {
      title: 'What Makes Us Different',
      items: [
        {
          title: 'Enterprise-Grade Data Pipeline',
          description: 'Lossless compression turns 180 MB of raw SEC EDGAR data into a 10.75 MB delivery package optimised for serverless deployment while keeping the original structure intact for SEO.'
        },
        {
          title: 'Intelligent Search Experience',
          description: 'Powerful keyword and ticker matching, real-time auto-completion, and contextual filtering let users surface 10-K, 10-Q, 8-K, and DEF 14A filings with minimal effort.'
        },
        {
          title: 'Bilingual Workflow',
          description: 'Switch seamlessly between English and Chinese interfaces so global teams can collaborate on the same dataset without translation friction.'
        }
      ]
    }
  },
  zh: {
    hero: {
      title: '关于 UsstocksTop',
      subtitle: '为分析师、投资者和合规团队打造的专业 US Stocks SEC EDGAR 情报平台。',
      description: 'UsstocksTop 直连 SEC EDGAR 系统，对海量披露数据进行高效压缩，并通过双语界面让复杂的申报文件变得可视、可读、可复用。'
    },
    mission: {
      title: '我们的使命',
      paragraphs: [
        '把繁琐的 SEC EDGAR 申报信息转化为可执行的洞察，帮助投资研究、风控和教育机构在不依赖旧式流程的前提下快速决策。',
        '通过现代化基础设施与双语界面，我们缩小 US Stocks 披露标准与中文用户期待之间的差距，让跨区域团队高效协作。'
      ]
    },
    stats: [
      { title: 'US Stocks 覆盖', subtitle: '上市公司', value: '880,000', unit: '+', trendValue: '每日更新', icon: 'fas fa-building', color: 'blue' },
      { title: 'SEC 表单类型', subtitle: '10-K / 10-Q / 8-K', value: '200', unit: '+', trendValue: '完整表单库', icon: 'fas fa-file-alt', color: 'green' },
      { title: '历史档案', subtitle: '申报历史', value: '15', unit: '+ 年', trendValue: '可追溯至 2009', icon: 'fas fa-history', color: 'orange' }
    ],
    pillars: {
      title: '核心优势',
      items: [
        {
          title: '企业级数据管线',
          description: '无损压缩将 180MB 原始 SEC 数据精简至 10.75MB，同时保持完整结构，适配 Serverless 环境并友好于 SEO。'
        },
        {
          title: '智能搜索体验',
          description: '支持公司名、Ticker、CIK 等多维检索，实时联想提示，让用户快速定位 10-K、10-Q、8-K、DEF 14A 等核心文件。'
        },
        {
          title: '双语协同流程',
          description: '一键切换英/中文界面，跨地域团队共享同一份数据视图，无需额外翻译成本。'
        }
      ]
    }
  }
} as const;

/**
 * 关于我们页面
 * 展示平台定位、使命与核心优势
 */
export default function AboutPage() {
  const { t } = useTranslation();
  const meta = t(ABOUT_META);
  const copy = t(ABOUT_COPY);

  return (
    <>
      <SEOHead
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonical="https://usstocks.top/about"
      />

      <div className="App">
        <Header />
        <Layout>
          <div className="about-page">
            <section className="about-hero">
              <div className="container">
                <h1>{copy.hero.title}</h1>
                <h2>{copy.hero.subtitle}</h2>
                <p className="hero-description">{copy.hero.description}</p>
              </div>
            </section>

            <section className="mission-section">
              <div className="container">
                <h3>{copy.mission.title}</h3>
                <div className="mission-content">
                  {copy.mission.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </section>

            <section className="metrics-showcase">
              <div className="container">
                <StatsGrid title="" subtitle="">
                  {copy.stats.map((metric) => (
                    <DataCard
                      key={metric.title}
                      title={metric.title}
                      subtitle={metric.subtitle}
                      value={metric.value}
                      unit={metric.unit}
                      trend="up"
                      trendValue={metric.trendValue}
                      icon={metric.icon}
                      color={metric.color as 'blue' | 'green' | 'orange'}
                    />
                  ))}
                </StatsGrid>
              </div>
            </section>

            <section className="pillars-section">
              <div className="container">
                <h3>{copy.pillars.title}</h3>
                <div className="pillars-grid">
                  {copy.pillars.items.map((item) => (
                    <div key={item.title} className="pillar-card">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </Layout>
      </div>
    </>
  );
}
