import React from 'react';
import { DataCard } from '../ui/DataCard';
import { StatsGrid } from '../ui/StatsGrid';

/**
 * 首页SEO内容区块组件
 * 提供关键词密度优化的内容，提升搜索引擎排名
 * 采用专业级数据卡片展示功能特色
 */
export function SEOContent() {
  return (
    <section className="seo-content">
      <div className="container">
        <h2>专业US Stocks SEC EDGAR数据检索平台</h2>
        <p>
          UsstocksTop是专业的US Stocks SEC EDGAR数据检索系统，提供完整的美股上市公司申报文件查询服务。
          我们的数据库涵盖88万+家美股公司，支持10-K年报、10-Q季报、8-K重大事件等200+种SEC表单类型查询，
          是投资研究和合规分析的专业工具。
        </p>

        <h3 style={{ textAlign: 'center' }}>核心功能特色</h3>
        <StatsGrid title="" subtitle="">
          <DataCard
            title="完整覆盖"
            subtitle="Complete US Stocks Coverage"
            value="880,000"
            unit="+ 公司"
            trend="up"
            trendValue="全市场"
            icon="fas fa-database"
            color="blue"
            size="medium"
          />

          <DataCard
            title="智能检索"
            subtitle="EDGAR Search Engine"
            value="毫秒级"
            unit=""
            trend="stable"
            icon="fas fa-search"
            color="green"
            size="medium"
          />

          <DataCard
            title="专业表单"
            subtitle="SEC Form Types"
            value="200"
            unit="+ 类型"
            icon="fas fa-file-alt"
            color="orange"
            size="medium"
          />

          <DataCard
            title="行业覆盖"
            subtitle="Industry Coverage"
            value="全行业"
            unit=""
            icon="fas fa-chart-pie"
            color="purple"
            size="medium"
          />
        </StatsGrid>

        <h3 style={{ textAlign: 'center' }}>适用场景</h3>
        <div className="use-cases-grid">
          <div className="use-case-card">
            <div className="use-case-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="use-case-content">
              <h4>投资研究分析</h4>
              <p>获取US Stocks完整财务数据和重大事件信息，支持深度投资决策</p>
            </div>
          </div>

          <div className="use-case-card">
            <div className="use-case-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="use-case-content">
              <h4>合规风险评估</h4>
              <p>查询公司治理结构和风险因素披露，确保投资合规性</p>
            </div>
          </div>

          <div className="use-case-card">
            <div className="use-case-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="use-case-content">
              <h4>学术研究教学</h4>
              <p>获取标准化的SEC EDGAR数据用于学术分析和教学实践</p>
            </div>
          </div>

          <div className="use-case-card">
            <div className="use-case-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="use-case-content">
              <h4>企业竞争分析</h4>
              <p>了解同行业公司经营状况和战略布局，制定竞争策略</p>
            </div>
          </div>
        </div>

        <h3 style={{ textAlign: 'center' }}>为什么选择UsstocksTop？</h3>
        <div className="advantages">
          <div className="advantage-item">
            <div className="advantage-header">
              <i className="fas fa-star"></i>
              <h4>数据完整性保障</h4>
            </div>
            <p>
              与其他US Stocks数据平台相比，UsstocksTop直接对接SEC官方EDGAR数据库，确保数据的完整性和准确性。
              我们覆盖88万+家美股公司的完整申报文件，为投资者提供最全面的市场数据支持。
            </p>
          </div>

          <div className="advantage-item">
            <div className="advantage-header">
              <i className="fas fa-cog"></i>
              <h4>专业级检索能力</h4>
            </div>
            <p>
              作为专业的SEC EDGAR检索工具，我们支持从10-K年报到8-K重大事件的全类型文件查询，
              涵盖科技、金融、医疗、能源等所有主要行业，为US Stocks投资者提供最专业的数据支持。
            </p>
          </div>
        </div>

        {/* 关键功能覆盖区域已移除 */}
      </div>
    </section>
  );
}