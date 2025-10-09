/**
 * 简单的测试函数 - 验证Vercel Serverless基础功能
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
        // 简单的测试响应
        res.status(200).json({
            success: true,
            message: 'Vercel Serverless函数运行正常',
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url
        });
    } catch (error) {
        console.error('测试函数错误:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};