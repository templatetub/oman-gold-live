import { TrendIndicator } from './TrendIndicator';
import { TrendData } from '@/types/goldRate';
import { useLanguage } from '@/contexts/LanguageContext';

interface USDCardProps {
  usdPerOunce: number;
  trend: TrendData;
}

export function USDCard({ usdPerOunce, trend }: USDCardProps) {
  const { t } = useLanguage();
  
  return (
    <div className="gold-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-sm font-medium">{t.usd}</span>
      </div>
      
      <div className="price-display gold-text mb-2">
        {usdPerOunce.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{t.oz}</span>
        <TrendIndicator trend={trend} showPercentage={true} />
      </div>
    </div>
  );
}
