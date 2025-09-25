import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * 苹果质感主布局组件
 * 提供应用的整体结构和容器
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <main className="main-content fade-in">
        {children}
      </main>
    </div>
  );
};