import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * React错误边界组件
 * 捕获React组件树中的JavaScript错误并显示降级UI
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新state使下一次渲染能够显示降级后的UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error('React Error Boundary捕获到错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的UI并渲染
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  应用程序出现错误
                </h4>
                <p>
                  很抱歉，应用程序遇到了一个错误。这可能是由于网络连接问题或服务器暂时不可用导致的。
                </p>
                <hr />
                <div className="mb-3">
                  <strong>错误详情：</strong>
                  <pre className="mt-2 p-3 bg-light rounded">
                    {this.state.error?.message || '未知错误'}
                  </pre>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  <i className="fas fa-refresh me-2"></i>
                  重新加载页面
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;