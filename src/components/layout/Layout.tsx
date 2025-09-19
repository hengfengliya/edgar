import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * 主要布局组件
 * 提供应用的整体结构和容器
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid mt-4">
        {children}
      </div>
    </div>
  );
};