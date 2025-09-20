import React from 'react';
import { Filing, CompanyInfo } from '../../types/api';
import { Button } from '../ui';
import { DateUtils } from '../../utils/dateUtils';
import { getFormDescription } from '../../utils/secFormTypes';

interface ExportControlsProps {
  filings: Filing[];
  companyInfo: CompanyInfo;
  className?: string;
}

/**
 * 导出功能组件
 * 提供CSV导出功能，类似官网的导出按钮
 */
export const ExportControls: React.FC<ExportControlsProps> = ({
  filings,
  companyInfo,
  className = ''
}) => {

  // 生成CSV内容
  const generateCSV = (): string => {
    // CSV表头
    const headers = [
      'Form & File',
      '提交日期',
      '公司名称',
      '报告期末',
      '接收号',
      'CIK',
      '所在地',
      '注册地',
      '文件编号',
      '胶片编号'
    ];

    // CSV行数据
    const rows = filings.map(filing => {
      const location = companyInfo.addresses?.business
        ? `${companyInfo.addresses.business.city}, ${companyInfo.addresses.business.stateOrCountry}`
        : companyInfo.addresses?.mailing
        ? `${companyInfo.addresses.mailing.city}, ${companyInfo.addresses.mailing.stateOrCountry}`
        : '';

      return [
        `${filing.form} - ${getFormDescription(filing.form)}`,
        DateUtils.formatDate(filing.filingDate),
        companyInfo.name,
        filing.reportDate ? DateUtils.formatDate(filing.reportDate) : '',
        filing.accessionNumber,
        companyInfo.cik,
        location,
        companyInfo.stateOfIncorporationDescription || companyInfo.stateOfIncorporation || '',
        filing.fileNumber || '',
        filing.filmNumber || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`); // 转义CSV中的引号
    });

    // 组合CSV内容
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  };

  // 下载CSV文件
  const downloadCSV = () => {
    try {
      const csvContent = generateCSV();
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' }); // 添加BOM支持中文
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `SEC_EDGAR_${companyInfo.name}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log(`CSV导出成功: ${filings.length} 条记录`);
    } catch (error) {
      console.error('CSV导出失败:', error);
      alert('导出失败，请重试');
    }
  };

  return (
    <div className={className}>
      <Button
        variant="success"
        size="sm"
        onClick={downloadCSV}
        disabled={!filings || filings.length === 0}
        icon="fas fa-download"
        title={`导出 ${filings.length} 条记录到CSV`}
      >
        导出CSV
      </Button>
    </div>
  );
};

/**
 * 结果统计显示组件
 */
interface ResultStatsProps {
  totalCount: number;
  companyName: string;
  className?: string;
}

export const ResultStats: React.FC<ResultStatsProps> = ({
  totalCount,
  companyName,
  className = ''
}) => {
  return (
    <div className={`alert alert-success d-flex align-items-center ${className}`}>
      <i className="fas fa-check-circle me-2"></i>
      <span>
        找到 <strong>{totalCount}</strong> 条申报记录
        {companyName && (
          <>（搜索: <strong>{companyName}</strong>）</>
        )}
      </span>
    </div>
  );
};