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
 * 获取公司申报文件
 */
const getCompanyFilings = async (cik) => {
    try {
        // 确保CIK格式正确（10位数字，前面补0）
        const formattedCik = cik.padStart(10, '0');
        const url = `${SEC_DATA_URL}/submissions/CIK${formattedCik}.json`;

        console.log('获取申报文件:', url);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json'
            }
        });

        const data = response.data;

        // 处理申报文件数据
        const filings = [];
        if (data.filings && data.filings.recent) {
            const recent = data.filings.recent;
            const count = Math.min(recent.form.length, 50); // 限制返回50条最新数据

            for (let i = 0; i < count; i++) {
                filings.push({
                    form: recent.form[i],
                    filingDate: recent.filingDate[i],
                    reportDate: recent.reportDate[i] || '',
                    accessionNumber: recent.accessionNumber[i],
                    fileNumber: recent.fileNumber[i] || '',
                    filmNumber: recent.filmNumber[i] || '',
                    description: recent.primaryDocument[i] || '',
                    size: recent.size[i] || 0
                });
            }
        }

        return {
            success: true,
            data: filings,
            company: {
                name: data.name,
                cik: data.cik,
                sic: data.sic,
                sicDescription: data.sicDescription,
                fiscalYearEnd: data.fiscalYearEnd
            },
            message: `获取到 ${filings.length} 条申报文件`
        };

    } catch (error) {
        console.error('获取申报文件失败:', error.message);

        if (error.response?.status === 404) {
            return {
                success: false,
                error: '未找到该公司的申报文件',
                message: '请检查CIK是否正确'
            };
        }

        return {
            success: false,
            error: '获取申报文件失败: ' + error.message,
            message: '请稍后重试或检查网络连接'
        };
    }
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

        // 申报文件获取 - 匹配 /companies/{cik}/filings 路径
        const filingMatch = pathname.match(/\/companies\/(\d+)\/filings/);
        if (filingMatch) {
            const cik = filingMatch[1];
            console.log('获取申报文件, CIK:', cik);

            const result = await getCompanyFilings(cik);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(400).json(result);
            }
        }

        // 默认响应
        return res.status(200).json({
            success: true,
            message: 'SEC EDGAR API代理服务正在运行',
            available_endpoints: [
                '/api/companies/search?q=公司名称',
                '/api/companies/{cik}/filings'
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