export interface AdminSettings {
  // API Settings
  demoMode: boolean;
  apiKey: string;
  refreshInterval: number;
  
  // Prices Settings
  manualOverride: boolean;
  enablePremiums: boolean;
  usdOverride: number;
  exchangeRate: number;
  symbol: string;
  premium10Tola: number;
  premiumGinni: number;
  premium24k: number;
  premium22k: number;
  premium21k: number;
  premium18k: number;
  
  // Charges Settings
  showMakingCharges: boolean;
  makingCharges: MakingCharge[];
  
  // Security Settings
  theme: 'light' | 'dark';
  adminPin: string;
}

export interface MakingCharge {
  id: string;
  name: string;
  above: number;
  below: number;
}

export interface PriceData {
  usdPerOunce: number;
  previousUsdPerOunce: number;
  tola10WithoutPremium: number;
  tola10WithPremium: number;
  ginniPrice: number;
  perGram24k: number;
  perGram22k: number;
  perGram21k: number;
  perGram18k: number;
  lastUpdate: Date;
}

export interface TrendData {
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
}
