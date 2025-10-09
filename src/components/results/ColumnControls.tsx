import React, { useState } from 'react';
import { Button } from '../ui';

// 定义可控制的表格列
export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  required?: boolean; // 必须显示的列（如表单类型、操作）
}

interface ColumnControlsProps {
  columns: ColumnConfig[];
  onColumnChange: (columns: ColumnConfig[]) => void;
  className?: string;
}

/**
 * 表格列显示控制组件
 * 允许用户选择显示哪些列，类似官网的 "Show Columns" 功能
 */
export const ColumnControls: React.FC<ColumnControlsProps> = ({
  columns,
  onColumnChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 处理列显示状态切换
  const handleColumnToggle = (columnKey: string) => {
    const updatedColumns = columns.map(col =>
      col.key === columnKey
        ? { ...col, visible: !col.visible }
        : col
    );
    onColumnChange(updatedColumns);
  };

  // 全选/全不选
  const handleSelectAll = () => {
    const allSelected = columns.every(col => col.visible || col.required);
    const updatedColumns = columns.map(col => ({
      ...col,
      visible: col.required ? true : !allSelected
    }));
    onColumnChange(updatedColumns);
  };

  const visibleCount = columns.filter(col => col.visible).length;

  return (
    <div className={`position-relative ${className}`}>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="d-flex align-items-center"
      >
        <i className="fas fa-columns me-2"></i>
        显示列 ({visibleCount}/{columns.length})
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} ms-2`}></i>
      </Button>

      {isOpen && (
        <div className="dropdown-menu show position-absolute top-100 start-0 mt-1 p-3 shadow-lg border"
             style={{ width: '300px', zIndex: 1050 }}>

          {/* 标题和全选按钮 */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">选择显示的列</h6>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSelectAll}
              className="text-decoration-none p-0"
            >
              {columns.every(col => col.visible || col.required) ? '全不选' : '全选'}
            </Button>
          </div>

          {/* 列选择列表 */}
          <div className="max-height-200 overflow-auto">
            {columns.map(column => (
              <div key={column.key} className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`column-${column.key}`}
                  checked={column.visible}
                  disabled={column.required}
                  onChange={() => handleColumnToggle(column.key)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`column-${column.key}`}
                >
                  {column.label}
                  {column.required && (
                    <small className="text-muted ms-1">(必需)</small>
                  )}
                </label>
              </div>
            ))}
          </div>

          {/* 底部按钮 */}
          <div className="border-top pt-3 mt-3">
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-fill"
              >
                应用
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-fill"
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 点击外部关闭 */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1040 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// 默认列配置
export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'formFile', label: 'Form & File', visible: true, required: true },
  { key: 'filingDate', label: '提交日期', visible: true },
  { key: 'reportDate', label: '报告期末', visible: true },
  { key: 'companyName', label: '申报主体/个人', visible: true, required: true },
  { key: 'accessionNumber', label: '接收号', visible: true },
  { key: 'cik', label: 'CIK', visible: true },
  { key: 'location', label: '所在地', visible: true },
  { key: 'incorporated', label: '注册地', visible: true },
  { key: 'fileNumber', label: '文件编号', visible: true },
  { key: 'filmNumber', label: '胶片编号', visible: true },
  { key: 'actions', label: '操作', visible: true, required: true }
];