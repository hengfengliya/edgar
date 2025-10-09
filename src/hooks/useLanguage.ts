import { useContext } from 'react';
import { LanguageContext } from '../components/common/LanguageProvider';

/**
 * 语言上下文 Hook
 * 封装 useContext，确保使用者总能拿到有效的语言配置
 */
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage 必须在 LanguageProvider 内部使用。');
  }

  return context;
}
