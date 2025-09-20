/**
 * Vercel Serverless函数 - SEC EDGAR API代理
 * 将Express服务器逻辑转换为Serverless函数
 */

const axios = require('axios');

// SEC EDGAR API配置
const SEC_DATA_URL = 'https://data.sec.gov';       // 用于submissions API
const SEC_ARCHIVE_URL = 'https://www.sec.gov';     // 用于文件档案访问
const USER_AGENT = process.env.SEC_USER_AGENT || 'SEC EDGAR Research Tool tellmeheifengli@gmail.com';

// 请求限流配置 (在Serverless环境中简化处理)
const REQUEST_DELAY = 100; // SEC要求每秒最多10个请求

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

// 常见公司的CIK映射表
const WELL_KNOWN_COMPANIES = {
    // 科技公司
    'AAPL': { cik: '320193', name: 'Apple Inc.' },
    'APPLE': { cik: '320193', name: 'Apple Inc.' },
    'MSFT': { cik: '789019', name: 'Microsoft Corporation' },
    'MICROSOFT': { cik: '789019', name: 'Microsoft Corporation' },
    'GOOGL': { cik: '1652044', name: 'Alphabet Inc.' },
    'GOOG': { cik: '1652044', name: 'Alphabet Inc.' },
    'ALPHABET': { cik: '1652044', name: 'Alphabet Inc.' },
    'GOOGLE': { cik: '1652044', name: 'Alphabet Inc.' },
    'AMZN': { cik: '1018724', name: 'Amazon.com, Inc.' },
    'AMAZON': { cik: '1018724', name: 'Amazon.com, Inc.' },
    'META': { cik: '1326801', name: 'Meta Platforms, Inc.' },
    'FACEBOOK': { cik: '1326801', name: 'Meta Platforms, Inc.' },
    'TSLA': { cik: '1318605', name: 'Tesla, Inc.' },
    'TESLA': { cik: '1318605', name: 'Tesla, Inc.' },
    'NVDA': { cik: '1045810', name: 'NVIDIA Corporation' },
    'NVIDIA': { cik: '1045810', name: 'NVIDIA Corporation' },
    'NFLX': { cik: '1065280', name: 'Netflix, Inc.' },
    'NETFLIX': { cik: '1065280', name: 'Netflix, Inc.' },

    // 中概股
    'BABA': { cik: '1577552', name: 'Alibaba Group Holding Limited' },
    'ALIBABA': { cik: '1577552', name: 'Alibaba Group Holding Limited' },
    'JD': { cik: '1549802', name: 'JD.com, Inc.' },
    'BIDU': { cik: '1329099', name: 'Baidu, Inc.' },
    'BAIDU': { cik: '1329099', name: 'Baidu, Inc.' },
    'PDD': { cik: '1737806', name: 'PDD Holdings Inc.' },
    'PINDUODUO': { cik: '1737806', name: 'PDD Holdings Inc.' },

    // 金融公司
    'JPM': { cik: '19617', name: 'JPMorgan Chase & Co.' },
    'JPMORGAN': { cik: '19617', name: 'JPMorgan Chase & Co.' },
    'BAC': { cik: '70858', name: 'Bank of America Corporation' },
    'GS': { cik: '886982', name: 'The Goldman Sachs Group, Inc.' },
    'GOLDMAN': { cik: '886982', name: 'The Goldman Sachs Group, Inc.' },

    // 其他知名公司
    'WMT': { cik: '104169', name: 'Walmart Inc.' },
    'WALMART': { cik: '104169', name: 'Walmart Inc.' },
    'DIS': { cik: '1744489', name: 'The Walt Disney Company' },
    'DISNEY': { cik: '1744489', name: 'The Walt Disney Company' },
    'KO': { cik: '21344', name: 'The Coca-Cola Company' },
    'COCACOLA': { cik: '21344', name: 'The Coca-Cola Company' },
    'PFE': { cik: '78003', name: 'Pfizer Inc.' },
    'PFIZER': { cik: '78003', name: 'Pfizer Inc.' }
};

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
    console.log(`检查申报文件: ${filing.form} (${filing.filingDate})，筛选条件:`, filters);

    // 表单类型筛选
    if (filters.formType && filing.form !== filters.formType) {
        console.log(`表单类型不匹配: ${filing.form} !== ${filters.formType}`);
        return false;
    }

    // 日期范围筛选
    if (filters.startDate || filters.endDate) {
        const filingDate = new Date(filing.filingDate);

        if (filters.startDate && filingDate < new Date(filters.startDate)) {
            console.log(`文件日期过早: ${filing.filingDate} < ${filters.startDate}`);
            return false;
        }

        if (filters.endDate && filingDate > new Date(filters.endDate)) {
            console.log(`文件日期过晚: ${filing.filingDate} > ${filters.endDate}`);
            return false;
        }
    }

    // 时间范围筛选（最近N天）
    if (filters.dateRange && filters.dateRange !== 'custom') {
        const days = parseInt(filters.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        if (new Date(filing.filingDate) < cutoffDate) {
            console.log(`文件日期超出范围: ${filing.filingDate} < ${cutoffDate.toISOString().split('T')[0]}`);
            return false;
        }
    }

    console.log(`文件通过筛选: ${filing.form}`);
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

/**
 * Vercel Serverless函数主入口
 */
module.exports = async (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url } = req;
    const pathname = new URL(url, `http://${req.headers.host}`).pathname;

    try {
        // 路由分发
        if (pathname === '/api/health') {
            // 健康检查
            res.status(200).json({
                success: true,
                message: 'SEC EDGAR API服务器运行正常',
                timestamp: new Date().toISOString(),
                userAgent: USER_AGENT
            });

        } else if (pathname === '/api/companies/search') {
            // 搜索公司
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({
                    success: false,
                    error: '请提供搜索查询参数'
                });
            }

            console.log(`搜索公司: ${q}`);

            const searchTerm = q.toUpperCase().trim();
            const companies = [];

            // 在预定义的公司列表中搜索
            for (const [key, company] of Object.entries(WELL_KNOWN_COMPANIES)) {
                if (key.includes(searchTerm) || company.name.toUpperCase().includes(searchTerm)) {
                    companies.push({
                        cik: company.cik.padStart(10, '0'),
                        ticker: key.includes(searchTerm) ? key : '',
                        title: company.name
                    });
                }
            }

            // 去重
            const uniqueCompanies = companies.reduce((acc, company) => {
                const existing = acc.find(c => c.cik === company.cik);
                if (!existing) {
                    acc.push(company);
                }
                return acc;
            }, []);

            console.log(`找到 ${uniqueCompanies.length} 个匹配的公司`);

            if (uniqueCompanies.length === 0) {
                return res.status(200).json({
                    success: true,
                    data: [],
                    count: 0,
                    message: `未找到 "${q}" 的匹配公司。支持的公司包括：AAPL, MSFT, GOOGL, AMZN, META, TSLA, BABA等知名公司。`
                });
            }

            res.status(200).json({
                success: true,
                data: uniqueCompanies,
                count: uniqueCompanies.length
            });

        } else if (pathname.match(/^\/api\/companies\/(\d+)\/filings$/)) {
            // 获取公司申报文件
            const cik = pathname.match(/^\/api\/companies\/(\d+)\/filings$/)[1];
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

            res.status(200).json({
                success: true,
                data: result
            });

        } else if (pathname.match(/^\/api\/filings\/(\d+)\/([^\/]+)$/)) {
            // 获取申报文件详情
            const matches = pathname.match(/^\/api\/filings\/(\d+)\/([^\/]+)$/);
            const cik = matches[1];
            const accessionNumber = matches[2];

            console.log(`获取文件详情: CIK ${cik}, Accession ${accessionNumber}`);

            const paddedCik = cik.padStart(10, '0');
            const cleanAccessionNumber = accessionNumber.replace(/-/g, '');
            const url = `${SEC_ARCHIVE_URL}/Archives/edgar/data/${paddedCik}/${cleanAccessionNumber}/index.json`;

            const indexData = await makeSecRequest(url);

            if (!indexData || !indexData.directory) {
                return res.status(404).json({
                    success: false,
                    error: '无法获取文件索引信息'
                });
            }

            // 处理文件列表
            const files = indexData.directory.item.map(item => ({
                name: item.name,
                type: getFileType(item.name),
                size: item.size || 0,
                lastModified: item['last-modified'] || '',
                downloadUrl: `${SEC_ARCHIVE_URL}/Archives/edgar/data/${paddedCik}/${cleanAccessionNumber}/${item.name}`
            }));

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

            res.status(200).json({
                success: true,
                data: result
            });

        } else if (pathname.startsWith('/api/download/')) {
            // 代理文件下载
            const secUrl = pathname.replace('/api/download/', SEC_ARCHIVE_URL + '/');
            console.log(`代理下载文件: ${secUrl}`);

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

        } else {
            // 404处理
            res.status(404).json({
                success: false,
                error: '接口不存在'
            });
        }

    } catch (error) {
        console.error('Serverless函数错误:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};