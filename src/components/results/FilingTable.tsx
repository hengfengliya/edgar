import React from 'react';
import { Filing, CompanyInfo } from '../../types/api';
import { DateUtils } from '../../utils/dateUtils';
import { StringUtils } from '../../utils/stringUtils';
import { getFormDescription } from '../../utils/secFormTypes';
import { Button } from '../ui';

interface FilingTableProps {
  filings: Filing[];
  companyInfo: CompanyInfo;
  onViewDetails: (cik: string, accessionNumber: string) => void;
  onDownload: (cik: string, accessionNumber: string) => void;
  loading?: boolean;
  className?: string;
}

/**
 * 申报文件表格组件
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
      <div className={`text-center py-5 ${className}`}>
        <i className="fas fa-search fa-3x text-muted mb-3"></i>
        <h4 className="text-muted">暂无申报文件</h4>
        <p className="text-muted">请尝试调整搜索条件</p>
      </div>
    );
  }

  return (
    <div className={`table-responsive ${className}`}>
      <table className="table table-hover mb-0">
        <thead className="table-light">
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
 * 申报文件表格行组件
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
    <tr>
      {/* Form & File */}
      <td>
        <div>
          <span className="badge bg-primary mb-1 d-block">
            {getFormDescription(filing.form)}
          </span>
          <small className="text-muted">
            {filing.form}
          </small>
        </div>
      </td>

      {/* 提交日期 */}
      <td>
        <span className="badge bg-secondary">
          {DateUtils.formatDate(filing.filingDate)}
        </span>
      </td>

      {/* 报告期末 */}
      <td>
        {filing.reportDate ? DateUtils.formatDate(filing.reportDate) : '-'}
      </td>

      {/* 申报主体/个人 */}
      <td>
        <div>
          <div>{StringUtils.truncateText(companyInfo.name || '', 30)}</div>
        </div>
      </td>

      {/* 接收号 */}
      <td>
        <small className="text-muted font-monospace">
          {filing.accessionNumber}
        </small>
      </td>

      {/* CIK */}
      <td>
        <code className="small text-muted">
          {companyInfo.cik}
        </code>
      </td>

      {/* 所在地 */}
      <td>
        <span className="small text-muted">
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
        <span className="small text-muted">
          {companyInfo.stateOfIncorporationDescription || companyInfo.stateOfIncorporation || '-'}
        </span>
      </td>

      {/* 文件编号 */}
      <td>
        <code className="small text-muted">
          {filing.fileNumber || '-'}
        </code>
      </td>

      {/* 胶片编号 */}
      <td>
        <code className="small text-muted">
          {filing.filmNumber || '-'}
        </code>
      </td>

      {/* 操作按钮 */}
      <td>
        <div className="btn-group btn-group-sm">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleViewDetails}
            disabled={loading}
            icon="fas fa-eye"
            title="查看详情"
          >
            查看
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleDownload}
            disabled={loading}
            icon="fas fa-download"
            title="下载文件"
          >
            下载
          </Button>
        </div>
      </td>
    </tr>
  );
};