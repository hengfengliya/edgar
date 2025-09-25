/**
 * SEC EDGAR 完整公司数据库 - 93万+家公司支持
 * 基于SEC官方数据源的完整实现
 * 数据来源：https://www.sec.gov/files/company_tickers.json
 *          https://www.sec.gov/Archives/edgar/cik-lookup-data.txt
 */

const fs = require('fs');
const path = require('path');

class SECCompanyDatabase {
    constructor() {
        this.searchDatabase = null;
        this.cikDatabase = null;
        this.isLoaded = false;
    }

    /**
     * 延迟加载数据库
     */
    loadDatabase() {
        if (this.isLoaded) return;

        try {
            const searchPath = path.join(__dirname, '..', 'optimized-search-database.json');
            const cikPath = path.join(__dirname, '..', 'optimized-cik-database.json');

            if (fs.existsSync(searchPath) && fs.existsSync(cikPath)) {
                // 优化数据库已存在，加载
                console.log('📚 加载优化SEC数据库...');
                this.searchDatabase = JSON.parse(fs.readFileSync(searchPath, 'utf8'));
                this.cikDatabase = JSON.parse(fs.readFileSync(cikPath, 'utf8'));
                console.log(`✅ 优化数据库加载完成: ${Object.keys(this.searchDatabase).length} 个搜索条目`);
            } else {
                // 尝试加载完整数据库
                const fullSearchPath = path.join(__dirname, '..', 'complete-search-database.json');
                const fullCikPath = path.join(__dirname, '..', 'complete-cik-database.json');

                if (fs.existsSync(fullSearchPath) && fs.existsSync(fullCikPath)) {
                    console.log('📚 加载完整SEC数据库...');
                    this.searchDatabase = JSON.parse(fs.readFileSync(fullSearchPath, 'utf8'));
                    this.cikDatabase = JSON.parse(fs.readFileSync(fullCikPath, 'utf8'));
                    console.log(`✅ 完整数据库加载完成: ${Object.keys(this.searchDatabase).length} 个搜索条目`);
                } else {
                    // 使用基础数据库
                    console.log('⚠️ 完整数据库不存在，使用基础数据库');
                    const basicCompanies = require('./companies.cjs').WELL_KNOWN_COMPANIES;
                    this.searchDatabase = basicCompanies;
                    this.cikDatabase = {};

                    Object.entries(basicCompanies).forEach(([key, value]) => {
                        const paddedCik = value.cik.padStart(10, '0');
                        this.cikDatabase[paddedCik] = {
                            name: value.name,
                            ticker: key,
                            priority: true
                        };
                    });
                }
            }

            this.isLoaded = true;
        } catch (error) {
            console.error('❌ 数据库加载失败:', error.message);
            // 降级到基础数据
            const basicCompanies = require('./companies.cjs').WELL_KNOWN_COMPANIES;
            this.searchDatabase = basicCompanies;
            this.isLoaded = true;
        }
    }

    /**
     * 智能搜索公司
     */
    searchCompanies(query, options = {}) {
        this.loadDatabase();

        const {
            limit = 20,
            includePartialMatch = true,
            prioritizeWithTickers = true,
            minRelevance = 50
        } = options;

        const searchTerm = query.toUpperCase().trim();
        const results = [];
        const seen = new Set();

        // 1. 精确匹配
        if (this.searchDatabase[searchTerm]) {
            const company = this.searchDatabase[searchTerm];
            const cikData = this.cikDatabase[company.cik];

            results.push({
                ticker: cikData?.ticker || searchTerm,
                name: company.name,
                cik: company.cik,
                matchType: 'exact',
                relevance: 100,
                hasTickerSymbol: !!cikData?.ticker
            });
            seen.add(company.cik);
        }

        // 2. 模糊匹配
        if (includePartialMatch && results.length < limit) {
            const matches = [];

            for (const [key, company] of Object.entries(this.searchDatabase)) {
                if (seen.has(company.cik) || matches.length >= limit * 3) continue;

                let relevance = 0;
                let matchType = '';

                // 完整匹配键名
                if (key === searchTerm) {
                    relevance = 100;
                    matchType = 'exact_key';
                }
                // 键名前缀匹配
                else if (key.startsWith(searchTerm)) {
                    relevance = 85;
                    matchType = 'key_prefix';
                }
                // 键名包含
                else if (key.includes(searchTerm)) {
                    relevance = 70;
                    matchType = 'key_contains';
                }
                // 公司名称匹配
                else {
                    const upperName = company.name.toUpperCase();
                    if (upperName.startsWith(searchTerm)) {
                        relevance = 80;
                        matchType = 'name_prefix';
                    } else if (upperName.includes(searchTerm)) {
                        relevance = 60;
                        matchType = 'name_contains';
                    }
                }

                if (relevance >= minRelevance) {
                    const cikData = this.cikDatabase[company.cik];

                    matches.push({
                        ticker: cikData?.ticker || key,
                        name: company.name,
                        cik: company.cik,
                        matchType,
                        relevance,
                        hasTickerSymbol: !!cikData?.ticker
                    });
                }
            }

            // 排序：相关性 > 是否有ticker > 字母顺序
            matches.sort((a, b) => {
                if (prioritizeWithTickers && a.hasTickerSymbol !== b.hasTickerSymbol) {
                    return b.hasTickerSymbol - a.hasTickerSymbol;
                }
                if (a.relevance !== b.relevance) {
                    return b.relevance - a.relevance;
                }
                return a.name.localeCompare(b.name);
            });

            results.push(...matches.slice(0, limit - results.length));
        }

        return results;
    }

