import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
  className?: string;
}

/**
 * 警告提示组件
 * 用于显示成功、错误、警告或信息消息
 */
export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  dismissible = false,
  className = ''
}) => {
  const typeClasses = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info'
  };

  const iconClasses = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-triangle',
    warning: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle'
  };

  if (!message) return null;

  return (
    <div className={`alert ${typeClasses[type]} ${dismissible ? 'alert-dismissible' : ''} ${className}`} role="alert">
      <i className={`${iconClasses[type]} me-2`}></i>
      {message}
      {dismissible && onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};