import { useState, useEffect, useCallback } from 'react';
import { AdminSettings, PriceData, TrendData, MakingCharge } from '@/types/goldRate';

const DEFAULT_MAKING_CHARGES: MakingCharge[] = [
  { id: '1', name: 'TURKISH', above: 4.5, below: 3.8 },
  { id: '2', name: 'SAUDI', above: 4.8, below: 4 },
  { id: '3', name: 'SINGAPORE', above: 3.5, below: 3 },
  { id: '4', name: 'OMANI', above: 3.5, below: 3 },
  { id: '5', name: 'EMIRATI', above: 3.8, below: 2.8 },
  { id: '6', name: 'INDIAN', above: 4, below: 3.5 },
  { id: '7', name: 'BAHRAINI', above: 4, below: 3.5 },
  { id: '8', name: 'KHWATI', above: 4, below: 3.5 },
];

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  // API Settings
  demoMode: false,
  apiKey: '',
  refreshInterval: 3600,
  
  // Prices Settings
  manualOverride: false,
  enablePremiums: true,
  usdOverride: 2500,
  exchangeRate: 1.4485,
  symbol: 'OMR',
  premium10Tola: 6,
  premiumGinni: 0,
  premium24k: 0.7,
  premium22k: 1.6,
  premium21k: 1.2,
  premium18k: 1.2,
  
  // Charges Settings
  showMakingCharges: true,
  makingCharges: DEFAULT_MAKING_CHARGES,
  
  // Security Settings
  theme: 'dark',
  adminPin: '8472',
};

const STORAGE_KEY = 'oman_gold_admin_settings';

