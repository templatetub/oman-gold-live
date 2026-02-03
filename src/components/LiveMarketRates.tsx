import { useLanguage } from '@/contexts/LanguageContext';

interface KaratRate {
  karat: string;
  price: number;
}

interface LiveMarketRatesProps {
  rates: KaratRate[];
  symbol: string;
}

export function LiveMarketRates({ rates, symbol }: LiveMarketRatesProps) {
  const { t } = useLanguage();
  
  // Map karat labels to translations
  const getKaratLabel = (karat: string) => {
    if (karat.includes('24')) return t.karat24;
    if (karat.includes('22')) return t.karat22;
    if (karat.includes('21')) return t.karat21;
    if (karat.includes('18')) return t.karat18;
    return karat;
  };
  
  return (
    <div className="gold-card h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-primary font-semibold text-sm uppercase tracking-wider">
          {t.liveMarketRates}
        </h3>
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
      </div>
      
      <div className="space-y-0">
        {rates.map((rate, index) => (
          <div 
            key={rate.karat}
            className={`flex items-center justify-between py-3 ${
              index !== rates.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">▶</span>
              <span className="text-foreground">{getKaratLabel(rate.karat)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold gold-text">
                {rate.price.toFixed(2)}
              </span>
              <span className="text-muted-foreground text-sm">{symbol}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
