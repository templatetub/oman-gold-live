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
  chargeTurkish: string;
  chargeSaudi: string;
  chargeSingapore: string;
  chargeOmani: string;
  chargeEmirati: string;
  chargeIndian: string;
  chargeBahraini: string;
  chargeKhwati: string;
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
    chargeTurkish: 'TURKISH',
    chargeSaudi: 'SAUDI',
    chargeSingapore: 'SINGAPORE',
    chargeOmani: 'OMANI',
    chargeEmirati: 'EMIRATI',
    chargeIndian: 'INDIAN',
    chargeBahraini: 'BAHRAINI',
    chargeKhwati: 'KHWATI',
  },
  AR: {
    backToDashboard: 'العودة إلى لوحة التحكم',
    usd: 'دولار',
    oz: 'أونصة',
    tola10: '10 تولة',
    ginni21k: 'الجني (21 ع)',
    lastUpdateOn: 'آخر تحديث في',
    live: 'مباشر',
    liveMarketRates: 'أسعار السوق المباشرة',
    karat24: '24 ع',
    karat22: '22 ع',
    karat21: '21 ع',
    karat18: '18 ع',
    makingChargeTitle: 'رسوم التصنيع تبدأ ------> أقل من 2.00 جرام لكل قطعة',
    chargeTurkish: 'تركي',
    chargeSaudi: 'سعودي',
    chargeSingapore: 'سنغافوري',
    chargeOmani: 'عماني',
    chargeEmirati: 'إماراتي',
    chargeIndian: 'هندي',
    chargeBahraini: 'بحريني',
    chargeKhwati: 'كويتي',
  },
};

// Convert Western numerals to Arabic-Hindi numerals
function toArabicNumerals(str: string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (d) => arabicDigits[parseInt(d)]);
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  formatNumber: (num: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) => string;
  localizeText: (text: string) => string;
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

  const formatNumber = (num: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) => {
    const formatted = num.toLocaleString('en-US', {
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    });
    return language === 'AR' ? toArabicNumerals(formatted) : formatted;
  };

  const localizeText = (text: string) => {
    return language === 'AR' ? toArabicNumerals(text) : text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], formatNumber, localizeText }}>
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
