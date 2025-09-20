import React from 'react';
import { FilingDetails } from '../../types/api';
import { FileUtils } from '../../utils/fileUtils';

interface FilingDetailsModalProps {
  details: FilingDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadFile: (url: string, filename: string) => void;
  loading?: boolean;
}

/**
 * 苹果质感申报文件详情模态框组件
 * 显示文件详情和下载选项
 */
export const FilingDetailsModal: React.FC<FilingDetailsModalProps> = ({
  details,
  isOpen,
  onClose,
  onDownloadFile,
  loading = false
}) => {
  if (!isOpen || !details) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownloadFile = (url: string, filename: string) => {
    onDownloadFile(url, filename);
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content fade-in">
        {/* 模态框头部 */}
        <div className="modal-header">
          <h3 className="modal-title">
            <i className="fas fa-file-alt" style={{ marginRight: 'var(--space-3)' }}></i>
            文件详情
          </h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="关闭"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* 模态框内容 */}
        <div className="modal-body">
          {/* 基本信息 */}
          <div className="mb-6">
            <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
              接收号：
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
              共 {details.totalFiles} 个文件
            </p>
          </div>

          {/* 文件列表 */}
          <div>
            <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
              文件列表：
            </h4>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>文件名</th>
                    <th>类型</th>
                    <th>大小</th>
                    <th>操作</th>
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
                            {file.name.length > 30
                              ? `${file.name.substring(0, 30)}...`
                              : file.name
                            }
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
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleDownloadFile(file.downloadUrl, file.name)}
                          disabled={loading}
                          title={`下载 ${file.name}`}
                        >
                          <i className="fas fa-download"></i>
                          下载
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 主要文档提示 */}
          {details.primaryDocument && (
            <div className="mt-6">
              <div className="alert alert-info">
                <i className="fas fa-star"></i>
                <span>
                  <strong>主要文档：</strong>
                  {details.primaryDocument.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 模态框底部 */}
        <div className="flex justify-between gap-4 p-6 border-t border-color-border-light">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            关闭
          </button>
          {details.primaryDocument && (
            <button
              className="btn btn-primary"
              onClick={() => handleDownloadFile(
                details.primaryDocument!.downloadUrl,
                details.primaryDocument!.name
              )}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', marginBottom: 0 }}></div>
                  下载中...
                </>
              ) : (
                <>
                  <i className="fas fa-download"></i>
                  下载主要文档
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};