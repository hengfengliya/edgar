import React, { useState, useCallback } from 'react';
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
  }, [errors.length]);

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

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* 公司搜索框 */}
        <div className="form-group">
          <label htmlFor="companyInput" className="form-label">
            公司名称或股票代码
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              id="companyInput"
              placeholder="例如: TSLA, Apple, BABA, Microsoft"
              value={formData.companyInput}
              onChange={(e) => handleInputChange('companyInput', e.target.value)}
              disabled={loading}
              style={{ paddingLeft: '44px' }}
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
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
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

        {/* 自定义日期范围 */}
        {formData.dateRange === 'custom' && (
          <>
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
          </>
        )}
      </div>

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