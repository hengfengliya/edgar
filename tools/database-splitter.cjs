/**
 * 大文件拆分工具 - 解决Git 100MB限制问题
 * 将完整SEC数据库文件拆分成小于50MB的分片
 */

const fs = require('fs');
const path = require('path');

class DatabaseSplitter {
    constructor(maxChunkSize = 50 * 1024 * 1024) { // 50MB每个分片
        this.maxChunkSize = maxChunkSize;
    }

    /**
     * 拆分大型JSON文件为多个分片
     */
    splitJsonFile(inputPath, outputPrefix) {
        console.log(`📚 开始拆分文件: ${inputPath}`);

        const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
        const entries = Object.entries(data);
        const totalEntries = entries.length;

        // 估算每个分片的条目数
        const sampleSize = Math.min(100, totalEntries);
        const sampleEntries = entries.slice(0, sampleSize);
        const sampleJson = JSON.stringify(Object.fromEntries(sampleEntries));
        const avgEntrySize = sampleJson.length / sampleSize;
        const entriesPerChunk = Math.floor(this.maxChunkSize / avgEntrySize * 0.8); // 保留20%缓冲

        console.log(`📊 总条目数: ${totalEntries}, 每分片约: ${entriesPerChunk} 条目`);

        const chunks = [];
        let chunkIndex = 0;

        for (let i = 0; i < totalEntries; i += entriesPerChunk) {
            const chunkEntries = entries.slice(i, i + entriesPerChunk);
            const chunkData = Object.fromEntries(chunkEntries);
            const chunkPath = `${outputPrefix}-part${chunkIndex.toString().padStart(2, '0')}.json`;

            fs.writeFileSync(chunkPath, JSON.stringify(chunkData, null, 0));

            const fileSize = fs.statSync(chunkPath).size;
            const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

            console.log(`✅ 创建分片 ${chunkIndex}: ${chunkPath} (${fileSizeMB}MB, ${chunkEntries.length}条目)`);

            chunks.push({
                file: path.basename(chunkPath),
                entries: chunkEntries.length,
                size: fileSize
            });

            chunkIndex++;
        }

        // 创建索引文件
        const indexPath = `${outputPrefix}-index.json`;
        const indexData = {
            version: '1.0',
            created: new Date().toISOString(),
            originalFile: path.basename(inputPath),
            totalEntries: totalEntries,
            totalChunks: chunks.length,
            chunks: chunks
        };

        fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
        console.log(`📋 创建索引文件: ${indexPath}`);

        return {
            indexFile: indexPath,
            chunks: chunks,
            totalSize: chunks.reduce((sum, chunk) => sum + chunk.size, 0)
        };
    }

    /**
     * 合并分片文件为完整数据
     */
    static mergeChunks(indexPath) {
        const indexDir = path.dirname(indexPath);
        const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

        console.log(`🔄 开始合并 ${indexData.totalChunks} 个分片文件...`);

        const mergedData = {};
        let totalEntries = 0;

        for (const chunkInfo of indexData.chunks) {
            const chunkPath = path.join(indexDir, chunkInfo.file);

            if (fs.existsSync(chunkPath)) {
                const chunkData = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
                Object.assign(mergedData, chunkData);
                totalEntries += Object.keys(chunkData).length;
            } else {
                console.warn(`⚠️ 分片文件不存在: ${chunkPath}`);
            }
        }

        console.log(`✅ 合并完成: ${totalEntries} 条目`);
        return mergedData;
    }
}

// 执行拆分
async function splitDatabases() {
    const splitter = new DatabaseSplitter();

    try {
        // 拆分搜索数据库
        console.log('\n=== 拆分搜索数据库 ===');
        const searchResult = splitter.splitJsonFile(
            'complete-search-database.json',
            'data/search-db'
        );

        // 拆分CIK数据库
        console.log('\n=== 拆分CIK数据库 ===');
        const cikResult = splitter.splitJsonFile(
            'complete-cik-database.json',
            'data/cik-db'
        );

        console.log('\n🎉 拆分完成!');
        console.log(`搜索数据库: ${searchResult.chunks.length} 个分片`);
        console.log(`CIK数据库: ${cikResult.chunks.length} 个分片`);

        return { searchResult, cikResult };
    } catch (error) {
        console.error('❌ 拆分失败:', error.message);
        throw error;
    }
}

// 测试合并功能
function testMerge() {
    console.log('\n=== 测试数据合并 ===');

    try {
        const searchData = DatabaseSplitter.mergeChunks('data/search-db-index.json');
        const cikData = DatabaseSplitter.mergeChunks('data/cik-db-index.json');

        console.log(`搜索数据库条目: ${Object.keys(searchData).length}`);
        console.log(`CIK数据库条目: ${Object.keys(cikData).length}`);

        // 测试Zymeworks搜索
        const zymeResults = Object.keys(searchData).filter(key =>
            key.toUpperCase().includes('ZYMEWORKS')
        );
        console.log(`Zymeworks搜索结果: ${zymeResults.length} 条`);
        zymeResults.forEach(key => {
            console.log(`  - ${key}: ${searchData[key].name}`);
        });

    } catch (error) {
        console.error('❌ 测试失败:', error.message);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    splitDatabases()
        .then(() => testMerge())
        .catch(console.error);
}

module.exports = { DatabaseSplitter };