import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/auth/AuthContext';
import en from '@/i18n/translations/en';
import fr from '@/i18n/translations/fr';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations = { en, fr };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const readStored = (): Language => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('GëstuSaDine-language') as Language;
      if (saved && ['en', 'fr'].includes(saved)) return saved;
    }
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(readStored);

  useEffect(() => {
    document.documentElement.lang = language;
    if (typeof window !== 'undefined') {
      localStorage.setItem('GëstuSaDine-language', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const current = (translations as Record<string, Record<string, string>>)[language];
    const translate = (dict?: Record<string, string>) => {
      const value = dict?.[key];
      if (!value) return undefined;
      if (!params) return value;
      return Object.keys(params).reduce((acc, paramKey) => {
        const token = `{${paramKey}}`;
        return acc.replace(token, String(params[paramKey]));
      }, value);
    };

    const currentValue = translate(current);
    if (currentValue) return currentValue;

    const fallback = (translations as Record<string, Record<string, string>>).en;
    const fallbackValue = translate(fallback);
    if (fallbackValue) return fallbackValue;
    
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
