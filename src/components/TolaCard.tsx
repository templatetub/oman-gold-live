import { useLanguage } from '@/contexts/LanguageContext';

interface TolaCardProps {
  price: number;
  symbol: string;
}

export function TolaCard({ price, symbol }: TolaCardProps) {
  const { t, formatNumber, translateSymbol } = useLanguage();
  
  return (
    <div className="gold-card text-center">
      <div className="inline-block gold-badge mb-2 bg-[#151b28] text-[#7588a3] px-[8px] py-[2px] border-0 border-solid rounded-md">
        {translateSymbol(symbol)}
      </div>
      
      <div className="font-mono text-4xl font-bold text-foreground mb-3">
        {formatNumber(price)}
      </div>
      
      <div className="flex items-center justify-center">
        <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded">{t.tola10}</span>
      </div>
    </div>
  );
}