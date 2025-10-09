// 地址信息类型
export interface Address {
  street1: string;
  street2?: string;
  city: string;
  stateOrCountry: string;
  zipCode: string;
  stateOrCountryDescription: string;
  isForeignLocation?: number;
  foreignStateTerritory?: string;
  country?: string;
  countryCode?: string;
}

// 地址集合类型
export interface Addresses {
  mailing?: Address;
  business?: Address;
}

// 公司信息类型
export interface CompanyInfo {
  cik: string;
  name: string;
  ticker: string;
  sic?: string;
  sicDescription?: string;
  fiscalYearEnd?: string;
  stateOfIncorporation?: string;
  stateOfIncorporationDescription?: string;
  addresses?: Addresses;
  category?: string;
  ein?: string;
}

// 申报文件类型
export interface Filing {
  accessionNumber: string;
  form: string;
  filingDate: string;
  reportDate?: string;
  acceptanceDateTime?: string;
  act?: string;
  fileNumber?: string;
  filmNumber?: string;
  items?: string;
  size?: number;
  isXBRL?: number;
  isInlineXBRL?: number;
}

// 文件详情类型
export interface FileDetails {
  name: string;
  type: string;
  size: number;
  lastModified?: string;
  downloadUrl: string;
}

// 申报文件详情类型
export interface FilingDetails {
  accessionNumber: string;
  files: FileDetails[];
  primaryDocument?: FileDetails;
  totalFiles: number;
  indexUrl: string;
}

// 搜索表单数据类型
export interface SearchFormData {
  companyInput: string;
  formType: string;
  dateRange: string;
  startDate: string;
  endDate: string;
}

// 筛选条件类型
export interface FilingFilters {
  formType?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
}

// API响应类型
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// 申报数据响应类型
export interface FilingDataResponse {
  companyInfo: CompanyInfo;
  filings: Filing[];
  totalCount: number;
}

// 搜索结果类型
export interface SearchResult {
  cik: string;
  ticker: string;
  title: string;
}