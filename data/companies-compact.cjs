/**
 * 压缩数据库加载器 - 专为Vercel优化的轻量级版本
 * 优先使用10.75MB核心数据库，按需扩展
 */

const fs = require('fs');
const path = require('path');

class CompactDatabaseLoader {
    constructor() {
        this.coreData = null;
        this.extendedChunks = new Map();
        this.isLoaded = false;
    }

    /**
     * 加载核心数据库（优先级最高）
     */
    loadCoreDatabase() {
        if (this.coreData) return this.coreData;

        try {
            // 多路径尝试加载核心数据库
            const possiblePaths = [
                path.resolve(process.cwd(), 'data', 'core-database.json'),
                path.join(__dirname, 'core-database.json'),
                path.resolve(__dirname, '..', 'data', 'core-database.json')
            ];

            for (const filePath of possiblePaths) {
                if (fs.existsSync(filePath)) {
                    console.log('📚 加载核心SEC数据库 (10.75MB):', filePath);
                    this.coreData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    console.log(`✅ 核心数据加载成功: ${Object.keys(this.coreData.search).length} 搜索条目`);
                    return this.coreData;
                }
            }

            throw new Error('核心数据库文件未找到');
        } catch (error) {
            console.error('❌ 核心数据库加载失败:', error.message);
            return null;
        }
    }

    /**
     * 搜索公司（核心数据库优先）
     */
    searchCompanies(query, options = {}) {
        const {
            limit = 50,
            minRelevance = 50
        } = options;

        // 确保核心数据已加载
        if (!this.coreData) {
            this.coreData = this.loadCoreDatabase();
        }

        if (!this.coreData) {
            console.log('⚠️ 降级到基础数据库');
            return this.fallbackSearch(query, options);
        }

        const searchTerm = query.toUpperCase().trim();
        const results = [];
        const seen = new Set();

        // 在核心数据中搜索
        for (const [key, company] of Object.entries(this.coreData.search)) {
            if (seen.has(company.c) || results.length >= limit) continue;

            let relevance = 0;
            let matchType = '';

            // 匹配逻辑（解压缩字段名）
            if (key === searchTerm) {
                relevance = 100;
                matchType = 'exact';
            } else if (key.startsWith(searchTerm)) {
                relevance = 85;
                matchType = 'prefix';
            } else if (key.includes(searchTerm)) {
                relevance = 70;
                matchType = 'contains';
            } else {
                const upperName = company.n.toUpperCase();
                if (upperName.startsWith(searchTerm)) {
                    relevance = 80;
                    matchType = 'name_prefix';
                } else if (upperName.includes(searchTerm)) {
                    relevance = 60;
                    matchType = 'name_contains';
                }
            }

            if (relevance >= minRelevance) {
                const cikInfo = this.coreData.cik[company.c] || {};
                results.push({
                    ticker: cikInfo.t || key,
                    name: company.n,
                    cik: company.c,
                    matchType,
                    relevance,
                    hasTickerSymbol: !!cikInfo.t
                });
                seen.add(company.c);
            }
        }

        // 按相关性排序
        results.sort((a, b) => {
            if (a.hasTickerSymbol !== b.hasTickerSymbol) {
                return b.hasTickerSymbol - a.hasTickerSymbol;
            }
            if (a.relevance !== b.relevance) {
                return b.relevance - a.relevance;
            }
            return a.name.localeCompare(b.name);
        });

        console.log(`🔍 搜索"${query}": 在核心数据库找到${results.length}个结果`);
        return results.slice(0, limit);
    }

    /**
     * 降级搜索（使用基础数据）
     */
    fallbackSearch(query, options) {
        try {
            const basicCompanies = require('./companies.cjs').WELL_KNOWN_COMPANIES;
            const searchTerm = query.toUpperCase().trim();
            const results = [];

            for (const [key, company] of Object.entries(basicCompanies)) {
                if (key.includes(searchTerm) || company.name.toUpperCase().includes(searchTerm)) {
                    results.push({
                        ticker: key,
                        name: company.name,
                        cik: company.cik,
                        matchType: 'fallback',
                        relevance: 50,
                        hasTickerSymbol: true
                    });
                }
            }

            console.log(`⚠️ 降级搜索"${query}": 在基础数据库找到${results.length}个结果`);
            return results.slice(0, options.limit || 50);
        } catch (error) {
            console.error('❌ 降级搜索也失败:', error.message);
            return [];
        }
    }

    /**
     * 获取数据库统计信息
     */
    getStats() {
        if (!this.coreData) {
            this.coreData = this.loadCoreDatabase();
        }

        if (this.coreData) {
            return {
                totalSearchEntries: Object.keys(this.coreData.search).length,
                uniqueCompanies: Object.keys(this.coreData.cik).length,
                companiesWithTickers: Object.values(this.coreData.cik).filter(c => c.t).length,
                databaseType: 'compact',
                version: this.coreData.meta?.version || '2.0'
            };
        } else {
            // 降级统计
            try {
                const basicCompanies = require('./companies.cjs').WELL_KNOWN_COMPANIES;
                return {
                    totalSearchEntries: Object.keys(basicCompanies).length,
                    uniqueCompanies: Object.keys(basicCompanies).length,
                    companiesWithTickers: Object.keys(basicCompanies).length,
                    databaseType: 'fallback'
                };
            } catch {
                return {
                    totalSearchEntries: 0,
                    uniqueCompanies: 0,
                    companiesWithTickers: 0,
                    databaseType: 'error'
                };
            }
        }
    }

    /**
     * 根据CIK获取公司信息
     */
    getCompanyByCik(cik) {
        if (!this.coreData) {
            this.coreData = this.loadCoreDatabase();
        }

        if (this.coreData) {
            const paddedCik = cik.toString().padStart(10, '0');
            const company = this.coreData.cik[paddedCik];
            if (company) {
                return {
                    name: company.n,
                    ticker: company.t,
                    priority: company.p === 1
                };
            }
        }

        return null;
    }
}

// 创建单例实例
const compactDB = new CompactDatabaseLoader();

// 导出接口（兼容原有接口）
module.exports = {
    CompactDatabaseLoader,
    compactDatabase: compactDB,

    // 主要搜索接口
    searchCompanies: (query, options) => compactDB.searchCompanies(query, options),
    getDatabaseStats: () => compactDB.getStats(),
    getCompanyByCik: (cik) => compactDB.getCompanyByCik(cik),

    // 兼容老接口
    getSuggestions: (query, limit) => {
        const results = compactDB.searchCompanies(query, { limit });
        return results.map(result => ({
            value: result.ticker,
            label: `${result.ticker} - ${result.name}`,
            cik: result.cik,
            hasTickerSymbol: result.hasTickerSymbol
        }));
    }
};