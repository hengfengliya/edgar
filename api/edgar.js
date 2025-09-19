/**
 * Vercel Serverless函数 - SEC EDGAR API代理 (简化版)
 */

const axios = require('axios');

// SEC EDGAR API配置
const SEC_DATA_URL = 'https://data.sec.gov';
const USER_AGENT = process.env.SEC_USER_AGENT || 'SEC EDGAR Research Tool tellmeheifengli@gmail.com';

// 常见公司的CIK映射表 (简化版)
const WELL_KNOWN_COMPANIES = {
    'AAPL': { cik: '320193', name: 'Apple Inc.' },
    'APPLE': { cik: '320193', name: 'Apple Inc.' },
    'TSLA': { cik: '1318605', name: 'Tesla, Inc.' },
    'TESLA': { cik: '1318605', name: 'Tesla, Inc.' },
    'MSFT': { cik: '789019', name: 'Microsoft Corporation' },
    'MICROSOFT': { cik: '789019', name: 'Microsoft Corporation' }
};

/**
 * 搜索公司
 */
const searchCompanies = (query) => {
    const searchTerm = query.toUpperCase();
    const results = [];

    for (const [key, company] of Object.entries(WELL_KNOWN_COMPANIES)) {
        if (key.includes(searchTerm) || company.name.toUpperCase().includes(searchTerm)) {
            results.push({
                cik: company.cik,
                name: company.name,
                ticker: key
            });
        }
    }

    return results;
};

/**
 * Serverless函数主入口
 */
module.exports = async (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        console.log('API请求:', req.method, req.url);

        // 解析URL路径
        const url = new URL(req.url, `https://${req.headers.host}`);
        const pathname = url.pathname;
        const searchParams = url.searchParams;

        // 路由处理
        if (pathname.includes('/companies/search')) {
            // 公司搜索
            const query = searchParams.get('q');
            if (!query) {
                return res.status(400).json({
                    success: false,
                    error: '缺少搜索参数q'
                });
            }

            console.log('搜索公司:', query);
            const companies = searchCompanies(query);

            return res.status(200).json({
                success: true,
                data: companies,
                message: `找到 ${companies.length} 个匹配的公司`
            });
        }

        // 默认响应
        return res.status(200).json({
            success: true,
            message: 'SEC EDGAR API代理服务正在运行',
            available_endpoints: [
                '/api/companies/search?q=公司名称',
            ],
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('API错误:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};