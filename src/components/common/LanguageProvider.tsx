import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'zh';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const STORAGE_KEY = 'usstocks-language';

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'zh') {
        setLanguageState(saved);
      }
    } catch (error) {
      console.warn('Failed to read language preference, fallback to English.', error);
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const htmlElement = document.documentElement;
    const langCode = language === 'en' ? 'en' : 'zh-CN';
    htmlElement.lang = langCode;
    htmlElement.setAttribute('data-language', langCode);

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.warn('Failed to persist language preference.', error);
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const value = useMemo(() => ({
    language,
    setLanguage
  }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
