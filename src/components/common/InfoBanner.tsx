import React from 'react';

interface InfoBannerProps {
  title?: string;
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success' | 'danger';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

/**
 * 信息横幅组件
 * 用于显示重要信息或使用说明
 */
const InfoBanner: React.FC<InfoBannerProps> = ({
  title,
  children,
  type = 'info',
  dismissible = false,
  onDismiss,
  className = ''
}) => {
  const typeClasses = {
    info: 'alert-info',
    warning: 'alert-warning',
    success: 'alert-success',
    danger: 'alert-danger'
  };

  const iconClasses = {
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    success: 'fas fa-check-circle',
    danger: 'fas fa-exclamation-circle'
  };

  return (
    <div className={`alert ${typeClasses[type]} ${dismissible ? 'alert-dismissible' : ''} ${className}`}>
      <i className={`${iconClasses[type]} me-2`}></i>
      {title && <strong>{title}</strong>}
      {title && ': '}
      {children}
      {dismissible && onDismiss && (
        <button
          type="button"
          className="btn-close"
          onClick={onDismiss}
          aria-label="关闭"
        ></button>
      )}
    </div>
  );
};

export default InfoBanner;