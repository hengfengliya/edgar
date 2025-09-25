import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { SearchFormData } from '../../types/api';
import { ValidationUtils } from '../../utils/validationUtils';
import { getAllFormTypes } from '../../utils/secFormTypes';

interface SearchFormProps {
  onSearch: (formData: SearchFormData) => void;
  loading?: boolean;
  className?: string;
}

/**
 * 苹果质感搜索表单组件
 * 提供公司搜索和筛选条件输入功能
 */
export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading = false,
  className = ''
}) => {
  // 获取所有表单类型
  const formTypes = getAllFormTypes();
  // 显示所有表单类型
  const allFormTypes = formTypes;

  // 表单状态
  const [formData, setFormData] = useState<SearchFormData>({
    companyInput: '',
    formType: '',
    dateRange: '',
    startDate: '',
    endDate: ''
  });

  // 验证错误状态
  const [errors, setErrors] = useState<string[]>([]);

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
    const query = formData.companyInput.toLowerCase().trim();

    if (query.length === 0) {
      // 没有输入时显示热门推荐
      return popularCompanies.slice(0, 10);
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
  }, [formData.companyInput, popularCompanies]);

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
    setFormData(prev => ({
      ...prev,
      companyInput: suggestion.ticker
    }));
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  }, []);

  // 处理输入变化
  const handleInputChange = useCallback((
    field: keyof SearchFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除之前的错误
    if (errors.length > 0) {
      setErrors([]);
    }

    // 处理公司输入框的特殊逻辑
    if (field === 'companyInput') {
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    }
  }, [errors.length]);

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

  // 处理日期范围变化
  const handleDateRangeChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      dateRange: value,
      // 当选择非自定义选项时，清空自定义日期
      startDate: value === 'custom' ? prev.startDate : '',
      endDate: value === 'custom' ? prev.endDate : ''
    }));
  }, []);

  // 处理表单提交
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单
    const validation = ValidationUtils.validateSearchForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // 提交搜索
    onSearch(formData);
  }, [formData, onSearch]);

  // 清空表单
  const handleClear = useCallback(() => {
    setFormData({
      companyInput: '',
      formType: '',
      dateRange: '',
      startDate: '',
      endDate: ''
    });
    setErrors([]);
  }, []);

  return (
    <form onSubmit={handleSubmit} className={`slide-in ${className}`}>
      {/* 错误提示 */}
      {errors.length > 0 && (
        <div className="alert alert-error mb-6">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{errors.join('；')}</span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* 公司搜索框 - 带自动完成 */}
        <div className="form-group">
          <label htmlFor="companyInput" className="form-label">
            公司名称或股票代码
          </label>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              className="form-input"
              id="companyInput"
              placeholder="例如: TSLA, Apple, BABA, Microsoft"
              value={formData.companyInput}
              onChange={(e) => handleInputChange('companyInput', e.target.value)}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ paddingLeft: '44px' }}
              autoComplete="off"
            />
            <i
              className="fas fa-building"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-tertiary)',
                fontSize: '14px'
              }}
            />

            {/* 下拉建议列表 */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="suggestions-dropdown"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  maxHeight: '320px',
                  overflowY: 'auto',
                  marginTop: '4px'
                }}
              >
                {formData.companyInput.length === 0 && (
                  <div className="suggestions-header" style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: '#666',
                    backgroundColor: '#f8f9fa',
                    borderBottom: '1px solid #e9ecef',
                    fontWeight: '500'
                  }}>
                    <i className="fas fa-star" style={{ marginRight: '6px', color: '#ffc107' }}></i>
                    热门推荐
                  </div>
                )}

                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.ticker}-${index}`}
                    className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                    onClick={() => selectSuggestion(suggestion)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: index < suggestions.length - 1 ? '1px solid #f1f3f4' : 'none',
                      backgroundColor: index === selectedSuggestionIndex ? '#f0f8ff' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1 }}>
                        <div className="ticker" style={{
                          fontWeight: '600',
                          color: '#007aff',
                          fontSize: '14px',
                          marginBottom: '2px',
                          fontFamily: "'Monaco', 'Menlo', monospace"
                        }}>
                          {suggestion.ticker}
                        </div>
                        <div className="company-name" style={{
                          color: '#666',
                          fontSize: '12px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {suggestion.name}
                        </div>
                      </div>
                      <div className={`category-tag ${getCategoryClass(suggestion.category)}`} style={{
                        fontSize: '11px',
                        color: '#888',
                        backgroundColor: '#f8f9fa',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginLeft: '8px',
                        flexShrink: 0
                      }}>
                        {suggestion.category}
                      </div>
                    </div>
                  </div>
                ))}

                {formData.companyInput.length > 0 && suggestions.length === 0 && (
                  <div style={{
                    padding: '16px',
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '13px'
                  }}>
                    <i className="fas fa-search" style={{ marginRight: '6px' }}></i>
                    没有找到匹配的公司
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 表单类型筛选 */}
        <div className="form-group">
          <label htmlFor="formType" className="form-label">
            表单类型
          </label>
          <select
            className="form-select"
            id="formType"
            value={formData.formType}
            onChange={(e) => handleInputChange('formType', e.target.value)}
            disabled={loading}
          >
            <option value="">全部类型</option>
            {allFormTypes.map(({ code, description }) => (
              <option key={code} value={code}>
                {code} ({description})
              </option>
            ))}
          </select>
        </div>

        {/* 时间范围 */}
        <div className="form-group">
          <label htmlFor="dateRange" className="form-label">
            时间范围
          </label>
          <select
            className="form-select"
            id="dateRange"
            value={formData.dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            disabled={loading}
          >
            <option value="">不限制</option>
            <option value="30">最近30天</option>
            <option value="90">最近3个月</option>
            <option value="365">最近1年</option>
            <option value="custom">自定义日期</option>
          </select>
        </div>
      </div>

      {/* 自定义日期范围 */}
      {formData.dateRange === 'custom' && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">
              开始日期
            </label>
            <input
              type="date"
              className="form-input"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate" className="form-label">
              结束日期
            </label>
            <input
              type="date"
              className="form-input"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: '16px', height: '16px', marginBottom: 0 }}></div>
              搜索中...
            </>
          ) : (
            <>
              <i className="fas fa-search"></i>
              搜索
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={handleClear}
          disabled={loading}
        >
          <i className="fas fa-times"></i>
          清空
        </button>
      </div>
    </form>
  );
};