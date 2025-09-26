import React from 'react';
import { DataCard } from './DataCard';

interface StatsGridProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

interface MetricData {
  id: string;
  title: string;
  subtitle?: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray';
  onClick?: () => void;
}

/**
 * 数据统计网格组件
 * 专业级金融数据展示，支持多种布局和交互
 */
export function StatsGrid({ title, subtitle, className = '', children }: StatsGridProps) {
  return (
    <section className={`stats-grid ${className}`}>
      {(title || subtitle) && (
        <div className="stats-grid__header">
          {title && <h3 className="stats-grid__title">{title}</h3>}
          {subtitle && <p className="stats-grid__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="stats-grid__container">
        {children}
      </div>
    </section>
  );
}

// 预定义的指标组件，用于常见的金融数据展示
export function MarketMetrics() {
  const metrics: MetricData[] = [
    {
      id: 'companies',
      title: '覆盖公司数',
      subtitle: 'US Stock Companies',
      value: '880,000',
      unit: '+',
      trend: 'up',
      trendValue: '实时更新',
      icon: 'fas fa-building',
      color: 'blue'
    },
    {
      id: 'forms',
      title: '支持表单类型',
      subtitle: 'SEC Form Types',
      value: '200',
      unit: '+',
      icon: 'fas fa-file-alt',
      color: 'green'
    },
    {
      id: 'history',
      title: '历史数据覆盖',
      subtitle: 'Historical Coverage',
      value: '15',
      unit: '年+',
      icon: 'fas fa-history',
      color: 'orange'
    },
    {
      id: 'industries',
      title: '行业全覆盖',
      subtitle: 'Industry Coverage',
      value: '全行业',
      unit: '',
      icon: 'fas fa-chart-pie',
      color: 'purple'
    }
  ];

  return (
    <StatsGrid title="核心数据指标" subtitle="US Stocks SEC EDGAR完整数据覆盖">
      {metrics.map((metric) => (
        <DataCard
          key={metric.id}
          title={metric.title}
          subtitle={metric.subtitle}
          value={metric.value}
          unit={metric.unit}
          trend={metric.trend}
          trendValue={metric.trendValue}
          icon={metric.icon}
          color={metric.color}
          onClick={metric.onClick}
        />
      ))}
    </StatsGrid>
  );
}

// 行业分析组件
export function IndustryMetrics() {
  const industries: MetricData[] = [
    {
      id: 'tech',
      title: '科技行业',
      subtitle: 'Technology',
      value: '180,000',
      unit: '+公司',
      trend: 'up',
      trendValue: '+12%',
      icon: 'fas fa-microchip',
      color: 'blue'
    },
    {
      id: 'finance',
      title: '金融服务',
      subtitle: 'Financial Services',
      value: '95,000',
      unit: '+公司',
      trend: 'stable',
      icon: 'fas fa-coins',
      color: 'green'
    },
    {
      id: 'healthcare',
      title: '医疗健康',
      subtitle: 'Healthcare',
      value: '78,000',
      unit: '+公司',
      trend: 'up',
      trendValue: '+8%',
      icon: 'fas fa-heartbeat',
      color: 'red'
    },
    {
      id: 'energy',
      title: '能源行业',
      subtitle: 'Energy',
      value: '35,000',
      unit: '+公司',
      trend: 'down',
      trendValue: '-3%',
      icon: 'fas fa-bolt',
      color: 'orange'
    }
  ];

  return (
    <StatsGrid title="行业分布统计" subtitle="主要行业公司数量分析">
      {industries.map((industry) => (
        <DataCard
          key={industry.id}
          title={industry.title}
          subtitle={industry.subtitle}
          value={industry.value}
          unit={industry.unit}
          trend={industry.trend}
          trendValue={industry.trendValue}
          icon={industry.icon}
          color={industry.color}
          size="small"
        />
      ))}
    </StatsGrid>
  );
}