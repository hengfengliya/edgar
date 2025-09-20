/**
 * SEC申报表单类型映射工具
 * 提供完整的SEC表单类型和中文描述对应关系
 */

// SEC表单类型映射表
const SEC_FORM_TYPES: Record<string, string> = {
  // 主要定期报告
  '10-K': '年度报告',
  '10-K/A': '年度报告修正',
  '10-Q': '季度报告',
  '10-Q/A': '季度报告修正',
  '8-K': '重大事件报告',
  '8-K/A': '重大事件报告修正',

  // 外国公司报告
  '20-F': '外国公司年度报告',
  '20-F/A': '外国公司年度报告修正',
  '6-K': '外国公司中期报告',
  '6-K/A': '外国公司中期报告修正',

  // 代理材料
  'DEF 14A': '代理声明书',
  'DEF 14C': '代理信息声明书',
  'DEFM14A': '合并代理声明书',
  'DEFM14C': '合并代理信息声明书',
  'DEFA14A': '附加代理材料',
  'DEFR14A': '修订代理声明书',
  'DEFR14C': '修订代理信息声明书',

  // 信息披露声明
  'PREM14A': '初步代理声明书',
  'PREM14C': '初步代理信息声明书',
  'PRE 14A': '初步代理声明书',
  'PRE 14C': '初步代理信息声明书',

  // 股权披露
  'SC 13D': '股权收购披露',
  'SC 13D/A': '股权收购披露修正',
  'SC 13G': '股权收购简化披露',
  'SC 13G/A': '股权收购简化披露修正',
  'SC 13E3': '要约收购声明',
  'SC TO-I': '第三方要约收购',
  'SC TO-T': '要约收购终止',

  // 机构投资者报告
  '13F-HR': '机构持股季度报告',
  '13F-HR/A': '机构持股季度报告修正',
  '13F-NT': '机构持股通知',

  // 内部人交易
  '3': '内部人股权初始披露',
  '3/A': '内部人股权初始披露修正',
  '4': '内部人股权变动报告',
  '4/A': '内部人股权变动报告修正',
  '5': '内部人股权年度声明',
  '5/A': '内部人股权年度声明修正',

  // 注册声明
  'S-1': '证券注册声明',
  'S-1/A': '证券注册声明修正',
  'S-3': '证券注册声明(简化)',
  'S-3/A': '证券注册声明修正(简化)',
  'S-4': '合并重组注册声明',
  'S-4/A': '合并重组注册声明修正',
  'S-8': '员工股票计划注册',
  'S-8/A': '员工股票计划注册修正',
  'S-11': '房地产证券注册',
  'S-11/A': '房地产证券注册修正',

  // 外国注册
  'F-1': '外国公司注册声明',
  'F-1/A': '外国公司注册声明修正',
  'F-3': '外国公司注册声明(简化)',
  'F-3/A': '外国公司注册声明修正(简化)',
  'F-4': '外国公司合并注册',
  'F-4/A': '外国公司合并注册修正',
  'F-6': '存托凭证注册',
  'F-6/A': '存托凭证注册修正',
  'F-10': '外国公司注册(加拿大)',
  'F-10/A': '外国公司注册修正(加拿大)',

  // 招股说明书
  '424B1': '招股说明书补充',
  '424B2': '招股说明书补充',
  '424B3': '招股说明书补充',
  '424B4': '招股说明书补充',
  '424B5': '招股说明书补充',
  '424B7': '招股说明书补充',
  '425': '合并通信材料',

  // 投资公司报告
  'N-1A': '开放式基金注册',
  'N-1A/A': '开放式基金注册修正',
  'N-CSR': '基金年度报告',
  'N-CSR/A': '基金年度报告修正',
  'N-CSRS': '基金半年报告',
  'N-CSRS/A': '基金半年报告修正',
  'N-Q': '基金季度持仓报告',
  'N-Q/A': '基金季度持仓报告修正',

  // 银行控股公司
  'FR Y-6': '银行控股公司报告',
  'FR Y-9C': '银行控股公司财务报告',
  'FR Y-9LP': '银行控股公司父公司报告',

  // 其他常见表单
  '11-K': '员工股票购买计划年报',
  '11-K/A': '员工股票购买计划年报修正',
  '18-K': '外国政府债券年报',
  '18-K/A': '外国政府债券年报修正',
  '40-F': '加拿大公司年报',
  '40-F/A': '加拿大公司年报修正',
  'ARS': '年度股东报告',
  'CERT': '证书',
  'CORRESP': '通信记录',
  'COVER': '封面页',
  'EX-99': '其他展示',
  'EX-99.1': '其他展示附件',
  'IRANNOTICE': '伊朗业务披露',
  'NT 10-K': '年报延期通知',
  'NT 10-Q': '季报延期通知',
  'NT 20-F': '外国公司年报延期通知',
  'SD': '冲突矿物披露',
  'SD/A': '冲突矿物披露修正',
  'UPLOAD': '上传文档',

  // XBRL相关
  'EX-100': 'XBRL实例文档',
  'EX-101': 'XBRL分类法扩展',
  'EX-99.SDR.INS': 'XBRL实例文档',

  // 特殊情况
  'EFFECT': '生效通知',
  'FWP': '免费写作招股书',
  'POS AM': '生效后修正',
  'POS462B': '注册声明生效后',
  'POS462C': '注册声明生效后',
  'POSAM': '生效后修正',
  'RW': '撤回通知',
  'RW WD': '撤回通知',
  'SP 15D2': '暂停报告通知',
  'STOP ORDER': '停止令',
  'SUPPL': '补充材料',
  'T-3': '信托契约申请',
  'UNDER': '承销协议',
  'WITHDRAWAL': '撤回申请'
};

