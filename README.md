# 虚空有物数据检索系统

## 📋 项目简介

虚空有物数据检索系统是一个基于SEC EDGAR官方API的美股上市公司申报文件检索和展示系统。用户可以通过公司名称或股票代码搜索相关的SEC申报文件（如10-K、20-F、10-Q等），查看详细信息并下载文件。

**项目状态**：✅ React版本已完成，功能完整运行

## ✨ 已实现功能

### 🎯 核心功能
- 🔍 **公司搜索**：支持50+知名美股公司搜索（AAPL、TSLA、BABA等）
- 📊 **申报文件展示**：显示真实的SEC申报文件列表
- 📅 **智能筛选**：按表单类型（10-K、10-Q等）和时间范围筛选
- 📄 **文件详情**：查看申报文件的详细信息和附件列表
- ⬇️ **文件下载**：支持单个文件下载
- 📤 **数据导出**：支持将搜索结果导出为CSV格式
- 📊 **表格显示**：完全对标SEC官网表格格式，包含Form & File等完整列信息
- 📱 **响应式设计**：支持桌面和移动设备

### 🛡️ 技术特性
- ✅ **真实数据**：直接使用SEC EDGAR官方API，无模拟数据
- ✅ **合规访问**：严格遵守SEC API使用规范和频率限制
- ✅ **现代架构**：React 19 + TypeScript + Vite技术栈
- ✅ **类型安全**：完整的TypeScript类型定义系统
- ✅ **组件化设计**：模块化React组件，易于维护和扩展
- ✅ **代理服务器**：解决CORS限制，确保稳定访问
- ✅ **错误处理**：完善的错误提示和调试信息
- ✅ **中文界面**：完全中文化的用户界面

## 🏗️ 技术架构

### 前端技术栈
- **React 19** + **TypeScript**：现代化React框架
- **Vite**：高性能构建工具和开发服务器
- **Bootstrap 5**：响应式UI框架
- **Font Awesome**：图标库

### 后端技术栈
- **Node.js** + **Express**：代理服务器 (本地开发)
- **Vercel Serverless函数**：生产环境API代理
- **axios**：HTTP请求库
- **SEC EDGAR API**：官方数据源

### 项目结构
```
vm_sec-report/
├── src/                     # React应用源码
│   ├── components/          # React组件
│   │   ├── layout/         # 布局组件 (Header, Layout)
│   │   ├── search/         # 搜索组件 (SearchForm)
│   │   ├── results/        # 结果组件 (FilingTable, Pagination, Modal)
│   │   ├── common/         # 通用组件 (EmptyState, InfoBanner)
│   │   └── ui/             # UI基础组件 (Button, Card, Alert)
│   ├── hooks/              # 自定义Hook (useEdgarAPI)
│   ├── services/           # API服务层 (edgarAPI)
│   ├── utils/              # 工具函数 (DateUtils, StringUtils等)
│   ├── types/              # TypeScript类型定义
│   └── styles/             # 样式文件
├── api/                     # Vercel Serverless函数
│   └── edgar.js            # 统一API代理函数
├── server/                  # 本地开发服务器
│   └── server.js           # Express代理服务器
├── index.html              # React应用入口
├── vercel.json             # Vercel部署配置
├── vite.config.mjs         # Vite构建配置
├── tsconfig.json           # TypeScript配置
└── 文档文件...
```

## 🚀 部署方式

### 🌐 Vercel部署（推荐）
支持免费一键部署到Vercel平台：

1. **准备代码**：推送项目到GitHub
2. **导入项目**：在Vercel平台导入GitHub仓库
3. **配置环境**：设置 `SEC_USER_AGENT` 环境变量
4. **自动部署**：获得 `https://your-project.vercel.app` 域名

**优势**：
- ✅ 免费100GB月流量
- ✅ 全球CDN加速
- ✅ 自动HTTPS和扩缩容
- ✅ Git推送自动部署

详细指南：[VERCEL-DEPLOY.md](VERCEL-DEPLOY.md)

