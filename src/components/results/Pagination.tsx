import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 分页组件
 * 提供页面导航功能
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) {
    return null;
  }

  // 计算显示的页码范围
  const getVisiblePages = (): number[] => {
    const visiblePages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // 调整起始位置以确保显示足够的页码
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();
  const showFirstLast = totalPages > 7;
  const showPrevNext = totalPages > 1;

  return (
    <nav aria-label="搜索结果分页" className={className}>
      <ul className="pagination justify-content-center">
        {/* 首页 */}
        {showFirstLast && currentPage > 3 && (
          <>
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(1)}
                aria-label="首页"
              >
                <i className="fas fa-angle-double-left"></i>
              </button>
            </li>
            {currentPage > 4 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {/* 上一页 */}
        {showPrevNext && (
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="上一页"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </li>
        )}

        {/* 页码按钮 */}
        {visiblePages.map(page => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? 'active' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(page)}
              aria-label={`第 ${page} 页`}
            >
              {page}
            </button>
          </li>
        ))}

        {/* 下一页 */}
        {showPrevNext && (
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="下一页"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </li>
        )}

        {/* 末页 */}
        {showFirstLast && currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(totalPages)}
                aria-label="末页"
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};