import React from 'react';

/**
 * 头部导航栏组件
 * 显示应用标题和导航信息
 */
export const Header: React.FC = () => {
  return (
    <nav className="navbar navbar-dark bg-primary">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">
          <i className="fas fa-chart-line me-2"></i>
          虚空有物数据检索系统
        </span>
      </div>
    </nav>
  );
};