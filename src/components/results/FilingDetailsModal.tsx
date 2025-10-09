import React from 'react';
import { FilingDetails } from '../../types/api';
import { FileUtils } from '../../utils/fileUtils';
import { useTranslation } from '../../hooks/useTranslation';

interface FilingDetailsModalProps {
  details: FilingDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadFile: (url: string, filename: string) => void;
  onOpenFile: (url: string, filename: string) => void;
  loading?: boolean;
}

const MODAL_COPY = {
  en: {
    title: 'Filing Details',
    close: 'Close',
    accession: 'Accession No.',
    totalFiles: (count: number) => `Total files: ${count}`,
    listTitle: 'Files',
    table: {
      name: 'Filename',
      type: 'Type',
      size: 'Size',
      actions: 'Actions'
    },
    view: 'View',
    download: 'Download',
    copyLink: 'Copy link',
    copySuccess: 'File link copied to clipboard.',
    copyFail: 'Failed to copy the link.',
    viewTitle: (name: string) => `Open ${name}`,
    downloadTitle: (name: string) => `Download ${name}`,
    copyTitle: (name: string) => `Copy download link for ${name}`,
    primary: 'Primary document'
  },
  zh: {
    title: '文件详情',
    close: '关闭',
    accession: '接收号',
    totalFiles: (count: number) => `共 ${count} 个文件`,
    listTitle: '文件列表',
    table: {
      name: '文件名',
      type: '类型',
      size: '大小',
      actions: '操作'
    },
    view: '查看',
    download: '下载',
    copyLink: '复制链接',
    copySuccess: '文件链接已复制到剪贴板。',
    copyFail: '复制链接失败，请重试。',
    viewTitle: (name: string) => `打开 ${name}`,
    downloadTitle: (name: string) => `下载 ${name}`,
    copyTitle: (name: string) => `复制 ${name} 的下载链接`,
    primary: '主要文档'
  }
} as const;

/**
 * 申报文件详情模态框
 * 展示申报文件的附件列表，支持查看与下载
 */
export const FilingDetailsModal: React.FC<FilingDetailsModalProps> = ({
  details,
  isOpen,
  onClose,
  onDownloadFile,
  onOpenFile,
  loading = false
}) => {
  const { t } = useTranslation();
  const copy = t(MODAL_COPY);

  if (!isOpen || !details) {
    return null;
  }

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleDownloadFile = (url: string, filename: string) => {
    onDownloadFile(url, filename);
  };

  const handleOpenFile = (url: string, filename: string) => {
    onOpenFile(url, filename);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert(copy.copySuccess);
    }).catch(() => {
      alert(copy.copyFail);
    });
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content fade-in">
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-file-alt" style={{ marginRight: 'var(--space-3)' }}></i>
            {copy.title}
          </h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label={copy.close}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-6">
            <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
              {copy.accession}：
              <code
                style={{
                  marginLeft: 'var(--space-2)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-tertiary)',
                  background: 'var(--color-surface-secondary)',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-small)',
                  border: '1px solid var(--color-border)'
                }}
              >
                {details.accessionNumber}
              </code>
            </h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              {copy.totalFiles(details.totalFiles)}
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
              {copy.listTitle}
            </h4>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>{copy.table.name}</th>
                    <th>{copy.table.type}</th>
                    <th>{copy.table.size}</th>
                    <th>{copy.table.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {details.files.map((file, index) => (
                    <tr key={`${file.name}-${index}`} className="slide-in">
                      <td>
                        <div className="flex items-center gap-2">
                          <i
                            className={FileUtils.getFileIcon(file.name)}
                            style={{
                              color: 'var(--color-text-tertiary)',
                              fontSize: 'var(--font-size-sm)'
                            }}
                          ></i>
                          <span
                            title={file.name}
                            style={{
                              color: 'var(--color-text-primary)',
                              fontSize: 'var(--font-size-sm)'
                            }}
                          >
                            {file.name.length > 50
                              ? `${file.name.substring(0, 50)}...`
                              : file.name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-xs)'
                        }}>
                          {FileUtils.getFileTypeDescription(file.name)}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-xs)'
                        }}>
                          {FileUtils.formatFileSize(file.size)}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleOpenFile(file.downloadUrl, file.name)}
                            disabled={loading}
                            title={copy.viewTitle(file.name)}
                          >
                            <i className="fas fa-external-link-alt"></i>
                            {copy.view}
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleDownloadFile(file.downloadUrl, file.name)}
                            disabled={loading}
                            title={copy.downloadTitle(file.name)}
                          >
                            <i className="fas fa-download"></i>
                            {copy.download}
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleCopyLink(file.downloadUrl)}
                            title={copy.copyTitle(file.name)}
                          >
                            <i className="fas fa-link"></i>
                            {copy.copyLink}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {details.primaryDocument && (
            <div className="mt-6">
              <div className="alert alert-info">
                <i className="fas fa-star"></i>
                <span>
                  <strong>{copy.primary}：</strong>
                  {details.primaryDocument.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