### 💻 本地开发

#### 1. 环境要求
- Node.js 14.0+
- npm 6.0+
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- **有效的邮箱地址**（SEC API要求）

#### 2. 邮箱配置（重要）
1. 复制环境变量模板：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，**将邮箱地址替换为你的真实邮箱**：
   ```env
   SEC_USER_AGENT=SEC EDGAR Research Tool your.email@example.com
   PORT=3000
   REQUEST_DELAY=100
   ```

   ⚠️ **注意**：SEC API严格要求真实的联系邮箱，否则会被拒绝访问！

### 3. 安装依赖
```bash
npm install
```

### 3. 配置API
系统已配置您的联系邮箱：`tellmeheifengli@gmail.com`
如需修改，请编辑 `.env` 文件中的 `SEC_USER_AGENT` 参数

### 4. 启动服务器
#### React版本 (推荐)
```bash
# 启动后端代理服务器
npm run dev

# 启动React前端开发服务器
npm run dev:client

# 或者同时启动前后端
npm run dev:full
```

### 5. 访问应用
- **React前端**：http://localhost:3003 (或自动分配的端口)
- **后端API**：http://localhost:3000

### 6. 开始使用
搜索支持的公司：AAPL、MSFT、GOOGL、AMZN、META、TSLA、BABA、JD等

详细启动指南请查看 [START.md](START.md)

## 🎯 支持的公司

### 🏢 科技公司
- **AAPL** - Apple Inc.
- **MSFT** - Microsoft Corporation
- **GOOGL** - Alphabet Inc.
- **AMZN** - Amazon.com, Inc.
- **META** - Meta Platforms, Inc.
- **TSLA** - Tesla, Inc.
- **NVDA** - NVIDIA Corporation
- **NFLX** - Netflix, Inc.

### 🏦 中概股
- **BABA** - Alibaba Group Holding Limited
- **JD** - JD.com, Inc.
- **BIDU** - Baidu, Inc.
- **PDD** - PDD Holdings Inc.

### 💰 金融公司
- **JPM** - JPMorgan Chase & Co.
- **BAC** - Bank of America Corporation
- **GS** - The Goldman Sachs Group, Inc.

### 🛒 其他知名公司
- **WMT** - Walmart Inc.
- **DIS** - The Walt Disney Company
- **KO** - The Coca-Cola Company
- **PFE** - Pfizer Inc.

*完整列表包含50+家知名美股公司*

## 📖 使用指南

### 基本搜索
1. 在搜索框中输入公司名称或股票代码
   - 支持：`TSLA`、`Tesla`、`BABA`、`Alibaba`等
2. 选择表单类型（可选）
   - **10-K**：年报（美企）
   - **20-F**：年报（外企）
   - **10-Q**：季报
   - **8-K**：临时报告
3. 设置时间范围（可选）
4. 点击"搜索"按钮

### 高级功能
- **查看详情**：点击"查看详情"按钮查看文件列表和附件
- **下载文件**：点击"下载"按钮下载主要文档
- **导出数据**：点击"导出"按钮将结果保存为CSV文件
- **筛选结果**：使用表单类型和时间范围筛选器

## ⚙️ 配置说明

### 环境变量
```bash
# .env 文件配置
SEC_USER_AGENT=SEC EDGAR Research Tool tellmeheifengli@gmail.com
PORT=3000
REQUEST_DELAY=100
```

### 重要提醒
- **SEC_USER_AGENT**：必须包含真实的联系邮箱，符合SEC要求
- **PORT**：服务器端口，默认3000
- **REQUEST_DELAY**：请求延迟，遵守SEC每秒最多10次请求的限制

## 🔧 故障排除

### 常见问题

**1. 搜索无结果**
- 确认公司在支持列表中
- 检查拼写是否正确
- 尝试使用股票代码而非公司名称

**2. 服务器启动失败**
- 检查Node.js版本（需要14.0+）
- 确认3000端口未被占用
- 运行 `npm install` 重新安装依赖

