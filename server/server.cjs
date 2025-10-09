/**
 * SEC EDGAR API代理服务器
 * 解决浏览器CORS限制，代理SEC EDGAR API请求
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

// 引用精简版SEC公司数据库（10.75MB核心数据，适合Vercel部署）
const { compactDatabase: companyDatabase } = require('../data/companies-compact.cjs');
const { getCompanyCount } = require('../data/companies.cjs'); // 保留统计函数

// 在服务启动时预热核心数据库，避免首次请求时才加载文件
companyDatabase.getStats();


const app = express();
const PORT = process.env.PORT || 3000;

// SEC EDGAR API配置
const SEC_DATA_URL = 'https://data.sec.gov';       // 用于submissions API
const SEC_ARCHIVE_URL = 'https://www.sec.gov';     // 用于文件档案访问
const USER_AGENT = process.env.SEC_USER_AGENT || 'SEC EDGAR Research Tool your-email@example.com';

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // 静态文件服务

// 请求限流配置
let lastRequestTime = 0;
const REQUEST_DELAY = 100; // SEC要求每秒最多10个请求

/**
 * 请求限流中间件
 */
const rateLimitMiddleware = async (req, res, next) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < REQUEST_DELAY) {
        await new Promise(resolve =>
            setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest)
        );
    }

    lastRequestTime = Date.now();
    next();
};

/**
 * SEC API代理请求封装
 */
const makeSecRequest = async (url, options = {}) => {
    try {
        console.log(`正在请求: ${url}`);
        console.log(`使用User-Agent: ${USER_AGENT}`);

        const response = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                ...options.headers
            },
            timeout: 30000,
            validateStatus: function (status) {
                return status < 500; // 允许查看4xx响应的详细信息
            },
            ...options
        });

        console.log(`响应状态: ${response.status}`);
        console.log(`响应头部:`, response.headers);

        if (response.status === 403) {
            console.error('403错误详情:', response.data);
            throw new Error(`SEC API拒绝访问 (403) - User-Agent: ${USER_AGENT}`);
        }

        if (response.status === 404) {
            console.error('404错误 - API端点可能已更改:', url);
            throw new Error(`SEC API端点不存在 (404): ${url}`);
        }

        if (response.status >= 400) {
            console.error(`${response.status}错误:`, response.data);
            throw new Error(`SEC API错误 ${response.status}: ${response.statusText}`);
        }

        console.log('请求成功，返回数据');
        return response.data;

    } catch (error) {
        console.error(`SEC API请求详细错误:`, {
            url: url,
            userAgent: USER_AGENT,
            error: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data
        });

        if (error.message.includes('SEC API')) {
            throw error;
        } else if (error.code === 'ENOTFOUND') {
            throw new Error('无法解析SEC服务器域名，请检查网络连接');
        } else if (error.code === 'ECONNREFUSED') {
            throw new Error('连接被拒绝，SEC服务器可能暂时不可用');
        } else if (error.code === 'ETIMEDOUT') {
            throw new Error('请求超时，SEC服务器响应缓慢');
        } else {
            throw new Error(`网络请求失败: ${error.message}`);
        }
    }
};

// API路由

/**
 * 获取公司ticker列表
 * 注意：SEC API不提供公司ticker查找端点，这个功能已被移除
 */
app.get('/api/companies/tickers', rateLimitMiddleware, async (req, res) => {
    res.status(404).json({
        success: false,
        error: 'SEC API不提供公司ticker查找功能',
        message: '根据SEC官方文档，没有公司ticker列表API。请直接使用CIK搜索公司申报文件。'
    });
});

/**
 * 搜索公司 - 基于预定义的CIK映射
 */
