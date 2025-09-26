import React from 'react';

interface DataCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

/**
 * 专业级数据卡片组件
 * 借鉴Bloomberg Terminal和PitchBook的数据展示风格
 */
export function DataCard({
  title,
  subtitle,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = 'blue',
  size = 'medium',
  onClick
}: DataCardProps) {
  const cardClass = `data-card data-card--${color} data-card--${size} ${onClick ? 'data-card--clickable' : ''}`;

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <i className="fas fa-arrow-up text-success"></i>;
      case 'down':
        return <i className="fas fa-arrow-down text-danger"></i>;
      case 'stable':
        return <i className="fas fa-minus text-muted"></i>;
      default:
        return null;
    }
  };

  return (
    <div className={cardClass} onClick={onClick}>
      {/* 卡片头部 */}
      <div className="data-card__header">
        {icon && <i className={`${icon} data-card__icon`}></i>}
        <div className="data-card__title-group">
          <h4 className="data-card__title">{title}</h4>
          {subtitle && <p className="data-card__subtitle">{subtitle}</p>}
        </div>
        {trend && (
          <div className="data-card__trend">
            {getTrendIcon()}
            {trendValue && <span className="data-card__trend-value">{trendValue}</span>}
          </div>
        )}
      </div>

      {/* 主要数值 */}
      <div className="data-card__value-section">
        <span className="data-card__value">{value}</span>
        {unit && <span className="data-card__unit">{unit}</span>}
      </div>

      {/* 悬停效果指示器 */}
      {onClick && <div className="data-card__hover-indicator"></div>}
    </div>
  );
}