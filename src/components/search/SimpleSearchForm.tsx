import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { SearchFormData } from '../../types/api';
import { useTranslation } from '../../hooks/useTranslation';

type CategoryKey = 'tech' | 'china' | 'finance' | 'retail' | 'healthcare' | 'emerging' | 'cloud';

interface PopularCompany {
  ticker: string;
  name: string;
  category: CategoryKey;
}

// Popular companies used for quick-start suggestions on the homepage
const POPULAR_COMPANIES: PopularCompany[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', category: 'tech' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', category: 'tech' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', category: 'tech' },
  { ticker: 'AMZN', name: 'Amazon.com, Inc.', category: 'tech' },
  { ticker: 'TSLA', name: 'Tesla, Inc.', category: 'tech' },
  { ticker: 'META', name: 'Meta Platforms, Inc.', category: 'tech' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', category: 'tech' },
  { ticker: 'NFLX', name: 'Netflix, Inc.', category: 'tech' },
  { ticker: 'BABA', name: 'Alibaba Group Holding Limited', category: 'china' },
  { ticker: 'JD', name: 'JD.com, Inc.', category: 'china' },
  { ticker: 'BIDU', name: 'Baidu, Inc.', category: 'china' },
  { ticker: 'PDD', name: 'PDD Holdings Inc.', category: 'china' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', category: 'finance' },
  { ticker: 'BAC', name: 'Bank of America Corporation', category: 'finance' },
  { ticker: 'V', name: 'Visa Inc.', category: 'finance' },
  { ticker: 'MA', name: 'Mastercard Incorporated', category: 'finance' },
  { ticker: 'WMT', name: 'Walmart Inc.', category: 'retail' },
  { ticker: 'COST', name: 'Costco Wholesale Corporation', category: 'retail' },
  { ticker: 'NKE', name: 'NIKE, Inc.', category: 'retail' },
  { ticker: 'SBUX', name: 'Starbucks Corporation', category: 'retail' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', category: 'healthcare' },
  { ticker: 'PFE', name: 'Pfizer Inc.', category: 'healthcare' },
  { ticker: 'UNH', name: 'UnitedHealth Group Incorporated', category: 'healthcare' },
  { ticker: 'ABNB', name: 'Airbnb, Inc.', category: 'emerging' },
  { ticker: 'UBER', name: 'Uber Technologies, Inc.', category: 'emerging' },
  { ticker: 'COIN', name: 'Coinbase Global, Inc.', category: 'emerging' },
  { ticker: 'RIVN', name: 'Rivian Automotive, Inc.', category: 'emerging' },
  { ticker: 'SNOW', name: 'Snowflake Inc.', category: 'cloud' },
  { ticker: 'CRWD', name: 'CrowdStrike Holdings, Inc.', category: 'cloud' },
  { ticker: 'PLTR', name: 'Palantir Technologies Inc.', category: 'cloud' }
];

const COPY = {
  en: {
    placeholder: 'Enter company name / ticker / CIK',
    popular: 'Popular picks',
    noMatches: 'No matching company found',
    search: 'Search',
    searching: 'Searching...'
  },
  zh: {
    placeholder: '输入公司名 / 股票代码 / CIK',
    popular: '热门推荐',
    noMatches: '没有找到匹配的公司',
    search: '搜索',
    searching: '搜索中...'
  }
} as const;

const CATEGORY_COPY = {
  tech: {
    en: 'Tech Leaders',
    zh: '科技巨头'
  },
  china: {
    en: 'China ADR',
    zh: '中概股'
  },
  finance: {
    en: 'Financial Institutions',
    zh: '金融银行'
  },
  retail: {
    en: 'Retail & Consumer',
    zh: '零售消费'
  },
  healthcare: {
    en: 'Healthcare',
    zh: '医疗健康'
  },
  emerging: {
    en: 'Emerging Tech',
    zh: '新兴科技'
  },
  cloud: {
    en: 'Cloud Software',
    zh: '云计算软件'
  }
} as const;

const CATEGORY_CLASS: Record<CategoryKey, string> = {
  tech: 'tech',
  china: 'chinese',
  finance: 'finance',
  retail: 'retail',
  healthcare: 'healthcare',
  emerging: 'tech',
  cloud: 'tech'
};

interface SimpleSearchFormProps {
  onSearch: (formData: SearchFormData) => void;
  loading?: boolean;
  className?: string;
}

/**
 * 绠€鍖栫増鎼滅储琛ㄥ崟缁勪欢 - 涓撻棬鐢ㄤ簬棣栭〉
 * 鍙寘鍚悳绱㈡鍜屾悳绱㈡寜閽紝绛涢€夊姛鑳藉湪鎼滅储缁撴灉椤垫彁渚? */
export const SimpleSearchForm: React.FC<SimpleSearchFormProps> = ({
  onSearch,
  loading = false,
  className = ''
}) => {
  const { t, language } = useTranslation();
  const copy = t(COPY);

  const [companyInput, setCompanyInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const query = companyInput.trim().toLowerCase();

    if (query.length === 0) {
      return POPULAR_COMPANIES.slice(0, 8);
    }

    const filtered = POPULAR_COMPANIES.filter((company) =>
      company.ticker.toLowerCase().includes(query) ||
      company.name.toLowerCase().includes(query) ||
      company.ticker.toLowerCase().startsWith(query)
    );

    return filtered
      .sort((a, b) => {
        const aTickerMatch = a.ticker.toLowerCase().startsWith(query);
        const bTickerMatch = b.ticker.toLowerCase().startsWith(query);

        if (aTickerMatch && !bTickerMatch) return -1;
        if (!aTickerMatch && bTickerMatch) return 1;

        return a.ticker.localeCompare(b.ticker);
      })
      .slice(0, 8);
  }, [companyInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        dropdownRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const submitSearch = useCallback(() => {
    if (!companyInput.trim()) {
      return;
    }

    const searchData: SearchFormData = {
      companyInput: companyInput.trim(),
      formType: '',
      dateRange: '',
      startDate: '',
      endDate: ''
    };

    onSearch(searchData);
  }, [companyInput, onSearch]);

  const handleSelect = useCallback((company: PopularCompany) => {
    setCompanyInput(company.ticker);
    setShowSuggestions(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (event.key === 'Enter') {
        submitSearch();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        event.preventDefault();
        if (activeIndex >= 0) {
          handleSelect(suggestions[activeIndex]);
        } else {
          submitSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  }, [showSuggestions, suggestions, activeIndex, submitSearch, handleSelect]);

  const handleInputChange = useCallback((value: string) => {
    setCompanyInput(value);
    setShowSuggestions(true);
    setActiveIndex(-1);
  }, []);

  const handleInputFocus = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    submitSearch();
  }, [submitSearch]);

  return (
    <form onSubmit={handleSubmit} className={`simple-search-form ${className}`}>
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder={copy.placeholder}
            value={companyInput}
            onChange={(event) => handleInputChange(event.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoComplete="off"
            aria-label={copy.placeholder}
          />
          <i className="search-icon fas fa-building"></i>

          {showSuggestions && (
            <div ref={dropdownRef} className="suggestions-dropdown">
              {companyInput.length === 0 && (
                <div className="suggestions-header">
                  <i className="fas fa-star"></i>
                  {copy.popular}
                </div>
              )}

              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.ticker}-${index}`}
                    className={`suggestion-item ${index === activeIndex ? 'selected' : ''}`}
                    onClick={() => handleSelect(suggestion)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <div className="suggestion-content">
                      <div className="suggestion-main">
                        <div className="ticker">{suggestion.ticker}</div>
                        <div className="company-name">{suggestion.name}</div>
                      </div>
                      <div className={`category-tag ${CATEGORY_CLASS[suggestion.category]}`}>
                        {CATEGORY_COPY[suggestion.category][language]}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                companyInput.length > 0 && (
                  <div className="no-suggestions">
                    <i className="fas fa-search"></i>
                    {copy.noMatches}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="search-button"
          disabled={loading || !companyInput.trim()}
        >
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              {copy.searching}
            </>
          ) : (
            <>
              <i className="fas fa-search"></i>
              {copy.search}
            </>
          )}
        </button>
      </div>
    </form>
  );
};





