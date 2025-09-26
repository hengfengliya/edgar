import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import AboutPage from '../pages/AboutPage';

/**
 * React Router配置
 * 定义应用的路由结构和SEO优化的meta数据
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    // SEO优化的meta数据
    handle: {
      crumb: () => "US Stocks首页",
      title: "US Stocks SEC EDGAR检索 - UsstocksTop专业美股申报文件查询系统",
      description: "专业US Stocks SEC EDGAR数据检索平台，15万+美股公司申报文件查询。支持10-K年报、10-Q季报、8-K重大事件等200+种SEC表单类型，投资研究首选工具。"
    }
  },
  {
    path: "/search",
    element: <SearchPage />,
    handle: {
      crumb: () => "搜索结果",
      title: "US Stocks SEC EDGAR搜索结果 | UsstocksTop",
      description: "查询US Stocks公司SEC申报文件，支持10-K、10-Q、8-K等专业检索。UsstocksTop提供完整的美股EDGAR数据库搜索服务。"
    }
  },
  {
    path: "/about",
    element: <AboutPage />,
    handle: {
      crumb: () => "关于我们",
      title: "关于UsstocksTop - 专业US Stocks SEC EDGAR检索平台",
      description: "了解UsstocksTop的技术创新和数据规模，专业的US Stocks SEC EDGAR检索服务。创新压缩算法，94%数据压缩率，完美适配Serverless环境。"
    }
  }
]);

/**
 * 应用路由提供者组件
 * 包装整个应用的路由逻辑
 */
export default function AppRouter() {
  return <RouterProvider router={router} />;
}