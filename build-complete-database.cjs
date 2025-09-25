const fs = require('fs');
const readline = require('readline');

console.log('🚀 开始构建完整SEC EDGAR公司数据库...');

async function buildCompleteDatabase() {
    // 1. 加载company_tickers.json (带ticker的优先公司)
    const tickerData = JSON.parse(fs.readFileSync('company_tickers.json', 'utf8'));
    console.log('✅ 已加载带ticker的公司数据:', Object.keys(tickerData).length, '家');

    // 2. 解析CIK lookup数据文件
    const cikDatabase = new Map();
    const tickerDatabase = new Map();

    // 优先处理有ticker的公司
    Object.values(tickerData).forEach(company => {
        const cik = company.cik_str.toString().padStart(10, '0');
        const ticker = company.ticker;
        const name = company.title;

        cikDatabase.set(cik, { name, ticker, priority: true });
        tickerDatabase.set(ticker, { cik, name });

        // 添加常见别名
        const cleanName = name
            .replace(/\s+(INC\.?|CORP\.?|CO\.?|LTD\.?|LLC\.?|LP\.?|PLC\.?)(\s.*)?$/gi, '')
            .replace(/[,\.\-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toUpperCase();

        if (cleanName && cleanName !== ticker && cleanName.length > 2) {
            const alias = cleanName.replace(/\s+/g, '');
            if (!tickerDatabase.has(alias)) {
                tickerDatabase.set(alias, { cik, name });
            }
        }
    });

    console.log('✅ 优先公司处理完成，开始解析完整CIK数据库...');

    // 3. 解析完整的CIK数据文件
    const fileStream = fs.createReadStream('cik-lookup-data.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineCount = 0;
    let validEntries = 0;

    for await (const line of rl) {
        lineCount++;

        if (line.trim() && line.includes(':')) {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const companyName = parts[0].trim();
                const cik = parts[1].trim();

                if (companyName && cik && cik.length >= 6) {
                    const paddedCik = cik.padStart(10, '0');

                    // 如果这个CIK还没有记录，或者现有记录没有ticker
                    if (!cikDatabase.has(paddedCik) || !cikDatabase.get(paddedCik).ticker) {
                        cikDatabase.set(paddedCik, {
                            name: companyName,
                            ticker: cikDatabase.get(paddedCik)?.ticker || null,
                            priority: cikDatabase.get(paddedCik)?.priority || false
                        });

                        // 为没有ticker的公司生成搜索别名
                        if (!cikDatabase.get(paddedCik).ticker) {
                            const cleanName = companyName
                                .replace(/[^\w\s]/g, ' ')
                                .replace(/\s+/g, ' ')
                                .trim()
                                .toUpperCase();

                            if (cleanName.length > 3 && cleanName.length < 50) {
                                const alias = cleanName.replace(/\s+/g, '');
                                if (!tickerDatabase.has(alias)) {
                                    tickerDatabase.set(alias, { cik: paddedCik, name: companyName });
                                }
                            }
                        }
                    }
                    validEntries++;
                }
            }
        }

        if (lineCount % 100000 === 0) {
            console.log(`已处理 ${lineCount} 行，有效条目: ${validEntries}`);
        }
    }

    console.log('✅ CIK数据解析完成');
    console.log(`📊 总处理行数: ${lineCount}`);
    console.log(`📊 CIK数据库大小: ${cikDatabase.size} 家公司`);
    console.log(`📊 搜索数据库大小: ${tickerDatabase.size} 个搜索条目`);

    // 4. 生成优化的数据结构
    const companySearchData = {};

    for (const [key, value] of tickerDatabase.entries()) {
        companySearchData[key] = {
            cik: value.cik,
            name: value.name
        };
    }

    // 5. 保存完整数据库
    console.log('💾 保存完整数据库...');

    // 保存CIK映射表（用于完整数据访问）
    const cikMap = {};
    for (const [cik, data] of cikDatabase.entries()) {
        cikMap[cik] = data;
    }

    fs.writeFileSync('complete-cik-database.json', JSON.stringify(cikMap, null, 2));
    fs.writeFileSync('complete-search-database.json', JSON.stringify(companySearchData, null, 2));

    // 6. 生成统计报告
    const priorityCompanies = Array.from(cikDatabase.values()).filter(c => c.priority).length;
    const companiesWithTickers = Array.from(cikDatabase.values()).filter(c => c.ticker).length;

    console.log('');
    console.log('📈 完整SEC EDGAR数据库构建完成！');
    console.log('=' .repeat(50));
    console.log(`🏢 总公司数量: ${cikDatabase.size.toLocaleString()}`);
    console.log(`🎯 优先公司 (有ticker): ${priorityCompanies.toLocaleString()}`);
    console.log(`📊 有ticker的公司: ${companiesWithTickers.toLocaleString()}`);
    console.log(`🔍 搜索条目总数: ${tickerDatabase.size.toLocaleString()}`);
    console.log(`📁 数据库文件: complete-cik-database.json, complete-search-database.json`);

    return {
        totalCompanies: cikDatabase.size,
        searchEntries: tickerDatabase.size,
        priorityCompanies,
        companiesWithTickers
    };
}

// 运行构建过程
buildCompleteDatabase().catch(console.error);