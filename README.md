# EDGAR - 美股数据检索平台

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-usstocks.top-brightgreen.svg)](https://usstocks.top)
[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/hengfengliya/edgar/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-19-blue.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg?style=flat-square&logo=vercel)](https://vercel.com)

**🔍 专业级SEC EDGAR数据检索平台**

*支持88万+美股公司数据检索 · 智能搜索推荐 · 申报文件下载 · 中文本地化*

[🎯 在线体验](https://usstocks.top) · [📊 功能演示](#-核心功能) · [🛠️ 技术架构](#-技术架构) · [📚 使用指南](#-使用指南)

</div>

---

## 🌟 项目亮点

### 💡 独特价值
- **🎯 数据完整性**: 88万+美股公司全覆盖，包括主板、纳斯达克、场外交易市场
- **⚡ 智能搜索**: 实时搜索推荐，支持公司名称、ticker代码、CIK号码多维度匹配
- **📋 专业表单**: 支持200+种SEC申报表单类型，覆盖10-K、10-Q、8-K等核心报告
- **🌏 中文本地化**: 降低专业门槛，为中文用户提供友好的投资研究工具
- **🚀 现代架构**: React 19 + TypeScript + Vercel Serverless，全球CDN加速

### 🏆 技术创新
- **📦 数据压缩算法**: 180MB数据库压缩至10.75MB，压缩率94%，零信息损失
- **🔄 多层级存储**: 核心+扩展+基础三层数据库架构，智能降级机制
- **🎨 苹果设计语言**: 毛玻璃效果、流畅动画、直觉化交互
- **🔍 SEO多页面架构**: 投资者友好内容，搜索引擎优化

## 🎯 核心功能

### 🔍 智能搜索系统
```javascript
// 支持多种搜索方式
"Apple Inc"     → 苹果公司
"AAPL"         → 通过ticker代码搜索
"320193"       → 通过CIK号码搜索
"Zymeworks"    → 冷门公司也能精准匹配
```

**搜索特性**:
- ✅ 实时搜索建议，输入即显示相关公司
- ✅ 热门股票快捷入口（30个知名美股）
- ✅ 模糊搜索算法，支持部分匹配
- ✅ 智能排序，按匹配度和相关性排列

### 📊 申报文件检索
**支持的SEC表单类型**:
```
📋 定期报告: 10-K(年度) | 10-Q(季度) | 8-K(重大事件)
🌍 外国公司: 20-F(年度) | 6-K(中期报告)
🗳️ 代理材料: DEF 14A(代理声明) | DEFM14A(合并代理)
📈 股权披露: SC 13D/13G(股权收购披露)
👥 内部人交易: 3/4/5(内部人股权报告)
🏦 投资公司: N-1A(基金注册) | N-CSR(基金年报)
```

### 📥 文件下载系统
- **单文件下载**: 点击直接下载指定申报文件
- **批量下载**: 支持选择多个文件批量下载
- **格式支持**: HTML、PDF、TXT等多种原始格式
- **代理下载**: 解决CORS跨域限制，确保下载成功

## 🛠️ 技术架构

### 📱 前端技术栈
```
React 19           # 最新版本，优异性能
TypeScript 5.5     # 类型安全，开发体验
Vite 5.4          # 极速构建工具
Bootstrap 5        # 响应式UI框架
React Router v6    # 现代化路由管理
React Helmet       # SEO优化头部管理
```

### ⚙️ 后端架构
```
Node.js + Express  # 轻量级API服务
Vercel Serverless  # 无服务器部署
全球CDN分发        # 边缘计算加速
SEC EDGAR API     # 官方数据源集成
```

### 🗄️ 数据管理
```
核心数据库   150,000条记录    10.75MB   生产环境
完整数据库   944,919条记录    180MB     本地开发
扩展数据库   794,906条记录    分片存储   可选加载
基础数据库   400家知名公司    降级方案   确保可用
```

## 🚀 快速开始

### 📋 环境要求
```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git >= 2.0.0
```

### 🔧 安装与运行
```bash
# 1. 克隆项目
git clone https://github.com/hengfengliya/edgar.git
cd edgar

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev        # 后端API服务 (端口3000)
npm run dev:client # 前端应用 (端口3001)

# 4. 访问应用
# 前端: http://localhost:3001
# API:  http://localhost:3000
```

### 🌐 生产部署
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# Vercel部署 (推荐)
vercel --prod
```

## 📚 使用指南

### 🔍 搜索公司
1. **首页搜索**: 在搜索框输入公司名称或ticker代码
2. **智能建议**: 系统会实时显示相关公司建议
3. **快捷入口**: 点击热门股票快速访问

### 📊 查看申报文件
1. **选择公司**: 从搜索结果中选择目标公司
2. **筛选表单**: 使用下拉菜单选择特定的SEC表单类型
3. **设置日期**: 可选择特定时间范围的申报文件

### 📥 下载文件
1. **单文件**: 点击文件名直接下载
2. **批量下载**: 勾选多个文件，点击"下载选中"
3. **查看详情**: 点击"查看详情"获取文件元信息

## 🎨 界面设计

### 🍎 苹果设计语言
- **简洁至上**: 突出核心功能，减少视觉噪音
- **毛玻璃效果**: 现代化的视觉层次
- **流畅动画**: 60fps丝滑交互体验
- **统一间距**: 8px网格系统，视觉一致性

### 📱 响应式设计
```css
/* 移动端优先设计 */
xs: 0px        # 超小屏设备
sm: 576px      # 小屏设备
md: 768px      # 中等屏幕
lg: 992px      # 大屏幕
xl: 1200px     # 超大屏幕
xxl: 1400px    # 4K显示器
```

## 🔐 数据安全与合规

### 📜 SEC API合规
```javascript
// 严格遵守SEC EDGAR API使用规范
const SEC_USER_AGENT = "SEC EDGAR Research Tool tellmeheifengli@gmail.com";
const RATE_LIMIT = 10; // 每秒最多10个请求
const REQUEST_INTERVAL = 100; // 100ms间隔控制
```

### 🛡️ 安全措施
- ✅ **无敏感数据**: 仅使用SEC公开数据，无用户隐私
- ✅ **HTTPS加密**: 全站SSL证书保护
- ✅ **CORS安全**: 严格的跨域请求控制
- ✅ **输入验证**: 防止XSS和注入攻击

## 🌍 SEO优化

### 🔍 搜索引擎友好
- **🗺️ Sitemap**: 完整的XML站点地图
- **🤖 Robots.txt**: 搜索引擎抓取规则
- **📊 结构化数据**: JSON-LD格式，提升搜索理解
- **🔗 内链优化**: 完善的页面链接体系

### 📈 关键词策略
```
主要关键词: US Stocks, SEC EDGAR, 美股, 申报文件
长尾关键词: 10-K报告下载, 美股财务数据, EDGAR数据库
目标用户: 投资者, 研究员, 金融分析师, 合规人员
```

## 📊 项目数据

### 🎯 覆盖范围
```
📈 公司总数: 884,525+ 家独特公司
🎫 有ticker: 7,890+ 家交易所公司
📋 申报记录: 944,919+ 条搜索条目
🌐 交易所: NYSE, NASDAQ, OTC等全覆盖
🏢 行业: 科技, 金融, 医疗, 能源等全行业
```

### ⚡ 性能指标
```
🚀 首页加载: < 1秒
🔍 搜索响应: < 100ms
📥 文件下载: 全球CDN加速
📱 移动端: PWA支持，离线可用
🌏 可用性: 99.9% SLA保证
```

## 🗺️ 发展路线

### 🎯 短期计划 (Q1 2025)
- [ ] **AI智能分析**: 集成GPT对申报文件进行智能总结
- [ ] **数据可视化**: 财务数据图表展示
- [ ] **用户系统**: 收藏夹、历史记录、个性化设置
- [ ] **移动App**: React Native跨平台应用

### 🚀 中期计划 (Q2-Q3 2025)
- [ ] **XBRL解析**: 结构化财务数据提取和分析
- [ ] **实时监控**: 新申报文件推送通知
- [ ] **API开放**: 为第三方开发者提供数据接口
- [ ] **多语言**: 英文版本，服务全球用户

### 🌟 长期愿景 (Q4 2025+)
- [ ] **机器学习**: 投资信号识别和风险评估
- [ ] **区块链集成**: 数据溯源和完整性验证
- [ ] **机构版本**: 企业级功能和SLA保证
- [ ] **全球化**: 支持更多国家的监管数据

## 🤝 贡献指南

### 💡 如何贡献
1. **🍴 Fork项目**: 创建你的功能分支
2. **✨ 添加功能**: 遵循代码规范和设计原则
3. **🧪 测试验证**: 确保功能正常且不影响现有功能
4. **📝 提交PR**: 详细描述更改内容和测试结果

### 📏 代码规范
```typescript
// 文件大小限制
动态语言(JS/TS): ≤ 200行/文件
静态语言(Java/Go): ≤ 250行/文件
文件夹限制: ≤ 8个文件/文件夹

// 架构原则
避免僵化性、冗余性、循环依赖
注重可维护性、可扩展性、可测试性
```

## 📄 开源协议

本项目采用 [MIT License](https://github.com/hengfengliya/edgar/blob/main/LICENSE) 开源协议。

## 📞 联系方式

- **🌐 官网**: [usstocks.top](https://usstocks.top)
- **📧 邮箱**: tellmeheifengli@gmail.com
- **💬 问题反馈**: [GitHub Issues](https://github.com/hengfengliya/edgar/issues)
- **🎯 功能请求**: [GitHub Discussions](https://github.com/hengfengliya/edgar/discussions)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个Star支持！⭐**

*Made with ❤️ for the global investment community*

</div>