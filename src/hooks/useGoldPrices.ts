import { useState, useEffect, useCallback } from 'react';
import { AdminSettings, PriceData, TrendData } from '@/types/goldRate';

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
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
};

const STORAGE_KEY = 'oman_gold_admin_settings';

export function useGoldPrices() {
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(stored) };
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

  // Save admin settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminSettings));
    } catch (e) {
      console.error('Failed to save admin settings:', e);
    }
  }, [adminSettings]);

  // Fetch USD per ounce from API
  const fetchUsdPerOunce = useCallback(async (): Promise<number> => {
    if (adminSettings.manualOverride) {
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
  }, [adminSettings.manualOverride, adminSettings.usdOverride]);

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
    const interval = setInterval(updatePrices, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [updatePrices]);

  const trend = calculateTrend(priceData.previousUsdPerOunce, priceData.usdPerOunce);

  return {
    priceData,
    adminSettings,
    setAdminSettings,
    trend,
    isLoading,
    error,
    refreshPrices: updatePrices,
  };
}
