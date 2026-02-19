import { useClock } from '@/hooks/useClock';
import { useLanguage } from '@/contexts/LanguageContext';

interface GinniCardProps {
  price: number;
  symbol: string;
  lastUpdate: Date;
}

export function GinniCard({ price, symbol, lastUpdate }: GinniCardProps) {
  const { formatUpdateTime } = useClock();
  const { t, formatNumber, localizeText, translateSymbol } = useLanguage();

  return (
    <div>
      <div className="ginni-card">
        <div className="text-center">
          <div className="text-primary text-lg font-medium mb-3">
            {t.ginni21k}
          </div>
          
          <div className="font-mono text-6xl font-bold gold-text mb-3">
            {formatNumber(price, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>

          <div className="inline-block gold-badge bg-[#151b28] text-[#7588a3] px-[8px] py-[2px] border border-border rounded-md text-xs">
            {translateSymbol(symbol)}
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-2 text-center">
        {t.lastUpdateOn} {localizeText(formatUpdateTime(lastUpdate))}{' '}
        <span className="live-badge ml-2">{t.live}</span>
      </div>
    </div>);

}