    /**
     * 根据CIK获取公司信息
     */
    getCompanyByCik(cik) {
        this.loadDatabase();
        const paddedCik = cik.toString().padStart(10, '0');
        return this.cikDatabase[paddedCik] || null;
    }

    /**
     * 获取数据库统计信息
     */
    getStats() {
        this.loadDatabase();

        const searchEntries = Object.keys(this.searchDatabase).length;
        const uniqueCompanies = new Set(Object.values(this.searchDatabase).map(c => c.cik)).size;
        const companiesWithTickers = Object.values(this.cikDatabase).filter(c => c.ticker).length;

        return {
            totalSearchEntries: searchEntries,
            uniqueCompanies: uniqueCompanies,
            companiesWithTickers: companiesWithTickers,
            databaseType: fs.existsSync(path.join(__dirname, 'complete-search-database.json')) ? 'complete' : 'basic'
        };
    }

    /**
     * 批量搜索建议
     */
    getSuggestions(query, limit = 10) {
        const results = this.searchCompanies(query, {
            limit,
            includePartialMatch: true,
            minRelevance: 70
        });

        return results.map(result => ({
            value: result.ticker,
            label: `${result.ticker} - ${result.name}`,
            cik: result.cik,
            hasTickerSymbol: result.hasTickerSymbol
        }));
    }

    /**
     * 获取热门公司（有ticker的前100家）
     */
    getPopularCompanies(limit = 100) {
        this.loadDatabase();

        const popularCompanies = [];

        for (const [cik, data] of Object.entries(this.cikDatabase)) {
            if (data.ticker && data.priority) {
                popularCompanies.push({
                    ticker: data.ticker,
                    name: data.name,
                    cik: cik
                });

                if (popularCompanies.length >= limit) break;
            }
        }

        return popularCompanies;
    }
}

// 创建单例实例
const companyDB = new SECCompanyDatabase();

// 兼容性导出
module.exports = {
    // 新的完整数据库接口
    SECCompanyDatabase,
    companyDatabase: companyDB,

    // 兼容老接口
    WELL_KNOWN_COMPANIES: new Proxy({}, {
        get(target, prop) {
            companyDB.loadDatabase();
            return companyDB.searchDatabase[prop];
        },
        ownKeys(target) {
            companyDB.loadDatabase();
            return Object.keys(companyDB.searchDatabase);
        },
        has(target, prop) {
            companyDB.loadDatabase();
            return prop in companyDB.searchDatabase;
        }
    }),

    getCompanyCount: () => {
        return companyDB.getStats().uniqueCompanies;
    },

    getCompaniesByCategory: () => require('./companies.cjs').getCompaniesByCategory(),

    // 新增接口
    searchCompanies: (query, options) => companyDB.searchCompanies(query, options),
    getCompanyByCik: (cik) => companyDB.getCompanyByCik(cik),
    getDatabaseStats: () => companyDB.getStats(),
    getSuggestions: (query, limit) => companyDB.getSuggestions(query, limit),
    getPopularCompanies: (limit) => companyDB.getPopularCompanies(limit)
};