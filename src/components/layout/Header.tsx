import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

// 定义导航区域的多语言文案
const NAV_TEXTS = {
  en: {
    brand: 'UsstocksTop',
    home: 'Home',
    search: 'Search',
    about: 'About',
    navLabel: 'Primary navigation',
    languageLabel: 'Switch language',
    english: 'English',
    chinese: '中文'
  },
  zh: {
    brand: 'UsstocksTop',
    home: '首页',
    search: '搜索',
    about: '关于',
    navLabel: '主导航',
    languageLabel: '切换语言',
    english: 'English',
    chinese: '中文'
  }
} as const;

/**
 * 苹果质感头部组件
 * 采用毛玻璃效果和现代化设计，支持多页面导航
 */
export const Header: React.FC = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useTranslation();
  const copy = t(NAV_TEXTS);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // 切换语言时同步上下文，按钮使用可访问属性指示状态
  const handleLanguageSwitch = (targetLanguage: 'en' | 'zh') => {
    if (language !== targetLanguage) {
      setLanguage(targetLanguage);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <div className="header-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <Link to="/" className="header-brand">
            {copy.brand}
          </Link>
        </div>

        <div className="header-actions">
          {/* 导航菜单 */}
          <nav className="header-nav" aria-label={copy.navLabel}>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <i className="fas fa-home"></i>
              <span>{copy.home}</span>
            </Link>
            <Link
              to="/search"
              className={`nav-link ${isActive('/search') ? 'active' : ''}`}
            >
              <i className="fas fa-search"></i>
              <span>{copy.search}</span>
            </Link>
            <Link
              to="/about"
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              <i className="fas fa-info-circle"></i>
              <span>{copy.about}</span>
            </Link>
          </nav>

          {/* 语言切换按钮 */}
          <div className="language-switcher" role="group" aria-label={copy.languageLabel}>
            <button
              type="button"
              className={`language-button ${language === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageSwitch('en')}
              aria-pressed={language === 'en'}
            >
              {copy.english}
            </button>
            <button
              type="button"
              className={`language-button ${language === 'zh' ? 'active' : ''}`}
              onClick={() => handleLanguageSwitch('zh')}
              aria-pressed={language === 'zh'}
            >
              {copy.chinese}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
