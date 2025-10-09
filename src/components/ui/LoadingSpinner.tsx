import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LOADING_TEXT = {
  en: 'Loading...',
  zh: '加载中...'
} as const;

/**
 * 加载动画组件
 * 显示旋转指示器以及国际化的提示文本
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = ''
}) => {
  const { language } = useTranslation();
  const displayText = text ?? LOADING_TEXT[language];

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
      {displayText && (
        <p className="mt-2 text-muted">{displayText}</p>
      )}
    </div>
  );
};
