import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline-primary' | 'outline-secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: string;
  children: React.ReactNode;
}

/**
 * 自定义按钮组件
 * 支持多种样式、大小和加载状态
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <i className="fas fa-spinner fa-spin me-2"></i>
          {typeof children === 'string' ? '处理中...' : children}
        </>
      ) : (
        <>
          {icon && <i className={`${icon} me-2`}></i>}
          {children}
        </>
      )}
    </button>
  );
};