app.get('/api/companies/search', rateLimitMiddleware, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                error: '请提供搜索查询参数'
            });
        }

        console.log(`搜索公司: ${q}`);

        const searchTerm = q.trim();

        // 使用精简核心数据库进行搜索
        const results = companyDatabase.searchCompanies(searchTerm, { limit: 10 });

        // 转换为API期望的格式
        const companies = results.map(company => ({
            cik: company.cik.padStart(10, '0'),
            ticker: company.ticker || '',
            title: company.name
        }));

        console.log(`找到 ${companies.length} 个匹配的公司`);

        if (companies.length === 0) {
            return res.json({
                success: true,
                data: [],
                count: 0,
                message: `未找到 "${q}" 的匹配公司。核心数据库覆盖约7,890家公司，请尝试调整关键词。`
            });
        }

        res.json({
            success: true,
            data: companies,
            count: companies.length
        });

    } catch (error) {
        console.error('搜索公司失败:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * 获取公司申报文件
 */
app.get('/api/companies/:cik/filings', rateLimitMiddleware, async (req, res) => {
    try {
        const { cik } = req.params;
        const { formType, startDate, endDate, dateRange } = req.query;

        console.log(`获取公司申报文件: CIK ${cik}`);
        console.log('筛选条件:', { formType, startDate, endDate, dateRange });

        // 验证CIK格式
        if (!/^\d{1,10}$/.test(cik)) {
            return res.status(400).json({
                success: false,
                error: '无效的CIK格式'
            });
        }

        const paddedCik = cik.padStart(10, '0');
        const url = `${SEC_DATA_URL}/submissions/CIK${paddedCik}.json`;

        const data = await makeSecRequest(url);

        if (!data || !data.filings || !data.filings.recent) {
            return res.status(404).json({
                success: false,
                error: '未找到申报数据'
            });
        }

        // 处理申报数据
        const filings = processFilingsData(data.filings.recent, {
            formType,
            startDate,
            endDate,
            dateRange
        });

        console.log(`筛选后的申报文件数量: ${filings.length}`);

        const result = {
            companyInfo: {
                cik: data.cik,
                name: data.name,
                ticker: data.tickers && data.tickers.length > 0 ? data.tickers[0] : '',
                sic: data.sic,
                sicDescription: data.sicDescription,
                fiscalYearEnd: data.fiscalYearEnd,
                stateOfIncorporation: data.stateOfIncorporation,
                stateOfIncorporationDescription: data.stateOfIncorporationDescription,
                addresses: data.addresses,
                category: data.category,
                ein: data.ein
            },
            filings: filings,
            totalCount: filings.length
        };

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('获取申报文件失败:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * 获取申报文件详情
 */
app.get('/api/filings/:cik/:accessionNumber', rateLimitMiddleware, async (req, res) => {
    try {
        const { cik, accessionNumber } = req.params;

        console.log(`获取文件详情: CIK ${cik}, Accession ${accessionNumber}`);

        const paddedCik = cik.padStart(10, '0');
        const cleanAccessionNumber = accessionNumber.replace(/-/g, '');
        // 修复：使用HTML索引页面而不是JSON
        const url = `${SEC_ARCHIVE_URL}/Archives/edgar/data/${paddedCik}/${cleanAccessionNumber}/${accessionNumber}-index.html`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            timeout: 10000
        });

        const htmlContent = response.data;
        console.log('成功获取文件索引页面');

        // 解析HTML内容提取文件信息
        const files = parseFileTable(htmlContent, paddedCik, cleanAccessionNumber);

        // 识别主要文档
        const primaryDocument = files.find(file =>
            file.name.endsWith('.htm') || file.name.endsWith('.html')
        ) || files[0];

        const result = {
            accessionNumber: accessionNumber,
            files: files,
            primaryDocument: primaryDocument,
            totalFiles: files.length,
            indexUrl: url
        };

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('获取文件详情失败:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * 代理文件下载
 * 解决直接从SEC下载文件的CORS问题
 */
app.get('/api/download/*', rateLimitMiddleware, async (req, res) => {
    try {
        // 从路径中提取SEC文件URL - 修复URL构建逻辑
        const filePath = req.path.replace('/api/download/', '');

        // 确保正确构建SEC URL
        let secUrl;
        if (filePath.startsWith('Archives/')) {
            // 标准的Archives路径
            secUrl = `${SEC_ARCHIVE_URL}/${filePath}`;
        } else if (filePath.startsWith('data/')) {
            // data.sec.gov路径
            secUrl = `${SEC_DATA_URL}/${filePath}`;
        } else {
            // 其他情况，假设是完整的相对路径
            secUrl = `${SEC_ARCHIVE_URL}/${filePath}`;
        }

        console.log(`代理下载文件: ${filePath} -> ${secUrl}`);

        const response = await axios({
            method: 'GET',
            url: secUrl,
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': '*/*',
            },
            responseType: 'stream',
            timeout: 60000
        });

        // 设置响应头 - 强制下载到本地
        const filename = secUrl.split('/').pop() || 'download';
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');

        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }

        // 管道数据流
        response.data.pipe(res);

    } catch (error) {
        console.error('代理下载失败:', error.message);
        res.status(500).json({
            success: false,
            error: '文件下载失败: ' + error.message
        });
    }
});

/**
 * 解析SEC HTML索引页面的文件表格
 */
function parseFileTable(htmlContent, paddedCik, cleanAccessionNumber) {
    const files = [];

    try {
        // 匹配文件表格中的行 - SEC使用标准HTML表格格式
        const tableRowRegex = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
        const matches = htmlContent.match(tableRowRegex) || [];

        for (const row of matches) {
            // 提取文件名链接
            const fileMatch = row.match(/<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
            if (!fileMatch) continue;

            const filename = fileMatch[2].trim();
            if (!filename || filename === 'Filename') continue; // 跳过表头

            // 提取文件大小
            const sizeMatch = row.match(/<td[^>]*>\s*(\d+)\s*<\/td>/i);
            const size = sizeMatch ? parseInt(sizeMatch[1]) : 0;

            // 构建完整的下载URL
            const downloadUrl = `${SEC_ARCHIVE_URL}/Archives/edgar/data/${paddedCik}/${cleanAccessionNumber}/${filename}`;

            files.push({
                name: filename,
                type: getFileType(filename),
                size: size,
                downloadUrl: downloadUrl
            });
        }

        console.log(`解析到 ${files.length} 个文件`);
        return files;

    } catch (error) {
        console.error('解析HTML文件表格失败:', error.message);
        return [];
    }
}

// 工具函数

/**
 * 处理和筛选申报数据
 */
function processFilingsData(recentFilings, filters) {
    const filings = [];

    // 确保数据数组长度一致
    const length = Math.min(
        recentFilings.accessionNumber?.length || 0,
        recentFilings.form?.length || 0,
        recentFilings.filingDate?.length || 0
    );

    for (let i = 0; i < length; i++) {
        const filing = {
            accessionNumber: recentFilings.accessionNumber[i],
            form: recentFilings.form[i],
            filingDate: recentFilings.filingDate[i],
            reportDate: recentFilings.reportDate[i] || '',
            acceptanceDateTime: recentFilings.acceptanceDateTime[i] || '',
            act: recentFilings.act[i] || '',
            fileNumber: recentFilings.fileNumber[i] || '',
            filmNumber: recentFilings.filmNumber[i] || '',
            items: recentFilings.items[i] || '',
            size: recentFilings.size[i] || 0,
            isXBRL: recentFilings.isXBRL[i] || 0,
            isInlineXBRL: recentFilings.isInlineXBRL[i] || 0
        };

        // 应用筛选条件
        if (shouldIncludeFiling(filing, filters)) {
            filings.push(filing);
        }
    }

    // 按提交日期倒序排列
    filings.sort((a, b) => new Date(b.filingDate) - new Date(a.filingDate));

    return filings;
}

/**
 * 判断申报文件是否符合筛选条件
 */
function shouldIncludeFiling(filing, filters) {
    // 表单类型筛选
    if (filters.formType && filing.form !== filters.formType) {
        return false;
    }

    // 日期范围筛选
    if (filters.startDate || filters.endDate) {
        const filingDate = new Date(filing.filingDate);

        if (filters.startDate && filingDate < new Date(filters.startDate)) {
            return false;
        }

        if (filters.endDate && filingDate > new Date(filters.endDate)) {
            return false;
        }
    }

    // 时间范围筛选（最近N天）
    if (filters.dateRange && filters.dateRange !== 'custom') {
        const days = parseInt(filters.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        if (new Date(filing.filingDate) < cutoffDate) {
            return false;
        }
    }

    return true;
}

/**
 * 根据文件名判断文件类型
 */
function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const typeMap = {
        'htm': 'HTML文档',
        'html': 'HTML文档',
        'pdf': 'PDF文档',
        'xml': 'XML文档',
        'xbrl': 'XBRL数据',
        'txt': '文本文件',
        'csv': 'CSV数据',
        'json': 'JSON数据',
        'zip': '压缩文件'
    };

    return typeMap[extension] || '其他文件';
}

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'SEC EDGAR API服务器运行正常',
        timestamp: new Date().toISOString(),
        userAgent: USER_AGENT
    });
});

// 静态文件路由 - 主页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// SPA路由支持 - 为所有非API路径返回index.html
app.get('*', (req, res, next) => {
    // 如果请求的是API路径，继续到下一个中间件
    if (req.path.startsWith('/api/')) {
        return next();
    }

    // 对于所有其他路径（如/search, /about等），返回index.html
    // 让React Router处理客户端路由
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    res.status(500).json({
        success: false,
        error: '服务器内部错误'
    });
});

// 404处理 - 只处理API路径的404
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: '接口不存在'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 SEC EDGAR API服务器已启动`);
    console.log(`📍 服务地址: http://localhost:${PORT}`);
    console.log(`👤 User-Agent: ${USER_AGENT}`);
    console.log(`⚠️  请确保修改 .env 文件中的联系邮箱`);
    console.log(`📊 准备代理SEC EDGAR API请求...`);
});
