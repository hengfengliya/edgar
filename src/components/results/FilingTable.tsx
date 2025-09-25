import React from 'react';
import { Filing, CompanyInfo } from '../../types/api';
import { DateUtils } from '../../utils/dateUtils';
import { StringUtils } from '../../utils/stringUtils';
import { getFormDescription } from '../../utils/secFormTypes';

interface FilingTableProps {
  filings: Filing[];
  companyInfo: CompanyInfo;
  onViewDetails: (cik: string, accessionNumber: string) => void;
  onDownload: (cik: string, accessionNumber: string) => void;
  loading?: boolean;
  className?: string;
}

/**
 * 苹果质感申报文件表格组件
 * 显示申报文件列表和操作按钮
 */
export const FilingTable: React.FC<FilingTableProps> = ({
  filings,
  companyInfo,
  onViewDetails,
  onDownload,
  loading = false,
  className = ''
}) => {
  if (!filings || filings.length === 0) {
    return (
      <div className={`empty-state ${className}`}>
        <div className="empty-icon">
          <i className="fas fa-file-alt"></i>
        </div>
        <h3 className="empty-title">暂无申报文件</h3>
        <p className="empty-description">请尝试调整搜索条件</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <table className="table">
        <thead>
          <tr>
            <th>Form & File</th>
            <th>提交日期</th>
            <th>报告期末</th>
            <th>申报主体/个人</th>
            <th>接收号</th>
            <th>CIK</th>
            <th>所在地</th>
            <th>注册地</th>
            <th>文件编号</th>
            <th>胶片编号</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filings.map((filing, index) => (
            <FilingTableRow
              key={`${filing.accessionNumber}-${index}`}
              filing={filing}
              companyInfo={companyInfo}
              onViewDetails={onViewDetails}
              onDownload={onDownload}
              loading={loading}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface FilingTableRowProps {
  filing: Filing;
  companyInfo: CompanyInfo;
  onViewDetails: (cik: string, accessionNumber: string) => void;
  onDownload: (cik: string, accessionNumber: string) => void;
  loading?: boolean;
}

/**
 * 苹果质感申报文件表格行组件
 */
const FilingTableRow: React.FC<FilingTableRowProps> = ({
  filing,
  companyInfo,
  onViewDetails,
  onDownload,
  loading = false
}) => {
  const handleViewDetails = () => {
    onViewDetails(companyInfo.cik, filing.accessionNumber);
  };

  const handleDownload = () => {
    onDownload(companyInfo.cik, filing.accessionNumber);
  };

  return (
    <tr className="slide-in">
      {/* Form & File */}
      <td>
        <span className="badge badge-primary">
          {getFormDescription(filing.form)}
        </span>
      </td>

      {/* 提交日期 */}
      <td>
        <span className="badge badge-success">
          {DateUtils.formatDate(filing.filingDate)}
        </span>
      </td>

      {/* 报告期末 */}
      <td>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {filing.reportDate ? DateUtils.formatDate(filing.reportDate) : '-'}
        </span>
      </td>

      {/* 申报主体/个人 */}
      <td>
        <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
          {StringUtils.truncateText(companyInfo.name || '', 30)}
        </div>
      </td>

      {/* 接收号 */}
      <td>
        <code
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-tertiary)',
            background: 'var(--color-surface-secondary)',
            padding: 'var(--space-1) var(--space-2)',
            borderRadius: 'var(--radius-small)',
            border: '1px solid var(--color-border)'
          }}
        >
          {filing.accessionNumber}
        </code>
      </td>

      {/* CIK */}
      <td>
        <code
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-tertiary)',
            background: 'var(--color-surface-secondary)',
            padding: 'var(--space-1) var(--space-2)',
            borderRadius: 'var(--radius-small)',
            border: '1px solid var(--color-border)'
          }}
        >
          {companyInfo.cik}
        </code>
      </td>

      {/* 所在地 */}
      <td>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {companyInfo.addresses?.business
            ? `${companyInfo.addresses.business.city}, ${companyInfo.addresses.business.stateOrCountry}`
            : companyInfo.addresses?.mailing
            ? `${companyInfo.addresses.mailing.city}, ${companyInfo.addresses.mailing.stateOrCountry}`
            : '-'
          }
        </span>
      </td>

      {/* 注册地 */}
      <td>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {companyInfo.stateOfIncorporationDescription || companyInfo.stateOfIncorporation || '-'}
        </span>
      </td>

      {/* 文件编号 */}
      <td>
        <code
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-tertiary)',
            background: 'var(--color-surface-secondary)',
            padding: 'var(--space-1) var(--space-2)',
            borderRadius: 'var(--radius-small)',
            border: '1px solid var(--color-border)'
          }}
        >
          {filing.fileNumber || '-'}
        </code>
      </td>

      {/* 胶片编号 */}
      <td>
        <code
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-tertiary)',
            background: 'var(--color-surface-secondary)',
            padding: 'var(--space-1) var(--space-2)',
            borderRadius: 'var(--radius-small)',
            border: '1px solid var(--color-border)'
          }}
        >
          {filing.filmNumber || '-'}
        </code>
      </td>

      {/* 操作按钮 */}
      <td>
        <div className="flex gap-2">
          <button
            className="btn btn-outline btn-sm"
            onClick={handleViewDetails}
            disabled={loading}
            title="查看详情"
          >
            <i className="fas fa-eye"></i>
            查看
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleDownload}
            disabled={loading}
            title="下载文件"
          >
            <i className="fas fa-download"></i>
            下载
          </button>
        </div>
      </td>
    </tr>
  );
};