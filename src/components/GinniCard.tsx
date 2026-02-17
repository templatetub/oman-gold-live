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
    <div className="ginni-card">
      <div className="text-center">
        <div className="inline-block gold-badge mb-2 bg-[#151b28] text-[#7588a3] px-[8px] py-[2px] border-0 border-solid rounded-md">
          {translateSymbol(symbol)}
        </div>
        
        <div className="font-mono text-5xl font-bold gold-text mb-3">
          {formatNumber(price, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </div>

        <div className="text-muted-foreground text-base font-medium mb-2">
          {t.ginni21k}
        </div>
        
        <div className="text-xs text-muted-foreground">
          {t.lastUpdateOn} {localizeText(formatUpdateTime(lastUpdate))}{' '}
          <span className="live-badge ml-2">{t.live}</span>
        </div>
      </div>
    </div>);

}