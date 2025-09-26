/**
 * 数据库压缩工具 - 生成小于50MB的高度压缩版本
 * 优化策略：移除冗余信息、压缩格式、智能去重
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class DatabaseCompressor {
    constructor() {
        this.maxFileSize = 45 * 1024 * 1024; // 45MB保持安全边界
    }

    /**
     * 压缩和优化数据库
     */
    async compressDatabase() {
        console.log('🗜️ 开始数据库压缩优化...');

        try {
            // 加载原始数据
            const searchData = JSON.parse(fs.readFileSync('complete-search-database.json', 'utf8'));
            const cikData = JSON.parse(fs.readFileSync('complete-cik-database.json', 'utf8'));

            console.log(`📊 原始数据: 搜索${Object.keys(searchData).length}条, CIK${Object.keys(cikData).length}条`);

            // 1. 数据去重和清理
            const cleanedSearch = this.cleanSearchData(searchData);
            const cleanedCik = this.cleanCikData(cikData);

            // 2. 优先级排序 - 保留最重要的数据
            const prioritizedData = this.prioritizeData(cleanedSearch, cleanedCik);

            // 3. 分层存储 - 核心数据 + 扩展数据
            const coreData = prioritizedData.core;
            const extendedData = prioritizedData.extended;

            // 4. 生成压缩文件
            await this.createCompressedFiles(coreData, extendedData);

            console.log('✅ 数据库压缩完成!');
            return true;

        } catch (error) {
            console.error('❌ 压缩失败:', error.message);
            return false;
        }
    }

    /**
     * 清理搜索数据 - 移除冗余信息
     */
    cleanSearchData(searchData) {
        const cleaned = {};
        let processed = 0;

        for (const [key, company] of Object.entries(searchData)) {
            // 跳过明显的垃圾数据
            if (!company.name || company.name.length > 100) continue;
            if (key.length > 50) continue; // 过长的key通常是垃圾数据

            // 压缩格式：只保留必要字段
            cleaned[key] = {
                n: company.name,  // name -> n
                c: company.cik    // cik -> c
            };

            processed++;
            if (processed % 100000 === 0) {
                console.log(`🔄 已处理搜索数据: ${processed}条`);
            }
        }

        console.log(`✅ 搜索数据清理完成: ${Object.keys(searchData).length} → ${Object.keys(cleaned).length}`);
        return cleaned;
    }

    /**
     * 清理CIK数据
     */
    cleanCikData(cikData) {
        const cleaned = {};

        for (const [cik, info] of Object.entries(cikData)) {
            if (!info.name) continue;

            cleaned[cik] = {
                n: info.name,                    // name -> n
                t: info.ticker || '',           // ticker -> t
                p: info.priority ? 1 : 0       // priority -> p (数字比布尔值小)
            };
        }

        console.log(`✅ CIK数据清理完成: ${Object.keys(cikData).length} → ${Object.keys(cleaned).length}`);
        return cleaned;
    }

    /**
     * 数据优先级排序
     */
    prioritizeData(searchData, cikData) {
        console.log('📈 开始数据优先级分析...');

        // 按重要性分类
        const coreSearch = {};
        const extendedSearch = {};
        const coreCik = {};
        const extendedCik = {};

        // 核心数据：有ticker的公司 + 知名公司
        const knownTickers = new Set();

        // 收集所有有ticker的公司
        for (const [cik, info] of Object.entries(cikData)) {
            if (info.t && info.t.length <= 10) { // 合理的ticker长度
                knownTickers.add(info.t.toUpperCase());
                coreCik[cik] = info;
            } else {
                extendedCik[cik] = info;
            }
        }

        console.log(`🏢 发现${knownTickers.size}家有ticker的公司`);

        // 分类搜索数据
        let coreCount = 0;
        for (const [key, company] of Object.entries(searchData)) {
            const isCore = knownTickers.has(key) ||
                          company.n.toUpperCase().includes('INC') ||
                          company.n.toUpperCase().includes('CORP') ||
                          company.n.toUpperCase().includes('LLC') ||
                          company.n.length < 50; // 短名称通常是正规公司

            if (isCore && coreCount < 150000) { // 限制核心数据大小
                coreSearch[key] = company;
                coreCount++;
            } else {
                extendedSearch[key] = company;
            }
        }

        console.log(`🎯 核心数据: 搜索${Object.keys(coreSearch).length}条, CIK${Object.keys(coreCik).length}条`);
        console.log(`📚 扩展数据: 搜索${Object.keys(extendedSearch).length}条, CIK${Object.keys(extendedCik).length}条`);

        return {
            core: { search: coreSearch, cik: coreCik },
            extended: { search: extendedSearch, cik: extendedCik }
        };
    }

    /**
     * 创建压缩文件
     */
    async createCompressedFiles(coreData, extendedData) {
        console.log('📦 生成压缩文件...');

        // 1. 核心数据库 - 必须小于45MB
        const coreJson = JSON.stringify({
            meta: {
                version: '2.0',
                type: 'core',
                compressed: true,
                created: new Date().toISOString()
            },
            search: coreData.search,
            cik: coreData.cik
        }, null, 0); // 不格式化以节省空间

        // 检查大小
        if (Buffer.byteLength(coreJson) > this.maxFileSize) {
            console.log('⚠️ 核心数据库仍然过大，进行额外压缩...');
            const reducedCore = this.reduceDataSize(coreData, this.maxFileSize * 0.8);
            const reducedJson = JSON.stringify({
                meta: {
                    version: '2.0',
                    type: 'core-reduced',
                    compressed: true,
                    created: new Date().toISOString()
                },
                search: reducedCore.search,
                cik: reducedCore.cik
            }, null, 0);

            fs.writeFileSync('data/core-database.json', reducedJson);
            console.log(`📦 核心数据库: ${(Buffer.byteLength(reducedJson) / 1024 / 1024).toFixed(2)}MB`);
        } else {
            fs.writeFileSync('data/core-database.json', coreJson);
            console.log(`📦 核心数据库: ${(Buffer.byteLength(coreJson) / 1024 / 1024).toFixed(2)}MB`);
        }

        // 2. 扩展数据库 - 可以分多个文件
        const extendedChunks = this.createExtendedChunks(extendedData);
        for (let i = 0; i < extendedChunks.length; i++) {
            const chunkJson = JSON.stringify(extendedChunks[i], null, 0);
            fs.writeFileSync(`data/extended-database-${i}.json`, chunkJson);
            console.log(`📦 扩展数据库${i}: ${(Buffer.byteLength(chunkJson) / 1024 / 1024).toFixed(2)}MB`);
        }

        // 3. 创建加载器配置
        const config = {
            version: '2.0',
            coreFile: 'core-database.json',
            extendedFiles: extendedChunks.map((_, i) => `extended-database-${i}.json`),
            totalEntries: Object.keys(coreData.search).length + Object.keys(extendedData.search).length,
            created: new Date().toISOString()
        };

        fs.writeFileSync('data/database-config.json', JSON.stringify(config, null, 2));
        console.log('📋 数据库配置文件已创建');
    }

    /**
     * 进一步减少数据大小
     */
    reduceDataSize(data, targetSize) {
        const reduced = { search: {}, cik: {} };
        let currentSize = 0;
        let count = 0;

        // 优先保留有ticker的公司
        const prioritized = Object.entries(data.search).sort((a, b) => {
            const hasTickerA = data.cik[a[1].c]?.t ? 1 : 0;
            const hasTickerB = data.cik[b[1].c]?.t ? 1 : 0;
            return hasTickerB - hasTickerA;
        });

        for (const [key, company] of prioritized) {
            const entrySize = JSON.stringify([key, company]).length;
            if (currentSize + entrySize < targetSize) {
                reduced.search[key] = company;
                if (data.cik[company.c]) {
                    reduced.cik[company.c] = data.cik[company.c];
                }
                currentSize += entrySize;
                count++;
            } else {
                break;
            }
        }

        console.log(`🔄 数据减少: ${Object.keys(data.search).length} → ${count}条`);
        return reduced;
    }

    /**
     * 创建扩展数据分块
     */
    createExtendedChunks(extendedData) {
        const chunks = [];
        const entries = Object.entries(extendedData.search);
        const chunkSize = 200000; // 每块20万条记录

        for (let i = 0; i < entries.length; i += chunkSize) {
            const chunkEntries = entries.slice(i, i + chunkSize);
            const chunkSearch = Object.fromEntries(chunkEntries);

            // 只包含相关的CIK数据
            const chunkCik = {};
            for (const [key, company] of chunkEntries) {
                if (extendedData.cik[company.c]) {
                    chunkCik[company.c] = extendedData.cik[company.c];
                }
            }

            chunks.push({
                meta: {
                    chunk: chunks.length,
                    entries: chunkEntries.length
                },
                search: chunkSearch,
                cik: chunkCik
            });
        }

        return chunks;
    }
}

// 执行压缩
async function compressDatabase() {
    const compressor = new DatabaseCompressor();
    const success = await compressor.compressDatabase();

    if (success) {
        // 显示文件大小
        console.log('\n📊 最终文件大小统计:');
        const files = fs.readdirSync('data').filter(f => f.endsWith('.json'));
        files.forEach(file => {
            const size = fs.statSync(`data/${file}`).size;
            const sizeMB = (size / 1024 / 1024).toFixed(2);
            console.log(`  ${file}: ${sizeMB}MB`);
        });
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    compressDatabase().catch(console.error);
}

module.exports = { DatabaseCompressor };