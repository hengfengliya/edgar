import React from 'react';
import { FilingDetails } from '../../types/api';
import { FileUtils } from '../../utils/fileUtils';
import { Button } from '../ui';

interface FilingDetailsModalProps {
  details: FilingDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadFile: (url: string, filename: string) => void;
  loading?: boolean;
}

/**
 * 申报文件详情模态框组件
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
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      onClick={handleBackdropClick}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          {/* 模态框头部 */}
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-file-alt me-2"></i>
              文件详情
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="关闭"
            ></button>
          </div>

          {/* 模态框内容 */}
          <div className="modal-body">
            {/* 基本信息 */}
            <div className="row mb-3">
              <div className="col-12">
                <h6>接收号：
                  <code className="ms-2">{details.accessionNumber}</code>
                </h6>
                <p className="text-muted">
                  共 {details.totalFiles} 个文件
                </p>
              </div>
            </div>

            {/* 文件列表 */}
            <div className="row">
              <div className="col-12">
                <h6>文件列表：</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
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
                        <tr key={`${file.name}-${index}`}>
                          <td>
                            <i className={`${FileUtils.getFileIcon(file.name)} file-icon me-2`}></i>
                            <span title={file.name}>
                              {file.name.length > 30
                                ? `${file.name.substring(0, 30)}...`
                                : file.name
                              }
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {FileUtils.getFileTypeDescription(file.name)}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {FileUtils.formatFileSize(file.size)}
                            </small>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleDownloadFile(file.downloadUrl, file.name)}
                              disabled={loading}
                              icon="fas fa-download"
                              title={`下载 ${file.name}`}
                            >
                              下载
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 主要文档提示 */}
            {details.primaryDocument && (
              <div className="row mt-3">
                <div className="col-12">
                  <div className="alert alert-info">
                    <i className="fas fa-star me-2"></i>
                    <strong>主要文档：</strong>
                    {details.primaryDocument.name}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 模态框底部 */}
          <div className="modal-footer">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              关闭
            </Button>
            {details.primaryDocument && (
              <Button
                variant="primary"
                onClick={() => handleDownloadFile(
                  details.primaryDocument!.downloadUrl,
                  details.primaryDocument!.name
                )}
                disabled={loading}
                loading={loading}
                icon="fas fa-download"
              >
                下载主要文档
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};