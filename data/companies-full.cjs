/**
 * SEC EDGAR 完整公司CIK映射表 - 基于SEC官方数据
 * 包含前1000大美股上市公司的CIK和基本信息
 * 数据来源：SEC EDGAR官方数据库 (https://www.sec.gov/files/company_tickers.json)
 * 总公司数：10123家，本文件包含前1000家重要公司
 */

// 生成完整公司列表的函数
const generateFullCompanyList = () => {
    const fs = require('fs');
    const path = require('path');

    try {
        // 尝试读取下载的SEC数据
        const filePath = path.join(__dirname, 'company_tickers.json');
        if (fs.existsSync(filePath)) {
            const secData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const companies = {};

            // 转换前1000家公司数据
            const companyArray = Object.values(secData).slice(0, 1000);

            companyArray.forEach(company => {
                const ticker = company.ticker;
                const cik = company.cik_str.toString();
                const name = company.title;

                // 添加ticker条目
                companies[ticker] = {
                    cik: cik.padStart(6, '0'), // 标准化CIK格式
                    name: name
                };

                // 添加公司名称缩写条目（去除常见后缀）
                const cleanName = name
                    .replace(/\s+(INC\.?|CORP\.?|CO\.?|LTD\.?|LLC\.?|LP\.?)(\s|$)/gi, '')
                    .replace(/[^\w\s]/g, '')
                    .replace(/\s+/g, '')
                    .toUpperCase();

                if (cleanName && cleanName !== ticker && cleanName.length > 2) {
                    companies[cleanName] = { cik: cik.padStart(6, '0'), name: name };
                }
            });

            return companies;
        }
    } catch (error) {
        console.error('无法读取SEC数据文件:', error.message);
    }

    // 如果无法读取SEC数据，返回基础数据集
    return require('./companies.cjs').WELL_KNOWN_COMPANIES;
};

// 生成完整的公司映射表
const FULL_COMPANY_DATABASE = generateFullCompanyList();

/**
 * 获取支持的公司总数
 */
const getFullCompanyCount = () => {
    const uniqueCompanies = new Set();
    Object.values(FULL_COMPANY_DATABASE).forEach(company => {
        uniqueCompanies.add(company.cik);
    });
    return uniqueCompanies.size;
};

/**
 * 按市值/重要性搜索公司
 */
const searchCompaniesByImportance = (query, limit = 10) => {
    const searchTerm = query.toUpperCase();
    const results = [];

    for (const [ticker, company] of Object.entries(FULL_COMPANY_DATABASE)) {
        if (ticker.includes(searchTerm) ||
            company.name.toUpperCase().includes(searchTerm)) {
            results.push({
                ticker: ticker,
                name: company.name,
                cik: company.cik
            });

            if (results.length >= limit) break;
        }
    }

    return results;
};

/**
 * 获取行业分类（基于前1000大公司）
 */
const getFullCompaniesByCategory = () => {
    // 基础分类保持不变，但现在支持更多公司
    const baseCategories = require('./companies.cjs').getCompaniesByCategory();

    // 添加新的分类
    return {
        ...baseCategories,
        '🌐 国际公司': ['SAP', 'ASML', 'NVO', 'TM', 'AZN', 'HSBC', 'NVS', 'CYATY'],
        '📈 ETF基金': ['SPY', 'QQQ', 'IVV', 'VOO', 'VTI', 'IEFA', 'EFA'],
        '🚬 传统行业': ['PM', 'MO', 'BTI', 'JTI'],
        '🏛️ 金融服务扩展': ['GS', 'MS', 'SCHW', 'BLK', 'ICE', 'CME', 'SPGI', 'MCO'],
        '🔋 电池与储能': ['CATL', 'BYD', 'LG', 'PANASONIC'],
        '🎯 专业服务': ['ACN', 'IBM', 'ORCL', 'SAP', 'NOW', 'ADBE']
    };
};

/**
 * 智能搜索函数
 */
const intelligentSearch = (query, options = {}) => {
    const {
        limit = 20,
        includePartialMatch = true,
        sortByRelevance = true
    } = options;

    const searchTerm = query.toUpperCase().trim();
    const results = [];
    const seen = new Set();

    // 1. 精确匹配ticker
    if (FULL_COMPANY_DATABASE[searchTerm]) {
        const company = FULL_COMPANY_DATABASE[searchTerm];
        results.push({
            ticker: searchTerm,
            name: company.name,
            cik: company.cik,
            matchType: 'exact_ticker',
            relevance: 100
        });
        seen.add(company.cik);
    }

    // 2. 部分匹配
    if (includePartialMatch && results.length < limit) {
        for (const [ticker, company] of Object.entries(FULL_COMPANY_DATABASE)) {
            if (seen.has(company.cik)) continue;

            let relevance = 0;
            let matchType = '';

            // Ticker开头匹配
            if (ticker.startsWith(searchTerm)) {
                relevance = 90;
                matchType = 'ticker_prefix';
            }
            // Ticker包含
            else if (ticker.includes(searchTerm)) {
                relevance = 70;
                matchType = 'ticker_contains';
            }
            // 公司名称开头匹配
            else if (company.name.toUpperCase().startsWith(searchTerm)) {
                relevance = 80;
                matchType = 'name_prefix';
            }
            // 公司名称包含
            else if (company.name.toUpperCase().includes(searchTerm)) {
                relevance = 60;
                matchType = 'name_contains';
            }

            if (relevance > 0) {
                results.push({
                    ticker: ticker,
                    name: company.name,
                    cik: company.cik,
                    matchType: matchType,
                    relevance: relevance
                });
                seen.add(company.cik);

                if (results.length >= limit) break;
            }
        }
    }

    // 3. 按相关性排序
    if (sortByRelevance) {
        results.sort((a, b) => b.relevance - a.relevance);
    }

    return results;
};

module.exports = {
    FULL_COMPANY_DATABASE,
    getFullCompanyCount,
    searchCompaniesByImportance,
    getFullCompaniesByCategory,
    intelligentSearch
};