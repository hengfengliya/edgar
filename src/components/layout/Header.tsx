import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * 苹果质感头部组件
 * 采用毛玻璃效果和现代化设计，支持多页面导航
 */
export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <div className="header-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <Link to="/" className="header-brand">
            UsstocksTop
          </Link>
        </div>

        {/* 导航菜单 */}
        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <i className="fas fa-home"></i>
            <span>首页</span>
          </Link>
          <Link
            to="/search"
            className={`nav-link ${isActive('/search') ? 'active' : ''}`}
          >
            <i className="fas fa-search"></i>
            <span>搜索</span>
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            <i className="fas fa-info-circle"></i>
            <span>关于</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};