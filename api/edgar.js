/**
 * Vercel Serverless函数 - SEC EDGAR API代理
 */

const axios = require('axios');
// 引用共享的公司数据文件
const { WELL_KNOWN_COMPANIES, getCompanyCount } = require('../data/companies.cjs');

// SEC EDGAR API配置
const SEC_DATA_URL = 'https://data.sec.gov';
const USER_AGENT = process.env.SEC_USER_AGENT || 'SEC EDGAR Research Tool tellmeheifengli@gmail.com';

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
 * 文件下载代理
 */
const downloadFile = async (filePath) => {
    try {
        // 重建原始SEC URL
        let secUrl;
        if (filePath.startsWith('data/')) {
            // 数据API文件
            secUrl = `https://data.sec.gov/${filePath}`;
        } else {
            // Archives文件
            secUrl = `https://www.sec.gov/${filePath}`;
        }

        console.log('代理下载文件:', secUrl);

        const response = await axios.get(secUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': '*/*'
            },
            responseType: 'stream',
            timeout: 30000
        });

        return {
            success: true,
            stream: response.data,
            headers: response.headers
        };

    } catch (error) {
        console.error('下载文件失败:', error.message);

        if (error.response?.status === 404) {
            return {
                success: false,
                error: '文件未找到',
                status: 404
            };
        }

        return {
            success: false,
            error: '下载文件失败: ' + error.message,
            status: 500
        };
    }
};
const getFilingDetails = async (cik, accessionNumber) => {
    try {
        // 确保CIK格式正确（10位数字，前面补0）
        const formattedCik = cik.padStart(10, '0');
        // 移除接收号中的连字符
        const cleanAccessionNumber = accessionNumber.replace(/-/g, '');

        // 构建文件索引URL
        const indexUrl = `https://www.sec.gov/Archives/edgar/data/${formattedCik}/${cleanAccessionNumber}/${accessionNumber}-index.html`;

        console.log('获取文件详情:', indexUrl);

        const response = await axios.get(indexUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 10000
        });

        // 解析HTML响应以提取文件信息
        const htmlContent = response.data;
        const files = [];

        // 简单的HTML解析 - 查找文件表格
        const tableRegex = /<table[^>]*class="tableFile"[^>]*>(.*?)<\/table>/is;
        const tableMatch = htmlContent.match(tableRegex);

        if (tableMatch) {
            const tableContent = tableMatch[1];
            // 查找表格行
            const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
            const rows = [...tableContent.matchAll(rowRegex)];

            for (let i = 1; i < rows.length; i++) { // 跳过表头
                const row = rows[i][1];
                // 提取文件信息
                const cellRegex = /<td[^>]*>(.*?)<\/td>/gis;
                const cells = [...row.matchAll(cellRegex)];

                if (cells.length >= 5) {
                    // SEC文件索引页面结构：
                    // 第1列：序号, 第2列：描述, 第3列：文档链接, 第4列：类型, 第5列：大小

                    const description = cells[1][1].replace(/<[^>]*>/g, '').trim();
                    const documentCell = cells[2][1];
                    const type = cells[3][1].replace(/<[^>]*>/g, '').trim();
                    const size = parseInt(cells[4][1].replace(/<[^>]*>/g, '').replace(/,/g, '')) || 0;

                    // 从文档链接中提取实际文件名
                    let filename = '';
                    const linkMatch = documentCell.match(/<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
                    if (linkMatch) {
                        const href = linkMatch[1];
                        const linkText = linkMatch[2].trim();

                        // href通常是相对路径，提取文件名
                        if (href) {
                            filename = href.split('/').pop() || linkText;
                        } else {
                            filename = linkText;
                        }
                    } else {
                        // 如果没有链接，使用描述
                        filename = description;
                    }

                    // 构建下载URL
                    const downloadUrl = `https://www.sec.gov/Archives/edgar/data/${formattedCik}/${cleanAccessionNumber}/${filename}`;

                    files.push({
                        name: filename,
                        description: description,
                        type: type,
                        size: size,
                        downloadUrl: downloadUrl
                    });
                }
            }
        }

        // 找到主要文档
        let primaryDocument = null;
        if (files.length > 0) {
            // 通常第一个文件是主要文档
            primaryDocument = files[0];
        }

        return {
            success: true,
            data: {
                accessionNumber: accessionNumber,
                files: files,
                primaryDocument: primaryDocument,
                totalFiles: files.length,
                indexUrl: indexUrl
            },
            message: `获取到 ${files.length} 个文件`
        };

    } catch (error) {
        console.error('获取文件详情失败:', error.message);

        if (error.response?.status === 404) {
            return {
                success: false,
                error: '未找到该申报文件的详情',
                message: '请检查接收号是否正确'
            };
        }

        return {
            success: false,
            error: '获取文件详情失败: ' + error.message,
            message: '请稍后重试或检查网络连接'
        };
    }
};

/**
 * 获取公司申报文件
 */
const getCompanyFilings = async (cik, filters = {}) => {
    try {
        // 确保CIK格式正确（10位数字，前面补0）
        const formattedCik = cik.padStart(10, '0');
        const url = `${SEC_DATA_URL}/submissions/CIK${formattedCik}.json`;

        console.log('获取申报文件:', url);
        console.log('筛选条件:', filters);

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
            const count = recent.form.length; // 返回所有可用数据，不设限制

            for (let i = 0; i < count; i++) {
                const filing = {
                    form: recent.form[i],
                    filingDate: recent.filingDate[i],
                    reportDate: recent.reportDate[i] || '',
                    accessionNumber: recent.accessionNumber[i],
                    fileNumber: recent.fileNumber[i] || '',
                    filmNumber: recent.filmNumber[i] || '',
                    description: recent.primaryDocument[i] || '',
                    size: recent.size[i] || 0
                };

                // 应用筛选条件
                if (shouldIncludeFiling(filing, filters)) {
                    filings.push(filing);
                }
            }
        }

        // 按提交日期倒序排列
        filings.sort((a, b) => new Date(b.filingDate) - new Date(a.filingDate));

        return {
            success: true,
            data: {
                filings: filings,
                companyInfo: {
                    name: data.name,
                    cik: data.cik,
                    sic: data.sic,
                    sicDescription: data.sicDescription,
                    fiscalYearEnd: data.fiscalYearEnd
                }
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
 * 判断申报文件是否符合筛选条件
 */
const shouldIncludeFiling = (filing, filters) => {
    // 表单类型筛选
    if (filters.formType && filing.form !== filters.formType) {
        console.log(`❌ 表单类型不匹配: "${filing.form}" !== "${filters.formType}"`);
        return false;
    }

    // 日期范围筛选
    if (filters.startDate || filters.endDate) {
        const filingDate = new Date(filing.filingDate);

        if (filters.startDate && filingDate < new Date(filters.startDate)) {
            console.log(`❌ 文件日期太早: ${filing.filingDate} < ${filters.startDate}`);
            return false;
        }

        if (filters.endDate && filingDate > new Date(filters.endDate)) {
            console.log(`❌ 文件日期太晚: ${filing.filingDate} > ${filters.endDate}`);
            return false;
        }
    }

    // 时间范围筛选（最近N天）
    if (filters.dateRange && filters.dateRange !== 'custom') {
        const days = parseInt(filters.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        if (new Date(filing.filingDate) < cutoffDate) {
            console.log(`❌ 文件超出时间范围: ${filing.filingDate} < ${cutoffDate.toISOString().split('T')[0]} (最近${days}天)`);
            return false;
        }
    }

    console.log(`✅ 文件通过筛选: ${filing.form} (${filing.filingDate})`);
    return true;
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

        // 文件下载代理 - 匹配 /download/* 路径
        const downloadMatch = pathname.match(/\/download\/(.+)/);
        if (downloadMatch) {
            let filePath = downloadMatch[1];
            console.log('下载文件请求:', filePath);

            // URL解码文件路径
            filePath = decodeURIComponent(filePath);

            // 代理下载文件，设置正确的下载响应头
            let secUrl;
            if (filePath.startsWith('data/')) {
                // 数据API文件 - data.sec.gov
                secUrl = `https://data.sec.gov/${filePath}`;
            } else if (filePath.startsWith('Archives/')) {
                // Archives文件 - www.sec.gov
                secUrl = `https://www.sec.gov/${filePath}`;
            } else {
                // 默认使用www.sec.gov
                secUrl = `https://www.sec.gov/${filePath}`;
            }

            console.log('代理下载文件:', secUrl);

            try {
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
                return;

            } catch (error) {
                console.error('代理下载失败:', error.message);
                return res.status(500).json({
                    success: false,
                    error: '文件下载失败: ' + error.message
                });
            }
        }

        // 文件详情获取 - 匹配 /filings/{cik}/{accessionNumber} 路径
        const filingDetailsMatch = pathname.match(/\/filings\/(\d+)\/([0-9-]+)/);
        if (filingDetailsMatch) {
            const cik = filingDetailsMatch[1];
            const accessionNumber = filingDetailsMatch[2];
            console.log('获取文件详情, CIK:', cik, 'AccessionNumber:', accessionNumber);

            const result = await getFilingDetails(cik, accessionNumber);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(400).json(result);
            }
        }

        // 申报文件获取 - 匹配 /companies/{cik}/filings 路径
        const filingMatch = pathname.match(/\/companies\/(\d+)\/filings/);
        if (filingMatch) {
            const cik = filingMatch[1];

            // 从URL查询参数中获取筛选条件
            const formType = searchParams.get('formType');
            const startDate = searchParams.get('startDate');
            const endDate = searchParams.get('endDate');
            const dateRange = searchParams.get('dateRange');

            const filters = {
                formType,
                startDate,
                endDate,
                dateRange
            };

            console.log('🔍 API请求URL:', req.url);
            console.log('📋 完整查询参数:', Object.fromEntries(searchParams.entries()));
            console.log('🎯 解析的筛选条件:', filters);

            const result = await getCompanyFilings(cik, filters);

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
                '/api/companies/{cik}/filings',
                '/api/filings/{cik}/{accessionNumber}'
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