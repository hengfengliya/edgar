# SEC EDGAR 数据检索系统 - 启动指南

## 🚀 快速启动步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 配置邮箱地址
系统已配置您的邮箱：`tellmeheifengli@gmail.com`

### 3. 启动后端服务器
```bash
npm start
```

### 4. 访问应用
打开浏览器访问：http://localhost:3000

## ✅ 现在可以使用真实SEC EDGAR数据！

### 支持的功能：
- ✅ 搜索任意美股上市公司（如：TSLA、AAPL、MSFT、GOOGL等）
- ✅ 查看真实的SEC申报文件列表
- ✅ 按表单类型和时间筛选
- ✅ 查看文件详情和附件列表
- ✅ 下载真实的申报文件
- ✅ 导出搜索结果为CSV

### 注意事项：
- 后端服务器必须先启动才能搜索
- SEC API有速率限制（每秒最多10个请求）
- 确保网络连接正常

## 🔧 如果遇到问题：

### 服务器无法启动：
```bash
# 检查Node.js版本
node --version

# 重新安装依赖
rm -rf node_modules
npm install
```

### 搜索失败：
1. 检查后端服务器是否运行（应显示"🚀 SEC EDGAR API服务器已启动"）
2. 检查网络连接
3. 尝试搜索其他公司（如 AAPL、MSFT）

---
**准备就绪！现在您可以搜索真实的SEC EDGAR数据了！**