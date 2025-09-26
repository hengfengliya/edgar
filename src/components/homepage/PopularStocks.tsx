import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 热门股票快捷入口组件
 * 提供30个热门美股公司的快捷搜索入口，提升用户体验
 */
export function PopularStocks() {
  const navigate = useNavigate();

  // 热门美股公司列表
  const popularCompanies = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.' },
    { ticker: 'TSLA', name: 'Tesla Inc.' },
    { ticker: 'META', name: 'Meta Platforms Inc.' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation' },
    { ticker: 'NFLX', name: 'Netflix Inc.' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
    { ticker: 'JNJ', name: 'Johnson & Johnson' },
    { ticker: 'V', name: 'Visa Inc.' },
    { ticker: 'PG', name: 'Procter & Gamble Co.' },
    { ticker: 'UNH', name: 'UnitedHealth Group Inc.' },
    { ticker: 'MA', name: 'Mastercard Inc.' },
    { ticker: 'HD', name: 'Home Depot Inc.' },
    { ticker: 'DIS', name: 'Walt Disney Co.' },
    { ticker: 'BAC', name: 'Bank of America Corp.' },
    { ticker: 'ADBE', name: 'Adobe Inc.' },
    { ticker: 'CRM', name: 'Salesforce Inc.' },
    { ticker: 'KO', name: 'Coca-Cola Co.' },
    { ticker: 'PFE', name: 'Pfizer Inc.' },
    { ticker: 'INTC', name: 'Intel Corporation' },
    { ticker: 'WMT', name: 'Walmart Inc.' },
    { ticker: 'VZ', name: 'Verizon Communications Inc.' },
    { ticker: 'MRK', name: 'Merck & Co. Inc.' },
    { ticker: 'T', name: 'AT&T Inc.' },
    { ticker: 'ORCL', name: 'Oracle Corporation' },
    { ticker: 'IBM', name: 'International Business Machines Corp.' },
    { ticker: 'XOM', name: 'Exxon Mobil Corporation' },
    { ticker: 'CVX', name: 'Chevron Corporation' }
  ];

  const handleCompanyClick = (ticker: string) => {
    // 使用React Router导航到搜索结果页
    navigate(`/search?q=${encodeURIComponent(ticker)}`);
  };

  return (
    <section className="popular-stocks">
      <div className="container">
        <h3 className="section-title">热门US Stocks快捷查询</h3>
        <p className="section-description">点击下方公司快速查看其SEC EDGAR申报文件</p>

        <div className="stocks-grid">
          {popularCompanies.map((company) => (
            <button
              key={company.ticker}
              className="stock-item"
              onClick={() => handleCompanyClick(company.ticker)}
              title={`查询${company.name}的SEC申报文件`}
            >
              <span className="ticker">{company.ticker}</span>
              <span className="company-name">{company.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}