import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

const POPULAR_COMPANIES = [
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

const COPY = {
  en: {
    title: 'Popular US Stocks Shortcuts',
    description: 'Click any company to see its SEC EDGAR filings instantly',
    tooltipPrefix: 'View SEC filings for'
  },
  zh: {
    title: '热门 US Stocks 快捷查询',
    description: '点击下方公司即可快速查看对应的 SEC EDGAR 申报文件',
    tooltipPrefix: '查询'
  }
} as const;

/**
 * 热门股票快捷入口组件
 * 提供 30 个热门美股公司的快捷搜索入口，提升用户体验
 */
export function PopularStocks() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const copy = t(COPY);

  const handleCompanyClick = (ticker: string) => {
    navigate(`/search?q=${encodeURIComponent(ticker)}`);
  };

  return (
    <section className="popular-stocks">
      <div className="container">
        <h3 className="section-title">{copy.title}</h3>
        <p className="section-description">{copy.description}</p>

        <div className="stocks-grid">
          {POPULAR_COMPANIES.map((company) => {
            const tooltip =
              language === 'en'
                ? `${copy.tooltipPrefix} ${company.name}`
                : `${copy.tooltipPrefix}${company.name}的 SEC 申报文件`;

            return (
              <button
                key={company.ticker}
                className="stock-item"
                onClick={() => handleCompanyClick(company.ticker)}
                title={tooltip}
              >
                <span className="ticker">{company.ticker}</span>
                <span className="company-name">{company.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
