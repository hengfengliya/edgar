import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

/**
 * 卡片组件
 * 用于包装内容的容器组件
 */
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  headerActions
}) => {
  const hasHeader = title || subtitle || headerActions;

  return (
    <div className={`card ${className}`}>
      {hasHeader && (
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {title && <h5 className="card-title mb-0">{title}</h5>}
              {subtitle && <p className="card-subtitle text-muted">{subtitle}</p>}
            </div>
            {headerActions && (
              <div className="card-actions">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};