export function useGoldPrices() {
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { 
          ...DEFAULT_ADMIN_SETTINGS, 
          ...parsed,
          makingCharges: parsed.makingCharges || DEFAULT_MAKING_CHARGES 
        };
      }
    } catch (e) {
      console.error('Failed to load admin settings:', e);
    }
    return DEFAULT_ADMIN_SETTINGS;
  });

  const [priceData, setPriceData] = useState<PriceData>({
    usdPerOunce: 0,
    previousUsdPerOunce: 0,
    tola10WithoutPremium: 0,
    tola10WithPremium: 0,
    ginniPrice: 0,
    perGram24k: 0,
    perGram22k: 0,
    perGram21k: 0,
    perGram18k: 0,
    lastUpdate: new Date(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiTestResult, setApiTestResult] = useState<'success' | 'error' | null>(null);

  // Save admin settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminSettings));
    } catch (e) {
      console.error('Failed to save admin settings:', e);
    }
  }, [adminSettings]);

  // Test API connection
  const testApiConnection = useCallback(async (): Promise<boolean> => {
    if (!adminSettings.apiKey) {
      setApiTestResult('error');
      return false;
    }
    
    try {
      // Simulate API test - in production, make actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApiTestResult('success');
      return true;
    } catch (e) {
      setApiTestResult('error');
      return false;
    }
  }, [adminSettings.apiKey]);

  // Fetch USD per ounce from API
  const fetchUsdPerOunce = useCallback(async (): Promise<number> => {
    if (adminSettings.manualOverride || adminSettings.demoMode) {
      return adminSettings.usdOverride;
    }

    try {
      // Using a mock API - in production, replace with real gold price API
      // For demo purposes, we'll simulate with a base price + small random variation
      const basePrice = 4892.81;
      const variation = (Math.random() - 0.5) * 10; // ±5 variation
      return basePrice + variation;
    } catch (e) {
      console.error('Failed to fetch USD per ounce:', e);
      throw e;
    }
  }, [adminSettings.manualOverride, adminSettings.demoMode, adminSettings.usdOverride]);

  // Calculate 10 Tola prices
  const calculate10Tola = useCallback((usdPerOunce: number): { withPremium: number; withoutPremium: number } => {
    const withoutPremium = usdPerOunce * adminSettings.exchangeRate;
    const withPremium = adminSettings.enablePremiums 
      ? withoutPremium + adminSettings.premium10Tola 
      : withoutPremium;
    return { withPremium, withoutPremium };
  }, [adminSettings.exchangeRate, adminSettings.enablePremiums, adminSettings.premium10Tola]);

  // Calculate Ginni price with special rounding
  const calculateGinni = useCallback((tola10WithoutPremium: number): number => {
    const baseGinni = (tola10WithoutPremium / 116.64) * 0.875 * 8;
    const premium = adminSettings.enablePremiums ? adminSettings.premiumGinni : 0;
    const ginniWithPremium = baseGinni + premium;
    
    // Special rounding: < 0.5 round down, >= 0.5 round up
    const decimal = ginniWithPremium - Math.floor(ginniWithPremium);
    return decimal < 0.5 ? Math.floor(ginniWithPremium) : Math.ceil(ginniWithPremium);
  }, [adminSettings.enablePremiums, adminSettings.premiumGinni]);

  // Calculate per gram rates
  const calculatePerGramRates = useCallback((tola10WithoutPremium: number): {
    perGram24k: number;
    perGram22k: number;
    perGram21k: number;
    perGram18k: number;
  } => {
    const basePerGram = tola10WithoutPremium / 116.64;
    
    const premium24k = adminSettings.enablePremiums ? adminSettings.premium24k : 0;
    const premium22k = adminSettings.enablePremiums ? adminSettings.premium22k : 0;
    const premium21k = adminSettings.enablePremiums ? adminSettings.premium21k : 0;
    const premium18k = adminSettings.enablePremiums ? adminSettings.premium18k : 0;

    return {
      perGram24k: basePerGram + premium24k,
      perGram22k: (basePerGram * 0.916) + premium22k,
      perGram21k: (basePerGram * 0.875) + premium21k,
      perGram18k: (basePerGram * 0.750) + premium18k,
    };
  }, [adminSettings.enablePremiums, adminSettings.premium24k, adminSettings.premium22k, adminSettings.premium21k, adminSettings.premium18k]);

  // Calculate trend
  const calculateTrend = useCallback((oldPrice: number, newPrice: number): TrendData => {
    if (oldPrice === 0 || oldPrice === newPrice) {
      return { direction: 'neutral', percentage: 0 };
    }
    const percentage = ((newPrice - oldPrice) / oldPrice) * 100;
    return {
      direction: newPrice > oldPrice ? 'up' : 'down',
      percentage: Math.abs(percentage),
    };
  }, []);

  // Update all prices
  const updatePrices = useCallback(async () => {
    try {
      setError(null);
      const newUsdPerOunce = await fetchUsdPerOunce();
      
      const { withPremium, withoutPremium } = calculate10Tola(newUsdPerOunce);
      const ginniPrice = calculateGinni(withoutPremium);
      const gramRates = calculatePerGramRates(withoutPremium);

      setPriceData(prev => ({
        usdPerOunce: newUsdPerOunce,
        previousUsdPerOunce: prev.usdPerOunce || newUsdPerOunce,
        tola10WithoutPremium: withoutPremium,
        tola10WithPremium: withPremium,
        ginniPrice,
        ...gramRates,
        lastUpdate: new Date(),
      }));
      
      setIsLoading(false);
    } catch (e) {
      setError('Failed to fetch prices. Using last known values.');
      setIsLoading(false);
    }
  }, [fetchUsdPerOunce, calculate10Tola, calculateGinni, calculatePerGramRates]);

  // Initial load and auto-refresh
  useEffect(() => {
    updatePrices();
    const refreshMs = Math.max(adminSettings.refreshInterval * 1000, 5000); // Minimum 5 seconds
    const interval = setInterval(updatePrices, adminSettings.demoMode ? 5000 : refreshMs);
    return () => clearInterval(interval);
  }, [updatePrices, adminSettings.refreshInterval, adminSettings.demoMode]);

  const trend = calculateTrend(priceData.previousUsdPerOunce, priceData.usdPerOunce);

  return {
    priceData,
    adminSettings,
    setAdminSettings,
    trend,
    isLoading,
    error,
    refreshPrices: updatePrices,
    testApiConnection,
    apiTestResult,
  };
}
