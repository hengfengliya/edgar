import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead';
import { Header, Layout } from '../components/layout';
import { DataCard } from '../components/ui/DataCard';
import { StatsGrid, MarketMetrics, IndustryMetrics } from '../components/ui/StatsGrid';

/**
 * 关于我们页面组件
 * 提供项目背景、技术创新、团队信息等内容，增强SEO效果
 * 采用专业级数据卡片展示核心指标
 */
export default function AboutPage() {
  return (
    <>
      {/* SEO Meta标签 */}
      <SEOHead
        title="关于UsstocksTop - 专业US Stocks SEC EDGAR检索平台"
        description="了解UsstocksTop的行业覆盖和数据规模，专业的US Stocks SEC EDGAR检索服务。覆盖88万+家美股公司，涵盖科技、金融、医疗、能源等所有主要行业。"
        keywords="关于UsstocksTop, US Stocks平台, SEC EDGAR数据, 行业覆盖, 投资研究工具, 88万美股公司"
        canonical="https://usstocks.top/about"
      />

      <div className="App">
        <Header />
        <Layout>
          <div className="about-page">
            {/* About Hero Section */}
            <section className="about-hero">
              <div className="container">
                <h1>关于UsstocksTop - 专业US Stocks SEC EDGAR检索平台</h1>
                <h2>致力于为投资者提供最专业的美股数据检索服务</h2>
                <p className="hero-description">
                  UsstocksTop是一个专业级的SEC EDGAR数据检索平台，通过创新技术为投资研究者提供
                  完整、准确、高效的US Stocks申报文件查询服务。
                </p>
              </div>
            </section>

            {/* 项目背景和使命 */}
            <section className="mission-section">
              <div className="container">
                <h3>项目使命</h3>
                <div className="mission-content">
                  <p>
                    在当今信息化时代，获取准确的US Stocks财务数据对投资决策至关重要。
                    然而，SEC EDGAR数据库虽然包含丰富信息，但其复杂的结构和专业术语
                    往往让普通投资者望而却步。
                  </p>
                  <p>
                    <strong>UsstocksTop的使命</strong>是将专业的SEC EDGAR数据以最友好的方式
                    呈现给每一位投资者，让复杂的美股申报文件变得易于理解和使用。
                  </p>
                </div>
              </div>
            </section>

            {/* 核心数据指标展示 */}
            <section className="metrics-showcase">
              <div className="container">
                <MarketMetrics />
                <IndustryMetrics />
              </div>
            </section>

            {/* 技术创新亮点 */}
            <section className="tech-innovation">
              <div className="container">
                <h3>技术创新亮点</h3>

                <StatsGrid title="专业级服务能力" subtitle="Professional Service Capabilities">
                  <DataCard
                    title="查询响应"
                    subtitle="Query Response Time"
                    value="< 100"
                    unit="ms"
                    trend="stable"
                    trendValue="稳定"
                    icon="fas fa-tachometer-alt"
                    color="green"
                    size="medium"
                  />

                  <DataCard
                    title="服务可用性"
                    subtitle="Service Availability"
                    value="99.9"
                    unit="%"
                    trend="up"
                    trendValue="SLA保证"
                    icon="fas fa-shield-alt"
                    color="blue"
                    size="medium"
                  />

                  <DataCard
                    title="数据同步"
                    subtitle="Data Synchronization"
                    value="实时"
                    unit=""
                    trend="up"
                    trendValue="SEC官方"
                    icon="fas fa-sync"
                    color="orange"
                    size="medium"
                  />

                  <DataCard
                    title="全球访问"
                    subtitle="Global Access"
                    value="CDN"
                    unit="加速"
                    icon="fas fa-globe-americas"
                    color="purple"
                    size="medium"
                  />
                </StatsGrid>

                <div className="innovation-features">
                  <div className="feature-highlight">
                    <div className="feature-icon">
                      <i className="fas fa-database"></i>
                    </div>
                    <div className="feature-content">
                      <h4>完整数据覆盖</h4>
                      <p>
                        覆盖88万+家美股公司的完整数据库，包含所有主要交易所上市公司，
                        为投资者提供最全面的市场数据支持。从知名的科技巨头到小型创新公司，
                        确保投资研究的完整性。
                      </p>
                    </div>
                  </div>

                  <div className="feature-highlight">
                    <div className="feature-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <div className="feature-content">
                      <h4>智能搜索系统</h4>
                      <p>
                        先进的搜索算法支持公司名称、ticker代码、CIK多维度搜索，
                        智能推荐系统提供实时搜索建议，快速定位目标公司。
                        无论您搜索Apple还是AAPL，都能精准匹配。
                      </p>
                    </div>
                  </div>

                  <div className="feature-highlight">
                    <div className="feature-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="feature-content">
                      <h4>专业表单支持</h4>
                      <p>
                        支持10-K年报、10-Q季报、8-K重大事件、DEF14A代理材料等200+种SEC表单类型，
                        满足不同投资研究需求。从基础财务报告到复杂的合规文件，一站式获取。
                      </p>
                    </div>
                  </div>

                  <div className="feature-highlight">
                    <div className="feature-icon">
                      <i className="fas fa-chart-pie"></i>
                    </div>
                    <div className="feature-content">
                      <h4>行业全覆盖</h4>
                      <p>
                        涵盖科技、金融、医疗、能源、制造业等所有主要行业，
                        提供全面的行业投资研究支持和竞争分析数据。
                        深度理解各行业特点，助力精准投资决策。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 数据规模介绍 */}
            <section className="database-scale">
              <div className="container">
                <h3>数据库规模</h3>

                <StatsGrid title="完整数据统计" subtitle="Comprehensive Data Statistics">
                  <DataCard
                    title="美股公司"
                    subtitle="US Stock Companies"
                    value="880,000"
                    unit="+"
                    trend="up"
                    trendValue="持续增长"
                    icon="fas fa-building"
                    color="blue"
                    size="large"
                  />

                  <DataCard
                    title="历史数据"
                    subtitle="Historical Coverage"
                    value="15"
                    unit="年+"
                    icon="fas fa-history"
                    color="green"
                    size="large"
                  />

                  <DataCard
                    title="表单类型"
                    subtitle="Form Types"
                    value="200"
                    unit="+"
                    icon="fas fa-file"
                    color="orange"
                    size="large"
                  />

                  <DataCard
                    title="月度更新"
                    subtitle="Monthly Updates"
                    value="数千万"
                    unit="条记录"
                    trend="up"
                    icon="fas fa-chart-line"
                    color="purple"
                    size="large"
                  />
                </StatsGrid>

                <div className="architecture-description">
                  <h4>数据服务特色</h4>
                  <ul>
                    <li><strong>实时同步</strong>：与SEC官方EDGAR数据库实时同步，确保数据时效性</li>
                    <li><strong>行业分类</strong>：按行业智能分类，便于行业研究和竞争分析</li>
                    <li><strong>多格式支持</strong>：提供HTML、XML、XBRL等多种格式文件下载</li>
                    <li><strong>高可用性</strong>：99.9%服务可用性保证，全天候稳定服务</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 联系我们 */}
            <section className="contact-section">
              <div className="container">
                <h3>联系我们</h3>
                <div className="contact-content">
                  <p>
                    如果您对UsstocksTop有任何建议或合作意向，欢迎与我们联系。
                    我们始终欢迎来自投资者、研究机构和技术爱好者的反馈。
                  </p>

                  <div className="contact-info">
                    <div className="contact-item">
                      <strong>网站</strong>: <a href="https://usstocks.top" target="_blank" rel="noopener noreferrer">https://usstocks.top</a>
                    </div>
                    <div className="contact-item">
                      <strong>技术支持</strong>: 通过网站搜索功能体验我们的专业服务
                    </div>
                  </div>

                  <div className="cta-section">
                    <h4>开始体验专业的US Stocks SEC EDGAR检索服务</h4>
                    <div className="cta-buttons">
                      <Link to="/" className="btn btn-primary">
                        <i className="fas fa-search"></i>
                        开始搜索
                      </Link>
                      <Link to="/search?q=AAPL" className="btn btn-outline">
                        <i className="fas fa-rocket"></i>
                        查看示例
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Layout>
      </div>
    </>
  );
}