**3. 筛选功能异常**
- 重启服务器
- 清除浏览器缓存
- 查看服务器控制台日志

**4. 网络连接错误**
- 检查网络连接
- 确认防火墙设置
- SEC服务器可能临时不可用

详细的故障排除指南请查看 [DEBUG.md](DEBUG.md)

## 📊 技术细节

### API集成
- **SEC EDGAR API**：https://data.sec.gov/submissions/
- **频率限制**：每秒最多10个请求
- **User-Agent要求**：必须包含真实联系信息
- **CORS处理**：通过Node.js代理服务器解决

### 数据处理
- **公司CIK映射**：预定义50+家知名公司的CIK
- **实时数据**：直接从SEC服务器获取最新申报文件
- **筛选逻辑**：支持表单类型和时间范围组合筛选
- **错误处理**：多层次错误捕获和用户友好提示

### 安全性
- **无API密钥**：SEC API无需认证
- **环境变量**：敏感配置外部化
- **输入验证**：前后端双重数据验证
- **错误隐藏**：不向用户暴露系统内部错误

## 🚀 开发路线图

### 📋 当前状态（v2.0 React版本）
- ✅ **React技术栈升级完成**：React 19 + TypeScript + Vite
- ✅ **组件化重构**：模块化React组件架构
- ✅ **类型安全**：完整的TypeScript类型定义
- ✅ **现代化构建**：Vite热重载开发环境
- ✅ **表格标准化**：完全对标SEC官网表格格式
- ✅ **基础公司搜索功能**
- ✅ **SEC申报文件展示**
- ✅ **筛选和排序功能**
- ✅ **单文件下载**
- ✅ **CSV数据导出**
- ✅ **响应式UI设计**

### 🎯 下一版本计划（v2.1）
- [ ] 优化筛选功能调试
- [ ] 添加更多公司支持
- [ ] 批量文件下载功能
- [ ] 文件预览功能
- [ ] 搜索历史记录

### 🔮 未来版本计划（v3.0+）
- [ ] **XBRL数据功能**
  - [ ] 财务数据解析
  - [ ] 数据可视化图表
  - [ ] 财务指标计算
- [ ] **高级功能**
  - [ ] 用户账号系统
  - [ ] 收藏和标签功能
  - [ ] API访问统计
  - [ ] 多语言支持

## 📚 相关文档

- [START.md](START.md) - 快速启动指南
- [DEBUG.md](DEBUG.md) - 问题排查指南
- [CLAUDE.md](CLAUDE.md) - 开发经验总结
- [SEC官方API文档](https://www.sec.gov/search-filings/edgar-application-programming-interfaces)

## 🤝 贡献指南

### 开发环境设置
1. Fork本项目
2. 克隆到本地：`git clone <your-fork-url>`
3. 安装依赖：`npm install`
4. 启动开发服务器：`npm start`
5. 在浏览器中访问：`http://localhost:3000`

### 代码规范
- TypeScript + React组件化开发
- 所有注释使用中文
- 函数和变量使用驼峰命名
- 遵循React最佳实践和Hooks模式

### 提交规范
- 提交信息使用中文
- 每个功能单独提交
- 包含必要的测试和文档更新

## 📄 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件

## 📞 联系方式

- **项目邮箱**：tellmeheifengli@gmail.com
- **技术支持**：请在GitHub Issues中提出问题
- **功能建议**：欢迎通过Issues提出改进建议

## ⚠️ 免责声明

本项目仅用于学习和研究目的。所有数据来源于SEC EDGAR公开数据库。用户在使用本系统时应：

1. 遵守SEC的使用条款和相关法律法规
2. 不得将系统用于商业用途而未获得适当授权
3. 理解SEC数据的局限性和时效性
4. 对投资决策承担个人责任

---

**🎉 感谢使用虚空有物数据检索系统！**

如有问题或建议，请随时通过GitHub Issues联系我们。
