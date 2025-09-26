import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { SearchFormData } from '../../types/api';

interface SimpleSearchFormProps {
  onSearch: (formData: SearchFormData) => void;
  loading?: boolean;
  className?: string;
}

/**
 * 简化版搜索表单组件 - 专门用于首页
 * 只包含搜索框和搜索按钮，筛选功能在搜索结果页提供
 */
export const SimpleSearchForm: React.FC<SimpleSearchFormProps> = ({
  onSearch,
  loading = false,
  className = ''
}) => {
  // 表单状态
  const [companyInput, setCompanyInput] = useState('');

  // 自动完成相关状态
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 热门推荐公司列表
  const popularCompanies = useMemo(() => [
    { ticker: 'AAPL', name: 'Apple Inc.', category: '科技巨头' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', category: '科技巨头' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', category: '科技巨头' },
    { ticker: 'AMZN', name: 'Amazon.com, Inc.', category: '科技巨头' },
    { ticker: 'TSLA', name: 'Tesla, Inc.', category: '科技巨头' },
    { ticker: 'META', name: 'Meta Platforms, Inc.', category: '科技巨头' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', category: '科技巨头' },
    { ticker: 'NFLX', name: 'Netflix, Inc.', category: '科技巨头' },
    { ticker: 'BABA', name: 'Alibaba Group Holding Limited', category: '中概股' },
    { ticker: 'JD', name: 'JD.com, Inc.', category: '中概股' },
    { ticker: 'BIDU', name: 'Baidu, Inc.', category: '中概股' },
    { ticker: 'PDD', name: 'PDD Holdings Inc.', category: '中概股' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.', category: '金融银行' },
    { ticker: 'BAC', name: 'Bank of America Corporation', category: '金融银行' },
    { ticker: 'V', name: 'Visa Inc.', category: '金融银行' },
    { ticker: 'MA', name: 'Mastercard Incorporated', category: '金融银行' },
    { ticker: 'WMT', name: 'Walmart Inc.', category: '零售消费' },
    { ticker: 'COST', name: 'Costco Wholesale Corporation', category: '零售消费' },
    { ticker: 'NKE', name: 'NIKE, Inc.', category: '零售消费' },
    { ticker: 'SBUX', name: 'Starbucks Corporation', category: '零售消费' },
    { ticker: 'JNJ', name: 'Johnson & Johnson', category: '医疗健康' },
    { ticker: 'PFE', name: 'Pfizer Inc.', category: '医疗健康' },
    { ticker: 'UNH', name: 'UnitedHealth Group Incorporated', category: '医疗健康' },
    { ticker: 'ABNB', name: 'Airbnb, Inc.', category: '新兴科技' },
    { ticker: 'UBER', name: 'Uber Technologies, Inc.', category: '新兴科技' },
    { ticker: 'COIN', name: 'Coinbase Global, Inc.', category: '新兴科技' },
    { ticker: 'RIVN', name: 'Rivian Automotive, Inc.', category: '新兴科技' },
    { ticker: 'SNOW', name: 'Snowflake Inc.', category: '云计算软件' },
    { ticker: 'CRWD', name: 'CrowdStrike Holdings, Inc.', category: '云计算软件' },
    { ticker: 'PLTR', name: 'Palantir Technologies Inc.', category: '云计算软件' }
  ], []);

  // 根据输入内容筛选建议
  const suggestions = useMemo(() => {
    const query = companyInput.toLowerCase().trim();

    if (query.length === 0) {
      // 没有输入时显示热门推荐
      return popularCompanies.slice(0, 8);
    }

    if (query.length < 1) {
      return [];
    }

    // 搜索匹配的公司
    const filtered = popularCompanies.filter(company =>
      company.ticker.toLowerCase().includes(query) ||
      company.name.toLowerCase().includes(query) ||
      company.ticker.toLowerCase().startsWith(query)
    );

    // 按匹配度排序
    return filtered.sort((a, b) => {
      const aTickerMatch = a.ticker.toLowerCase().startsWith(query);
      const bTickerMatch = b.ticker.toLowerCase().startsWith(query);

      if (aTickerMatch && !bTickerMatch) return -1;
      if (!aTickerMatch && bTickerMatch) return 1;

      return a.ticker.localeCompare(b.ticker);
    }).slice(0, 8);
  }, [companyInput, popularCompanies]);

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 处理键盘导航
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(suggestions[selectedSuggestionIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, selectedSuggestionIndex]);

  // 选择建议项
  const selectSuggestion = useCallback((suggestion: typeof suggestions[0]) => {
    setCompanyInput(suggestion.ticker);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  }, []);

  // 处理输入变化
  const handleInputChange = useCallback((value: string) => {
    setCompanyInput(value);
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
  }, []);

  // 处理输入框聚焦
  const handleInputFocus = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  // 获取分类对应的CSS类名
  const getCategoryClass = useCallback((category: string) => {
    switch (category) {
      case '科技巨头':
      case '云计算软件':
      case '新兴科技':
        return 'tech';
      case '金融银行':
        return 'finance';
      case '零售消费':
        return 'retail';
      case '医疗健康':
        return 'healthcare';
      case '中概股':
        return 'chinese';
      default:
        return '';
    }
  }, []);

  // 处理表单提交
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // 检查是否有输入
    if (!companyInput.trim()) {
      return;
    }

    // 构造搜索数据
    const searchData: SearchFormData = {
      companyInput: companyInput.trim(),
      formType: '',
      dateRange: '',
      startDate: '',
      endDate: ''
    };

    // 提交搜索
    onSearch(searchData);
  }, [companyInput, onSearch]);

  return (
    <form onSubmit={handleSubmit} className={`simple-search-form ${className}`}>
      <div className="search-input-container">
        {/* 公司搜索框 - 带自动完成 */}
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="输入公司名 / 股票代码 / CIK"
            value={companyInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoComplete="off"
          />
          <i className="search-icon fas fa-building"></i>

          {/* 下拉建议列表 */}
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="suggestions-dropdown">
              {companyInput.length === 0 && (
                <div className="suggestions-header">
                  <i className="fas fa-star"></i>
                  热门推荐
                </div>
              )}

              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.ticker}-${index}`}
                  className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                  onClick={() => selectSuggestion(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  <div className="suggestion-content">
                    <div className="suggestion-main">
                      <div className="ticker">{suggestion.ticker}</div>
                      <div className="company-name">{suggestion.name}</div>
                    </div>
                    <div className={`category-tag ${getCategoryClass(suggestion.category)}`}>
                      {suggestion.category}
                    </div>
                  </div>
                </div>
              ))}

              {companyInput.length > 0 && suggestions.length === 0 && (
                <div className="no-suggestions">
                  <i className="fas fa-search"></i>
                  没有找到匹配的公司
                </div>
              )}
            </div>
          )}
        </div>

        {/* 搜索按钮 */}
        <button
          type="submit"
          className="search-button"
          disabled={loading || !companyInput.trim()}
        >
          {loading ? (
            <>
              <div className="loading-spinner"></div>
              搜索中
            </>
          ) : (
            <>
              <i className="fas fa-search"></i>
              搜索
            </>
          )}
        </button>
      </div>
    </form>
  );
};