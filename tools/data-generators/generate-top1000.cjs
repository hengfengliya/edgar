const fs = require('fs');

console.log('🏗️ 正在生成前1000家公司映射...');

const secData = JSON.parse(fs.readFileSync('company_tickers.json', 'utf8'));
const companies = {};
const companyArray = Object.values(secData).slice(0, 1000);

companyArray.forEach((company, index) => {
    const ticker = company.ticker;
    const cik = company.cik_str.toString().padStart(6, '0');
    const name = company.title;

    // 添加ticker条目
    companies[ticker] = { cik: cik, name: name };

    // 添加简化的公司名称
    const simpleName = name
        .replace(/\s+(INC\.?|CORP\.?|CO\.?|LTD\.?|LLC\.?|LP\.?)(\s.*)?$/gi, '')
        .replace(/[,\.]/g, '')
        .replace(/\s+/g, '')
        .toUpperCase();

    if (simpleName && simpleName !== ticker && simpleName.length > 2 && !companies[simpleName]) {
        companies[simpleName] = { cik: cik, name: name };
    }

    // 进度指示
    if ((index + 1) % 100 === 0) {
        console.log('已处理', index + 1, '家公司...');
    }
});

console.log('✅ 生成完成！');
console.log('📊 Ticker条目数:', Object.values(secData).slice(0, 1000).length);
console.log('📋 总条目数（含别名）:', Object.keys(companies).length);

// 保存到文件
const outputData = JSON.stringify(companies, null, 2);
fs.writeFileSync('top1000-companies.json', outputData);
console.log('💾 已保存到 top1000-companies.json');

// 显示前20个示例
console.log('');
console.log('📝 前20个条目示例:');
Object.entries(companies).slice(0, 20).forEach(([key, value], index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${key.padEnd(15)} -> ${value.name.substring(0, 40)}... (CIK: ${value.cik})`);
});