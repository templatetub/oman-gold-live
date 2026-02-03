import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'EN' | 'AR';

interface Translations {
  // Header
  backToDashboard: string;
  
  // USD Card
  usd: string;
  oz: string;
  
  // Tola Card
  tola10: string;
  
  // Ginni Card
  ginni21k: string;
  lastUpdateOn: string;
  live: string;
  
  // Live Market Rates
  liveMarketRates: string;
  karat24: string;
  karat22: string;
  karat21: string;
  karat18: string;
  
  // Making Charges
  makingChargeTitle: string;
}

const translations: Record<Language, Translations> = {
  EN: {
    backToDashboard: 'Back to Dashboard',
    usd: 'USD',
    oz: 'Oz.',
    tola10: '10 Tola.',
    ginni21k: 'GINNI (21K)',
    lastUpdateOn: 'Last Update On',
    live: 'LIVE',
    liveMarketRates: 'Live Market Rates',
    karat24: '24 Karat',
    karat22: '22 Karat',
    karat21: '21 Karat',
    karat18: '18 Karat',
    makingChargeTitle: 'MAKING CHARGE STARTING ------> LESS THEN 2.00 GRM MAKING PER PIECE',
  },
  AR: {
    backToDashboard: 'العودة إلى لوحة التحكم',
    usd: 'دولار',
    oz: 'أونصة',
    tola10: '10 تولة',
    ginni21k: 'جيني (21 قيراط)',
    lastUpdateOn: 'آخر تحديث في',
    live: 'مباشر',
    liveMarketRates: 'أسعار السوق المباشرة',
    karat24: '24 قيراط',
    karat22: '22 قيراط',
    karat21: '21 قيراط',
    karat18: '18 قيراط',
    makingChargeTitle: 'رسوم التصنيع تبدأ ------> أقل من 2.00 جرام لكل قطعة',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('oman_gold_language');
    return (stored === 'AR' ? 'AR' : 'EN') as Language;
  });

  useEffect(() => {
    localStorage.setItem('oman_gold_language', language);
    // Only change the lang attribute, NOT the direction (no RTL)
    document.documentElement.lang = language === 'AR' ? 'ar' : 'en';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
