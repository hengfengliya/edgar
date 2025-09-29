import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { SpeedInsights } from '@vercel/speed-insights/react';
import AppRouter from './router';
import { ErrorBoundary } from './components/common';
import './styles/index.css';
import './styles/crunchbase-style.css';
import './styles/layout-system.css';

// 创建React根节点并渲染应用
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <AppRouter />
        <SpeedInsights />
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);