import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * 加载动画组件
 * 显示旋转的加载指示器和可选的加载文本
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = '加载中...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border spinner-border-lg'
  };

  return (
    <div className={`text-center ${className}`}>
      <div
        className={`spinner-border text-primary ${sizeClasses[size]}`}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && (
        <p className="mt-2 text-muted">{text}</p>
      )}
    </div>
  );
};