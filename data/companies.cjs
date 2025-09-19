/**
 * SEC EDGAR 公司CIK映射表 - 共享数据源
 * 包含美股主要上市公司的CIK和基本信息
 * 数据来源：SEC EDGAR官方数据库
 */

const WELL_KNOWN_COMPANIES = {
    // 📱 科技巨头
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
    'FB': { cik: '1326801', name: 'Meta Platforms, Inc.' },
    'FACEBOOK': { cik: '1326801', name: 'Meta Platforms, Inc.' },
    'TSLA': { cik: '1318605', name: 'Tesla, Inc.' },
    'TESLA': { cik: '1318605', name: 'Tesla, Inc.' },
    'NVDA': { cik: '1045810', name: 'NVIDIA Corporation' },
    'NVIDIA': { cik: '1045810', name: 'NVIDIA Corporation' },
    'NFLX': { cik: '1065280', name: 'Netflix, Inc.' },
    'NETFLIX': { cik: '1065280', name: 'Netflix, Inc.' },
    'ADBE': { cik: '796343', name: 'Adobe Inc.' },
    'ADOBE': { cik: '796343', name: 'Adobe Inc.' },
    'CRM': { cik: '1108524', name: 'Salesforce, Inc.' },
    'SALESFORCE': { cik: '1108524', name: 'Salesforce, Inc.' },
    'ORCL': { cik: '1341439', name: 'Oracle Corporation' },
    'ORACLE': { cik: '1341439', name: 'Oracle Corporation' },
    'IBM': { cik: '51143', name: 'International Business Machines Corporation' },
    'INTC': { cik: '50863', name: 'Intel Corporation' },
    'INTEL': { cik: '50863', name: 'Intel Corporation' },
    'AMD': { cik: '2488', name: 'Advanced Micro Devices, Inc.' },
    'QCOM': { cik: '804328', name: 'QUALCOMM Incorporated' },
    'QUALCOMM': { cik: '804328', name: 'QUALCOMM Incorporated' },

    // 🛒 电商与消费技术
    'SHOP': { cik: '1594805', name: 'Shopify Inc.' },
    'SHOPIFY': { cik: '1594805', name: 'Shopify Inc.' },
    'PYPL': { cik: '1633917', name: 'PayPal Holdings, Inc.' },
    'PAYPAL': { cik: '1633917', name: 'PayPal Holdings, Inc.' },
    'SQ': { cik: '1512673', name: 'Block, Inc.' },
    'BLOCK': { cik: '1512673', name: 'Block, Inc.' },
    'SQUARE': { cik: '1512673', name: 'Block, Inc.' },
    'UBER': { cik: '1543151', name: 'Uber Technologies, Inc.' },
    'LYFT': { cik: '1759509', name: 'Lyft, Inc.' },

    // 🇨🇳 中概股
    'BABA': { cik: '1577552', name: 'Alibaba Group Holding Limited' },
    'ALIBABA': { cik: '1577552', name: 'Alibaba Group Holding Limited' },
    'JD': { cik: '1549802', name: 'JD.com, Inc.' },
    'BIDU': { cik: '1329099', name: 'Baidu, Inc.' },
    'BAIDU': { cik: '1329099', name: 'Baidu, Inc.' },
    'PDD': { cik: '1737806', name: 'PDD Holdings Inc.' },
    'PINDUODUO': { cik: '1737806', name: 'PDD Holdings Inc.' },
    'BILI': { cik: '1792792', name: 'Bilibili Inc.' },
    'BILIBILI': { cik: '1792792', name: 'Bilibili Inc.' },
    'NIO': { cik: '1736541', name: 'NIO Inc.' },
    'LI': { cik: '1791708', name: 'Li Auto Inc.' },
    'XPEV': { cik: '1806707', name: 'XPeng Inc.' },
    'XPENG': { cik: '1806707', name: 'XPeng Inc.' },

    // 🏦 金融服务
    'JPM': { cik: '19617', name: 'JPMorgan Chase & Co.' },
    'JPMORGAN': { cik: '19617', name: 'JPMorgan Chase & Co.' },
    'BAC': { cik: '70858', name: 'Bank of America Corporation' },
    'BANKOFAMERICA': { cik: '70858', name: 'Bank of America Corporation' },
    'WFC': { cik: '72971', name: 'Wells Fargo & Company' },
    'WELLSFARGO': { cik: '72971', name: 'Wells Fargo & Company' },
    'C': { cik: '831001', name: 'Citigroup Inc.' },
    'CITIGROUP': { cik: '831001', name: 'Citigroup Inc.' },
    'GS': { cik: '886982', name: 'Goldman Sachs Group, Inc.' },
    'GOLDMAN': { cik: '886982', name: 'Goldman Sachs Group, Inc.' },
    'MS': { cik: '895421', name: 'Morgan Stanley' },
    'MORGAN': { cik: '895421', name: 'Morgan Stanley' },
    'V': { cik: '1403161', name: 'Visa Inc.' },
    'VISA': { cik: '1403161', name: 'Visa Inc.' },
    'MA': { cik: '1141391', name: 'Mastercard Incorporated' },
    'MASTERCARD': { cik: '1141391', name: 'Mastercard Incorporated' },
    'AXP': { cik: '4962', name: 'American Express Company' },
    'AMERICANEXPRESS': { cik: '4962', name: 'American Express Company' },

    // 🛍️ 零售与消费品
    'WMT': { cik: '104169', name: 'Walmart Inc.' },
    'WALMART': { cik: '104169', name: 'Walmart Inc.' },
    'COST': { cik: '909832', name: 'Costco Wholesale Corporation' },
    'COSTCO': { cik: '909832', name: 'Costco Wholesale Corporation' },
    'TGT': { cik: '27419', name: 'Target Corporation' },
    'TARGET': { cik: '27419', name: 'Target Corporation' },
    'HD': { cik: '354950', name: 'Home Depot, Inc.' },
    'HOMEDEPOT': { cik: '354950', name: 'Home Depot, Inc.' },
    'LOW': { cik: '60667', name: 'Lowe\'s Companies, Inc.' },
    'LOWES': { cik: '60667', name: 'Lowe\'s Companies, Inc.' },
    'NKE': { cik: '320187', name: 'NIKE, Inc.' },
    'NIKE': { cik: '320187', name: 'NIKE, Inc.' },
    'SBUX': { cik: '829224', name: 'Starbucks Corporation' },
    'STARBUCKS': { cik: '829224', name: 'Starbucks Corporation' },
    'MCD': { cik: '63908', name: 'McDonald\'s Corporation' },
    'MCDONALDS': { cik: '63908', name: 'McDonald\'s Corporation' },

    // 🎬 媒体与娱乐
    'DIS': { cik: '1744489', name: 'Walt Disney Company (The)' },
    'DISNEY': { cik: '1744489', name: 'Walt Disney Company (The)' },
    'CMCSA': { cik: '1166691', name: 'Comcast Corporation' },
    'COMCAST': { cik: '1166691', name: 'Comcast Corporation' },
    'T': { cik: '732717', name: 'AT&T Inc.' },
    'ATT': { cik: '732717', name: 'AT&T Inc.' },
    'VZ': { cik: '732712', name: 'Verizon Communications Inc.' },
    'VERIZON': { cik: '732712', name: 'Verizon Communications Inc.' },

    // 🥤 食品饮料
    'KO': { cik: '21344', name: 'Coca-Cola Company (The)' },
    'COCACOLA': { cik: '21344', name: 'Coca-Cola Company (The)' },
    'PEP': { cik: '77476', name: 'PepsiCo, Inc.' },
    'PEPSI': { cik: '77476', name: 'PepsiCo, Inc.' },
    'PEPSICO': { cik: '77476', name: 'PepsiCo, Inc.' },

    // 🚗 汽车制造
    'F': { cik: '37996', name: 'Ford Motor Company' },
    'FORD': { cik: '37996', name: 'Ford Motor Company' },
    'GM': { cik: '1467858', name: 'General Motors Company' },
    'GENERALMOTORS': { cik: '1467858', name: 'General Motors Company' },

    // ⚡ 能源
    'XOM': { cik: '34088', name: 'Exxon Mobil Corporation' },
    'EXXON': { cik: '34088', name: 'Exxon Mobil Corporation' },
    'CVX': { cik: '93410', name: 'Chevron Corporation' },
    'CHEVRON': { cik: '93410', name: 'Chevron Corporation' },

    // 💊 医疗健康
    'JNJ': { cik: '200406', name: 'Johnson & Johnson' },
    'JOHNSON': { cik: '200406', name: 'Johnson & Johnson' },
    'PFE': { cik: '78003', name: 'Pfizer Inc.' },
    'PFIZER': { cik: '78003', name: 'Pfizer Inc.' },
    'ABBV': { cik: '1551152', name: 'AbbVie Inc.' },
    'ABBVIE': { cik: '1551152', name: 'AbbVie Inc.' },
    'UNH': { cik: '731766', name: 'UnitedHealth Group Incorporated' },
    'UNITEDHEALTH': { cik: '731766', name: 'UnitedHealth Group Incorporated' },

    // ✈️ 航空航天
    'BA': { cik: '12927', name: 'Boeing Company (The)' },
    'BOEING': { cik: '12927', name: 'Boeing Company (The)' },
    'LMT': { cik: '936468', name: 'Lockheed Martin Corporation' },
    'LOCKHEED': { cik: '936468', name: 'Lockheed Martin Corporation' },

    // 🔬 半导体与芯片
    'TSM': { cik: '1046179', name: 'Taiwan Semiconductor Manufacturing Company Limited' },
    'TSMC': { cik: '1046179', name: 'Taiwan Semiconductor Manufacturing Company Limited' },
    'ASML': { cik: '937966', name: 'ASML Holding N.V.' },
    'AVGO': { cik: '1730168', name: 'Broadcom Inc.' },
    'BROADCOM': { cik: '1730168', name: 'Broadcom Inc.' },

    // 🏗️ 工业与材料
    'CAT': { cik: '18230', name: 'Caterpillar Inc.' },
    'CATERPILLAR': { cik: '18230', name: 'Caterpillar Inc.' },
    'DE': { cik: '315189', name: 'Deere & Company' },
    'DEERE': { cik: '315189', name: 'Deere & Company' },

    // 🏠 房地产与REIT
    'AMT': { cik: '1053507', name: 'American Tower Corporation' },
    'AMERICANTOWER': { cik: '1053507', name: 'American Tower Corporation' }
};

/**
 * 获取公司总数
 */
const getCompanyCount = () => {
    const uniqueCompanies = new Set();
    Object.values(WELL_KNOWN_COMPANIES).forEach(company => {
        uniqueCompanies.add(company.cik);
    });
    return uniqueCompanies.size;
};

/**
 * 按行业分类获取公司列表
 */
const getCompaniesByCategory = () => {
    return {
        '科技巨头': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX'],
        '中概股': ['BABA', 'JD', 'BIDU', 'PDD', 'BILI', 'NIO', 'LI', 'XPEV'],
        '金融服务': ['JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'V', 'MA'],
        '零售消费': ['WMT', 'COST', 'TGT', 'HD', 'NKE', 'SBUX', 'MCD'],
        '医疗健康': ['JNJ', 'PFE', 'ABBV', 'UNH'],
        '能源汽车': ['XOM', 'CVX', 'F', 'GM']
    };
};

module.exports = {
    WELL_KNOWN_COMPANIES,
    getCompanyCount,
    getCompaniesByCategory
};