/**
 * 获取SEC表单类型的中文描述
 * @param formType 表单类型代码
 * @returns 中文描述
 */
export const getFormDescription = (formType: string): string => {
  if (!formType) return '未知表单';

  // 清理表单类型字符串
  const cleanFormType = formType.trim().toUpperCase();

  // 直接匹配
  if (SEC_FORM_TYPES[cleanFormType]) {
    return SEC_FORM_TYPES[cleanFormType];
  }

  // 处理修正版本 (/A 后缀)
  if (cleanFormType.endsWith('/A')) {
    const baseForm = cleanFormType.replace('/A', '');
    if (SEC_FORM_TYPES[baseForm]) {
      return SEC_FORM_TYPES[baseForm] + '修正';
    }
  }

  // 更精确的模糊匹配 - 只匹配以已知类型开头的表单
  for (const [key, value] of Object.entries(SEC_FORM_TYPES)) {
    // 避免过度匹配，只有当表单类型是已知类型的明确变体时才匹配
    if (cleanFormType.startsWith(key + '-') ||
        cleanFormType.startsWith(key + '/') ||
        (cleanFormType.startsWith(key) && /\d+$/.test(cleanFormType.substring(key.length)))) {
      return value;
    }
  }

  // 根据表单前缀推断类型 - 更精确的匹配
  if (cleanFormType.startsWith('10-K')) return '年度报告';
  if (cleanFormType.startsWith('10-Q')) return '季度报告';
  if (cleanFormType.startsWith('8-K')) return '重大事件报告';
  if (cleanFormType.startsWith('20-F')) return '外国公司年度报告';
  if (cleanFormType.startsWith('6-K')) return '外国公司中期报告';
  if (cleanFormType.startsWith('DEF')) return '代理材料';
  if (cleanFormType.startsWith('SC')) return '股权披露';
  if (cleanFormType.startsWith('S-')) return '证券注册';
  if (cleanFormType.startsWith('F-')) return '外国公司注册';
  if (cleanFormType.startsWith('N-')) return '投资公司报告';
  if (cleanFormType.startsWith('424')) return '招股说明书';
  if (cleanFormType.startsWith('13F')) return '机构投资者报告';
  if (cleanFormType.match(/^[3-5]$/)) return '内部人交易报告';
  if (cleanFormType.startsWith('EX-')) return '附件文档';
  if (cleanFormType.startsWith('NT')) return '通知文档';

  return '其他申报文件';
};

/**
 * 获取表单类型的简短标签
 * @param formType 表单类型代码
 * @returns 简短的中文标签
 */
export const getFormLabel = (formType: string): string => {
  const description = getFormDescription(formType);

  // 返回简化的标签
  if (description.includes('年度')) return '年报';
  if (description.includes('季度')) return '季报';
  if (description.includes('重大事件')) return '临时';
  if (description.includes('代理')) return '代理';
  if (description.includes('股权')) return '股权';
  if (description.includes('注册')) return '注册';
  if (description.includes('机构')) return '机构';
  if (description.includes('内部人')) return '内部';
  if (description.includes('外国')) return '外企';

  return '其他';
};

/**
 * 检查是否为主要报告类型
 * @param formType 表单类型代码
 * @returns 是否为主要报告
 */
export const isMajorForm = (formType: string): boolean => {
  const majorForms = ['10-K', '10-Q', '8-K', '20-F', '6-K', 'DEF 14A', '13F-HR'];
  return majorForms.includes(formType?.toUpperCase());
};

/**
 * 获取所有支持的表单类型列表
 * @returns 表单类型数组，按重要性排序
 */
export const getAllFormTypes = (): Array<{code: string, description: string}> => {
  const majorForms = [
    '10-K', '10-Q', '8-K', '20-F', '6-K', 'DEF 14A', '13F-HR',
    'SC 13D', 'SC 13G', '3', '4', '5', 'S-1', 'F-1'
  ];

  const result = majorForms.map(code => ({
    code,
    description: SEC_FORM_TYPES[code] || '未知'
  }));

  // 添加其他表单类型
  Object.entries(SEC_FORM_TYPES).forEach(([code, description]) => {
    if (!majorForms.includes(code)) {
      result.push({ code, description });
    }
  });

  return result;
};

export default {
  getFormDescription,
  getFormLabel,
  isMajorForm,
  getAllFormTypes
};