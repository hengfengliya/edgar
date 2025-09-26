# 🌟 虚空有物数据检索系统

> 专业级SEC EDGAR数据检索平台，支持88万+家美国公司申报文件检索

[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://usstocks.top)
[![Tech Stack](https://img.shields.io/badge/stack-React%20%2B%20TypeScript%20%2B%20Vercel-blue)](https://github.com/hengfengliya/vm_sec-report)
[![Data Coverage](https://img.shields.io/badge/companies-880K%2B-orange)](https://usstocks.top)
[![License](https://img.shields.io/badge/license-MIT-green)](#)

## 📖 项目简介

虚空有物数据检索系统是一个现代化的SEC EDGAR数据检索平台，为投资研究和合规分析提供专业级的工具支持。通过中文本地化界面和智能搜索功能，大大降低了SEC数据检索的使用门槛。

### 🌟 核心特色

- **🏢 完整数据覆盖**: 支持88万+家美国公司，包括上市公司、私人公司、投资基金
- **🔍 智能搜索**: 苹果风格下拉推荐，支持公司名称、ticker代码、模糊搜索
- **📋 专业表单**: 支持200+种SEC表单类型，完整的中文术语映射
- **🌐 全球部署**: Vercel Serverless架构，全球CDN加速，秒级响应
- **🎨 现代界面**: 苹果设计语言，毛玻璃效果，完美的用户体验
- **🇨🇳 中文友好**: 全中文界面，专业术语本地化，符合中国用户习惯

## 🚀 在线体验

### 生产环境
**🌐 [https://usstocks.top](https://usstocks.top)**

### 功能演示
- 搜索任意美股公司 (如：Apple, Tesla, 阿里巴巴)
- 查看完整申报文件列表
- 筛选特定表单类型 (10-K, 10-Q, 8-K等)
- 下载原始SEC文档
- 导出CSV数据表格

## 🛠️ 技术栈

### 前端技术
- **React 19** - 现代化前端框架
- **TypeScript** - 类型安全开发
- **Vite** - 高性能构建工具
- **Bootstrap 5** - 响应式UI框架

### 后端技术
- **Node.js** - 服务器运行时
- **Express** - Web应用框架
- **Vercel Serverless** - 无服务器部署

### 数据与API
- **SEC EDGAR API** - 官方数据源
- **完整CIK数据库** - 88万+公司映射
- **智能搜索引擎** - 多维度匹配算法

## 📊 项目数据

### 数据规模
- **944,919** 个搜索条目 (完整SEC数据覆盖)
- **884,525** 家独特公司 (包括私人公司和投资基金)
- **7,890** 家有股票代码的公司 (交易所上市)
- **200+** 种SEC表单类型 (专业术语映射)

### 文件结构
```
📂 vm_sec-report/
├── 📁 src/                     # React应用源码
│   ├── 📁 components/          # UI组件库
│   ├── 📁 hooks/              # 自定义Hook
│   ├── 📁 services/           # API服务层
│   ├── 📁 utils/              # 工具函数
│   └── 📁 types/              # TypeScript类型
├── 📁 api/                     # Vercel Serverless函数
├── 📁 server/                  # 本地开发服务器
├── 📁 data/                    # 数据层接口
├── 📁 docs/                    # 项目文档
├── 📁 tools/                   # 开发工具和脚本
├── 📄 complete-*.json         # 完整SEC数据库 (180MB+)
└── 📄 配置文件...
```

## 🏃‍♂️ 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- Git

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/hengfengliya/vm_sec-report.git
   cd vm_sec-report
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，添加你的邮箱到 SEC_USER_AGENT
   ```

4. **启动开发服务器**
   ```bash
   # 启动后端API服务器 (http://localhost:3000)
   npm run dev

   # 启动React开发服务器 (http://localhost:3001)
   npm run dev:client
   ```

5. **访问应用**
   - 前端界面: http://localhost:3001
   - API服务: http://localhost:3000

### 生产部署

项目已配置自动部署到Vercel：

1. Fork此仓库
2. 在Vercel中导入项目
3. 配置环境变量 `SEC_USER_AGENT`
4. 自动构建和部署

## 📋 使用指南

### 基本功能

1. **公司搜索**
   - 在搜索框输入公司名称或ticker代码
   - 系统自动显示匹配的公司建议
   - 支持中文搜索 (如：搜索"阿里"找到BABA)

2. **申报文件查看**
   - 选择公司后查看完整申报文件列表
   - 按表单类型、日期范围筛选
   - 支持分页和排序

3. **文件下载和导出**
   - 点击"查看"查看文件详情
   - 直接下载SEC原始文档
   - 导出筛选结果为CSV格式

### 高级功能

- **智能筛选**: 支持多个筛选条件组合使用
- **批量操作**: 同时处理多个文件
- **历史数据**: 访问公司完整申报历史
- **专业表单**: 识别和处理各种SEC表单类型

## 🎯 核心特性详解

### 智能搜索系统
- **实时推荐**: 输入时即时显示相关公司
- **多维匹配**: 公司名称、ticker代码、CIK号码
- **热门推荐**: 空输入时显示30个热门公司
- **苹果风格**: 毛玻璃效果、流畅动画交互

### 专业数据支持
- **完整SEC数据库**: 直接对接SEC EDGAR官方API
- **表单类型识别**: 支持10-K、10-Q、8-K等200+种表单
- **中文术语映射**: 将专业术语翻译为中文描述
- **智能降级**: 数据库不可用时自动切换到基础版本

### 现代化架构
- **React + TypeScript**: 类型安全的组件化开发
- **Serverless部署**: Vercel全球CDN，零运维成本
- **响应式设计**: 完美支持桌面和移动设备
- **性能优化**: 虚拟滚动、缓存机制、代码分割

## 📚 文档资源

### 用户文档
- [快速开始指南](START.md) - 5分钟上手使用
- [功能使用说明](docs/development/) - 详细功能介绍

### 开发文档
- [技术架构文档](CLAUDE.md) - 完整的开发经验总结
- [部署指南](docs/development/VERCEL-DEPLOY.md) - Vercel部署详细步骤
- [调试指南](docs/development/DEBUG.md) - 常见问题和解决方案

### 工具脚本
- [数据生成工具](tools/data-generators/) - SEC数据库构建脚本
- [开发脚本](tools/scripts/) - 便捷的开发和部署脚本

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程
1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交Pull Request

### 代码规范
- 使用TypeScript进行类型安全开发
- 遵循React最佳实践
- 保持代码简洁和可读性
- 添加必要的中文注释

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- **SEC EDGAR API** - 提供官方金融数据
- **React生态系统** - 现代化前端开发框架
- **Vercel平台** - 优秀的Serverless部署服务
- **开源社区** - 提供丰富的工具和库支持

## 📞 联系与支持

### 项目相关
- 🌐 **在线体验**: [https://usstocks.top](https://usstocks.top)
- 📖 **项目文档**: [GitHub仓库](https://github.com/hengfengliya/vm_sec-report)
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/hengfengliya/vm_sec-report/issues)

### 技术支持
- 查看 [FAQ文档](docs/development/DEBUG.md) 解决常见问题
- 阅读 [技术文档](CLAUDE.md) 了解架构设计
- 提交Issue获取社区帮助

---

## ✨ 核心特性

### 🎯 功能亮点
- 🔍 **智能公司搜索**：支持88万+家美国公司申报文件检索，涵盖上市公司、私人公司、投资基金
- 📊 **完整申报展示**：显示真实的SEC申报文件列表，无数据限制
- 📅 **专业筛选系统**：支持200+种SEC表单类型筛选和精确时间范围筛选
- 📄 **文件详情查看**：完整的申报文件列表和附件信息
- ⬇️ **安全文件下载**：通过代理服务器安全下载SEC原始文档
- 📤 **数据导出功能**：支持将搜索结果导出为专业CSV格式
- 📊 **标准表格显示**：完全对标SEC EDGAR官网表格格式，专业术语中文化
- 🎨 **苹果风格界面**：毛玻璃效果、流畅动画，现代化用户体验
- 🔍 **智能搜索推荐**：实时下拉推荐，支持模糊匹配和热门公司展示
- 📱 **完全响应式**：完美支持桌面、平板和移动设备

### 🛡️ 技术优势
- ✅ **官方数据源**：直接使用SEC EDGAR官方API，确保数据真实性和及时性
- ✅ **合规架构**：严格遵守SEC API使用规范和频率限制
- ✅ **现代技术栈**：React 19 + TypeScript + Vite，类型安全的开发体验
- ✅ **Serverless部署**：Vercel全球CDN，99.9%+ SLA可用性保障
- ✅ **智能代理系统**：解决CORS限制，确保稳定访问和文件下载
- ✅ **完善错误处理**：多层次错误捕获和用户友好的中文提示
- ✅ **性能优化**：虚拟滚动、智能缓存、按需加载

---

**⭐ 如果这个项目对你有帮助，请给个星标支持！**

> 这是一个真正的专业级SEC EDGAR数据检索平台，为投资研究和合规分析提供强大的技术支持。

