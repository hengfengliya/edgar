import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import AboutPage from '../pages/AboutPage';

/**
 * React Router 配置
 * 定义页面与基础元数据
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    handle: {
      crumb: () => 'Home',
      title: 'US Stocks SEC EDGAR Search - UsstocksTop',
      description: 'Professional US Stocks SEC EDGAR search platform with 880,000+ companies and 200+ filing types.'
    }
  },
  {
    path: '/search',
    element: <SearchPage />,
    handle: {
      crumb: () => 'Search',
      title: 'SEC EDGAR Search Results | UsstocksTop',
      description: 'Discover US stock filings including 10-K, 10-Q, 8-K, and proxy statements with UsstocksTop.'
    }
  },
  {
    path: '/about',
    element: <AboutPage />,
    handle: {
      crumb: () => 'About',
      title: 'About UsstocksTop - US Stocks SEC EDGAR Platform',
      description: 'Learn how UsstocksTop delivers fast, bilingual access to US stock market disclosures.'
    }
  }
]);

/**
 * 应用路由提供者组件
 */
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
