import { TrendIndicator } from './TrendIndicator';
import { TrendData } from '@/types/goldRate';
import { useLanguage } from '@/contexts/LanguageContext';

interface USDCardProps {
  usdPerOunce: number;
  trend: TrendData;
}

export function USDCard({ usdPerOunce, trend }: USDCardProps) {
  const { t, formatNumber } = useLanguage();
  
  return (
    <div className="gold-card text-center">
      <div className="mb-2">
        <span className="text-muted-foreground text-base font-medium">{t.usd}</span>
      </div>
      
      <div className="font-mono text-4xl font-bold gold-text mb-3">
        {formatNumber(usdPerOunce)}
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded">{t.oz}</span>
        <TrendIndicator trend={trend} showPercentage={true} />
      </div>
    </div>
  );
}