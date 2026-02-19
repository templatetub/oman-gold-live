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
      <div className="inline-block gold-badge mb-2 text-[#7588a3] px-[8px] py-[2px] border-0 border-solid rounded-md bg-[#151b28]">
        {t.usd}
      </div>
      
      <div className="font-mono text-6xl font-bold gold-text mb-3">
        {formatNumber(usdPerOunce)}
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded">{t.oz}</span>
        <TrendIndicator trend={trend} showPercentage={true} />
      </div>
    </div>);

}