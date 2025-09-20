import React, { useState, useCallback } from 'react';
import { Card, Button } from '../ui';
import { SearchFormData } from '../../types/api';
import { ValidationUtils } from '../../utils/validationUtils';
import { getAllFormTypes } from '../../utils/secFormTypes';

interface SearchFormProps {
  onSearch: (formData: SearchFormData) => void;
  loading?: boolean;
  className?: string;
}

/**
 * 搜索表单组件
 * 提供公司搜索和筛选条件输入功能
 */
export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading = false,
  className = ''
}) => {
  // 获取所有表单类型
  const formTypes = getAllFormTypes();
  // 只显示主要的表单类型
  const majorFormTypes = formTypes.slice(0, 20);

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
    <Card
      title="搜索公司申报文件"
      className={className}
    >
      <form onSubmit={handleSubmit}>
        {/* 错误提示 */}
        {errors.length > 0 && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {errors.join('；')}
          </div>
        )}

        <div className="row">
          {/* 公司搜索框 */}
          <div className="col-md-6 mb-3">
            <label htmlFor="companyInput" className="form-label">
              公司名称或股票代码
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-building"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="companyInput"
                placeholder="例如: TSLA, Apple, BABA, Microsoft"
                value={formData.companyInput}
                onChange={(e) => handleInputChange('companyInput', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* 表单类型筛选 */}
          <div className="col-md-3 mb-3">
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
              {majorFormTypes.map(({ code, description }) => (
                <option key={code} value={code}>
                  {code} ({description})
                </option>
              ))}
            </select>
          </div>

          {/* 时间范围 */}
          <div className="col-md-3 mb-3">
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
          <div className="row">
            <div className="col-md-3 mb-3">
              <label htmlFor="startDate" className="form-label">
                开始日期
              </label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="endDate" className="form-label">
                结束日期
              </label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="row">
          <div className="col-12">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon="fas fa-search"
              className="me-2"
            >
              搜索
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              size="lg"
              onClick={handleClear}
              icon="fas fa-times"
              disabled={loading}
            >
              清空
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};