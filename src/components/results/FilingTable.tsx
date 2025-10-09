import React from 'react';
import { Filing, CompanyInfo } from '../../types/api';
import { DateUtils } from '../../utils/dateUtils';
import { StringUtils } from '../../utils/stringUtils';
import { getFormDescription } from '../../utils/secFormTypes';
import { useTranslation } from '../../hooks/useTranslation';

interface FilingTableProps {
  filings: Filing[];
  companyInfo: CompanyInfo;
  onViewDetails: (cik: string, accessionNumber: string) => void;
  onDownload: (cik: string, accessionNumber: string) => void;
  loading?: boolean;
  className?: string;
}

const TABLE_HEADERS = {
  en: [
    'Form & File',
    'Filing Date',
    'Report End Date',
    'Registrant',
    'Accession No.',
    'CIK',
    'Location',
    'Incorporation',
    'File Number',
    'Film Number',
    'Actions'
  ],
  zh: [
    'Form & File',
    '提交日期',
    '报告期末',
    '申报主体/个人',
    '接收号',
    'CIK',
    '所在地',
    '注册州',
    '文件编号',
    '胶片编号',
    '操作'
  ]
} as const;

const EMPTY_STATE = {
  en: {
    title: 'No filings available',
    description: 'Try adjusting the filters or search for another company.'
  },
  zh: {
    title: '暂无申报文件',
    description: '请尝试调整搜索条件或更换公司。'
  }
} as const;

const ACTION_TEXTS = {
  en: {
    view: 'View',
    download: 'Download',
    viewTitle: 'Open filing details',
    downloadTitle: 'Download filing'
  },
  zh: {
    view: '查看',
    download: '下载',
    viewTitle: '查看详情',
    downloadTitle: '下载文件'
  }
} as const;

const BADGE_CLASS_MAP: Record<string, string> = {
  success: 'badge-success',
  primary: 'badge-primary'
};

/**
 * 苹果质感申报文件表格组件
 * 根据语言展示不同的列标题与操作按钮
 */
export const FilingTable: React.FC<FilingTableProps> = ({
  filings,
  companyInfo,
  onViewDetails,
  onDownload,
  loading = false,
  className = ''
}) => {
  const { t, language } = useTranslation();
  const headers = t(TABLE_HEADERS);
  const emptyCopy = t(EMPTY_STATE);
  const actionCopy = t(ACTION_TEXTS);

  if (!filings || filings.length === 0) {
    return (
      <div className={`empty-state ${className}`}>
        <div className="empty-icon">
          <i className="fas fa-file-alt"></i>
        </div>
        <h3 className="empty-title">{emptyCopy.title}</h3>
        <p className="empty-description">{emptyCopy.description}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <table className="table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
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
              language={language}
              actionCopy={actionCopy}
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
  loading: boolean;
  language: 'en' | 'zh';
  actionCopy: typeof ACTION_TEXTS['en'];
}

/**
 * 申报文件表格行
 * 调整展示内容以匹配当前语言
 */
const FilingTableRow: React.FC<FilingTableRowProps> = ({
  filing,
  companyInfo,
  onViewDetails,
  onDownload,
  loading,
  language,
  actionCopy
}) => {
  const handleViewDetails = () => {
    onViewDetails(companyInfo.cik, filing.accessionNumber);
  };

  const handleDownload = () => {
    onDownload(companyInfo.cik, filing.accessionNumber);
  };

  const fallbackLabel = language === 'zh' ? '暂无数据' : 'Unavailable';
  const formLabel = language === 'zh'
    ? getFormDescription(filing.form)
    : filing.form || fallbackLabel;

  return (
    <tr className="slide-in">
      <td>
        <span className={`badge ${BADGE_CLASS_MAP.primary}`}>
          {formLabel}
        </span>
      </td>
      <td>
        <span className={`badge ${BADGE_CLASS_MAP.success}`}>
          {DateUtils.formatDate(filing.filingDate)}
        </span>
      </td>
      <td>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {filing.reportDate ? DateUtils.formatDate(filing.reportDate) : '-'}
        </span>
      </td>
      <td>
        <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
          {StringUtils.truncateText(companyInfo.name || '', 30)}
        </div>
      </td>
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
      <td>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {companyInfo.addresses?.business
            ? `${companyInfo.addresses.business.city}, ${companyInfo.addresses.business.stateOrCountry}`
            : companyInfo.addresses?.mailing
            ? `${companyInfo.addresses.mailing.city}, ${companyInfo.addresses.mailing.stateOrCountry}`
            : '-'}
        </span>
      </td>
      <td>
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {companyInfo.stateOfIncorporationDescription || companyInfo.stateOfIncorporation || '-'}
        </span>
      </td>
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
      <td>
        <div className="flex gap-2">
          <button
            className="btn btn-outline btn-sm"
            onClick={handleViewDetails}
            disabled={loading}
            title={actionCopy.viewTitle}
          >
            <i className="fas fa-eye"></i>
            {actionCopy.view}
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleDownload}
            disabled={loading}
            title={actionCopy.downloadTitle}
          >
            <i className="fas fa-download"></i>
            {actionCopy.download}
          </button>
        </div>
      </td>
    </tr>
  );
};
