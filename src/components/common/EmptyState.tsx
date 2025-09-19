import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * 空状态组件
 * 用于显示没有数据时的占位内容
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'fas fa-search',
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <div className={`text-center py-5 ${className}`}>
      <i className={`${icon} fa-3x text-muted mb-3`}></i>
      <h4 className="text-muted">{title}</h4>
      {description && (
        <p className="text-muted">{description}</p>
      )}
      {action && (
        <div className="mt-3">
          {action}
        </div>
      )}
    </div>
  );
};