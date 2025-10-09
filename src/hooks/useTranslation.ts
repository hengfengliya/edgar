import { useCallback } from 'react';
import { useLanguage } from './useLanguage';
import type { Language } from '../components/common/LanguageProvider';

// 定义通用字典类型，约束语言与文案的映射关系
export type TranslationDictionary<T> = Record<Language, T>;

/**
 * 多语言辅助 Hook
 * 提供：
 * 1. 当前语言标记
 * 2. 语言切换方法
 * 3. `t` 函数：接收一个包含中英文的对象并返回当前语言的值
 */
export function useTranslation() {
  const { language, setLanguage } = useLanguage();

  const t = useCallback(<T,>(dictionary: TranslationDictionary<T>): T => {
    return dictionary[language];
  }, [language]);

  return {
    language,
    setLanguage,
    t
  };
}
