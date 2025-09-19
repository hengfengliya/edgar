# Vercel部署指南

## 🚀 部署步骤

### 1. 准备工作
确保您的项目已经上传到Git仓库（GitHub/GitLab/Bitbucket）

### 2. 访问Vercel
1. 打开 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录

### 3. 导入项目
1. 点击 "New Project"
2. 选择您的GitHub仓库
3. 配置项目设置：
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (根目录)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4. 环境变量配置
在Vercel项目设置中添加环境变量：
```
SEC_USER_AGENT = SEC EDGAR Research Tool tellmeheifengli@gmail.com
```

### 5. 部署
点击 "Deploy" 按钮，Vercel会自动：
- 安装依赖
- 构建React应用
- 部署Serverless函数
- 生成访问域名

## 📁 项目结构说明

```
vm_sec-report/
├── api/
│   └── edgar.js          # Serverless函数 (替代Express服务器)
├── src/                  # React应用源码
├── dist/                 # 构建输出目录
├── vercel.json          # Vercel部署配置
└── package.json         # 包含构建脚本
```

## ⚙️ 技术配置

### vercel.json配置说明
- **routes**: 路由配置，API请求转发到Serverless函数
- **functions**: Serverless函数超时设置 (30秒)
- **env**: 环境变量配置

### API路径映射
- 前端: `/` → React静态文件
- API: `/api/*` → `api/edgar.js` Serverless函数

## 🔧 本地测试Vercel配置

1. 安装Vercel CLI:
```bash
npm i -g vercel
```

2. 本地运行Vercel环境:
```bash
vercel dev
```

3. 访问 `http://localhost:3000` 测试

## 🌐 部署后功能验证

### 必须验证的功能:
1. **公司搜索** - 搜索AAPL、MSFT等公司
2. **申报文件获取** - 查看文件列表
3. **文件下载** - 测试代理下载功能
4. **CSV导出** - 验证数据导出

### 常见问题解决:

#### 1. 环境变量问题
```
错误: SEC API拒绝访问 (403)
解决: 检查Vercel环境变量中的SEC_USER_AGENT配置
```

#### 2. API路由问题
```
错误: 404 接口不存在
解决: 检查vercel.json中的routes配置
```

#### 3. 文件下载问题
```
错误: 文件下载失败
解决: 检查Serverless函数的downloadFile逻辑
```

## 🎯 优势总结

### Vercel部署优势:
- ✅ **免费套餐** - 每月100GB带宽
- ✅ **自动HTTPS** - 免费SSL证书
- ✅ **全球CDN** - 访问速度快
- ✅ **Git集成** - 推送代码自动部署
- ✅ **零配置** - 无需服务器管理

### 性能特点:
- 🚀 前端静态文件CDN加速
- ⚡ Serverless函数按需启动
- 🔄 支持自动扩缩容
- 📊 内置性能监控

## 📞 支持联系

如果部署过程中遇到问题：
1. 检查Vercel部署日志
2. 验证环境变量配置
3. 测试API功能是否正常
4. 查看浏览器控制台错误信息

祝您部署成功！🎉