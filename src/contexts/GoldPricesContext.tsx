import { createContext, useContext, ReactNode } from 'react';
import { useGoldPrices } from '@/hooks/useGoldPrices';
import { AdminSettings, PriceData, TrendData } from '@/types/goldRate';

interface GoldPricesContextType {
  priceData: PriceData;
  adminSettings: AdminSettings;
  setAdminSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
  trend: TrendData;
  isLoading: boolean;
  error: string | null;
  refreshPrices: () => Promise<void>;
  testApiConnection: () => Promise<boolean>;
  apiTestResult: 'success' | 'error' | null;
}

const GoldPricesContext = createContext<GoldPricesContextType | null>(null);

export function GoldPricesProvider({ children }: { children: ReactNode }) {
  const goldPricesData = useGoldPrices();
  
  return (
    <GoldPricesContext.Provider value={goldPricesData}>
      {children}
    </GoldPricesContext.Provider>
  );
}

export function useGoldPricesContext() {
  const context = useContext(GoldPricesContext);
  if (!context) {
    throw new Error('useGoldPricesContext must be used within a GoldPricesProvider');
  }
  return context;
}
