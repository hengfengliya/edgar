import React from 'react';

/**
 * 苹果质感头部组件
 * 采用毛玻璃效果和现代化设计
 */
export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <div className="header-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <span>数据检索系统</span>
        </div>
      </div>
    </header>
  );
};